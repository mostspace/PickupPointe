import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from "react-toastify";
// @mui
import {
    Avatar, FormControl, Button, Typography, IconButton, Grid,
} from '@mui/material';
// Assets
import { icPen, UploadImg } from 'src/assets';
// Components
import SocialLinkItem from "../edit-shop-details/social-link-item";
import ProductCategory from "../edit-shop-details/product-category";
import ShopCategoryAutoComplete from "src/components/shop-category-auto-complete";
import PhoneNumberInput from "src/components/phonenumber";
import { RHFTextField, } from 'src/components/hook-form';
import ChooseLocation from 'src/components/choose-location-select';
import ButtonLoader from "src/components/button-loader/ButtonLoader";
import GeneralModal from 'src/components/modal';
import PaymentMethodsForm from 'src/sections/vendor/manage-shop/edit-shop-details/forms/payment-methods';
import BankingInfoForm from 'src/sections/vendor/banking-information/forms/add-banking-info';
import PaymentCard from "src/components/payment-card";
import BankingCard from "src/components/banking-card";
// Icons
import AddIcon from '@mui/icons-material/Add';
import AddCircleIcon from '@mui/icons-material/AddCircle';
// api
import { addShop } from "src/api/vendor/shops";
// Reducers
import { getAllShopCategories } from "src/reducers/shopCategorySlice";
import { useModalDispatch } from 'src/contexts/ModalContext';
import { CLOSE_MODAL } from 'src/reducers/modalReducer';

// ------------------------------------------------------------------------------------------------------------------------------------------

