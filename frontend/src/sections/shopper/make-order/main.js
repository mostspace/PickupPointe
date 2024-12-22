import React, {useEffect, useState} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from "react-toastify";
import {
  Button, Typography, Stepper, Step, StepLabel
} from '@mui/material';
import {
  CardNumberElement, useElements, useStripe
} from "@stripe/react-stripe-js";

// Components
import SelectProducts from './select-products';
import ScheduleOrder from './schedule-order';
import ReviewAndPay from './review-and-pay';
import PaymentDialog from 'src/components/modal/payment';

// Constants & Utils
import { createPaymentIntent } from "src/api/shopper/payment";
import { placeOrder } from "src/reducers/orderSlice";
import { clearCart } from "src/reducers/cartSlice";
import { formattedNumber } from "src/utils/utilityFunctions";
import { deliveryTypes } from "src/constants";
import * as Yup from "yup";
import dayjs from "dayjs";

// Constants
const STEPS = ['Select products', 'Schedule order', 'Review and pay'];

// Validation Schemas
const stepSchemas = [
  Yup.object().shape({}),
  Yup.object().shape({
    deliveryType: Yup.number().required("Delivery type is required"),
    pickupLocation: Yup.string().when("deliveryType", {
      is: (deliveryType) => deliveryType === 1,
      then: () => Yup.string().required("Pickup location is required"),
      otherwise: () => Yup.string().notRequired(),
    }),
    deliveryAddress: Yup.object().when("deliveryType", {
      is: (deliveryType) => deliveryType === 2,
      then: () => Yup.object().required("Delivery address is required"),
      otherwise: () => Yup.object().notRequired(),
    }),
    postMailAddress: Yup.object().when("deliveryType", {
      is: (deliveryType) => deliveryType === 3,
      then: () => Yup.object().required("Delivery address is required"),
      otherwise: () => Yup.object().notRequired(),
    }),
    pickupTime: Yup.date().required("Time is required"),
    pickupDate: Yup.date().required("Date is required"),
  }),
  Yup.object().shape({
    tip: Yup.string().required("Tip is required"),
    checkbox: Yup.boolean()
      .oneOf([true], 'You must agree to the terms and conditions')
      .required('You must agree to the terms and conditions'),
  })
];

