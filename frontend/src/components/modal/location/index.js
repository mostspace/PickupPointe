import React, {useEffect, useState} from "react";
import {
  Autocomplete, Checkbox, Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle, FormControlLabel,
  FormHelperText, Radio, RadioGroup, Typography
} from "@mui/material";
import {TextConstants} from "src/constants/textConstants.js";
import EditLocationOutlinedIcon from "@mui/icons-material/EditLocationOutlined";
import AddLocationAltOutlinedIcon from "@mui/icons-material/AddLocationAltOutlined";
import {Controller, FormProvider, useForm} from "react-hook-form";
import dayjs from "dayjs";
import axiosInstance from "src/utils/axios.js";

import {toast} from "react-toastify";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {TimePicker} from "@mui/x-date-pickers/TimePicker";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {BASE_URL} from "src/config-global.js";
import DefaultButton from "src/components/button/default-button.js";
import useSmartyAutocomplete from "src/hooks/use-smarty-autocomplete.js";
import PhoneNumberInput from "src/components/phonenumber";
import {RHFAutocomplete} from "src/components/hook-form";
import {_days} from "src/_mock/assets.js";
import LightTooltip from "src/components/LightTooltip";
import IOSSwitch from "src/components/ios-switch";

const EditLocationModal = ({
  isOpen,
  onClose,
  isEditMode,
  location,
  onSaveSuccess
}) => {
  const methods = useForm();
  const [deliveryTimeRange, setDeliveryTimeRange] = useState({from: null, to: null});
  const [pickupTimeRange, setPickupTimeRange] = useState({from: null, to: null});
  const [localDeliveryAvailable, setLocalDeliveryAvailable] = useState("deliver");
  const [showDeliverySection, setShowDeliverySection] = useState(true);
  const [showPickupSection, setShowPickupSection] = useState(false);
  const [taxRate, setTaxRate] = useState(null);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [loading, setLoading] = useState(false)
  const [extFormData, setExtFormData] = useState({});
  const [showDeliveryOption, setShowDeliveryOption] = useState({post: false, courier: true});
  const [locationDoorToDoorDeliveryMethod, setlocationDoorToDoorDeliveryMethod] = useState(null)
  const [locationPostMailDeliveryMethod, setLocationPostMailDeliveryMethod] = useState(null)
  const [address, setAddress] = useState("");
  const [taxRateTexts, setTaxRateTexts] = useState({ success: "", error: "", saved: true });

  useEffect(() => {
    if (isEditMode && location) {
      reset({
        name: location.name,
        address: formatAddress(location.address),
        contactPhoneNumber: location?.contact?.phoneNumber,
        contactFirstName: location?.contact?.firstName,
        contactLastName: location?.contact?.lastName,
        maxDistance: location?.delivery?.doorToDoor?.maxDistance || 0,
        pickupDays: location?.pickup?.days,
        deliveryDays: location?.delivery?.days,
        deliveryFrom: dayjs(location?.delivery?.from),
        deliveryTo: dayjs(location?.delivery?.to),
        pickupFrom: dayjs(location?.pickup?.from),
        pickupTo: dayjs(location?.pickup?.to),
        taxRate: location.taxRate
      });
      setTaxRate(location.taxRate);
      setFormValue("pickupDays", location?.pickup?.days)
      setFormValue("deliveryDays", location?.delivery?.days)
      setExtFormData({
        ...extFormData,
        phoneNumber: location?.contact?.phoneNumber
      });
      setAddress(formatAddress(location.address));

      if (location?.delivery?.doorToDoor?.use) {
        setlocationDoorToDoorDeliveryMethod(location?.delivery?.doorToDoor?.use)
      }
      if (location?.delivery?.postMail) {
        setLocationPostMailDeliveryMethod(location?.delivery?.postMail)
      }
      setFormValue("locationPrivate", location.isPrivate)
      setDeliveryTimeRange({
        from: location?.delivery?.from ? dayjs(location?.delivery?.from) : null,
        to: location?.delivery?.to ? dayjs(location?.delivery?.to) : null
      });
      setPickupTimeRange({
        from: location?.pickup?.from ? dayjs(location?.pickup?.from) : null,
        to: location?.pickup?.to ? dayjs(location?.pickup?.to) : null,
      })
      if (location?.pickup?.isUse) {
        setLocalDeliveryAvailable("pickup")
      } else if (location?.delivery?.isUse) {
        setLocalDeliveryAvailable("deliver")
      }
      if (location?.pickup?.isUse && location?.delivery?.isUse) {
        setLocalDeliveryAvailable("pickup_and_deliver")
      }
    } else {
      reset({});
      setExtFormData({
        ...extFormData,
        phoneNumber: ""
      });
      setlocationDoorToDoorDeliveryMethod(false)
      setLocationPostMailDeliveryMethod(false)
      setAddress("");
      setFormValue("locationPrivate", false)
      setLocalDeliveryAvailable("deliver")
    }
  }, [location, isEditMode]);

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.countryCode}`;
  };

  const clearValues = () => {
    setDeliveryTimeRange({from: null, to: null});
    setPickupTimeRange({from: null, to: null});
    setTaxRate(null);
    setLocalDeliveryAvailable("deliver")
    reset();
    clearErrors();
  }


  const {
    register, reset, watch, handleSubmit, clearErrors, setError, control,
    setValue: setFormValue,
    formState: {isSubmitting, errors},
  } = methods;

  const closeModal = () => {
    onClose()
    clearValues();
  }

  const {suggestions, error, handleInputChange: handleStreetInputChange} = useSmartyAutocomplete();

  const handleStreetChange = (_event, value) => {
    if (value.length === 0)
      setError("address", {type: "manual", message: "Address is required"});
    else
      clearErrors("address");

    handleStreetInputChange(value);
    setFormValue("address", value);
  };

  const handleStreetSelect = (_event, newValue) => {
    if (newValue) {
      setFormValue("address", newValue.value);
      clearErrors("address");
    }
  };

  const handleRadioTabChange = (event) => {
    const value = event.target.value;
    setLocalDeliveryAvailable(value);

    // Reset delivery options checkboxes when changing delivery availability type
    setShowDeliveryOption({
      post: false,
      courier: true,
    });

    if (value === "pickup_and_deliver") {
      setShowPickupSection(true);
      setShowDeliverySection(true);
    } else if (value === "deliver") {
      setShowPickupSection(false);
      setShowDeliverySection(true);
    } else if (value === "pickup") {
      setShowPickupSection(true);
      setShowDeliverySection(false);
    }
  };

  const handleTaxRateChange = (event) => {
    let { value } = event.target;
    console.log("Taxrate change", value)
    if (value === "") {
      setTaxRate(null);
      setTaxRateTexts({ success: "", error: "", saved: false });
      return;
    }

    const parsedValue = parseFloat(value);

    if (!isNaN(parsedValue) && parsedValue > 0 && parsedValue <= 50) {
      setTaxRate(parseFloat(parsedValue.toFixed(2)));
      setTaxRateTexts({ success: "", error: "", saved: false });
      clearErrors("taxRate")
      console.log("Taxrate change here", parsedValue, taxRate)
    } else if (parsedValue < 0) {
      setTaxRateTexts((prev) => ({
        ...prev,
        error: "Tax rate cannot be negative.",
      }));
    } else if (parsedValue > 50) {
      setTaxRateTexts((prev) => ({
        ...prev,
        error: "Tax rate cannot be more than 50%.",
      }));
    }
  };
  const parseAddress = (addressString) => {
    const addressParts = addressString.split(', ');
    if (addressParts.length < 3) {
      return null;
    }
    const street = addressParts[0];
    const city = addressParts[1];
    const stateAndZip = addressParts[2].split(' ');
    const state = stateAndZip[0];
    const zipCode = stateAndZip[1];
    return {countryCode: 'US', state, city, street, zipCode};
  };

  const onSubmit = async (data) => {
    console.log(data);
    const isValid = await methods.trigger();
    const parsedAddress = parseAddress(data.address);
    console.log("isValid", isValid, errors)
    if (!parsedAddress) {
      setError("address", "Invalid address format.");
      setRegisterLoading(false);
      return;
    }
    if (isValid) {
      const locationInfo = {
        name: data.name,
        address: parsedAddress,
        contact: {
          phoneNumber: extFormData.phoneNumber,
          firstName: data.contactFirstName,
          lastName: data.contactLastName,
        },
        pickup: {
          days: data.pickupDays,
          from: dayjs(pickupTimeRange.from),
          to: dayjs(pickupTimeRange.to),
          isUse: showPickupSection
        },
        delivery: {
          doorToDoor: {
            use: locationDoorToDoorDeliveryMethod,
            maxDistance: parseInt(data.maxDistance, 10),
          },
          postMail: locationPostMailDeliveryMethod,
          days: data.deliveryDays,
          from: dayjs(deliveryTimeRange.from),
          to: dayjs(deliveryTimeRange.to),
          isUse: showDeliverySection
        },
        isPrivate: data.locationPrivate || false,
        taxRate: data.taxRate
      };

      try {
        setLoading(true);
        let response;
        if (!isEditMode) {
          response = await axiosInstance.post(BASE_URL + `/api/v1/location`, locationInfo)
        } else {
          response = await axiosInstance.put(BASE_URL + `/api/v1/location/${location._id}`, locationInfo);
        }
        closeModal()
        onSaveSuccess(response.data.location)
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "An error occurred";
        setError(errorMessage);
        toast(errorMessage, {
          style: {
            backgroundColor: "red",
            color: "white",
            fontFamily: "Gilroy",
            fontSize: '14px',
          },
        });
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
          {!isEditMode ? TextConstants.AddNewLocation : TextConstants.EditLocation}
          {!isEditMode ?
            <AddLocationAltOutlinedIcon className="text-[24px] sm:text-[30px] ml-2 mb-1 sm:mb-2"/> :
            <EditLocationOutlinedIcon className="text-[24px] sm:text-[30px] ml-2 mb-1 sm:mb-2"/>
          }
        </h1>
      </DialogTitle>
      <DialogContent dividers={scroll === "paper"}>
        <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-[14px] font-gilroy sm:px-[60px] py-[16px]">
              <FormControl variant="standard" className="">
                <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
                  {TextConstants.LocationName}
                </label>
                <TextField
                  size="small"
                  variant="outlined"
                  fullWidth
                  name="name"
                  placeholder="Enter location name"
                  {...register("name", {
                    required: "Location name is required",
                  })}
                  error={!!errors.name}
                />
                {errors.name && (
                  <FormHelperText error>{errors.name.message}</FormHelperText>
                )}
              </FormControl>
              <FormControl variant="standard" className="w-full">
                <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
                  {TextConstants.Address}
                </label>
                <Autocomplete
                  clearIcon={false}
                  freeSolo
                  value={address}
                  options={suggestions}
                  onInputChange={handleStreetChange}
                  onChange={handleStreetSelect}
                  renderInput={(params) => (
                    <div>
                      <TextField
                        {...params}
                        name="address"
                        variant="outlined"
                        required
                        placeholder="Location address"
                        {...register("address", {
                          required: "Address is required",
                        })}
                        error={!!errors.address}
                      />
                      {(errors.address || error) && (
                        <FormHelperText error>
                          {error ? error : errors.address.message}
                        </FormHelperText>
                      )}
                    </div>
                  )}
                  renderOption={(props, option) => (
                    <li {...props} key={option.key}>
                      {option.label}
                    </li>
                  )}
                />
              </FormControl>
              <FormControl variant="standard" className="">
                <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
                  Location phone number
                </label>
                <TextField
                  InputProps={{
                    inputComponent: PhoneNumberInput,
                  }}
                  name="phoneNumber"
                  size="small"
                  variant="outlined"
                  fullWidth
                  placeholder="Enter contact number"
                  {...register("phoneNumber", {
                    required: "Phone Number is required"
                  })}
                  value={extFormData.phoneNumber}
                  onChange={(e) => setExtFormData({
                    ...extFormData,
                    phoneNumber: e.target.value
                  })}
                  error={!!errors.phoneNumber}
                />
                {errors.phoneNumber && (
                  <FormHelperText error>{errors.phoneNumber.message}</FormHelperText>
                )}
              </FormControl>
              <div className="flex justify-between w-full gap-[14px] items-end">
                <FormControl variant="standard" className="w-full">
                  <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
                    Location contact
                  </label>
                  <TextField
                    size="small"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter first name"
                    {...register("contactFirstName", {
                      required: "First name is required",
                    })}
                    error={!!errors.contactFirstName}
                  />
                  {errors.contactFirstName && (
                    <FormHelperText error>{errors.contactFirstName.message}</FormHelperText>
                  )}
                </FormControl>
                <FormControl
                  variant="standard"
                  className="w-full"
                >
                  <TextField
                    size="small"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter last name"
                    {...register("contactLastName", {
                      required: "Last Name is required",
                    })}
                    error={!!errors.contactLastName}
                  />
                  {errors.contactLastName && (
                    <FormHelperText error>{errors.contactLastName.message}</FormHelperText>
                  )}
                </FormControl>
              </div>
              <div className="flex flex-col gap-[14px]">
                <div className="w-full flex justify-between gap-[24px]">
                  <FormControl className="w-full">
                    <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
                      {TextConstants.HowDoesLocation}
                    </label>
                    <RadioGroup
                      row
                      value={localDeliveryAvailable}
                      onChange={handleRadioTabChange}
                      aria-label="delivery-options"
                      name="delivery-options"
                    >
                      <FormControlLabel
                        value="pickup"
                        control={
                          <Radio sx={{"&.Mui-checked": {color: "#F14445"}}} size="small"/>
                        }
                        label={<span className="text-[14px]">Pickup only</span>}
                      />
                      <FormControlLabel
                        value="deliver"
                        control={
                          <Radio sx={{"&.Mui-checked": {color: "#F14445"}}} size="small"/>
                        }
                        label={<span className="text-[14px]">Delivery only</span>}
                      />
                      <FormControlLabel
                        value="pickup_and_deliver"
                        control={
                          <Radio sx={{"&.Mui-checked": {color: "#F14445", fontSize: "12px",},}} size="small"/>
                        }
                        label={<span className="text-[14px]">Pickup and delivery available</span>}
                      />
                    </RadioGroup>

                    {(localDeliveryAvailable === "pickup_and_deliver" ||
                      localDeliveryAvailable === "deliver") && (
                      <div className="w-full">
                        <FormControl className="mt-1">
                          <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
                            Delivery method
                          </label>
                          <div className="w-full">
                            {/* Controller for deliveryOptionsCourier */}
                            <Controller
                              name="deliveryOptionsCourier"
                              control={control}
                              defaultValue={true} // Ensure it has a default value
                              render={({field: {onChange, value}}) => (
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      size="small"
                                      checked={locationDoorToDoorDeliveryMethod} // Sync only with form state (remove local state from here)
                                      onChange={(e) => {
                                        setlocationDoorToDoorDeliveryMethod(e.target.checked)
                                      }}
                                      value="courier"
                                    />
                                  }
                                  label={
                                    <span className="text-[14px]">
                                        Door-to-door courier delivery
                                    </span>
                                  }
                                />
                              )}
                            />

                            {/* Controller for deliveryOptionsPost */}
                            <Controller
                              name="deliveryOptionsPost"
                              control={control}
                              defaultValue={false} // Ensure it has a default value
                              render={({field: {onChange, value}}) => (
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      size="small"
                                      checked={locationPostMailDeliveryMethod} // Sync only with form state (remove local state from here)
                                      onChange={(e) => {
                                        setLocationPostMailDeliveryMethod(e.target.checked)
                                      }}
                                      value="post"
                                    />
                                  }
                                  label={
                                    <span className="text-[14px]">
                                        Post mail delivery
                                      </span>
                                  }
                                />
                              )}
                            />
                          </div>
                        </FormControl>

                        {showDeliveryOption.courier && (
                          <div className="flex flex-col gap-[14px] mt-4">
                            <FormControl className="w-full">
                              <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
                                Set your maximum courier delivery distance radius in miles
                              </label>
                              <Controller
                                name="maxDistance"
                                control={control}
                                // defaultValue={maxRadiusDefault} // Set a default value
                                rules={{
                                  required: "Max Distance is required",
                                  validate: (value) =>
                                    (!isNaN(value) && parseFloat(value) > 0) ||
                                    "Must be a valid number",
                                }}
                                render={({
                                           field: {onChange, value},
                                           fieldState: {error},
                                         }) => (
                                  <TextField
                                    placeholder="Enter miles amount"
                                    className="mt-2 w-full sm:mt-0 sm:w-[49%]"
                                    type="text"
                                    value={value}
                                    onChange={onChange}
                                    error={Boolean(error)}
                                    helperText={error ? error.message : ""}
                                  />
                                )}
                              />
                            </FormControl>
                          </div>
                        )}
                      </div>
                    )}
                  </FormControl>
                </div>
              </div>
              {(localDeliveryAvailable === "pickup_and_deliver" ||
                localDeliveryAvailable === "pickup") && (
                <FormControl variant="standard" className="flex flex-col gap-[14px]">
                  <div className="flex flex-col">
                    <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
                      Default pickup days for this location
                    </label>
                    <Controller
                      name="pickupDays"
                      control={control}
                      defaultValue={[]}
                      rules={{ required: "Pickup days are required" }} // Add validation rules
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <>
                          <RHFAutocomplete
                            name="pickupDays"
                            placeholder="+ Days"
                            multiple
                            freeSolo
                            disableCloseOnSelect
                            options={_days.map((option) => option)}
                            getOptionLabel={(option) => option}
                            renderOption={(props, option) => (
                              <li {...props} key={option}>
                                {option}
                              </li>
                            )}
                            renderTags={(selected, getTagProps) =>
                              selected.map((option, index) => (
                                <Chip
                                  {...getTagProps({ index })}
                                  key={option}
                                  label={option}
                                  size="small"
                                  color="tags"
                                  variant="soft"
                                  className="text-heading font-gilroy"
                                />
                              ))
                            }
                            value={value}
                            onChange={(event, newValue) => {
                              onChange(newValue);
                            }}
                          />
                        </>
                      )}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
                      Default pickup time-frame for this location
                    </label>
                    <div className="w-full flex justify-between gap-[14px]">
                      {/* From Section */}
                      <div className="w-full flex flex-col gap-[5px]">
                        <Typography variant="label">From</Typography>
                        <div className="flex items-center">
                          <FormControl
                            className="w-full"
                            error={Boolean(errors.pickupFrom)}
                          >
                            <Controller
                              name="pickupFrom"
                              defaultValue={0}
                              control={control}
                              render={({field}) => (
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                  <TimePicker
                                    name="pickupFrom"
                                    {...register("pickupFrom", {
                                      required: "Time is required",
                                    })}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        placeholder="08 : 00 AM"
                                        id={`timeframe-textfield-from`}
                                      />
                                    )}
                                    value={pickupTimeRange.from}
                                    onChange={(newValue) => {
                                      setPickupTimeRange((prev) => ({...prev, from: newValue}))
                                      clearErrors("pickupFrom")
                                    }}
                                  />
                                </LocalizationProvider>
                              )}
                            />
                          </FormControl>
                        </div>
                        {errors.pickupFrom && (
                          <Typography variant="caption" color="error">
                            {errors.pickupFrom.message}
                          </Typography>
                        )}
                      </div>
                      <div className="w-full flex flex-col gap-[5px]">
                        <Typography variant="label">To</Typography>
                        <div className="flex items-center">
                          <FormControl
                            className="w-full"
                            error={Boolean(errors.pickupFrom)}
                          >
                            <Controller
                              name="pickupTo"
                              defaultValue={0}
                              control={control}
                              render={({field}) => (
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                  <TimePicker
                                    name="pickupTo"
                                    {...register("pickupTo", {
                                      required: "Time is required",
                                    })}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        placeholder="08 : 00 PM"
                                        id={`timeframe-textfield-from`}
                                      />
                                    )}
                                    value={pickupTimeRange.to}
                                    onChange={(newValue) => {
                                      setPickupTimeRange((prev) => ({...prev, to: newValue}))
                                      clearErrors("pickupTo")
                                    }}
                                  />
                                </LocalizationProvider>
                              )}
                            />
                          </FormControl>
                        </div>
                        {errors.pickupTo && (
                          <Typography variant="caption" color="error">
                            {errors.pickupTo.message}
                          </Typography>
                        )}
                      </div>

                      {/* To Section */}
                      {/*<div className="w-full flex flex-col gap-[5px]">
                        <Typography variant="label">To</Typography>
                        <div className="flex items-center">
                          <FormControl className="w-full" error={Boolean(errors.pickupTo)}>
                            <Controller
                              name="pickupTo"
                              control={control}
                              defaultValue={null} // Set the default value here
                              rules={{required: "Pickup end time is required"}} // Add validation rules
                              render={({field}) => (
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                  <TimePicker
                                    name="pickupTo"
                                    {...register("pickupTo", {
                                      required: "Time is required",
                                    })}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        placeholder="08 : 00 AM"
                                        id={`timeframe-textfield-from`}
                                      />
                                    )}
                                    value={pickupTimeRange.to}
                                    onChange={(newValue) => {
                                      setPickupTimeRange((prev) => ({...prev, to: newValue}))
                                      clearErrors("pickupTo")
                                    }

                                    }
                                  />
                                </LocalizationProvider>
                              )}
                            />

                          </FormControl>
                        </div>
                        {errors.pickupTo && (
                          <Typography variant="caption" color="error">
                            {errors.pickupTo.message}
                          </Typography>
                        )}
                      </div>*/}
                    </div>
                  </div>
                </FormControl>
              )}

              {showDeliverySection && (
                <FormControl variant="standard" className="flex flex-col gap-[14px]">
                  <div className="flex flex-col">
                    <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
                      Default delivery days for this location
                    </label>
                    <Controller
                      name="deliveryDays"
                      control={control}
                      defaultValue={[]} // Set default value to an empty array for multiple selections
                      rules={{required: "Delivery days are required"}} // Add required validation
                      render={({
                        field: {onChange, value},
                        fieldState: {error},
                      }) => (
                        <>
                          <RHFAutocomplete
                            name="deliveryDays"
                            placeholder="+ Days"
                            multiple
                            freeSolo
                            disableCloseOnSelect
                            options={_days.map((option) => option)}
                            getOptionLabel={(option) => option}
                            renderOption={(props, option) => (
                              <li {...props} key={option}>
                                {option}
                              </li>
                            )}
                            renderTags={(selected, getTagProps) =>
                              selected.map((option, index) => (
                                <Chip
                                  {...getTagProps({index})}
                                  key={option}
                                  label={option}
                                  size="small"
                                  color="tags"
                                  variant="soft"
                                  className="text-heading font-gilroy"
                                />
                              ))
                            }
                            value={value}
                            onChange={(event, newValue) => {
                              onChange(newValue);
                            }}
                          />
                        </>
                      )}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
                      Default delivery time-frame for this location
                    </label>
                    <div className="w-full flex justify-between gap-[14px]">
                      {/* From Section */}
                      <div className="w-full flex flex-col gap-[5px]">
                        <Typography variant="label">From</Typography>
                        <div className="flex items-center">
                          <FormControl
                            className="w-full"
                            error={Boolean(errors.deliveryFrom)}
                          >
                            <Controller
                              name="deliveryFrom"
                              control={control}
                              defaultValue={0}
                              rules={{
                                required: "Delivery time from is required",
                              }}
                              render={({ field }) => (
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                  <TimePicker
                                    name="deliveryFrom"
                                    {...register("deliveryFrom", {
                                      required: "Time is required",
                                    })}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        placeholder="08 : 00 AM"
                                        id={`timeframe-textfield-from`}
                                      />
                                    )}
                                    value={deliveryTimeRange.from}
                                    onChange={(newValue) => {
                                      setDeliveryTimeRange((prev) => ({ ...prev, from: newValue }))
                                      clearErrors("deliveryFrom")
                                    }

                                    }
                                  />
                                </LocalizationProvider>
                              )}
                            />
                          </FormControl>
                        </div>
                        {errors.deliveryFrom && (
                          <Typography variant="caption" color="error">
                            {errors.deliveryFrom.message}
                          </Typography>
                        )}
                      </div>

                      {/* To Section */}
                      <div className="w-full flex flex-col gap-[5px]">
                        <Typography variant="label">To</Typography>
                        <div className="flex items-center">
                          <FormControl
                            className="w-full"
                            error={Boolean(errors.deliveryTo)}
                          >
                            <Controller
                              name="deliveryTo"
                              control={control}
                              defaultValue={0}
                              rules={{
                                required: "Delivery time to is required",
                              }}
                              render={({ field }) => (
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                  <TimePicker
                                    name="deliveryTo"
                                    {...register("deliveryTo", {
                                      required: "Time is required",
                                    })}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        placeholder="08 : 00 AM"
                                        id={`timeframe-textfield-from`}
                                      />
                                    )}
                                    value={deliveryTimeRange.to}
                                    onChange={(newValue) => {
                                      setDeliveryTimeRange((prev) => ({ ...prev, to: newValue }))
                                      clearErrors("deliveryTo")
                                    }

                                    }
                                  />
                                </LocalizationProvider>
                              )}
                            />
                            {errors.deliveryTo && (
                              <Typography variant="caption" color="error">
                                {errors.deliveryTo.message}
                              </Typography>
                            )}
                          </FormControl>
                        </div>
                      </div>
                    </div>
                  </div>
                </FormControl>
              )}
              <FormControl className="w-full">
                <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
                  What is your jurisdiction's tax rate?
                </label>
                <Controller
                  name="taxRate"
                  control={control}
                  rules={{
                    required: "Tax rate is required",
                    validate: (value) =>
                      (!isNaN(value) && parseFloat(value) >= 0 && parseFloat(value) < 51) ||
                      "Must be a valid number",
                  }}
                  render={({
                             field: { onChange, value },
                             fieldState: { error },
                           }) => (
                    <TextField
                      placeholder="Enter tax rate"
                      className="mt-2 w-full sm:mt-0 sm:w-[50%]"
                      type="text"
                      value={value}
                      onChange={(event) => {
                        onChange(event.target.value);
                        handleTaxRateChange(event);
                      }}
                      error={Boolean(error)}
                      helperText={error ? error.message : ""}
                      inputProps={{ min: 0, max: 50, step: 0.01 }}
                    />
                  )}
                />
              </FormControl>
              {(taxRateTexts.success || taxRateTexts.error) && (
                <Typography
                  variant="subtitle3"
                  className={taxRateTexts.success ? "text-success text-[14px]" : "text-red-500 text-[14px]"}
                >
                  {taxRateTexts.success || taxRateTexts.error}
                </Typography>
              )}
              <FormControl className="w-full flex flex-col gap-[3px] mt-1">
                <div className="flex gap-[5px] items-center">
                  <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
                    Keep this location’s address private and unlisted
                  </label>
                  <LightTooltip title="If you would like to hide this location’s address from customers, then enable this option. Some vendors may want certain location’s address information private if they have deliveries originating from a private location or warehouse.">
                    <InfoOutlinedIcon
                      sx={{ fontSize: "16px", marginBottom: "3px" }}
                    />
                  </LightTooltip>
                </div>
                <Controller
                  name="locationPrivate"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <FormControlLabel
                      className="max-w-fit"
                      label=""
                      control={
                        <IOSSwitch
                          checked={value}
                          onChange={(e) => onChange(e.target.checked)}
                          sx={{ m: 1 }}
                        />
                      }
                    />
                  )}
                />
              </FormControl>
            </form>
          </FormProvider>
        </DialogContentText>
      </DialogContent>
      <DialogActions className="!px-[22px] !pb-[32px] sm:!pb-[64px] sm:!px-[80px] !gap-[14px]">
        <DefaultButton value={TextConstants.Cancel} className="w-full bg-[#F5F5F5] text-heading hover:bg-[#fef0f0]"
                       onClick={closeModal}/>
        <DefaultButton loading={loading} className='w-full'
                       value={!loading ? (isEditMode ? 'Update' : "Add Location") : ""}
                       onClick={handleSubmit(onSubmit)}/>
      </DialogActions>
    </Dialog>
  )
};

export default EditLocationModal;