export default function CreateShopDetail({ formData }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { data: shopCategories, status, loading: shopLoading } = useSelector((state) => state.shopCategories);

    useEffect(() => {
        dispatch(getAllShopCategories());
    }, [])

    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState("");

    const onSubmit = async () => {
        setLoading(true)

        const data = watch();
        const formData = new FormData();
        formData.append("name", data.shopname)
        formData.append("aboutUs", data.aboutus)
        formData.append("phoneNumber", phoneNumber)
        formData.append("supportEmail", data.email)
        formData.append("website", data.website)
        formData.append("socialMedias", JSON.stringify(data.social))
        formData.append("locations", JSON.stringify(selectedOptions.map((element) => element._id)))
        formData.append("categories", JSON.stringify(selectedCategories.map((element) => element._id)))
        formData.append("photo", image)

        try {
            const result = await addShop(formData);
            setTimeout(() => {
                setLoading(false)
                toast("Changes Saved", {
                    type: 'success',
                    className: 'toast-custom',
                })
                navigate('/vendor/manage-shop/');
            }, 1000);
        } catch (error) {
            toast(error.message, {type: 'error', className: 'toast-custom',})
            setLoading(false)
        }
    };

    // RHF Hook Form
    const NewFormDataSchema = Yup.object().shape({
        shopname: Yup.string().required('Shop name is required'),
        shopid: Yup.string().required('Shop id is required'),
        aboutus: Yup.string().required('About Us is required'),
        email: Yup.string().required('Email is required').email('Email must be a valid email address'),
        // phonenumber: Yup.string().required('Phone number is required'),
    });

    const defaultValues = useMemo(
        () => ({
            shopname: formData?.shopname || '',
            shopid: formData?.shopid || '',
            aboutus: formData?.aboutus || '',
            email: formData?.email || '',
            phonenumber: formData?.phonenumber || "",
        }),
        [formData]
    );

    const methods = useForm({
        resolver: yupResolver(NewFormDataSchema),
        defaultValues,
    });

    const {
        reset,
        formState: { errors },
        control,
        watch,
        handleSubmit,
        register
    } = methods;

    const handlePhoneNumber = (value) => {
        setPhoneNumber(value);
        if (phoneNumber == "") {
            errors.phonenumber = "Phone number is required"
        }
    }

    useEffect(() => {
        if (formData) {
            reset(defaultValues);
        }
    }, [formData, defaultValues, reset]);

    // ====================== Handle Social Link Item  ===========================

    const handleRemoveSocialLinkItem = (numberToRemove) => {
        // Filter the socialLinkItemNumbers array to remove the specified number
        const updatedSocialLinkItem = socialLinkItemNumbers.filter((number) => number !== numberToRemove);

        // Update the socialLinkItemNumbers state
        setSocialLinkItemNumbers(updatedSocialLinkItem);

        // Filter the appendSocialLinkItem array to remove the corresponding section
        setAppendSocialLinkItem((prevComponents) => (
            prevComponents.filter((component) => {
                const componentNumber = parseInt(component.props.number, 10);
                return componentNumber !== numberToRemove;
            })
        ));
    };

    const [appendSocialLinkItem, setAppendSocialLinkItem] = useState([
        // Initial section
        <SocialLinkItem register={register} key={0} number={0} removeSection={handleRemoveSocialLinkItem} />
    ]);
    const [socialLinkItemNumbers, setSocialLinkItemNumbers] = useState([1]); // New array to store order numbers
    const [socialLinkItemNum, setSocialLinkItemNum] = React.useState(1);
    const socialLinkItemTargetRef = useRef(null);

    const handleAddSocialLinkItem = () => {
        setSocialLinkItemNum(prevSocialLinkItemNum => prevSocialLinkItemNum + 1);
        // Create a new component to append
        const newSocialLinkItem = <SocialLinkItem register={register} key={socialLinkItemNum} number={socialLinkItemNum} removeSection={handleRemoveSocialLinkItem} />;
        // Update the state by adding the new component
        setAppendSocialLinkItem([...appendSocialLinkItem, newSocialLinkItem]);
        // Update the socialLinkItemNumbers array
        setSocialLinkItemNumbers([...socialLinkItemNumbers, socialLinkItemNum]);
    };

    // ====================== Handle Product Category Item  ===========================

    const handleRemoveProductCategory = (numberToRemove) => {
        // Filter the productCategoryNumbers array to remove the specified number
        const updatedProductCategory = productCategoryNumbers.filter((number) => number !== numberToRemove);

        // Update the productCategoryNumbers state
        setProductCategoryNumbers(updatedProductCategory);

        // Filter the appendProductCategory array to remove the corresponding section
        setAppendProductCategory((prevComponents) => (
            prevComponents.filter((component) => {
                const componentNumber = parseInt(component.props.number, 10);
                return componentNumber !== numberToRemove;
            })
        ));
    };

    const [appendProductCategory, setAppendProductCategory] = useState([
        // Initial section
        <ProductCategory key={0} number={1} removeSection={handleRemoveProductCategory} />
    ]);
    const [productCategoryNumbers, setProductCategoryNumbers] = useState([1]); // New array to store order numbers
    const [productCategoryNum, setProductCategoryNum] = React.useState(2);

    // Upload product image
    const [avatarImg, setAvatarImg] = useState(UploadImg); // Initial image
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
                setAvatarImg(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const [selectedCategories, setSelectedCategories] = useState([]);

    // Change category handler
    const handleCategoriesChange = (value) => {
        if(value.length > 5) {
            toast("Choose up to 5", {
                type: "error",
                className: 'toast-custom',
            })
        } else {
            setSelectedCategories(value);
        }
    };

    const [selectedOptions, setSelectedOptions] = useState([]);

    const handleLocationSelectionChange = useCallback((event, newValue) => {
        setSelectedOptions(newValue);
        // debounce_locations(newValue.map(elem => elem._id))
    }, []);

    // Modal
    const modalDispatch = useModalDispatch();

    const [modalContent, setModalContent] = useState({
        heading: '',
        paragraph: '',
        component: null,
        type: 'disabled',
    });

    const openModal = () => {
        modalDispatch({
        type: 'OPEN_MODAL',
        });
    };

    // Handle modal
    const handleOpenModal = (type) => {
        switch (type) {
        case 'payment-methods':
            setModalContent({
                type,
                heading: 'Add new payment method',
                paragraph: null,
                component: <PaymentMethodsForm />,
                primaryButtonValue: 'Add',
                secondaryButtonValue: 'Cancel',
                onPrimaryClick: handleAddNewPaymentMethodClick,
            });
            break;
        case 'banking-info':
            setModalContent({
                type,
                heading: 'Add new banking information',
                paragraph: null,
                component: <BankingInfoForm />,
                primaryButtonValue: 'Add',
                secondaryButtonValue: 'Cancel',
                onPrimaryClick: handleAddNewBankingInfoClick,
            });
            break;
        default:
            setModalContent({
                type,
                heading: '',
                paragraph: '',
                component: null,
            });
        }
        openModal();
    }

    // Modal primary click
    const onPrimaryClick = (data, type) => {
        switch (type) {
        case 'payment-methods':
            return handleAddNewPaymentMethodClick();
        case 'banking-info':
            return handleAddNewBankingInfoClick();
        default:
            break;
        }
    }

    // Add payment method(My Payment methods)
    const handleAddNewPaymentMethodClick = async () => {
        try {
            toast("New payment method added successfully.",{
                theme: "light",
                style: {
                backgroundColor: "white",
                color: "primary",
                fontFamily: 'Gilroy',
                fontSize: '14px',
                },
            }),
            modalDispatch({
                type: CLOSE_MODAL,
            })
        } catch (error) {
            toast("Adding new payment method Failed", {
                type: 'error',
                className: 'toast-custom',
            });
        }
    }

    // Add new banking information
    const handleAddNewBankingInfoClick = async () => {
        try {
            toast("New banking information added successfully.",{
                theme: "light",
                style: {
                backgroundColor: "white",
                color: "primary",
                fontFamily: 'Gilroy',
                fontSize: '14px',
                },
            }),
            modalDispatch({
                type: CLOSE_MODAL,
            })
        } catch (error) {
            toast("Adding new banking information Failed", {
                type: 'error',
                className: 'toast-custom',
            });
        }
    }

    return (
        <>
            <FormProvider {...methods} onSubmit={onSubmit} className="w-full">
                <form onSubmit={handleSubmit(onSubmit)} className="w-full h-full" noValidate>
                    <div className="w-full h-full flex flex-col justify-between gap-[56px]">
                        <Grid container spacing={{ md: 6, xs: 3}}>
                            <Grid item md={6} xs={12}>
                                <div className="w-full flex flex-col gap-[40px]">
                                    <div className="flex flex-col gap-[14px]">
                                        <Typography variant="h5" className="capitalize">Shop Details</Typography>
                                        <div className="flex flex-col sm:flex-row justify-between gap-[16px]">
                                            <div className="w-fit relative cursor-pointer" onClick={handleAvatarClick}>
                                                <Avatar variant="rounded" alt="avatar" src={avatarImg} sx={{ width: 72, height: 72, border: '1px solid #dce0e4' }} />
                                                <input
                                                    {...register("photo")}
                                                    type="file"
                                                    ref={fileInputRef}
                                                    style={{ display: 'none' }}
                                                    accept="image/jpeg,image/png"
                                                    onChange={handleFileChange}
                                                />
                                                <div className="absolute -right-2 -top-2 bg-[#F5F5F5] rounded-full p-[6px]">
                                                    <img src={icPen} />
                                                </div>
                                            </div>
                                            <div className="w-full flex flex-col sm:flex-row gap-[24px]">
                                                <FormControl className="w-full" >
                                                    <Typography variant="label1">Shop name</Typography>
                                                    <Controller
                                                        name="shopname"
                                                        control={control}
                                                        rules={{
                                                            required: "Max Distance is required",
                                                            validate: (value) =>
                                                            (!isNaN(value) && parseFloat(value) > 0) ||
                                                            "Must be a valid number",
                                                        }}
                                                        render={({field}) => (
                                                            <RHFTextField {...field} name="shopname" placeholder='Enter shop name' required           error={!!errors.shopname}
                                                            />
                                                        )}
                                                    >
                                                    </Controller>
                                                </FormControl>
                                                <FormControl className="w-full">
                                                    <Typography variant="label1">Shop ID</Typography>
                                                    <RHFTextField name="shopid" placeholder='Enter shop id' required/>
                                                </FormControl>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-[14px]">
                                            <div className="flex flex-col">
                                                <Typography variant="label1">Shop item offerings</Typography>
                                                <FormControl className='flex-1'>
                                                    {shopCategories && <ShopCategoryAutoComplete
                                                        selectedCategories={selectedCategories}
                                                        onChangeSelectedCategories={handleCategoriesChange}
                                                        categories={shopCategories}
                                                    />}
                                                </FormControl>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-[14px]">
                                            <div className="flex flex-col">
                                                <Typography variant="label1">Locations operating under this shop</Typography>
                                                <ChooseLocation
                                                    name="locations"
                                                    selectedOptions={selectedOptions}
                                                    onSelectionChange={handleLocationSelectionChange}
                                                />
                                            </div>
                                        </div>
                                        <FormControl className="w-full">
                                            <Typography variant="label1">About Us</Typography>
                                            <RHFTextField name="aboutus" multiline rows='3' placeholder='Enter information about your shop' required/>
                                        </FormControl>
                                    </div>
                                </div>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <div className="w-full flex flex-col gap-[40px]">
                                    {/* <div className="flex flex-col gap-[14px]">
                                        <div className="flex justify-between items-center">
                                            <Typography variant="h5" className="capitalize">My Payment methods</Typography>
                                            <IconButton onClick={() => handleOpenModal('payment-methods')}>
                                                <AddCircleIcon className='text-[#aeaeae] text-[24px] hover:text-normal'/>
                                            </IconButton>
                                        </div>
                                        <div className="flex flex-col gap-[14px]">
                                            <PaymentCard />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-[14px]">
                                        <div className="flex justify-between items-center">
                                            <div className="flex flex-col gap-[6px]">
                                                <Typography variant="h5" className="capitalize">My Banking information</Typography>
                                                <Typography variant="subtitle3" className="">Enter the bank account for receiving payments.</Typography>
                                            </div>
                                            <IconButton onClick={() => handleOpenModal('banking-info')}>
                                                <AddCircleIcon className='text-[#aeaeae] text-[24px] hover:text-normal'/>
                                            </IconButton>
                                        </div>
                                        <div className="flex flex-col gap-[14px]">
                                            <BankingCard />
                                        </div>
                                    </div> */}

                                    <div className="flex flex-col gap-[14px]">
                                        <Typography variant="h5" className="capitalize">Public contact info</Typography>
                                        <div className="w-full flex flex-col sm:flex-row gap-[24px]">
                                            <FormControl className="w-full">
                                                <Typography variant="label1">Phone number</Typography>
                                                <PhoneNumberInput
                                                    name="phonenumber"
                                                    placeholder="Enter phone number"
                                                    fullWidth
                                                    register={register}
                                                    onChange={(e) => handlePhoneNumber(e.target.value)}
                                                />
                                            </FormControl>
                                            <FormControl className="w-full">
                                                <Typography variant="label1">Support email</Typography>
                                                <RHFTextField name="email" placeholder='Enter support email address' type='email' required/>
                                            </FormControl>
                                        </div>
                                        <div className="w-full flex gap-[24px]">
                                            <FormControl className="w-full">
                                                <Typography variant="label1">Website</Typography>
                                                <RHFTextField name="website" placeholder='Paste website link' required/>
                                            </FormControl>
                                            <FormControl className="w-full hidden sm:block">
                                            </FormControl>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-[14px]">
                                        <Typography variant="h5" className="capitalize">Social media</Typography>
                                        <div className="flex flex-col gap-[10px]" ref={socialLinkItemTargetRef} >

                                            {appendSocialLinkItem.map((component, index) => (
                                                <React.Fragment key={index}>{component}</React.Fragment>
                                            ))}

                                            <div className="flex">
                                                <Button
                                                    sx={{
                                                        width: 'inherit',
                                                        padding: '5px 5px',
                                                        fontFamily: 'Gilroy',
                                                        fontSize: '14px',
                                                        color: '#181818',
                                                        borderRadius: '8px',
                                                        backgroundColor: 'transparent',
                                                        textTransform: 'unset',
                                                    }}
                                                    onClick={handleAddSocialLinkItem}
                                                >
                                                    <AddIcon className="mr-2" sx={{ color: '#181818', fontSize: '18px' }} /> Add new social media
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Grid>
                        </Grid>

                        <div className="w-full flex justify-center gap-[14px]">
                            <Button
                                sx={{
                                    padding: '8px 40px',
                                    height: '44px',
                                    fontFamily: 'Gilroy',
                                    fontSize: '14px',
                                    color: '#181818',
                                    borderRadius: '8px',
                                    backgroundColor: '#F5F5F5',
                                    textTransform: 'unset',
                                }}
                                onClick={() => navigate('/vendor/manage-shop')}
                            >
                                Back
                            </Button>
                            {
                                loading ? <Button
                                    className="w-48"
                                    sx={{
                                        padding: '8px 40px',
                                        height: '44px',
                                        fontFamily: 'Gilroy',
                                        fontSize: '14px',
                                        borderRadius: "8px",
                                        border: "1px solid red",
                                        backgroundColor: "transparent",
                                    }}
                                    disabled={loading}
                                >
                                    <ButtonLoader />
                                </Button> : <Button
                                    className="w-48"
                                    sx={{
                                        padding: '8px 40px',
                                        height: '44px',
                                        fontFamily: 'Gilroy',
                                        fontSize: '14px',
                                        color: "rgba(254, 254, 255, 1)", // Change text color if needed
                                        borderRadius: "8px",
                                        backgroundColor: "rgba(241, 68, 69, 1)", // Change background color
                                        textTransform: "unset",
                                        "&:hover": {
                                            backgroundColor: "rgba(300, 68, 69, 1)", // Change hover background color
                                        },
                                    }}
                                    type="submit"
                                >
                                    Save Changes
                                </Button>
                            }
                        </div>
                    </div>
                </form>

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

            </FormProvider>
        </>
    )
}