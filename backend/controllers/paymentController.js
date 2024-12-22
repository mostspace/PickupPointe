const mongoose = require("mongoose");
const PaymentModel = require("../models/Payment");

const Stripe = require("stripe");
const PaymentMethodModel = require("../models/PaymentMethod");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const createCustomer = async (name, email) => {
  try {
    const customer = await stripe.customers.create({
      email: email,
      name: name,
    });
    console.log("customer", customer);
    return customer;
  } catch (error) {
    console.error("Error creating customer:", error);
  }
};

const createPaymentIntent = async (req, res) => {
  const { token, amount, name, email, country } = req.body;
  try {
    const customer = await createCustomer(name, email);

    const paymentIntent = await stripe.paymentIntents.create({
      payment_method_data: {
        type: "card", // card type
        card: { token: token }, // pass the token here under the 'card' field
      },
      amount,
      currency: "usd",
      customer: customer.id,
    });

    const newPayment = new PaymentModel({
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      paymentMethodId: paymentIntent.payment_method,
      paymentMethodConfId:
        paymentIntent.payment_method_configuration_details.id,
      status: paymentIntent.status,
      clientSecret: paymentIntent.client_secret,
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        country: country,
      },
    });

    const savedPayment = await newPayment.save();
    console.log("savedPayment", savedPayment);

    res.status(200).json({
      message: "Success payment",
      clientSecret: paymentIntent.client_secret,
      paymentData: savedPayment,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ message: "Error creating payment intent", error });
  }
};

const checkCard = async (req, res) => {
  console.log("Hello, checkCard", req.body);
  res.status(200).json({
    message: "Success"
  });
};

const createPaymentMethod = async (req, res) => {
  console.log("Hello, createPaymentMethod", req.body);
  const {billing_details: {name: fullName, email}, card: {last4}, id} = req.body;
  const vendorId = req.userId;
  const newPaymentMethod = new PaymentMethodModel({
    last4,
    fullName,
    email,
    methodId: id,
    vendorId,
    detailInfo: req.body
  });
  const savedPaymentMethod = await newPaymentMethod.save();

  console.log(newPaymentMethod);
  res.status(200).json({
    message: "Success",
    paymentMethod: savedPaymentMethod
  });
};

const webhook = async (request, response) => {
  const event = request.body;
  console.log("Web hook request", request.body);
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({received: true});
};

module.exports = {
  createPaymentMethod,
  checkCard,
  createPaymentIntent,
  webhook
};
