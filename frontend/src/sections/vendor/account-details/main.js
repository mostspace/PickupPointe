import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// Assets
import { icPen } from "src/assets";
import axiosInstance from "src/utils/axios";
import { BASE_URL } from "src/config-global";
// Components
import DefaultButton from "src/components/button/default-button";
import Iconify from "src/components/iconify";
import ImageUpload from "src/components/image-upload";
import PhoneNumberInput from 'src/components/phonenumber';
import { RHFTextField } from "src/components/hook-form";
// @mui
import {
  Avatar, FormControl, Button, Typography, IconButton, InputAdornment, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField,
} from "@mui/material";
// Hook
import { useForm, FormProvider } from "react-hook-form";
import useSmartyAutocomplete from "src/hooks/use-smarty-autocomplete";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validateWebsite,
} from "src/utils/utilityFunctions";
import ButtonLoader from "src/components/button-loader/ButtonLoader";
import { getCurrentUser } from "src/reducers/userSlice";
import { useDispatch } from "react-redux";

// --------------------------------------------------------------------------------------------------

const Main = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();

  const [avatar, setAvatar] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const {
    suggestions,
    error: streetError,
    handleInputChange,
  } = useSmartyAutocomplete();

  const handleBack = () => {
    navigate(-1);
  };

  const onSubmit = (data) => {
    console.log(data);
  };

  const [user, setUser] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [street, setStreet] = useState("")
  const [requiredFieldsError, setRequiredFieldsError] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    email: "",
    name: "",
    entity: "",
    website: "",
    supportNumber: "",
    supportEmail: "",
    countryCode: "",
    state: "",
    city: "",
    street: "",
    zipCode: "",
  });

  const validateRequiredFields = (data) => {
    const errors = {};

    // Utility function to check if a value is empty or not
    const isEmpty = (value) =>
      value === undefined || value === null || value === "";

    // Required Fields
    if (isEmpty(data.firstName)) errors.firstName = "First name is required";
    if (isEmpty(data.lastName)) errors.lastName = "Last name is required";
    if (isEmpty(data.contactNumber))
      errors.contactNumber = "Contact number is required";
    if (isEmpty(data.email))
      errors.email = "Contact email is required";

    // Nested entityDetail fields
    if (isEmpty(data?.name)) errors.name = "Business Name is required";
    if (isEmpty(data?.entity)) errors.entity = "DBA name is required";
    if (isEmpty(data?.website)) errors.website = "Website is required";
    if (isEmpty(data?.supportNumber))
      errors.supportNumber = "Support number is required";
    if (isEmpty(data?.supportEmail))
      errors.supportEmail = "Support email is required";
    // if (isEmpty(data?.country)) errors.countryCode = 'Country is required';
    // if (isEmpty(data?.state)) errors.state = 'State is required';
    // if (isEmpty(data?.city)) errors.city = 'City is required';
    if (isEmpty(data?.street)) errors.street = "Street is required";
    // if (isEmpty(data?.zipCode)) errors.zipCode = 'Zip code is required';

    // Update error state
    setRequiredFieldsError(errors);

    // Return boolean indicating whether there are errors
    return Object.keys(errors).length === 0;
  };

  // Handle Image Upload
  const handleUploadAvatar = async()=>{
    setLoading(true)
    try {
      let data = new FormData();
      data.append('photo', selectedFile);
      const response = await axiosInstance.patch(
        `${BASE_URL}/api/v1/vendor/upload-avatar`, data
      );
      dispatch(getCurrentUser());
      setAvatar(response.data.avatar)
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  const getUserProfileData = async () => {
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}/api/v1/user/get-current-user`
      );
      if(response.data.user?.entityDetail?.street && response.data.user?.entityDetail?.city 
        && response.data.user?.entityDetail?.state && response.data.user?.entityDetail?.zipCode) {
          const streetString = `${response.data.user?.entityDetail?.street}, ${response.data.user?.entityDetail?.city}, ${response.data.user?.entityDetail?.state} ${response.data.user?.entityDetail?.zipCode}`
          setStreet(streetString)
        }
      setUser(response.data.user);
      setAvatar(response?.data?.user?.avatar)
      setFormValues({
        firstName: response.data.user?.firstName || "",
        lastName: response.data.user?.lastName || "",
        city: response.data.user?.entityDetail?.city || null,
        role: response.data.user?.role || "",
        email: response.data.user.email || "",
        state: response.data.user?.entityDetail?.state || "",
        status: response.data.user?.entityDetail?.status || "",
        street: response.data.user?.entityDetail?.street || "",
        countryCode: response.data.user?.entityDetail?.countryCode || "",
        zipCode: response.data.user?.entityDetail?.zipCode || "",
        company: response.data.user?.entityDetail?.company || "",
        contactNumber: response.data.user?.contactNumber || "",
        isVerified: response.data.user?.isVerified || true,
        website: response.data.user?.entityDetail?.website || "",
        supportNumber: response.data.user?.entityDetail?.supportNumber || "",
        supportEmail: response.data.user?.entityDetail?.supportEmail || "",
        entity: response.data.user?.entityDetail?.entity || "",
        name: response.data.user?.entityDetail?.name || "",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    getUserProfileData();
  }, []);

  // State management for field errors
  const [fieldErrors, setFieldErrors] = useState({
    supportEmail: false,
    email: false,
    supportNumber: false,
    contactNumber: false,
    website: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  // Handle value changes for any input field
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    // Validate fields and update errors
    switch (name) {
      case "supportEmail":
      case "email":
        setFieldErrors((prevErrors) => ({
          ...prevErrors,
          [name]: !validateEmail(value),
        }));
        break;
      case "supportNumber":
      case "contactNumber":
        setFieldErrors((prevErrors) => ({
          ...prevErrors,
          [name]: !validatePhoneNumber(value),
        }));
        break;
      case "website":
        setFieldErrors((prevErrors) => ({
          ...prevErrors,
          website: !validateWebsite(value),
        }));
        break;
      default:
        break;
    }
  };

  // RHF Hook Form
  const NewFormDataSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastname: Yup.string().required("Last Name is required"),
    email: Yup.string()
      .required("Email is required")
      .email("Email must be a valid email address"),
    supportemail: Yup.string().email("Email must be a valid email address"),
    contactNumber: Yup.string().required("Phone number is required"),
    supportNumber: Yup.string(),
    street: Yup.string().required("Street is required"),
    // country: Yup.string().required('Country is required'),
    company: Yup.string().required("Company is required"),
    // state: Yup.string().required('State is required'),
    // city: Yup.string().required('City is required'),
    role: Yup.string().required("Role is required"),
    website: Yup.string(),
    // not required
    status: Yup.string(),
    isVerified: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      city: user?.city || "",
      role: user?.role || "",
      email: user?.email || "",
      state: user?.state || "",
      status: user?.status || "",
      street: user?.street || "",
      countryCode: user?.countryCode || "",
      zipCode: user?.zipCode || "",
      company: user?.company || "",
      contactNumber: user?.contactNumber || "",
      isVerified: user?.isVerified || true,
      website: user?.website || true,
      supportNumber: user?.supportNumber || true,
      supportEmail: user?.supportEmail || true,
      entity: user?.entity || true,
      name: user?.name || true,
    }),
    [user]
  );

  const methods = useForm({
    resolver: yupResolver(NewFormDataSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // Change Profile Picture Modal
  const [openChangeProfilePicture, setOpenChangeProfilePicture] = React.useState(false);
  const handleChangeProfilePictureOpen = () => setOpenChangeProfilePicture(true);
  const handleChangeProfilePictureClose = () => setOpenChangeProfilePicture(false);

  // Edit Pickup Location Modal
  const [openChangePassword, setOpenChangePassword] = React.useState(false);
  const handleChangePasswordOpen = () => setOpenChangePassword(true);
  const handleChangePasswordClose = () => setOpenChangePassword(false);

  // Password Field
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const [pwdValues, setValues] = useState({
    password: "",
    showPassword: false,
  });

  const handlePwdChange = (prop) => (event) => {
    setValues({ ...pwdValues, [prop]: event.target.value });
  };
  const handleShowPassword = useCallback(() => {
    setValues({ ...pwdValues, showPassword: !pwdValues.showPassword });
  }, [pwdValues]);
  const handleMouseDownPassword = useCallback((event) => {
    event.preventDefault();
  }, []);

  // New Password
  const [newPwdValues, setNewPwdValues] = useState({
    password: "",
    showPassword: false,
  });

  const handleNewPwdChange = (prop) => (event) => {
    setNewPwdValues({ ...newPwdValues, [prop]: event.target.value });
  };

  const [passwordError, setPasswordError] = useState(null);
  const [passwordModalError, setPasswordModalError] = useState(null);
  const [passwordModalSuccess, setPasswordModalSuccess] = useState(null);

  useEffect(() => {
    if (newPwdValues.password != "") {
      let res = validatePassword(newPwdValues.password);
      if (!res.isValid) {
        setPasswordError(res.missing);
      } else {
        setPasswordError(null);
      }
      return;
    } else {
      setPasswordError(null);
    }
  }, [newPwdValues.password]);

  const handleShowNewPwd = useCallback(() => {
    setNewPwdValues({
      ...newPwdValues,
      showPassword: !newPwdValues.showPassword,
    });
  }, [newPwdValues]);

  const handleMouseDownNewPwd = useCallback((event) => {
    event.setNewPwdValues();
  }, []);

  // Confirm
  const [confirmValues, setConfirmValues] = useState({
    password: "",
    showPassword: false,
  });

  const handleConfirmPwdChange = (prop) => (event) => {
    setConfirmValues({ ...confirmValues, [prop]: event.target.value });
  };
  const handleShowConfirmPassword = useCallback(() => {
    setConfirmValues({
      ...confirmValues,
      showPassword: !confirmValues.showPassword,
    });
  }, [confirmValues]);

  const handleMouseDownConfirmPassword = useCallback((event) => {
    event.preventDefault();
  }, []);

  const handleSaveChangesClick = async () => {
    const allFieldsAreValid = Object.values(fieldErrors).every(
      (error) => error === false
    );

    setLoading(true)

    if (Object.values(fieldErrors).every((error) => error === false)) {
      try {
        if (validateRequiredFields(formValues)) {
          const data = {
            firstName: formValues.firstName,
            lastName: formValues.lastName,
            contactNumber: formValues.contactNumber,
            email: formValues.email,
            entityDetail: {
              name: formValues.name,
              entity: formValues.entity,
              website: formValues.website,
              supportNumber: formValues.supportNumber,
              supportEmail: formValues.supportEmail,
              countryCode: formValues.countryCode,
              state: formValues.state,
              city: formValues.city,
              street: formValues.street,
              zipCode: formValues.zipCode,
            },
          };
          const response = await axiosInstance.patch(
            `${BASE_URL}/api/v1/vendor/update-profile`,
            data
          );
          if (response.status == 200) {
            dispatch(getCurrentUser());
            toast("Profile Updated Successfully", {
              type: 'success',
              className: 'toast-custom'
            });
          }
        }
      } catch (err) {
        toast(err.message, {
          type: 'error',
          className: 'toast-custom'
        });
      }
      finally{
        setLoading(false);
      }
    } else {
      toast("Please resolve All Errors before saving changes", {
        type: 'error',
        className: 'toast-custom'
      });
    }
  };

  const handlePasswordChange = async () => {
    if (newPwdValues.password !== confirmValues.password) {
      // setPasswordModalError(`Passwords don't match`);
      toast("Passwords don't match", {
        type: 'error',
        className: 'toast-custom'
      });
      return;
    } else {
      // setPasswordModalError(``);
      // toast("", {
      //   type: 'error',
      //   className: 'toast-custom'
      // });
    }

    if (passwordError) {
      return;
    }
    try {
      const data = {
        prevPassword: pwdValues.password,
        newPassword: newPwdValues.password,
      };
      const response = await axiosInstance.put(
        `${BASE_URL}/api/v1/vendor/change-password`,
        data
      );
      if (response.status == 200) {
        // setPasswordModalSuccess(response.data.message);
        setTimeout(() => {
          // setPasswordModalSuccess(null);
          setOpenChangePassword(false);
        }, 3000);
        toast(response.data.message, {
          type: 'success',
          className: 'toast-custom'
        });
      }
    } catch (err) {
      // setPasswordModalError(err.error);
      toast(err.error, {
        type: 'error',
        className: 'toast-custom'
      });
    }
  };

  // Find the selected country object by code
  // const selectedCountry = countries.find(
  //   (country) => country.code === formValues.country
  // );

  const handleStreetChange = (_event, value) => {
    if (value.length === 0) {
      setRequiredFieldsError((prevErrors) => ({
        ...prevErrors,
        street: "Street is required",
      }));
    } else {
      setRequiredFieldsError((prevErrors) => ({
        ...prevErrors,
        street: "",
      }));
    }

    handleInputChange(value);
    setFormValues((prevValues) => ({
      ...prevValues,
      street: value,
    }));
  };

  const handleStreetSelect = (_event, newValue) => {
    if (newValue) {
      const {street, city, state, zipCode, countryCode} = splitAddress(newValue.value);
      setFormValues((prevValues) => ({
        ...prevValues,
        street,
        city,
        state,
        zipCode,
        countryCode, 
      }));
      setRequiredFieldsError((prevErrors) => ({
        ...prevErrors,
        street: "",
      }));
    }
  };

  function splitAddress(address) {
    
    let parts = address.split(', ');
    let street = parts[0];
    let city = parts[1];
    
    let StateZip = parts[2].split(' ');
    let state = StateZip[0];
    let zipCode = StateZip[1];
    // Default country code to US
    let countryCode = "US";
    
    return {
      street: street,
      city: city,
      state: state,
      zipCode: zipCode,
      countryCode: countryCode
    };
  }

  return (
    <>
      <FormProvider {...methods} onSubmit={onSubmit}>
        <div className="flex flex-col gap-[32px] sm:gap-[48px]">
          <div className="flex flex-col gap-[14px]">
            <Typography variant="h5" className="capitalize">
              Account Registration Details
            </Typography>
            <div className="flex flex-col sm:flex-row gap-[24px] justify-between items-start">
              <div className="flex flex-col sm:flex-row items-center w-full gap-[24px]">
                <div
                  className="relative cursor-pointer"
                  onClick={handleChangeProfilePictureOpen}
                >
                  {avatar ? (
                    <Avatar
                      alt="avatar"
                      src={avatar}
                      sx={{ width: 72, height: 72 }}
                    />
                  ) : (
                    <Avatar sx={{ width: 72, height: 72 }}></Avatar>
                  )}
                  <div className="absolute -right-1 -top-1 bg-[#F5F5F5] rounded-full p-[6px]">
                    <img src={icPen} />
                  </div>
                </div>
                <FormControl className="w-full">
                  <Typography variant="label1">First name</Typography>
                  <RHFTextField
                    name="firstName"
                    value={formValues.firstName}
                    onChange={handleChange}
                  />
                  {requiredFieldsError.firstName && (
                    <span className="font-normal text-danger leading-[20px] text-[12px] py-[4px]">
                      {requiredFieldsError.firstName}
                    </span>
                  )}
                </FormControl>
              </div>
              <FormControl className="w-full">
                <Typography variant="label1">Last name</Typography>
                <RHFTextField
                  name="lastName"
                  value={formValues.lastName}
                  onChange={handleChange}
                />
                {requiredFieldsError.lastName && (
                  <span className="font-normal text-danger leading-[20px] text-[12px] py-[4px]">
                    {requiredFieldsError.lastName}
                  </span>
                )}
              </FormControl>
            </div>
            <div className="flex flex-col sm:flex-row gap-[24px] justify-between items-center">
              <FormControl className="w-full">
                <Typography variant="label1">Contact number</Typography>
                {/* <RHFTextField
                  name="contactNumber"
                  InputProps={{
                    inputComponent: PhoneNumberMaskInput,
                  }}
                  placeholder="Enter phone number"
                  value={formValues.contactNumber}
                  onChange={handleChange}
                />
                {fieldErrors.contactNumber && (
                  <span className="font-normal text-danger leading-[20px] text-[12px] py-[4px]">
                    Invalid phone format.
                  </span>
                )}
                {requiredFieldsError.contactNumber && (
                  <span className="font-normal text-danger leading-[20px] text-[12px] py-[4px]">
                    {requiredFieldsError.contactNumber}
                  </span>
                )} */}
                <PhoneNumberInput onChange={handleChange} name="contactNumber" value={formValues.contactNumber} />
              </FormControl>
              <FormControl className="w-full">
                <Typography variant="label1">Registration email</Typography>
                <RHFTextField
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                />
                {fieldErrors.email && (
                  <span className="font-normal text-danger leading-[20px] text-[12px] py-[4px]">
                    Invalid email format.
                  </span>
                )}
                {requiredFieldsError.email && (
                  <span className="font-normal text-danger leading-[20px] text-[12px] py-[4px]">
                    {requiredFieldsError.email}
                  </span>
                )}
              </FormControl>
            </div>
          </div>

          {/* <div className="flex flex-col gap-[14px]">
            <Typography variant="h5" className="capitalize">
              Business Entity Details
            </Typography>
            <div className="flex flex-col sm:flex-row gap-[24px] justify-between items-center">
              <FormControl className="w-full">
                <Typography variant="label1">Business Name</Typography>
                <RHFTextField
                  name="name"
                  value={formValues.name}
                  onChange={handleChange}
                />

                {requiredFieldsError.name && (
                  <span className="font-normal text-danger leading-[20px] text-[12px] py-[4px]">
                    {requiredFieldsError.name}
                  </span>
                )}
              </FormControl>
              <FormControl className="w-full">
                <Typography variant="label1">Legal business entity or DBA name</Typography>
                <RHFTextField
                  name="entity"
                  value={formValues.entity}
                  onChange={handleChange}
                  placeholder="Enter business entity or DBA name"
                />
                {requiredFieldsError.entity && (
                  <span className="font-normal text-danger leading-[20px] text-[12px] py-[4px]">
                    {requiredFieldsError.entity}
                  </span>
                )}
              </FormControl>
            </div>
            <div className="flex flex-col sm:flex-row gap-[24px] justify-between items-center">
              <FormControl className="w-full">
                <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
                  Website
                </label>
                <RHFTextField
                  name="website"
                  value={formValues.website}
                  onChange={handleChange}
                />
                {fieldErrors.website && (
                  <span className="font-normal text-danger leading-[20px] text-[12px] py-[4px]">
                    Invalid website url format.
                  </span>
                )}

                {requiredFieldsError.website && (
                  <span className="font-normal text-danger leading-[20px] text-[12px] py-[4px]">
                    {requiredFieldsError.website}
                  </span>
                )}
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
                <Autocomplete
                  clearIcon={false}
                  freeSolo
                  value={street}
                  options={suggestions}
                  onInputChange={handleStreetChange}
                  onChange={handleStreetSelect}
                  renderInput={(params) => (
                    <div>
                      <TextField
                        {...params}
                        name="street"
                        variant="outlined"
                        required
                        placeholder={TextConstants.LocalStreetPlaceHolder}
                      />
                    </div>
                  )}
                  renderOption={(props, option) => (
                    <li {...props} key={option.key}>
                      {option.label}
                    </li>
                  )}
                />
                {(requiredFieldsError.street || streetError) && (
                  <span className="font-normal text-danger leading-[20px] text-[12px] py-[4px]">
                    {streetError ? streetError : requiredFieldsError.street}
                  </span>
                )}
              </FormControl>
            </div>
          </div> */}

          <div className="flex flex-col gap-[14px]">
            <Typography variant="h5" className="capitalize">
              Account security
            </Typography>
            <div className="flex flex-col sm:flex-row gap-[24px] sm:justify-between sm:items-center">
              <div className="flex flex-col gap-[6px]">
                <Typography variant="subtitle1">Password</Typography>
                <Typography variant="subtitle3">
                  Set a permanent password to login to your account
                </Typography>
              </div>
              <Button
                sx={{
                  padding: "8px 40px",
                  height: "44px",
                  fontFamily: "Gilroy",
                  fontSize: "14px",
                  color: "#181818",
                  borderRadius: "8px",
                  backgroundColor: "#F5F5F5",
                  textTransform: "unset",
                }}
                onClick={handleChangePasswordOpen}
              >
                Change password
              </Button>
            </div>
          </div>
          {error && (
            <span className="font-normal text-danger leading-[20px] text-[12px] py-[4px]">
              {error}
            </span>
          )}
          {success && (
            <span className="font-normal text-success leading-[20px] text-[14px] py-[4px]">
              {success}
            </span>
          )}

          <div className="flex justify-end items-center gap-[8px] mt-[8px]">
            <Button
              onClick={handleBack}
              sx={{
                padding: "8px 40px",
                height: "44px",
                fontFamily: "Gilroy",
                fontSize: "14px",
                color: "#181818",
                borderRadius: "8px",
                backgroundColor: "transparent",
                textTransform: "unset",
              }}
            >
              Back
            </Button>
            {/* <DefaultButton
              value={"Save changes"}
              onClick={() => handleSaveChangesClick()}
            /> */}

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
              <ButtonLoader/>
            </Button> : <Button
              className="w-48"
              sx={{
              padding: '8px 40px',
              height: '44px',
              fontFamily: 'Gilroy',
              fontSize: '14px',
              color:"rgba(254, 254, 255, 1)", // Change text color if needed
              borderRadius: "8px",
              backgroundColor: "rgba(241, 68, 69, 1)", // Change background color
              textTransform: "unset",
              "&:hover": {
              backgroundColor: "rgba(300, 68, 69, 1)", // Change hover background color
              },
            }}
              onClick={() => handleSaveChangesClick()}
            >
              Save Changes
            </Button>
            }
          </div>
        </div>
      </FormProvider>

      {/* Upload Image Modal */}
      <React.Fragment>
        <Dialog
          className="w-full"
          open={openChangeProfilePicture}
          onClose={handleChangeProfilePictureClose}
          scroll="paper"
          sx={{
            width: "100% !important",
          }}
        >
          <DialogTitle id="" className="pt-[32px] sm:!pt-[64px]">
            <h1 className="text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center font-gilroy">
              Change your profile picture
            </h1>
          </DialogTitle>
          <DialogContent dividers={scroll === "paper"}>
            <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
              <div className="flex flex-col gap-[24px] font-gilroy sm:px-[60px] py-[16px] justify-center items-center">
                <Typography variant="subtitle1">
                  Upload an image to represent your identity
                </Typography>
                <ImageUpload img={avatar || null} onFileSelect={handleFileSelect}/>
                <Typography variant="subtitle1">
                  Must be a .jpg, or .png file.
                </Typography>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions className="!px-[22px] !pb-[32px] sm:!pb-[64px] sm:!px-[80px] !gap-[14px]">
            <Button
              sx={{
                width: "100%",
                height: "44px",
                fontFamily: "Gilroy",
                fontSize: "14px",
                color: "#181818",
                borderRadius: "8px",
                backgroundColor: "#F5F5F5",
                textTransform: "unset",
              }}
              onClick={handleChangeProfilePictureClose}
            >
              Cancel
            </Button>
            <Button
              className="w-full"
              sx={{
                width: "100%",
                height: "44px",
                fontFamily: "Gilroy",
                fontSize: "14px",
                color: "#ffffff",
                borderRadius: "8px",
                backgroundColor: "#F14445",
                textTransform: "unset",
                "&:hover": {
                  backgroundColor: "#E13031",
                },
              }}
              onClick={()=>{
                handleUploadAvatar()
                handleChangeProfilePictureClose()
              }}
            >
              {loading? 'loading':"Save Changes"}
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>

      {/* Change Password Modal */}
      <React.Fragment>
        <Dialog
          className="w-full"
          open={openChangePassword}
          onClose={handleChangePasswordClose}
          scroll="paper"
          sx={{
            width: "100% !important",
          }}
        >
          <DialogTitle id="" className="pt-[32px] sm:!pt-[64px]">
            <h1 className="text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center font-gilroy">
              Change password
            </h1>
          </DialogTitle>
          <DialogContent dividers={scroll === "paper"}>
            <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
              <div className="flex flex-col gap-[14px] font-gilroy sm:px-[60px] py-[16px]">
                <FormControl variant="outlined" className="w-full">
                  <label className="font-normal text-normal leading-[20px] text-[14px] pb-[4px]">
                    Current password
                  </label>
                  <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    type={pwdValues.showPassword ? "text" : "password"}
                    value={pwdValues.password}
                    onChange={handlePwdChange("password")}
                    placeholder="Enter current password"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {pwdValues.showPassword ? (
                              <Iconify icon="solar:eye-bold" width={24} />
                            ) : (
                              <Iconify
                                icon="solar:eye-closed-bold"
                                width={24}
                              />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
                <FormControl variant="outlined" className="w-full">
                  <label className="font-normal text-normal leading-[20px] text-[14px] pb-[4px]">
                    New password
                  </label>
                  <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    type={newPwdValues.showPassword ? "text" : "password"}
                    value={newPwdValues.password}
                    onChange={handleNewPwdChange("password")}
                    placeholder="Enter new password"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleShowNewPwd}
                            onMouseDown={handleMouseDownNewPwd}
                            edge="end"
                          >
                            {newPwdValues.showPassword ? (
                              <Iconify icon="solar:eye-bold" width={24} />
                            ) : (
                              <Iconify
                                icon="solar:eye-closed-bold"
                                width={24}
                              />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {passwordError && (
                    <div>
                      {passwordError.map((error, index) => (
                        <p
                          key={index}
                          className="text-red-500 text-[14px] mt-1"
                        >
                          • Password should have {error}
                        </p>
                      ))}
                    </div>
                  )}
                </FormControl>
                <FormControl variant="outlined" className="w-full">
                  <label className="font-normal text-normal leading-[20px] text-[14px] pb-[4px]">
                    Confirm new password
                  </label>
                  <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    type={confirmValues.showPassword ? "text" : "password"}
                    value={confirmValues.password}
                    onChange={handleConfirmPwdChange("password")}
                    placeholder="Enter new password"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleShowConfirmPassword}
                            onMouseDown={handleMouseDownConfirmPassword}
                            edge="end"
                          >
                            {confirmValues.showPassword ? (
                              <Iconify icon="solar:eye-bold" width={24} />
                            ) : (
                              <Iconify
                                icon="solar:eye-closed-bold"
                                width={24}
                              />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
                {/* {passwordModalError && (
                  <p className="text-red-500 text-[14px] mt-1">
                    {passwordModalError}
                  </p>
                )} */}

                {/* {passwordModalSuccess && (
                  <p className="text-success text-[14px] mt-1">
                    {passwordModalSuccess}
                  </p>
                )} */}
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions className="!px-[22px] !pb-[32px] sm:!pb-[64px] sm:!px-[80px] !gap-[14px]">
            <Button
              sx={{
                width: "100%",
                height: "44px",
                fontFamily: "Gilroy",
                fontSize: "14px",
                color: "#181818",
                borderRadius: "8px",
                backgroundColor: "#F5F5F5",
                textTransform: "unset",
              }}
              onClick={handleChangePasswordClose}
            >
              Cancel
            </Button>
            <Button
              className="w-full"
              sx={{
                width: "100%",
                height: "44px",
                fontFamily: "Gilroy",
                fontSize: "14px",
                color: "#ffffff",
                // color: isFormValid() ? '#ffffff' : '#181818',  // Change text color if needed
                borderRadius: "8px",
                backgroundColor: "#F14445",
                // backgroundColor: isFormValid() ? '#F14445' : '#F5F5F5',  // Change background color
                textTransform: "unset",
                "&:hover": {
                  backgroundColor: "#E13031",
                  // backgroundColor: isFormValid() ? '#E13031' : '#F5F5F5',  // Change hover background color
                },
              }}
              onClick={handlePasswordChange}
            >
              Save changes
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </>
  );
};

export default Main;