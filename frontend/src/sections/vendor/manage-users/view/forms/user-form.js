import React, {useEffect, useState} from "react";
import {
  Autocomplete,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  FormHelperText, IconButton, InputAdornment, Typography
} from "@mui/material";
import {TextConstants} from "src/constants/textConstants.js";
import DefaultButton from "src/components/button/default-button.js";
import {Controller, FormProvider, useForm} from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import PhoneNumberInput from "src/components/phonenumber/index.js";
import Iconify from "src/components/iconify/index.js";
import {Cached, ContentCopy} from "@mui/icons-material";
import {generatePassword} from "src/utils/utilityFunctions.js";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import {useDispatch, useSelector} from "react-redux";
import ChooseLocation from "src/components/choose-location-select/index.js";
import {fetchShops} from "src/reducers/shopSlice.js";
import { toast } from "react-toastify";
import {addUser, editUser} from "src/api/vendor/users.js";

const UserForm = (
  {
    isOpen, onClose, selectedUser, getListUser
  }) => {
  const form = useForm();
  const {
    register, reset, watch, handleSubmit, clearErrors, setError, control,
    setValue: setFormValue,
    formState: {isSubmitting, errors}
  } = form;

  const dispatch = useDispatch();
  const { shops } = useSelector((state) => state.shops);
  const { locations } = useSelector(state => state.locations)

  const [extFormData, setExtFormData] = useState({});
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [loading, setLoading] = useState(false);

  const isEdit = !!selectedUser;

  useEffect(() => {
    if (shops.length === 0) {
      dispatch(fetchShops())
    }
  }, [shops]);

  useEffect(() => {
    console.log(selectedUser)
    if (selectedUser) {
      reset({
        ...selectedUser,
        permissionVendor: selectedUser.permissions?.includes("vendor-portal"),
        permissionMerchant: selectedUser.permissions?.includes("tablet-user"),
      });
      if (shops) {
        setFormValue("shop", shops.find(shop => shop._id === selectedUser.shop));
        setSelectedShop(shops.find(shop => shop._id === selectedUser.shop))
      }
      if (locations) {
        const matchingLocations = locations.filter(location =>
          selectedUser.locations.some(userLocation => userLocation._id === location._id)
        );
        setFormValue("locations", matchingLocations);
        setExtFormDataInfo("locations", matchingLocations);
      }
      // setFormValue("locations", locations.find(location => location._id === selectedUser.shop));
    } else {
      reset({
        permissionVendor: false,
        permissionMerchant: false,
        firstName: "",
        lastName: "",
        contactEmail: "",
        contactNumber: "",
        password: ""
      });
      setSelectedShop({});
      setExtFormDataInfo("locations", [])
    }
  }, [selectedUser, shops, locations]);

  const setExtFormDataInfo = (key, value) => {
    setExtFormData(prevState => ({
      ...prevState,
      [key]: value
    }))
  }

  const onShopChange = (e, newValue) => {
    setSelectedShop(newValue);
    setExtFormDataInfo("locations", []);
  }

  const handleGeneratePassword = () => {
    const newPassword = generatePassword();
    setFormValue("password", newPassword)
  }

  const onPasswordCopy = () => {
    toast("Password copied", {type: 'success', className: 'toast-custom'});
    navigator.clipboard.writeText(watch("password"))
  }

  const closeModal = () => {
    reset();
    clearErrors();
    onClose()
  }

  const onSubmit = async (data) => {
    setLoading(true);
    const isValid = await form.trigger();

    if (isValid) {
      let formData = {
        ...data,
        permissions: []
      }
      if (data.permissionVendor) {
        formData.permissions.push("vendor-portal");
      }
      if (data.permissionMerchant) {
        formData.permissions.push("tablet-user");
      }
      try {
        if (isEdit) {
          await editUser(selectedUser._id, formData);
        } else {
          await addUser(formData);
        }
        await getListUser();
        closeModal();
      } catch (error) {
        setLoading(false);
        toast(error.message, {type: 'error', className: 'toast-custom'});
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <Dialog
      className="w-full !font-gilroy"
      open={isOpen}
      onClose={closeModal}
      scroll="paper"
      sx={{width: "100% !important",}}
    >
      <DialogTitle id="" className="pt-[32px] sm:!pt-[64px]">
        <h1 className="text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center font-gilroy">
          {!isEdit ? "Edit" : "Add"} user information
        </h1>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
          <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-[14px] font-gilroy sm:px-[60px] py-[16px]">
              <div className="flex justify-between w-full gap-[14px] items-end">
                <FormControl variant="standard" className="w-full">
                  <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
                    First name
                  </label>
                  <TextField
                    size="small"
                    variant="outlined"
                    fullWidth
                    name="firstName"
                    error={!!errors.firstName}
                    {...register("firstName", {
                      required: "First name is required",
                    })}
                  />
                  {errors.firstName && (
                    <FormHelperText error>{errors.firstName.message}</FormHelperText>
                  )}
                </FormControl>
                <FormControl variant="standard" className="w-full">
                  <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
                    Last name
                  </label>
                  <TextField
                    size="small"
                    variant="outlined"
                    fullWidth
                    name="lastName"
                    error={!!errors.lastName}
                    {...register("lastName", {
                      required: "Last name is required",
                    })}
                  />
                  {errors.lastName && (
                    <FormHelperText error>{errors.lastName.message}</FormHelperText>
                  )}
                </FormControl>
              </div>
              <div className="flex justify-between w-full gap-[14px] items-end">
                <FormControl variant="standard" className="w-full">
                  <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
                    Location phone number
                  </label>
                  <TextField
                    size="small"
                    variant="outlined"
                    fullWidth
                    name="contactNumber"
                    error={!!errors.phoneNumber}
                    // value={extFormData.phoneNumber}
                    InputProps={{inputComponent: PhoneNumberInput}}
                    // onChange={(e) => setExtFormDataInfo("phoneNumber", e.target.value)}
                    {...register("contactNumber", {
                      required: "Phone number is required",
                    })}
                  />
                  {errors.contactNumber && (
                    <FormHelperText error>{errors.contactNumber.message}</FormHelperText>
                  )}
                </FormControl>
                <FormControl variant="standard" className="w-full">
                  <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
                    Contact email
                  </label>
                  <TextField
                    size="small"
                    variant="outlined"
                    fullWidth
                    name="contactEmail"
                    error={!!errors.contactEmail}
                    {...register("contactEmail", {
                      required: "Contact email is required",
                    })}
                  />
                  {errors.contactEmail && (
                    <FormHelperText error>{errors.contactEmail.message}</FormHelperText>
                  )}
                </FormControl>
              </div>
              <div className="flex justify-between w-full gap-[14px] items-end">
                <FormControl variant="standard" className="w-full">
                  <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
                    Permissions
                  </label>
                  <div className="w-full">
                    <Controller
                      name="permissionVendor"
                      control={control}
                      defaultValue={false}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Checkbox 
                              size="small"
                              checked={field.value}
                              onChange={field.onChange}
                            />
                          }
                          label={<span className="text-[14px]">Merchant Portal</span>}
                        />
                      )}
                    />
                    <Controller
                      name="permissionMerchant"
                      control={control}
                      defaultValue={false}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Checkbox 
                              size="small"
                              checked={field.value}
                              onChange={field.onChange}
                            />
                          }
                          label={<span className="text-[14px]">Merchant Portal</span>}
                        />
                      )}
                    />
                  </div>
                </FormControl>
              </div>
              <div className="flex justify-between w-full gap-[14px] items-end">
                <FormControl variant="standard" className="w-full flex justify-between">
                  <div className="flex justify-between">
                    <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
                      Password
                    </label>
                    <Typography
                      variant='label1'
                      className='cursor-pointer underline'
                      onClick={() => handleGeneratePassword()}
                    >
                      <Cached className='mr-1 w-[16px]'/>
                      Regenerate password
                    </Typography>
                  </div>
                  <TextField
                    size="small"
                    variant="outlined"
                    type={passwordVisibility ? 'text' : 'password'}
                    fullWidth
                    name="password"
                    {...register("password")}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton onClick={() => setPasswordVisibility(!passwordVisibility)} edge='end'>
                            {passwordVisibility ? (
                              <Iconify icon='solar:eye-bold' width={24}/>
                            ) : (
                              <Iconify icon='solar:eye-closed-bold' width={24}/>
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
                <div className="flex gap-[14px]">
                  <DefaultButton
                    value={(<><ContentCopy className='mr-2' /> Copy</>)}
                    className="w-full bg-[#F5F5F5] text-heading hover:bg-[#fef0f0]"
                    onClick={onPasswordCopy}/>
                </div>
              </div>
              <FormControl variant="standard" className="w-full">
                <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
                  Choose Shop
                </label>
                <Controller
                  name="shop"
                  control={control}
                  rules={{ required: "Shop is required" }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      disablePortal
                      options={shops || []}
                      getOptionLabel={(option) => option?.name || ''}
                      value={selectedShop}
                      onChange={(e, newValue) => {
                        field.onChange(newValue);
                        setFormValue("locations", []);
                        onShopChange(e, newValue);
                      }}
                      popupIcon={<KeyboardArrowDownOutlinedIcon />}
                      noOptionsText="No shops"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={!!errors.shop}
                          variant="outlined"
                          placeholder="Choose a shop"
                          className="line-clamp-1"
                        />
                      )}
                    />
                  )}
                />
                {errors.shop && (
                  <FormHelperText error>{errors.shop.message}</FormHelperText>
                )}
              </FormControl>
              <FormControl variant="standard" className="w-full">
                <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
                  Choose Location
                </label>
                <Controller
                  name="locations"
                  control={control}
                  rules={{ required: "Location is required" }}
                  render={({ field }) => (
                    <ChooseLocation
                      {...field}
                      options={selectedShop?.locations ? locations.filter(loc => new Set(selectedShop.locations.map(shop => shop._id)).has(loc._id)) : []}
                      disabled={!selectedShop?._id}
                      selectedOptions={extFormData.locations || []}
                      onSelectionChange={(e, value) => {
                        field.onChange(value);
                        setExtFormDataInfo("locations", value);
                      }}
                      chipClassName={'font-gilroy'}
                      listClassName={'font-gilroy'}
                    />
                  )}
                />
                {errors.locations && (
                  <FormHelperText error>{errors.locations.message}</FormHelperText>
                )}
              </FormControl>
            </form>
          </FormProvider>
        </DialogContentText>
      </DialogContent>
      <DialogActions className="!px-[22px] !pb-[32px] sm:!pb-[64px] sm:!px-[80px] !gap-[14px]">
        <DefaultButton value={TextConstants.Cancel} className="w-full bg-[#F5F5F5] text-heading hover:bg-[#fef0f0]"
                       onClick={closeModal}/>
        <DefaultButton loading={loading} className='w-full'
                       value={!loading ? (selectedUser ? 'Update' : "Add Location") : ""}
                       onClick={handleSubmit(onSubmit)}/>
      </DialogActions>
    </Dialog>
  )
};

export default UserForm;