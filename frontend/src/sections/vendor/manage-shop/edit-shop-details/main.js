import React, { useEffect, useState, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { useForm, FormProvider } from "react-hook-form";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import {  useLocation, useNavigate } from "react-router-dom";
import { TextConstants } from "src/constants/textConstants";
// @mui
import {
  Avatar,
  FormControl,
  Button,
  Typography,
  IconButton,
  Grid,
} from "@mui/material";
// Asset
import { icPen, UploadImg } from "src/assets";
// Components
import SocialLinkItem from "./social-link-item";
import ProductCategory from "./product-category";
import BankingInfoForm from "src/sections/vendor/banking-information/forms/add-banking-info";
import PaymentCard from "src/components/payment-card";
import BankingCard from "src/components/banking-card";
import ChooseLocation from "src/components/choose-location-select";
import ShopCategoryAutoComplete from "src/components/shop-category-auto-complete";
import PhoneNumberInput from "src/components/phonenumber";
import { RHFTextField } from "src/components/hook-form";
import ButtonLoader from "src/components/button-loader/ButtonLoader";
// ModalForms
import SubscribePlanForm from "./forms/subscribe-plan";
import ReferralLinkForm from "./forms/referral-link";
// Icons
import AddIcon from "@mui/icons-material/Add";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { ArrowForwardIos } from "@mui/icons-material";
// apis
import { getShop, updateShop } from "src/api/vendor/shops";
// Reducers
import { useModalDispatch } from "src/contexts/ModalContext";
import {
  getAllShopCategories,
} from "src/reducers/shopCategorySlice";
import { CLOSE_MODAL } from "src/reducers/modalReducer";
import {
  CardNumberElement, useElements, useStripe
} from "@stripe/react-stripe-js";
import { createPaymentMethod } from "src/api/shopper/payment";
import _ from 'lodash';
import { createSubscription, updateSubscription } from "src/api/vendor/subscription";
import PaymentDialog from "src/components/modal/payment";
import DefaultButton from "src/components/button/default-button.js";

// ------------------------------------------------------------------------------------------------------------------------------------------

export default function Main() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const elements = useElements();
  const stripe = useStripe();
  const location = useLocation();
  const {
    data: shopCategories,
    status,
    loading: shopLoading,
  } = useSelector((state) => state.shopCategories);

  const [shopData, setShopData] = useState(location.state);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({});
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [paymentState, setPaymentState] = useState({
    email: '',
    fullName: '',
    country: '',
    activeMethod: 'card',
    errorMessage: {},
    loading: false
  });

  useEffect(() => {
    handleRefetch();
    dispatch(getAllShopCategories());
  }, []);

  useEffect(() => {
    if (shopData) {
      setSelectedCategories(shopData.categories);
      setPhoneNumber(shopData.phoneNumber);
      setPaymentMethods(shopData.payments);
    }
  }, [shopData]);

  const onSubmit = async () => {
    setLoading(true);

    const data = watch();

    const formData = new FormData();
    formData.append("name", data.shopname);
    formData.append("aboutUs", data.aboutus);
    formData.append("phoneNumber", phoneNumber);
    formData.append("supportEmail", data.email);
    formData.append("website", data.website);
    formData.append(
      "socialMedias",
      JSON.stringify(data.social.filter((element) => element != null))
    );
    formData.append(
      "locations",
      JSON.stringify(selectedOptions.map((element) => element._id))
    );
    formData.append(
      "categories",
      JSON.stringify(selectedCategories.map((element) => element._id))
    );
    formData.append("photo", image);
    formData.append('businessDetail', JSON.stringify({
      name: data.business_name,
      entity: data.business_entity,
      website: data.business_website,
      address: data.business_address
    }));
    formData.append('payments', JSON.stringify(_.map(paymentMethods, '_id')));

    try {
      const result = await updateShop(shopData._id, formData);
      setTimeout(() => {
        setLoading(false);
        toast("Changes Saved", {
          type: "success",
          className: "toast-custom",
        });
        handleRefetch();
        navigate(`/vendor/manage-shop`);
      }, 1000);
    } catch (error) {
      toast(error.message, { type: "error" });
      setLoading(false);
    }
  };

  // RHF Hook Form
  const NewFormDataSchema = Yup.object().shape({
  });

  const methods = useForm({
    resolver: yupResolver(NewFormDataSchema),
    defaultValues: {
      shopname: shopData.name,
      shopid: shopData.shopId,
      aboutus: shopData.aboutUs,
      email: shopData.supportEmail,
      website: shopData.website,
      business_name: shopData.businessDetail ? shopData.businessDetail['name'] : '',
      business_entity: shopData.businessDetail ? shopData.businessDetail['entity'] : '',
      business_website: shopData.businessDetail ? shopData.businessDetail['website'] : '',
      business_address: shopData.businessDetail ? shopData.businessDetail['address'] : '',
    },
  });

  const {
    formState: { errors },
    control,
    watch,
    register,
    unregister,
    reset,
    handleSubmit,
  } = methods;

  const handlePhoneNumber = (value) => {
    console.log(value);
    setPhoneNumber(value);
    if (phoneNumber == "") {
      errors.phonenumber = "Phone number is required";
    }
  };
  // ====================== Handle Social Link Item  ===========================

  const handleRemoveSocialLinkItem = (numberToRemove) => {
    // Filter the socialLinkItemNumbers array to remove the specified number
    const updatedSocialLinkItem = socialLinkItemNumbers.filter(
      (number) => number !== numberToRemove
    );

    // Update the socialLinkItemNumbers state
    setSocialLinkItemNumbers(updatedSocialLinkItem);

    // Filter the appendSocialLinkItem array to remove the corresponding section
    setAppendSocialLinkItem((prevComponents) =>
      prevComponents.filter((component) => {
        unregister(`social[${numberToRemove}]`);
        const componentNumber = parseInt(component.props.number, 10);
        return componentNumber !== numberToRemove;
      })
    );
  };

  const [appendSocialLinkItem, setAppendSocialLinkItem] = useState(
    // Initial section
    shopData.socialMedias.map((element, index) => (
      <SocialLinkItem
        key={index}
        register={register}
        link={element}
        number={index}
        removeSection={handleRemoveSocialLinkItem}
      />
    ))
  );
  const [socialLinkItemNumbers, setSocialLinkItemNumbers] = useState([1]); // New array to store order numbers
  const [socialLinkItemNum, setSocialLinkItemNum] = React.useState(
    shopData.socialMedias.length
  );
  const socialLinkItemTargetRef = useRef(null);

  const handleAddSocialLinkItem = () => {
    setSocialLinkItemNum((prevSocialLinkItemNum) => prevSocialLinkItemNum + 1);
    // Create a new component to append
    const newSocialLinkItem = (
      <SocialLinkItem
        key={socialLinkItemNum}
        register={register}
        number={socialLinkItemNum}
        removeSection={handleRemoveSocialLinkItem}
      />
    );
    // Update the state by adding the new component
    setAppendSocialLinkItem([...appendSocialLinkItem, newSocialLinkItem]);
    // Update the socialLinkItemNumbers array
    setSocialLinkItemNumbers([...socialLinkItemNumbers, socialLinkItemNum]);
  };

  // ====================== Handle Product Category Item  ===========================

  const handleRemoveProductCategory = (numberToRemove) => {
    // Filter the productCategoryNumbers array to remove the specified number
    const updatedProductCategory = productCategoryNumbers.filter(
      (number) => number !== numberToRemove
    );

    // Update the productCategoryNumbers state
    setProductCategoryNumbers(updatedProductCategory);

    // Filter the appendProductCategory array to remove the corresponding section
    setAppendProductCategory((prevComponents) =>
      prevComponents.filter((component) => {
        const componentNumber = parseInt(component.props.number, 10);
        return componentNumber !== numberToRemove;
      })
    );
  };

  const [appendProductCategory, setAppendProductCategory] = useState([
    // Initial section
    <ProductCategory
      key={0}
      number={1}
      removeSection={handleRemoveProductCategory}
    />,
  ]);
  const [productCategoryNumbers, setProductCategoryNumbers] = useState([1]); // New array to store order numbers
  const [productCategoryNum, setProductCategoryNum] = React.useState(2);
  const productCategoryTargetRef = useRef(null);

  const handleAddProductCategory = () => {
    setProductCategoryNum(
      (prevProductCategoryNum) => prevProductCategoryNum + 1
    );
    // Create a new component to append
    const newProductCategory = (
      <ProductCategory
        key={productCategoryNum}
        number={productCategoryNum}
        removeSection={handleRemoveProductCategory}
      />
    );
    // Update the state by adding the new component
    setAppendProductCategory([...appendProductCategory, newProductCategory]);
    // Update the productCategoryNumbers array
    setProductCategoryNumbers([...productCategoryNumbers, productCategoryNum]);
  };

  // Upload product image
  const [avatarImg, setAvatarImg] = useState(shopData.photo || UploadImg); // Initial image or placeholder
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarImg(e.target.result); // Update avatar image
      };
      reader.readAsDataURL(file);
    }
  };

  const initialCategories = shopData.categories.map((element) => ({
    id: element._id,
    name: element.category,
  }));
  const [categories, setCategories] = useState(initialCategories);

  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleRefetch = async () => {
    const data = await getShop(location.state._id);
    if (data.status) {
      setShopData(data.data.shop);
      // navigate("/vendor/manage-shop/");
    }
  };

  // Add new category handler
  const handleAddCategory = (id, name) => {
    setCategories((prevCategories) => [
      ...prevCategories,
      { id, name, items: prevCategories.length }, // Assuming new categories have 0 items initially
    ]);
  };

  // Change category handler
  const handleCategoriesChange = (value) => {
    if (value.length > 5) {
      toast("Choose up to 5", {
        type: "error",
        className: "toast-custom",
      });
    } else {
      setSelectedCategories(value);
    }
  };

  // Delete category handler
  const handleDeleteCategory = (id) => {
    setCategories((prevCategories) =>
      prevCategories.filter((category) => category.id !== id)
    );
    // Also remove the category from the selected categories if it is selected
    setSelectedCategories((prevSelectedCategories) =>
      prevSelectedCategories.filter((category) => category.id !== id)
    );
  };

  const handleEditCategory = (id, newName) => {
    // Update the main categories list
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === id ? { ...category, name: newName } : category
      )
    );

    // Also update the selected categories if the category is selected
    setSelectedCategories((prevSelectedCategories) =>
      prevSelectedCategories.map((selectedCategory) =>
        selectedCategory.id === id
          ? { ...selectedCategory, name: newName }
          : selectedCategory
      )
    );
  };

  const handleDeleteSelectedCategory = (categoryToDeleteId) => {
    setSelectedCategories((prevCategories) =>
      prevCategories.filter((category) => category.id !== categoryToDeleteId)
    );
  };

  const [selectedOptions, setSelectedOptions] = useState(shopData.locations);

  // const debounce_locations = debounce((value) => {
  //     setUserPayload({
  //       ...userPayload,
  //       locations: value
  //     })
  //   }, 500)
  const handleLocationSelectionChange = useCallback((event, newValue) => {
    setSelectedOptions(newValue);
    // debounce_locations(newValue.map(elem => elem._id))
  }, []);

  // Modal
  const modalDispatch = useModalDispatch();

  const [modalContent, setModalContent] = useState({
    heading: "",
    paragraph: "",
    component: null,
    type: "disabled",
  });

  const openModal = () => {
    modalDispatch({
      type: "OPEN_MODAL",
    });
  };

  // Handle modal
  const handleOpenModal = (type) => {
    switch (type) {
      case "payment-methods":
        setOpenPaymentDialog(true);
        break;
      case "banking-info":
        setModalContent({
          type,
          heading: "Add new banking information",
          paragraph: null,
          component: <BankingInfoForm />,
          primaryButtonValue: "Add",
          secondaryButtonValue: "Cancel",
          onPrimaryClick: handleAddNewBankingInfoClick,
        });
        break;
      case "subscribe-plan":
        setModalContent({
          type,
          heading: "Lower your Platform Fees",
          paragraph: null,
          component: <SubscribePlanForm
            handlePlanChange={handlePlanChange}
            shopData={shopData}
            plan={shopData.subscription}
          />,
          primaryButtonValue: "Subscribe",
          secondaryButtonValue: "Cancel",
          primaryButtonType: selectedPlan ? false : true,
        });
        break;
      case "referral-link":
        setModalContent({
          type,
          heading: "How does the referral link work?",
          paragraph: null,
          component: <ReferralLinkForm />,
          primaryButtonValue: "Copy",
          secondaryButtonValue: "Cancel",
          onPrimaryClick: handleReferralLinkClick,
        });
        break;
      default:
        setModalContent({
          type,
          heading: "",
          paragraph: "",
          component: null,
        });
    }
    openModal();
  };

  // Modal primary click
  const onPrimaryClick = (data, type) => {
    switch (type) {
      case "payment-methods":
        return handleAddNewPaymentMethodClick();
      case "banking-info":
        return handleAddNewBankingInfoClick();
      case "delete-payment-method":
        break;
      case "subscribe-plan":
        return handleSubscribePlanClick(data);
      case "referral-link":
        return handleReferralLinkClick();
      default:
        break;
    }
  };

  useEffect(() => {
    console.log(paymentInfo);
  }, [paymentInfo]);

  // Add payment method(My Payment methods)
  const handleAddNewPaymentMethod = async (event) => {
    event.preventDefault();

    const { email, fullName } = paymentState;

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

      const cardNumber = elements.getElement(CardNumberElement);
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumber,
        billing_details: {
          name: fullName,
          email,
        },
      });

      if (error) {
        toast(error.message, { type: "error" });
        return;
      }

      const data = await createPaymentMethod({...paymentMethod, isPrimary: false});
      
      if (data.error) {
        throw new Error(data.error);
      }

      const formData = new FormData();
      formData.append('payments', JSON.stringify(_.map([...paymentMethods, data.paymentMethod], '_id')));

      const result = await updateShop(shopData._id, formData);
      if (result && result.status === 200) {
        handleRefetch();
        setPaymentMethods([...paymentMethods, data.paymentMethod]);
        toast("New payment method added successfully.", { type: "success" });
        setOpenPaymentDialog(false);
      }

    } catch (error) {
      toast("Adding new payment method Failed", { type: "error" });
    } finally {
      setPaymentState(prev => ({ ...prev, loading: false }));
    }
  };

  // Add new banking information
  const handleAddNewBankingInfoClick = async () => {
    try {
      toast("New banking information added successfully.", {
        theme: "light",
        style: {
          backgroundColor: "white",
          color: "primary",
          fontFamily: "Gilroy",
          fontSize: "14px",
        },
      }),
        modalDispatch({
          type: CLOSE_MODAL,
        });
    } catch (error) {
      toast("Adding new banking information Failed", {
        type: "error",
        className: "toast-custom",
      });
    }
  };

  // Subscribe plan(Monthly Subscription Plan (Basic Plan)
  const handleSubscribePlanClick = async (data) => {

    try {
      if (shopData.subscription) {
        const res = await updateSubscription({shop: shopData, data}, shopData.subscription.subId);
      } else {
        const res = await createSubscription({shop: shopData, data});
        toast("You subscribtion plan is selected", {
          theme: "light",
          style: {
            backgroundColor: "white",
            color: "primary",
            fontFamily: "Gilroy",
            fontSize: "14px",
          },
        });
      }
      modalDispatch({
        type: CLOSE_MODAL,
      });
      handleRefetch();
    } catch (error) {
      toast("Selecting your subscription plan Failed", {
        type: "error",
        className: "toast-custom",
      });
    }
  };

  // Subscription cost
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handlePlanChange = (plan) => {
    setSelectedPlan(plan); // Update selected plan
    setModalContent((prevContent) => ({
      ...prevContent,
      primaryButtonType: plan ? false : true, // Enable if plan is selected
    }));
  };

  // Referral Link
  const handleReferralLinkClick = async () => {
    toast("Your personal link is copied", {
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
  };

  // Leget Address
  const handleStreetChange = (_event, value) => {
    if (value.length === 0) {
      setError("address", { type: "manual", message: "Address is required" });
    } else {
      clearErrors("address");
    }

    handleStreetInputChange(value);
    setFormValue("address", value);
  };

  const handleStreetSelect = (_event, newValue) => {
    if (newValue) {
      setFormValue("address", newValue.value);
      clearErrors("address");
    }
  };

  const handleSetPrimaryPaymentMethod = async (methodId) => {
    const formData = new FormData();
    formData.append('primaryPayment', methodId);

    try {
      const result = await updateShop(shopData._id, formData);
      if (result && result.status === 200) {
        handleRefetch();
      }
    } catch (error) {
      toast(error.message, { type: "error" });
    }
  };

  const handleDeletePaymentMethod = async (methodId) => {
    const formData = new FormData();
    formData.append('payments', JSON.stringify([...paymentMethods.filter(item => item._id !== methodId)]));
    // setPaymentMethods([...paymentMethods.filter(item => item._id !== methodId)]);

    try {
      const result = await updateShop(shopData._id, formData);
      if (result && result.status === 200) {
        handleRefetch();
      }
    } catch (error) {
      toast(error.message, { type: "error" });
    }
  };

  console.log(shopData.subscription);

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full" noValidate>
          <div className="w-full flex flex-col gap-[56px]">
            <Grid container spacing={{ md: 6, xs: 3 }}>
              <Grid item xs={12} md={7}>
                <div className="w-full flex flex-col gap-[40px]">
                  <div className="w-full flex flex-col gap-[14px]">
                    <Typography variant="h5" className="capitalize">
                      Shop Details
                    </Typography>
                    <div className="flex flex-col sm:flex-row justify-between gap-[16px]">
                      <div
                        className="w-fit relative cursor-pointer"
                        onClick={handleAvatarClick}
                      >
                        <Avatar
                          variant="rounded"
                          alt="avatar"
                          src={avatarImg} // Use avatarImg as the src
                          sx={{
                            width: 72,
                            height: 72,
                            border: "1px solid #dce0e4",
                          }}
                        />
                        <input
                          {...register("photo")}
                          type="file"
                          ref={fileInputRef}
                          style={{ display: "none" }}
                          accept="image/jpeg,image/png"
                          onChange={handleFileChange}
                        />
                        <div className="absolute -right-2 -top-2 bg-[#F5F5F5] rounded-full p-[6px]">
                          <img src={icPen} />
                        </div>
                      </div>
                      <div className="w-full flex flex-col sm:flex-row gap-[24px]">
                        <FormControl className="w-full">
                          <Typography variant="label1">Shop name</Typography>
                          <RHFTextField
                            name="shopname"
                            placeholder="Enter shop name"
                          />
                        </FormControl>
                        <FormControl className="w-full">
                          <Typography variant="label1">Shop ID</Typography>
                          <RHFTextField name="shopid" placeholder="" />
                        </FormControl>
                      </div>
                    </div>
                    <div className="flex flex-col gap-[14px]">
                      <div className="flex flex-col">
                        <Typography variant="label1">
                          Shop item offerings
                        </Typography>
                        <FormControl className="flex-1">
                          {shopCategories && (
                            <ShopCategoryAutoComplete
                              selectedCategories={selectedCategories}
                              onChangeSelectedCategories={
                                handleCategoriesChange
                              }
                              categories={shopCategories}
                            />
                          )}
                        </FormControl>
                      </div>
                    </div>
                    <div className="flex flex-col gap-[14px]">
                      <div className="flex flex-col">
                        <Typography variant="label1">
                          Locations operating under this shop
                        </Typography>
                        <ChooseLocation
                          name="locations"
                          selectedOptions={selectedOptions}
                          onSelectionChange={handleLocationSelectionChange}
                        />
                      </div>
                    </div>
                    <FormControl className="w-full">
                      <Typography variant="label1">About Us</Typography>
                      <RHFTextField
                        name="aboutus"
                        multiline
                        rows="3"
                        placeholder="Enter information about your shop"
                      />
                    </FormControl>
                  </div>

                  <div className="w-full flex flex-col gap-[14px]">
                    <Typography variant="h5" className="capitalize">
                      Public contact info
                    </Typography>
                    <div className="w-full flex flex-col sm:flex-row gap-[24px]">
                      <FormControl className="w-full">
                        <Typography variant="label1">Phone number</Typography>
                        <PhoneNumberInput
                          name="phonenumber"
                          placeholder="Enter phone number"
                          fullWidth
                          value={shopData.phoneNumber}
                          register={register}
                          onChange={(e) => handlePhoneNumber(e.target.value)}
                        />
                      </FormControl>
                      <FormControl className="w-full">
                        <Typography variant="label1">Support email</Typography>
                        <RHFTextField
                          name="email"
                          placeholder="Enter support email address"
                          type="email"
                        />
                      </FormControl>
                    </div>
                    <div className="w-full flex gap-[24px]">
                      <FormControl className="w-full">
                        <Typography variant="label1">Website</Typography>
                        <RHFTextField
                          name="website"
                          placeholder="Paste website link"
                        />
                      </FormControl>
                      <FormControl className="w-full hidden sm:block"></FormControl>
                    </div>
                  </div>

                  <div className="w-full flex flex-col gap-[14px]">
                    <Typography variant="h5" className="capitalize">
                      Social media
                    </Typography>
                    <div
                      className="flex flex-col gap-[10px]"
                      ref={socialLinkItemTargetRef}
                    >
                      {appendSocialLinkItem.map((component, index) => (
                        <React.Fragment key={index}>{component}</React.Fragment>
                      ))}
                      <div className="flex">
                        <Button
                          sx={{
                            width: "inherit",
                            padding: "5px 5px",
                            fontFamily: "Gilroy",
                            fontSize: "14px",
                            color: "#181818",
                            borderRadius: "8px",
                            backgroundColor: "transparent",
                            textTransform: "unset",
                          }}
                          onClick={handleAddSocialLinkItem}
                        >
                          <AddIcon
                            className="mr-2"
                            sx={{ color: "#181818", fontSize: "18px" }}
                          />{" "}
                          Add new social media
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} md={5}>
                <div className="w-full flex flex-col gap-[40px]">
                  <div className="flex justify-between gap-[24px] items-start">
                    <div className="w-full flex flex-col gap-[6px]">
                      <Typography variant="h5" className="capitalize">
                        {shopData.subscription ? (
                          shopData.subscription?.type === 'monthly_plan' ? 'Monthly Subscription Pro Plan' : 'Annual Subscription Pro Plan'
                        ) : 'Basic Plan' }
                      </Typography>
                      {!shopData.subscription && (
                        <Typography variant="subtitle3">
                          Lower your platform fee by 1.5% by subscribing monthly.
                        </Typography>
                      )}
                    </div>
                    <div className="w-full flex flex-col gap-[6px] items-end">
                      <Typography variant="h6" className="capitalize">
                        ${shopData.subscription ? (shopData.subscription.type === 'monthly_plan' ? (shopData.subscription.price / 100 || 19.99) : (shopData.subscription.price / 100 || 180)) : 0}
                      </Typography>
                      <div className="flex">
                        <Button
                          className="hover:bg-[#f5f5f5] text-start"
                          onClick={() => handleOpenModal("subscribe-plan")}
                          sx={{
                            padding: "5px 10px",
                            fontFamily: "Gilroy",
                            fontSize: "14px",
                            color: "#181818",
                            borderRadius: "5px",
                            lineHeight: "1.5",
                            backgroundColor: "transparent",
                            textTransform: "unset",
                          }}
                        >
                          {shopData.subscription ? 'Change your plan' : 'Subscribe monthly to Pro Plan'}&nbsp;
                          <ArrowForwardIos className="text-heading text-[14px] ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between gap-[24px] items-start">
                    <div className="w-full flex flex-col gap-[6px]">
                      <Typography variant="h5" className="capitalize">
                        Current Platform Fees
                      </Typography>
                      <Typography variant="subtitle3">
                        Invite a business and lower your platform fee by 1% for 30 days.
                      </Typography>
                    </div>
                    <div className="w-full flex flex-col items-end gap-[6px]">
                      <div className="w-full flex flex-col gap-[6px] justify-end">
                        <Typography variant="h6" className="capitalize text-end">
                          {shopData.subscription ? '3% + .50 cents per order' : '4.5% + .50 cents per order'}
                        </Typography>
                        {!shopData.subscription && (
                          <Typography variant="subtitle3">
                            Potential platform fee: 3.5% + .50 cents per order
                          </Typography>
                        )}
                      </div>
                      <div className="flex">
                        <Button
                          className="hover:bg-[#f5f5f5] text-start"
                          onClick={() => handleOpenModal("referral-link")}
                          sx={{
                            padding: "5px 10px",
                            fontFamily: "Gilroy",
                            fontSize: "14px",
                            color: "#181818",
                            lineHeight: "1.5",
                            borderRadius: "5px",
                            backgroundColor: "transparent",
                            textTransform: "unset",
                          }}
                        >
                          Lower your platform fee{" "}
                          <ArrowForwardIos className="text-heading text-[14px] ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="w-full flex flex-col gap-[14px]">
                    <div className="flex justify-between items-center">
                      <Typography variant="h5" className="capitalize">
                        My Payment methods
                      </Typography>
                      <IconButton
                        onClick={() => handleOpenModal("payment-methods")}
                      >
                        <AddCircleIcon className="text-[#aeaeae] text-[24px] hover:text-normal" />
                      </IconButton>
                    </div>
                    <div className="flex flex-col gap-[14px]">
                      {
                        paymentMethods.map((item, index) => (
                          <PaymentCard
                            key={index}
                            cardInfo={{...item, title: `Payment Method ${index + 1}`}}
                            isPrimary={item._id === shopData.primaryPayment}
                            onDelete={handleDeletePaymentMethod}
                            onPrimary={handleSetPrimaryPaymentMethod}
                          />
                        ))
                      }
                    </div>
                  </div>

                  <div className="w-full flex flex-col gap-[14px] hidden">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col gap-[6px]">
                        <Typography variant="h5" className="capitalize">
                          My Banking information
                        </Typography>
                        <Typography variant="subtitle3" className="">
                          Enter the bank account for receiving payments.
                        </Typography>
                      </div>
                      <IconButton
                        onClick={() => handleOpenModal("banking-info")}
                      >
                        <AddCircleIcon className="text-[#aeaeae] text-[24px] hover:text-normal" />
                      </IconButton>
                    </div>
                    <div className="w-full flex flex-col gap-[14px]">
                      <BankingCard />
                    </div>
                  </div>

                  <div className="flex flex-col gap-[14px]">
                    <Typography variant="h5" className="capitalize">
                      Business Entity Details
                    </Typography>
                    <div className="flex flex-col sm:flex-row gap-[24px] justify-between items-center">
                      <FormControl className="w-full">
                        <Typography variant="label1">Business Name</Typography>
                        <RHFTextField
                          name="business_name"
                          placeholder="Enter business name"
                        />
                      </FormControl>
                      <FormControl className="w-full">
                        <Typography variant="label1">
                          Legal business entity or DBA name
                        </Typography>
                        <RHFTextField
                          name="business_entity"
                          placeholder="Enter business entity or DBA name"
                        />
                      </FormControl>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-[24px] justify-between items-center">
                      <FormControl className="w-full">
                        <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
                          Website
                        </label>
                        <RHFTextField
                          name="business_website"
                          placeholder="Enter website"
                        />
                      </FormControl>
                      <FormControl className="hidden sm:block w-full"></FormControl>
                    </div>
                  </div>

                  <div className="flex flex-col gap-[14px]">
                    <Typography variant="h5" className="capitalize">
                      Legal Business Address
                    </Typography>
                    <div className="flex flex-col sm:flex-row gap-[24px] justify-between items-center">
                      <FormControl className="w-full">
                        <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
                          {TextConstants.StreetAddress}
                        </label>
                        <RHFTextField
                          name="business_address"
                          placeholder="1234 Sesame Street, Sacramento CA 95691"
                        />
                      </FormControl>
                    </div>
                  </div>
                </div>
              </Grid>
            </Grid>

            <div className="w-full flex justify-center gap-[14px]">
              <DefaultButton value="Back" onClick={() => navigate("/vendor/manage-shop")} className="bg-[#F5F5F5] text-heading hover:bg-[#fef0f0]" />
              <DefaultButton loading={loading} value={"Save Changes"} type={"submit"}/>
            </div>
          </div>
        </form>
      </FormProvider>

      <PaymentDialog
        open={openPaymentDialog}
        onClose={() => setOpenPaymentDialog(false)}
        paymentState={paymentState}
        setPaymentState={setPaymentState}
        onSubmit={handleAddNewPaymentMethod}
        isLoading={loading}
        title={"Add new payment method"}
        okText={"Add"}
      />
    </>
  );
}

Main.propTypes = {
  formData: PropTypes.object,
};