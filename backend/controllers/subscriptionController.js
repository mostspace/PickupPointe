const mongoose = require('mongoose');
const Stripe = require('stripe');
const SubscriptionModel = require('../models/Subscription');
const PaymentMethodModel = require('../models/PaymentMethod');
const ShopModel = require('../models/Shop');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const MONTHLY_PRICE = 1999;
const ANNUAL_PRICE = 18000;

const createCustomer = async (payload, paymentId) => {
  const {shop: shopData, data} = payload;
  const customers = await stripe.customers.search({
    query: `metadata['vendorId']: '${shopData.vendorId}' AND metadata['shopId']: '${shopData._id}'`
  });
  console.log(customers);
  if (customers.data.length > 0) {
    // if (customers[0].payment_method !== paymentId) {
    //   const customer = await stripe.customers.update(customers[0].id,
    //     {
    //       payment_method: paymentId
    //     }
    //   );
    //   return customer;
    // } else {
      return customers.data[0];
    // }
  }
  else {
    const customer = await stripe.customers.create({
      name: shopData.name,
      email: shopData.supportEmail,
      payment_method: paymentId,
      metadata: {
        shopId: shopData._id,
        vendorId: shopData.vendorId,
        plan: data.plan,
        locations: JSON.stringify(data.locations)
      }
    });
    return customer;
  }
};

const getPrice = async (payload) => {
  const data = payload;
  let amount = MONTHLY_PRICE;
  const quantity = data.locations.length < 1 ? 1 : data.locations.length;
  let intervalPlan = 'month';
  if (data.plan === 'annual_plan') {
    amount = ANNUAL_PRICE;
    intervalPlan = 'year';
  } else if (data.plan === 'monthly_plan') {
    amount = MONTHLY_PRICE;
  }

  const prices = await stripe.prices.search({
    query: `metadata[\'type\']:\'sub_${intervalPlan}\'`,
  });

  console.log(prices);

  if (prices.data.length > 1) {
    return prices.data[0];
  } else {
    const price = await stripe.prices.create({
      currency: 'usd',
      unit_amount: amount,
      recurring: {
        interval: intervalPlan,
        interval_count: 1
      },
      product_data: {
        name: `sub_${data.plan}`
      },
      metadata: {
        type: `sub_${intervalPlan}`
      }
    });
    return price;
  }
};

const update = async (req, res) => {
  const {shop: shopData, data} = req.body;
  const {id: subId} = req.params;
  if (subId) {
    try {
      if (!shopData.primaryPayment) {
        throw new Error('No primary payment method');
      }
      const paymentMethod = await PaymentMethodModel.findById(shopData.primaryPayment);
      const price = await getPrice(data);
      const curSub = await stripe.subscriptions.retrieve(subId);
      const quantity = data.locations.length < 1 ? 1 : data.locations.length;
      if (curSub) {
        let items = [];
        if (quantity !== curSub.items.data[0].quantity) {
          items = [{
            id: curSub.items.data[0].id,
            quantity
          }];
        }
        if (price.id !== curSub.items.data[0].plan.id) {
          items = [{
            id: curSub.items.data[0].id,
            price: price.id,
            quantity
          }];
        }
        const subscription = await stripe.subscriptions.update(subId, { items });
        const subData = await SubscriptionModel.findById(shopData.subscription._id);
        subData.locations = data.locations;
        subData.type = data.plan;
        subData.priceId = price.id;
        subData.price = quantity * price.unit_amount;
        await subData.save();
      } else {
        const customer = await createCustomer(req.body, paymentMethod.detailInfo.id);
        const subscription = await stripe.subscriptions.create({
          customer: customer.id,
          default_payment_method:  paymentMethod.detailInfo.id,
          items: [
            {
              price: price.id,
              quantity
            }
          ]
        });
        const newSubscription = new SubscriptionModel({
          type: data.plan,
          lastPurchasedDate: Date.now(),
          subId: subscription.id,
          customerId: customer.id,
          priceId: price.id,
          price: quantity * price.unit_amount,
          locations: data.locations
        });
        const savedSubscription = await newSubscription.save();
        const shop = await ShopModel.findById(shopData._id);
        shop.subscription = savedSubscription._id;
        await shop.save();
      }
      return res.status(200).json(curSub);
    } catch(error) {
      console.log(error);
      return res.status(500).json({
        message: "Error creating subscription",
        error: error
      });
    }
  }
  res.status(500).json({
    message: "Error updating subscription",
  });
};

const create = async (req, res) => {
  const {shop: shopData, data} = req.body;
  try {
    if (!shopData.primaryPayment) {
      throw new Error('No primary payment method');
    }
    const paymentMethod = await PaymentMethodModel.findById(shopData.primaryPayment);

    const customer = await createCustomer(req.body, paymentMethod.detailInfo.id);
    const price = await getPrice(data);
    const quantity = data.locations.length < 1 ? 1 : data.locations.length;

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      default_payment_method:  paymentMethod.detailInfo.id,
      items: [
        {
          price: price.id,
          quantity
        }
      ]
    });
    console.log('--------------------------------------------');

    console.log("subscription", subscription);

    const newSubscription = new SubscriptionModel({
      type: data.plan,
      lastPurchasedDate: Date.now(),
      subId: subscription.id,
      customerId: customer.id,
      priceId: price.id,
      locations: data.locations,
      price: quantity * price.unit_amount
    });

    const savedSubscription = await newSubscription.save();

    const shop = await ShopModel.findById(shopData._id);
    shop.subscription = savedSubscription._id;
    await shop.save();

    res.status(200).json({
      message: 'Success subscription',
      subscription: savedSubscription
    });
  } catch(e) {
    console.log("Create Subscription error: ", e);
    res.status(500).json({
      message: "Error creating subscription",
      error: e
    });
  }
}

module.exports = {
  create,
  update
}