const Main = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Redux state
  const { user: activeUser } = useSelector((state) => state.auth);
  const cartStore = useSelector((state) => state.cart);
  const { isLoading } = useSelector((state) => state.order);
  const {deliveryInfo} = useSelector(state => state.shopper.orders);

  const vendorProfile = location.state.shop;
  const locationId = location.state.locationId;
  const cartObject = cartStore[vendorProfile._id];

  // State
  const [activeStep, setActiveStep] = useState(0);
  const [openPaymentMethod, setOpenPaymentMethod] = useState(false);
  const [paymentState, setPaymentState] = useState({
    email: '',
    fullName: '',
    country: '',
    activeMethod: 'card',
    errorMessage: {},
    loading: false
  });

  // Form setup
  const methods = useForm({
    resolver: yupResolver(stepSchemas[activeStep]),
    mode: 'onTouched'
  });

  const { handleSubmit, trigger, watch } = methods;
  const watchData = watch();
  
  useEffect(() => {
    console.log(watchData)
    console.log(watchData.pickupLocation, watchData.deliveryAddress?.label);
  }, [watchData.pickupLocation, watchData.deliveryAddress?.label]);
  
  // Navigation handlers
  const handleNext = async () => {
    if (activeStep === STEPS.length - 1) {
      handlePaymentMethodOpen();
      return;
    }

    const isValid = await trigger();
    if (isValid) {
      setActiveStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (activeStep === 0) {
      navigate(-1);
    } else {
      setActiveStep((prev) => prev - 1);
    }
  };

  // Payment handlers
  const handlePaymentMethodOpen = async () => {
    const isValid = await trigger();
    if (isValid) {
      setOpenPaymentMethod(true);
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  const handleStripePayment = async (event) => {
    event.preventDefault();

    const { email, fullName, country } = paymentState;

    if (!email || !fullName) {
      setPaymentState(prev => ({
        ...prev,
        errorMessage: {
          email: !email ? "Email is required" : null,
          fullName: !fullName ? "Name is required" : null
        }
      }));
      return;
    }

    setPaymentState(prev => ({ ...prev, loading: true }));

    try {
      if (!stripe || !elements) {
        toast("Stripe has not loaded yet.", { type: "error" });
        return;
      }

      const payAmount = calculateTotalAmount();
      const cardNumber = elements.getElement(CardNumberElement);

      const { token, error } = await stripe.createToken(cardNumber);
      if (error) {
        toast(error.message, { type: "error" });
        return;
      }

      const paymentIntent = await processPayment(token, payAmount);
      if (paymentIntent.status === "succeeded") {
        await onSubmit(paymentIntent.paymentData._id);
      }
    } catch (error) {
      toast('Payment failed. Please try again.', { type: "error" });
    } finally {
      setPaymentState(prev => ({ ...prev, loading: false }));
    }
  };

  // Helper functions
  const calculateTotalAmount = () => {
    return Math.round(formattedNumber(
      cartObject.total +
      cartObject.items.reduce((acc, elm) => {
        return acc + (elm.quantity * (elm.modifierPrices || []).reduce((acc2, el) => acc2 + el, 0));
      }, 0) +
      vendorProfile.vendorSettings[0].courierDeliveryFees.chargeBeyondTheFree +
      2.00
    ) * 100);
  };

  const processPayment = async (token, amount) => {
    const { email, fullName, country } = paymentState;
    const data = await createPaymentIntent({
      token: token.id,
      amount,
      name: fullName,
      email,
      country
    });

    if (data.error) {
      throw new Error(data.error);
    }

    const { paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
      payment_method: { card: elements.getElement(CardNumberElement) }
    });

    return { status: paymentIntent.status, paymentData: data.paymentData };
  };

  // Form submission
  const onSubmit = async (paymentId) => {
    console.log(activeUser)
    try {
      const formData = new FormData();
      const watchedData = watch();

      let orderLocation = "";
      switch (watchedData.deliveryType) {
        case 1:
          orderLocation = vendorProfile.locations.find(
            location => location._id === watchedData.pickupLocation
          )._id;
          break;
        case 2:
          orderLocation = watchedData.deliveryAddress.label;
          break;
        case 3:
          orderLocation = watchedData.postMailAddress.label;
          break;
      }
      const subTotal = cartObject.total + cartObject.items.reduce((acc, elm) => {
        return acc + (elm.quantity * (elm.modifierPrices || []).reduce((acc2, el) => acc2 + el, 0));
      }, 0)
      formData.append("orderer", activeUser?.role ? watchedData.ordererName : activeUser?._id);
      formData.append("paymentId", paymentId);
      formData.append("pickupLocation", watchedData.pickupLocation);
      formData.append("shopId", vendorProfile._id);
      formData.append("package", JSON.stringify(cartObject?.items?.map(item => ({
        item: item._id,
        quantity: item.quantity,
        selectedItems: item.selectedItems,
        variant: item.variant
      }))));
      formData.append("deliveryType", deliveryTypes[watchedData.deliveryType - 1]);
      formData.append("orderLocation", orderLocation);
      formData.append("time", JSON.stringify({
        pickupTime: watchedData.pickupTime,
        pickupDate: watchedData.pickupDate
      }));
      formData.append("fee", JSON.stringify({
        deliveryFee: deliveryInfo.fee / 100,
        platformFee: 1.50,
        processingFee: 2.00,
        tip: subTotal * parseInt(watchedData.tip.replace("%", "")) / 100,
        tax: vendorProfile.vendorSettings.taxRate
      }));
      formData.append("contacts", JSON.stringify({
        notificationEmail: "customer@example.com",
        notificationNumber: "+1234567890",
        contactEmail: "contact@example.com",
        contactNumber: activeUser.contactNumber
      }));
      formData.append("notes", watchedData.orderNotes);
      formData.append("status", "Pending");
      formData.append("total", calculateTotalAmount() / 100);
      formData.append("subTotal", subTotal);

      const result = await dispatch(placeOrder({ formData }));
      if (placeOrder.fulfilled.match(result)) {
        dispatch(clearCart(vendorProfile._id));
        setOpenPaymentMethod(false);
        toast("Order placed successfully", { type: "success" });
        navigate("/shopper/active-orders");
      }
    } catch (error) {
      toast(`Error placing order: ${error}`, { type: 'error' });
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='w-full flex flex-col gap-[32px]'>
          {/* Header with Stepper */}
          <div className='w-full flex flex-col md:flex-row items-center gap-[24px] justify-between'>
            <Typography variant='h3' className="capitalize font-gilroyMedium">
              Make order
            </Typography>

            <Stepper activeStep={activeStep}>
              {STEPS.map((label) => (
                <Step key={label}>
                  <StepLabel className='!text-[16px]'>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <div className='hidden sm:flex items-start justify-start gap-3'>
              <Button
                color="inherit"
                onClick={handleBack}
                sx={{
                  padding: '6px 24px',
                  height: '36px',
                  fontFamily: 'Gilroy',
                  fontSize: '14px',
                  color: '#181818',
                  borderRadius: '8px',
                  backgroundColor: 'transparent',
                  textTransform: 'unset'
                }}
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                sx={{
                  padding: '6px 24px',
                  height: '36px',
                  fontFamily: 'Gilroy',
                  fontSize: '14px',
                  color: '#ffffff',
                  borderRadius: '8px',
                  lineHeight: '16px',
                  backgroundColor: cartObject?.items?.length < 1 ? "#e5e7eb" : '#F14445',
                  textTransform: 'unset',
                  '&:hover': {
                    backgroundColor: '#E13031',
                  }
                }}
                disabled={cartObject?.items?.length < 1 || (!deliveryInfo.external_delivery_id && watch().deliveryType === 2)}
              >
                {activeStep === STEPS.length - 1 ? 'Pay' : 'Continue to checkout'}
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className='w-full'>
            {activeStep === 0 && (
              <SelectProducts vendorProfile={vendorProfile} locationId={locationId} />
            )}
            {activeStep === 1 && (
              <ScheduleOrder vendorProfile={vendorProfile} locationId={locationId} />
            )}
            {activeStep === 2 && (
              <ReviewAndPay vendorProfile={vendorProfile} />
            )}
          </div>

          {/* Mobile Footer */}
          <div className="fixed bottom-0 left-0 w-full bg-white z-50 rounded-t-[12px] py-3 sm:hidden"
               style={{ boxShadow: '0 -4px 8px rgba(0, 0, 0, 0.1)' }}>
            <div className='flex gap-[8px] justify-center items-start'>
              <Button
                color="inherit"
                onClick={handleBack}
                sx={{
                  padding: '6px 24px',
                  height: '36px',
                  fontFamily: 'Gilroy',
                  fontSize: '14px',
                  color: '#181818',
                  borderRadius: '8px',
                  backgroundColor: '#f6f7f8',
                  textTransform: 'unset'
                }}
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                sx={{
                  padding: '6px 24px',
                  height: '36px',
                  fontFamily: 'Gilroy',
                  fontSize: '14px',
                  color: '#ffffff',
                  borderRadius: '8px',
                  lineHeight: '16px',
                  backgroundColor: cartObject?.items?.length < 1 ? "#e5e7eb" : '#F14445',
                  textTransform: 'unset',
                  '&:hover': {
                    backgroundColor: '#E13031',
                  }
                }}
                disabled={cartObject?.items?.length < 1 || (!deliveryInfo.external_delivery_id && watch().deliveryType === 2)}
              >
                {activeStep === STEPS.length - 1 ? 'Pay' : 'Continue to checkout'}
              </Button>
            </div>
          </div>

          <PaymentDialog
            open={openPaymentMethod}
            onClose={() => setOpenPaymentMethod(false)}
            paymentState={paymentState}
            setPaymentState={setPaymentState}
            // onSubmit={handleStripePayment}
            onSubmit={() => onSubmit("673ecadf1e25b33603464443")}
            isLoading={isLoading}
            title={"Payment for the order"}
            okText={"Make Payment"}
          />
        </div>
      </form>
    </FormProvider>
  );
};

export default Main;