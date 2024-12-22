import React, { useEffect, useState } from "react";
// @mui
import { Typography, IconButton } from "@mui/material";
// Icons
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PaymentCard from "src/components/payment-card";
import { useSelector } from "react-redux";
import PaymentMethodsForm from "src/sections/vendor/manage-shop/edit-shop-details/forms/payment-methods";
import GeneralModal from "src/components/modal";
import { useModalDispatch } from "src/contexts/ModalContext";
import { toast } from "react-toastify";
import {
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { createPaymentMethod } from "src/api/shopper/payment";
import _ from "lodash";
import { CLOSE_MODAL } from "src/reducers/modalReducer";
import { updateProfile } from "src/api/shopper/user";
import { setUserInfo } from 'src/reducers/userSlice';
import { useDispatch } from 'react-redux';
// =======================================================================================================================

const PaymentMethod = () => {
  const authState = useSelector((state) => state.auth);
  const elements = useElements();
  const stripe = useStripe();
  const dispatch = useDispatch();

  const [modalContent, setModalContent] = useState({
    heading: "",
    paragraph: "",
    component: null,
    type: "disabled",
  });

  // Payment method modal
  const [openPaymentMethod, setOpenPaymentMethod] = React.useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [primaryPayment, setPrimaryPayment] = useState('');
  const handlePaymentMethodOpen = () => setOpenPaymentMethod(true);
  const handlePaymentMethodClose = () => setOpenPaymentMethod(false);
  const [paymentInfo, setPaymentInfo] = useState({});
  // Payment method Modal Card Active
  const [activePaymentMethod, setActivePaymentMethod] = useState(null);
  const handlePaymentMethodClick = (paymentMethod) =>
    setActivePaymentMethod(paymentMethod);

  // Remove payment method Modal
  const [openRemovePaymentMethod, setOpenRemovePaymentMethod] =
    React.useState(false);
  const handleRemovePaymentMethodOpen = () => setOpenRemovePaymentMethod(true);
  const handleRemovePaymentMethodClose = () =>
    setOpenRemovePaymentMethod(false);

  const onPrimaryClick = (data, type) => {
    switch (type) {
      case "payment-methods":
        return handleAddNewPaymentMethodClick();
      case "delete-payment-method":
        break;
      default:
        break;
    }
  };

  // Add payment method(My Payment methods)
  const handleAddNewPaymentMethodClick = async () => {
    const cardNumber = elements.getElement(CardNumberElement);
    const {
      fullName,
      email,
      cardNumber: isCardNumber,
      cardExpiry: isExpiry,
      cardCvc: isCvc,
      card,
    } = paymentInfo;
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: cardNumber,
      billing_details: {
        name: fullName,
        email,
      },
    });
    try {
      if (!(fullName && email && isCardNumber && isExpiry && isCvc) || error) {
        throw new Error();
      }
      const data = await createPaymentMethod({
        ...paymentMethod,
        isPrimary: false,
      });
      console.log(data);
      if (data.error) {
        /** empty */
      } else {
        try {
          const payload = {
            payments:
              _.map([...paymentMethods, data.paymentMethod], "_id")
            ,
          };
          const result = await updateProfile(payload);
          if (result && result.status === 200) {
            //   handleRefetch();
            const activeUser = authState.user;
            dispatch(setUserInfo({...activeUser, payments: [...paymentMethods, data.paymentMethod]}));
          }
        } catch (error) {
          toast(error.message, { type: "error" });
        }
        setPaymentMethods([...paymentMethods, data.paymentMethod]);
      }
      toast("New payment method added successfully.", {
        theme: "light",
        style: {
          backgroundColor: "white",
          color: "primary",
          fontFamily: "Gilroy",
          fontSize: "14px",
        },
      });
      modalDispatch({
        type: CLOSE_MODAL,
      });
    } catch (error) {
      toast("Adding new payment method Failed", {
        type: "error",
        className: "toast-custom",
      });
    }
  };

  const modalDispatch = useModalDispatch();

  const openModal = () => {
    modalDispatch({
      type: "OPEN_MODAL",
    });
  };

  useEffect(() => {
    if (openPaymentMethod) {
      setModalContent({
        type: "payment-methods",
        heading: "Add new payment method",
        paragraph: null,
        component: <PaymentMethodsForm setInfo={setPaymentInfo} />,
        primaryButtonValue: "Add",
        secondaryButtonValue: "Cancel",
        onPrimaryClick: handleAddNewPaymentMethodClick,
      });
      openModal();
    }
  }, [openPaymentMethod]);

  useEffect(() => {
    const activeUser = authState.user;
    const { payments } = activeUser;
    setPaymentMethods(payments || []);
  }, [authState]);

  const handleDeletePaymentMethod = async (methodId) => {
    const formData = new FormData();
    formData.append('payments', JSON.stringify([...paymentMethods.filter(item => item._id !== methodId)]));
    // setPaymentMethods([...paymentMethods.filter(item => item._id !== methodId)]);

    try {
      // const result = await updateShop(shopData._id, formData);
      // if (result && result.status === 200) {
      //   handleRefetch();
      // }
    } catch (error) {
      toast(error.message, { type: "error" });
    }
  };

  const handleSetPrimaryPaymentMethod = async (methodId) => {
    const formData = new FormData();
    formData.append('primaryPayment', methodId);

    try {
      // const result = await updateShop(shopData._id, formData);
      // if (result && result.status === 200) {
      //   handleRefetch();
      // }
    } catch (error) {
      toast(error.message, { type: "error" });
    }
  };

  return (
    <>
      <div className="w-full flex flex-col gap-[24px]">
        <div className="flex justify-between">
          <Typography variant="h5" className="capitalize">
            My Payment Methods
          </Typography>
          <IconButton onClick={handlePaymentMethodOpen}>
            <AddCircleIcon className="text-[#aeaeae] text-2xl hover:text-normal" />
          </IconButton>
        </div>
        <div className="flex flex-col gap-4 font-gilroy">
          {paymentMethods.map((item, index) => (
            <PaymentCard
              key={index}
              cardInfo={{...item, title: `Payment Method ${index + 1}`}}
              isPrimary={item._id === primaryPayment}
              onDelete={handleDeletePaymentMethod}
              onPrimary={handleSetPrimaryPaymentMethod}
            />
          ))}
        </div>
      </div>

      <GeneralModal
        heading={modalContent.heading}
        paragraph={modalContent.paragraph}
        img={modalContent.img}
        primaryButtonValue={modalContent.primaryButtonValue}
        secondaryButtonValue={modalContent.secondaryButtonValue}
        primaryButtonType={modalContent.primaryButtonType}
        onPrimaryClick={(data) => onPrimaryClick(data, modalContent.type)}
      >
        {modalContent.component}
      </GeneralModal>
    </>
  );
};

export default PaymentMethod;
