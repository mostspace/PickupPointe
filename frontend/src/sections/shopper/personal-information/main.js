import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { useForm, FormProvider } from 'react-hook-form';
import { toast } from "react-toastify";
import * as Yup from 'yup';
// Assets
import { icPen } from 'src/assets';
// Components
import Iconify from 'src/components/iconify';
import ImageUpload from 'src/components/image-upload';
import PhoneNumberInput from "src/components/phonenumber";
import ButtonLoader from "src/components/button-loader/ButtonLoader";
import { getProfileLocationAddress, parseLocationAddress } from "src/components/choose-location-select";
import  {
  RHFTextField,
} from 'src/components/hook-form';
import styles from "./style";
// Constants
import { TextConstants } from "src/constants/textConstants";
// @mui
import {
  Avatar, FormControl, Button, Typography, IconButton, InputAdornment, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Autocomplete,
} from '@mui/material';
// Hooks
import { yupResolver } from '@hookform/resolvers/yup';
import useSmartyAutocomplete from "src/hooks/use-smarty-autocomplete";
import { changePassword, updateProfile, uploadAvatar } from "src/api/shopper/user";
import { updateUser } from "src/reducers/authSlice";

const Main = ({formData}) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const handleBack = () => navigate(-1);

  const authState = useSelector((state) => state.auth);
  const activeUser = authState.user;

  const [loading, setLoading] = useState(false)
  
  const [phoneNumber, setPhoneNumber] = useState(activeUser.contactNumber);
  const handlePhoneNumberChange = (event) => setPhoneNumber(event.target.value);
  
  const { suggestions, error , handleInputChange } = useSmartyAutocomplete();

  const handleUploadAvatar = async () => {
    try {
      setLoading(true);
      const avatarPayload = new FormData();
      avatarPayload.append("photo", selectedImage);
      const response = await uploadAvatar(avatarPayload);
      dispatch(updateUser(response));
      toast(`Successfully uploaded avatar`,{
        type: "success",
        className: "toast-custom"
      })
      setLoading(false);
      handleChangeProfilePictureClose();
    } catch (error) {
      toast(`Error on uploading avatar: ${error.message}`,{
        type: "error",
        className: "toast-custom"
      })
      setLoading(false);
    }
  }

  const onSubmit = async (data) => {
    try {
      console.log("Submitting data: ", data, phoneNumber);

      // Validate and prepare the payload
      const payload = {
        firstName: data.firstname,
        lastName: data.lastname,
        contactNumber: phoneNumber.trim(), // Ensure no extra spaces
        email: data.email,
        deliveryAddress: parseLocationAddress(data.address)?.address || "", // Avoid undefined addresses
        specialDeliveryInstruction: data.specialDeliveryInstruction
      };

      console.log("Payload: ", payload);

      setLoading(true);

      // Call API to update profile
      const response = await updateProfile(payload);

      if (response?.user) {
        dispatch(updateUser(response.user));
        toast(`Successfully updated profile`, {
          type: "success",
          className: "toast-custom",
        });
        console.log("API Response: ", response);
      } else {
        throw new Error("Unexpected API response format");
      }
    } catch (error) {
      console.error("Error updating profile: ", error);
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong.";
      toast(`Error on updating profile: ${errorMessage}`, {
        type: "error",
        className: "toast-custom",
      });
    } finally {
      setLoading(false); // Always reset loading state
    }
  };

  // RHF Hook Form
  const NewFormDataSchema = Yup.object().shape({
    firstname: Yup.string().required('First Name is required'),
    lastname: Yup.string().required('Last Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    phoneNumber: Yup.string().required('Phone number is required'),
    address: Yup.string().required('Address is required'),
    role: Yup.string().required('Role is required'),
    specialDeliveryInstruction: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      firstname: activeUser.firstName,
      lastname: activeUser.lastName,
      role: formData?.role || '',
      email: activeUser.email,
      address: getProfileLocationAddress(activeUser.deliveryAddress),
      phoneNumber: activeUser.contactNumber,
      specialDeliveryInstruction: activeUser.specialDeliveryInstruction,
    }),
    []
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
    setError,
    clearErrors,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  useEffect(() => {
    if (formData) {
      reset(defaultValues);
    }
  }, [formData, defaultValues, reset]);

  const [selectedImage, setSelectedImage] = useState(null);

  // Change Profile Picture Modal
  const [openChangeProfilePicture, setOpenChangeProfilePicture] = React.useState(false);
  const handleChangeProfilePictureOpen = () => setOpenChangeProfilePicture(true);
  const handleChangeProfilePictureClose  = () => setOpenChangeProfilePicture(false);

  // Change Password Modal
  const [openChangePassword, setOpenChangePassword] = React.useState(false);
  const handleChangePasswordOpen = () => setOpenChangePassword(true);
  const handleChangePasswordClose = () => {
    setValues({
      password: "",
      showPassword: false,
    })
    setConfirmValues({
      password: "",
      showPassword: false
    })
    setNewPwdValues({
      password: "",
      showPassword: false
    })
    setOpenChangePassword(false);
  };

  const handleChangePassword = async () => {
    if (confirmValues.password !== newPwdValues.password) {
      toast("New password is not equal to Confirm password", {type: 'info', className: 'toast-custom'});
    }
    try {
      const payload = {
        "prevPassword": pwdValues.password,
        "newPassword": newPwdValues.password
      }
      setLoading(true);
      await changePassword(payload);
      setLoading(false);
      toast("Successfully updated password", {type: 'success', className: 'toast-custom'});
      handleChangePasswordClose();
    } catch (error) {
      toast("Failed on updating password", {type: 'error', className: 'toast-custom'});
      setLoading(false);
    }
  }

  // Password Field
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const [pwdValues, setValues] = useState({
    password: '',
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
    password: '',
    showPassword: false,
  });

  const handleNewPwdChange = (prop) => (event) => {
    setNewPwdValues({ ...newPwdValues, [prop]: event.target.value });
  };
  const handleShowNewPwd = useCallback(() => {
    setNewPwdValues({ ...newPwdValues, showPassword: !newPwdValues.showPassword });
  }, [newPwdValues]);

  const handleMouseDownNewPwd = useCallback((event) => {
    event.setNewPwdValues();
  }, []);

  // Confirm
  const [confirmValues, setConfirmValues] = useState({
    password: '',
    showPassword: false,
  });

  const handleConfirmPwdChange = (prop) => (event) => {
    setConfirmValues({ ...confirmValues, [prop]: event.target.value });
  };
  const handleShowConfirmPassword = useCallback(() => {
    setConfirmValues({ ...confirmValues, showPassword: !confirmValues.showPassword });
  }, [confirmValues]);

  const handleMouseDownConfirmPassword = useCallback((event) => {
    event.preventDefault();
  }, []);


  const handleStreetChange = (_event, value) => {
    if (value.length === 0) {
      setError("address", { message: "Address is required" });
    } else {
      clearErrors("address");
      handleInputChange(value);
    }
    handleInputChange(value);
  };

  const handleStreetSelect = (_event, newValue) => {
    if (newValue) {
      setValue("address", newValue.value);
      clearErrors("address");
    }
  };

  return (
    <>
      <FormProvider {...methods}>
        <div className="flex flex-col gap-[32px]">
          <div className="flex flex-col gap-[14px]">
            <Typography variant="h5" className="capitalize">
              Personal contact details
            </Typography>
            <div className="flex flex-col sm:flex-row gap-[24px] justify-between items-center">
              <div className="flex flex-col sm:flex-row items-center w-full gap-[24px]">
                <div className="relative cursor-pointer" onClick={handleChangeProfilePictureOpen}>
                  <Avatar
                    alt="avatar"
                    src={selectedImage ? URL.createObjectURL(selectedImage) : activeUser.avatar}
                    sx={{ width: 72, height: 72 }}
                  />
                  <div className="absolute -right-1 -top-1 bg-[#F5F5F5] rounded-full p-[6px]">
                    <img src={icPen} />
                  </div>
                </div>
                <FormControl className="w-full">
                  <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">First name</label>
                  <RHFTextField name="firstname" placeholder="Enter first name" />
                </FormControl>
              </div>
              <FormControl className="w-full">
                <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">Last name</label>
                <RHFTextField name="lastname" placeholder="Enter last name" />
              </FormControl>
            </div>
            <div className="flex flex-col sm:flex-row gap-[24px] justify-between items-start">
              <FormControl className="w-full">
                <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">Contact number</label>
                <TextField 
                  InputProps={{
                    inputComponent: PhoneNumberInput
                  }} 
                  name="phoneNumber" 
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                />
              </FormControl>
              <FormControl className="w-full">
                <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
                  Registration email
                </label>
                <RHFTextField name="email" placeholder="Enter email" />
              </FormControl>
            </div>
          </div>

          <div className="flex flex-col gap-[14px]">
            <Typography variant="h5" className="capitalize">
              Delivery address
              <span className="text-[16px] lowercase ml-1">
                (also used for post mail deliveries)
              </span>
            </Typography>

            <div className="flex flex-col">
              <div className="flex flex-col sm:flex-row justify-between gap-[14px] items-center">
                <FormControl variant="standard" className="w-full">
                  <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
                    {TextConstants.StreetAddress}
                  </label>
                  <Autocomplete
                    clearIcon={false}
                    freeSolo
                    value={watch("address")}
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
                  {(errors?.address?.message || error) && (
                    <span className="font-normal text-danger leading-[20px] text-[12px] py-[4px]">
                      {error ? error : errors?.address?.message}
                    </span>
                  )}
                </FormControl>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-[14px]">
            <Typography variant="h5" className="capitalize">Special delivery instructions</Typography>

            <div className="flex flex-col">
              <div className="flex flex-col sm:flex-row justify-between gap-[14px] items-center">
                <FormControl variant="standard" className="w-full">
                  <Typography variant="label1">Provide any special instructions the driver may need to find your drop-off location easier</Typography>
                  <RHFTextField 
                    name="specialDeliveryInstruction" 
                    multiline 
                    rows="3"
                    placeholder="Call upon arrival, or use the side gate and enter code 3333 to enter the premises for delivery."
                  />
                </FormControl>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-[14px]">
            <Typography variant="h5" className="capitalize">
              {TextConstants.AccountSecurity}
            </Typography>
            <div className="flex flex-col sm:flex-row gap-[24px] sm:justify-between sm:items-center">
              <div className="flex flex-col gap-[6px]">
                <Typography variant="subtitle1">
                  {TextConstants.Password}
                </Typography>
                <Typography variant="label">
                  {TextConstants.setPasswordText}
                </Typography>
              </div>
              <Button sx={styles.changePasswordBtn} onClick={handleChangePasswordOpen}>
                {TextConstants.ChangePassword}
              </Button>
            </div>
          </div>

          <div className="flex justify-end items-center gap-[8px] mt-[8px]">
            <Button onClick={handleBack} sx={styles.backButtonMain}>
              {TextConstants.Back}
            </Button>
            {
              loading ? <Button
              className="w-40"
                sx={{
                  padding: '4px 2px',
                  height: '41px',
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
                className="w-40"
                sx={{
                  padding: '4px 2px',
                  height: '41px',
                  fontFamily: 'Gilroy',
                  fontSize: '14px',
                  color:"rgba(254, 254, 255, 1)",
                  borderRadius: "8px",
                  backgroundColor: "rgba(241, 68, 69, 1)",
                  textTransform: "unset",
                  "&:hover": {
                    backgroundColor: "rgba(300, 68, 69, 1)",
                  },
                }}
                onClick={handleSubmit(onSubmit)}
              >
                {TextConstants.SaveChanges}
              </Button>
            }
          </div>
        </div>
      </FormProvider>

      {/* Upload Image Modal */}
      <React.Fragment>
        <Dialog className="w-full"
            open={openChangeProfilePicture}
            onClose={handleChangeProfilePictureClose}
            scroll="paper"
            sx={{
              width: "100% !important",
            }}
        >
          <DialogTitle id="" className='pt-[32px] sm:!pt-[64px]'>
            <h1 className='text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center font-gilroy'>Change your profile picture</h1>
          </DialogTitle>
          <DialogContent dividers={scroll === 'paper'}>
            <DialogContentText
              id="scroll-dialog-description"
              tabIndex={-1}
            >
              <div className='flex flex-col gap-[24px] font-gilroy sm:px-[60px] py-[16px] justify-center items-center'>
                <Typography variant="subtitle1">Upload an image to represent your identity</Typography>
                <ImageUpload img={activeUser.avatar || null} onFileSelect={(file) => setSelectedImage(file)} />
                <Typography variant="subtitle1">Must be a .jpg, or .png file.</Typography>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions className="!px-[22px] !pb-[32px] sm:!pb-[64px] sm:!px-[80px] !gap-[14px]">
            <Button 
              sx={{
                  width: '100%',
                  height: '44px',
                  fontFamily: 'Gilroy',
                  fontSize: '14px',
                  color: '#181818',
                  borderRadius: '8px',
                  backgroundColor: '#F5F5F5',
                  textTransform: 'unset',
              }}
              onClick={handleChangeProfilePictureClose}
            >
              Cancel
            </Button>
            {
              loading ? <Button
              className="w-40"
              sx={{
                minWidth: '50%',
                width: '100%',
                height: '44px',
                fontFamily: 'Gilroy',
                fontSize: '14px',
                color: '#ffffff',
                borderRadius: '8px',
                backgroundColor: '#F14445',
                textTransform: 'unset',
                '&:hover': {
                    backgroundColor: '#E13031',
                }
            }}
              disabled={loading}
              >
              <ButtonLoader/>
              </Button> :
              <Button className='w-full'
              sx={{
                minWidth: '50%',
                  width: '100%',
                  height: '44px',
                  fontFamily: 'Gilroy',
                  fontSize: '14px',
                  color: '#ffffff',
                  borderRadius: '8px',
                  backgroundColor: '#F14445',
                  textTransform: 'unset',
                  '&:hover': {
                    backgroundColor: '#E13031',
                  }
              }}
              onClick={handleUploadAvatar}
            > 
              {TextConstants.SaveChanges}
            </Button>
            }
          </DialogActions>
        </Dialog>
      </React.Fragment>

      {/* Change Password Modal */}
      <React.Fragment>
        <Dialog className="w-full"
            open={openChangePassword}
            onClose={handleChangePasswordClose}
            scroll="paper"
            sx={{
              width: "100% !important",
            }}
        >
          <DialogTitle id="" className='pt-[32px] sm:!pt-[64px]'>
            <h1 className='text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center font-gilroy'>Change password</h1>
          </DialogTitle>
          <DialogContent dividers={scroll === 'paper'}>
            <DialogContentText
              id="scroll-dialog-description"
              tabIndex={-1}
            >
              <div className='flex flex-col gap-[14px] font-gilroy sm:px-[60px] py-[16px]'>
                <FormControl variant="outlined" className='w-full'>
                  <label className='font-normal text-normal leading-[20px] text-[14px] pb-[4px]'>Current password</label>
                  <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    type={pwdValues.showPassword ? 'text' : 'password'}
                    value={pwdValues.password}
                    onChange={handlePwdChange('password')}
                    placeholder='Enter current password'
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
                          <Iconify icon="solar:eye-closed-bold" width={24} />
                        )}
                        </IconButton>
                      </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
                <FormControl variant="outlined" className='w-full'>
                  <label className='font-normal text-normal leading-[20px] text-[14px] pb-[4px]'>New password</label>
                  <TextField
                      variant="outlined"
                      size="small"
                      fullWidth
                      type={newPwdValues.showPassword ? 'text' : 'password'}
                      value={newPwdValues.password}
                      onChange={handleNewPwdChange('password')}
                      placeholder='Enter new password'
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
                              <Iconify icon="solar:eye-closed-bold" width={24} />
                            )}
                          </IconButton>
                        </InputAdornment>
                        ),
                      }}
                  />
                </FormControl>
                <FormControl variant="outlined" className='w-full'>
                  <label className='font-normal text-normal leading-[20px] text-[14px] pb-[4px]'>Confirm password</label>
                  <TextField
                      variant="outlined"
                      size="small"
                      fullWidth
                      type={confirmValues.showPassword ? 'text' : 'password'}
                      value={confirmValues.password}
                      onChange={handleConfirmPwdChange('password')}
                      placeholder='Enter comfirm password'
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
                            <Iconify icon="solar:eye-closed-bold" width={24} />
                          )}
                          </IconButton>
                        </InputAdornment>
                        ),
                      }}
                  />
                </FormControl>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions className="!px-[22px] !pb-[32px] sm:!pb-[64px] sm:!px-[80px] !gap-[14px]">
            <Button 
              sx={{
                width: '100%',
                height: '44px',
                fontFamily: 'Gilroy',
                fontSize: '14px',
                color: '#181818',
                borderRadius: '8px',
                backgroundColor: '#F5F5F5',
                textTransform: 'unset',
              }}
              onClick={handleChangePasswordClose}
            >
              {TextConstants.Cancel}
            </Button>
            
            {
              loading ? <Button
              className="w-40"
              sx={{
                minWidth: '50%',
                width: '100%',
                height: '44px',
                fontFamily: 'Gilroy',
                fontSize: '14px',
                color: '#ffffff',
                borderRadius: '8px',
                backgroundColor: '#F14445',
                textTransform: 'unset',
                '&:hover': {
                  backgroundColor: '#E13031',
                }
            }}
              disabled={loading}
              >
              <ButtonLoader/>
              </Button> :
              <Button className='w-full'
              sx={{
                minWidth: '50%',
                  width: '100%',
                  height: '44px',
                  fontFamily: 'Gilroy',
                  fontSize: '14px',
                  color: '#ffffff',
                  borderRadius: '8px',
                  backgroundColor: '#F14445',
                  textTransform: 'unset',
                  '&:hover': {
                    backgroundColor: '#E13031',
                  }
              }}
              onClick={handleChangePassword}
            >
              {TextConstants.SaveChanges}
            </Button>
            }
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </>
  );
}

export default Main;