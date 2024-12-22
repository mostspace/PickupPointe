import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm, FormProvider, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// @mui
import {
  Select, FormControl, Button, Popover, Box, Autocomplete, Checkbox, MenuItem, Typography, IconButton, RadioGroup, Radio, Tabs, Tab, useMediaQuery, useTheme, 
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Chip, Divider, FormControlLabel, FormHelperText,
} from "@mui/material";

// Icons
import EditLocationOutlinedIcon from "@mui/icons-material/EditLocationOutlined";
import AddLocationAltOutlinedIcon from "@mui/icons-material/AddLocationAltOutlined";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AddIcon from "@mui/icons-material/Add";

// Assets
import { Magnifer, icTrash } from "src/assets";

// Components
import Pagination from "src/components/pagination/";
import TabPanel from "src/components/tab";
import IOSSwitch from "src/components/ios-switch";
import LightTooltip from "src/components/LightTooltip";
import CheckboxList from "src/components/checkbox-list";
import PhoneNumberMaskInput from "src/components/phonenumber-mask-input";
import PhoneNumberInput from "src/components/phonenumber";
import Iconify from "src/components/iconify/iconify";
import ButtonLoader from "src/components/button-loader/ButtonLoader";
import DefaultButton from "src/components/button/default-button";

// Hook form
import { RHFAutocomplete, RHFTextField } from "src/components/hook-form";
import useSmartyAutocomplete from "src/hooks/use-smarty-autocomplete";
import { _days } from "src/_mock/assets";
import { TextConstants } from "src/constants/textConstants";
import axiosInstance from "src/utils/axios";
import { BASE_URL } from "src/config-global";
import TaxRate from "src/components/tax-rate";

const EditLocationForm = ({formData, selectLocation}) => {
  // Selected Location ID
  const [selectedLocation, setSelectedLocation] = useState(selectLocation);
  
  
  // Locations
  const [locations, setLocations] = useState([]);

  // RHF Hook Form
  const NewFormDataSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    images: Yup.array().min(1, "Images is required"),
    tags: Yup.array().min(1, "Must have at least 1 attributes"),
    category: Yup.string().required("Category is required"),
    description: Yup.string().required("Description is required"),
    phoneNumber: Yup.string().required("Phone number is required"),
    address: Yup.string().required("Address is required"),
    deliveryFrom: Yup.number().required("Address is required").min(1, "Delivery time from must be greater than 0"),
    deliveryTo: Yup.number().required("Address is required").moreThan(0, "Delivery time from must be greater than 0"),
  });

  const defaultValues = useMemo(
    () => ({
      name: formData?.name || "",
      description: formData?.description || "",
      subDescription: formData?.subDescription || "",
      phoneNumber: formData?.phoneNumber || "",
      images: formData?.images || [],
      //
      code: formData?.code || "",
      price: formData?.price || 0,
      quantity: formData?.quantity || 0,
      priceSale: formData?.priceSale || 0,
      tags: formData?.tags || [],
      address: formData?.address || "",
      deliveryFrom: 0,
      deliveryTo: 0
    }),
    [formData]
  );

  // Fetch Locations
  const getLocations = async () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `${BASE_URL}/api/v1/location?pageSize=5&page=1`,
        config
      );
      setLocations(response.data.locations);
      setTotalNumberOfLocations(response.data.totalResults);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };


  const methods = useForm({
    resolver: yupResolver(NewFormDataSchema),
    defaultValues,
  });

  // Add Location Methods
  const [extFormData, setExtFormData] = useState({});

  const addLocationMethods = useForm({defaultValues:{ locationPrivate: false}})
  
  const {
    register:addLocationRegister,
    formState:{errors:addLocationErrors},
    setError: setAddLocationError,
    clearErrors: clearAddLocationError,
    control,
    reset:resetAddLocationForm
  } = addLocationMethods;

  // Edit Location Methods
  const editLocationMethods = useForm({
    defaultValues:{
      locationPrivate: false,
      address:'',
      pickupDays:[],
      deliveryDays:[]
    }
  })

  // Edit Location States
  const [locationDoorToDoorDeliveryMethod, setlocationDoorToDoorDeliveryMethod] = useState(null)
  const [locationPostMailDeliveryMethod, setLocationPostMailDeliveryMethod] = useState(null) 

  const { 
    register:editLocationRegister,
    formState:{errors:editLocationErrors},
    setError:setEditLocationError,
    clearErrors:clearEditLocationError,
    control:editLocationControl,
    reset:resetEditLocationForm,
    setValue:setEditValue,
    watch:editWatch
  } = editLocationMethods;

  const {
    register,
    reset,
    watch,
    setValue: setFormValue,
    handleSubmit,
    formState: { isSubmitting, errors },
    clearErrors,
    setError,
  } = methods;

  const {
    suggestions,
    error,
    handleInputChange: handleStreetInputChange,
  } = useSmartyAutocomplete();

  useEffect(() => {
    getLocations();
  }, []);

  useEffect(() => {
    if (formData) {
      reset(defaultValues);
    }
  }, [formData, defaultValues, reset]);


  // Function To Retrieve Address from Single String
  const parseAddress = (addressString) => {
    // Split the address string into parts
    const addressParts = addressString.split(', ');
    
    if (addressParts.length < 3) {
      return null;
    }
  
    const street = addressParts[0];
    const city = addressParts[1];
    const stateAndZip = addressParts[2].split(' ');
    const state = stateAndZip[0];
    const zipCode = stateAndZip[1];
  
    return {
      countryCode: 'US', // Assuming US, you can modify as needed
      state,
      city,
      street,
      zipCode,
    };
  };

  const [maxRadiusDefault, setMaxRadiusDefault] = useState(0)

  // Address Formatting
  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.countryCode}`;
  };

  // Find the selected location when selectedLocationId changes
  useEffect(() => {
    if (selectedLocation) {
      const location = locations.find((loc) => loc._id === selectedLocation);
      if (location) {
        const formattedAddress = formatAddress(location.address);
        if(location?.delivery?.doorToDoor?.maxDistance) {
          setMaxRadiusDefault(location.delivery.doorToDoor.maxDistance)
        }
        resetEditLocationForm({
          name: location.name,
          address: formattedAddress,
          contactPhoneNumber: location.contact.phoneNumber,
          contactFirstName:location.contact.firstName,
          contactLastName:location.contact.lastName,
          pickupDays:location.pickup.days,
          deliveryDays:location.delivery.days,
          deliveryFrom:location.delivery.from,
          deliveryTo:location.delivery.to,
          pickupFrom:location.pickup.from,
          pickupTo:location.pickup.to,
        });
        setEditValue(formattedAddress)
        setEditValue("pickupDays",location.pickup.days)
        setEditValue("deliveryDays",location.delivery.days)
        setExtFormData({
          ...extFormData,
          phoneNumber: location.contact.phoneNumber
        })
        if(location?.delivery?.doorToDoor?.use) {
          setlocationDoorToDoorDeliveryMethod(location.delivery.doorToDoor.use)
        }
        if(location?.delivery?.postMail){
          setLocationPostMailDeliveryMethod(location.delivery.postMail)
        }
        setEditValue("locationPrivate",location.isPrivate)
      }
    }
  }, [selectedLocation, editLocationMethods]);
    

  const handleEditPickupLocationClose = async (data) => {
    setOpenEditPickupLocation(false)
  };

  const onSubmit = async(data) => {
    const isValid = await editLocationMethods.trigger();
    const parsedAddress = parseAddress(data.address);
      
    if (!parsedAddress) {
      setError("Invalid address format.");
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
          isUse:false,
          days: data.pickupDays,
          from: data.pickupFrom,
          to: data.pickupTo,
        },
        delivery: {
          isuse:true,
          doorToDoor: {
            use: locationDoorToDoorDeliveryMethod,
            maxDistance: parseInt(data.maxDistance, 10),
          },
          postMail: locationPostMailDeliveryMethod,
          days: data.deliveryDays,
          from: data.deliveryFrom,
          to: data.deliveryTo,
        },
        isPrivate: data.locationPrivate,
      };
      try {
        setLoading(true)
        const response = await axiosInstance.put(
          BASE_URL + `/api/v1/location/${selectedLocation}`, locationInfo
        ); // Removed nesting
      
        if (response) {
          toast("Location updated successfully", {type: "success", className: 'toast-custom'});
          resetEditLocationForm()
          handleEditPickupLocationClose()
          modalDispatch({
            type: 'CLOSE_MODAL',
          });
          setSelectedLocation(null)
          getLocations()
        }
      } catch (err) {
        // Extract relevant error information
        const errorMessage =
          err.response?.data?.message || err.message || "An error occurred";
    
          // Set the extracted error message
          setError(errorMessage);
    
          // Optionally display a toast or alert with the error
          toast(errorMessage, {
            style: {
              backgroundColor: "red",
              color: "white",
              fontFamily: "Gilroy",
              fontSize: '14px',
            },
          });
      } finally {
        setLoading(false)
      }
    }
  };

  // Delivery Details
  const [localDeliveryAvailable, setLocalDeliveryAvailable] =
    useState("deliver");
  const [showDeliverySection, setShowDeliverySection] = useState(true);
  const [showPickupSection, setShowPickupSection] = useState(false);

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

  // Radio Different Location True
  // const [differentLocationValue, setDifferentLocationValue] = useState('yes');

  // const handleDifferentLocationRadioTabChange = (event) => {
  //   setDifferentLocationValue(event.target.value);
  // };

  // Handle Delivery Option
  const [showDeliveryOption, setShowDeliveryOption] = useState({
    post: false,
    courier: true,
  });

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

    return (
        <FormProvider {...editLocationMethods}>
                  <form onSubmit={editLocationMethods.handleSubmit(onSubmit)} className="flex flex-col gap-[14px] font-gilroy sm:px-[60px] py-[16px]">
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
                        {...editLocationRegister("name", {
                          required: "Location name is required",
                        })}
                        error={!!editLocationErrors.name}
                      />
                        {editLocationErrors.name && (
                        <FormHelperText error>{editLocationErrors.name.message}</FormHelperText>
                        )}
                    </FormControl>

                    <div className="flex flex-col gap-[14px]">
                      <div className="flex flex-col">
                        <div className="flex flex-col sm:flex-row justify-between gap-[14px] items-center">
                          <FormControl variant="standard" className="w-full">
                            <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
                              {TextConstants.Address}
                            </label>
                            <Autocomplete
                              clearIcon={false}
                              freeSolo
                              value={editWatch("address")}
                              options={suggestions}
                              onInputChange={handleStreetChange}
                              onChange={handleStreetSelect}
                              renderInput={(params) => (
                                <div>
                                  <TextField
                                    {...params}
                                    name="address"
                                    size="small"
                                    variant="outlined"
                                    required
                                    placeholder="Location address"
                                    {...editLocationRegister("address", {
                                      required: "Address is required",
                                    })}
                                    error={!!editLocationErrors.address}
                                  />
                                  {(editLocationErrors.address || error) && (
                                                <FormHelperText error>
                                                  {error ? error : editLocationErrors.address.message}
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
                        </div>
                      </div>
                    </div>

                    <FormControl variant="standard" className="">
                      <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
                        Location phone number
                      </label>
                      <PhoneNumberInput
                          name="phonenumber"
                          placeholder="Enter phone number"
                          fullWidth
                          register={register}
                          {...addLocationRegister("contactPhoneNumber", {
                            required: "Phone Number is required"
                          })}
                          value={extFormData.phoneNumber}
                          onChange={(e) => setExtFormData({
                            ...extFormData,
                            phoneNumber: e.target.value
                          })}
                          error={!!editLocationMethods.contactPhoneNumber}
                      />
                      {editLocationErrors.contactPhoneNumber && (
                        <FormHelperText error>{editLocationErrors.contactPhoneNumber.message}</FormHelperText>
                      )}
                    </FormControl>

                    <div className="flex justify-between items-start w-full gap-[14px] items-end">
                      <FormControl variant="standard" className="w-full">
                        <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
                          Location contact
                        </label>
                        <TextField
                          size="small"
                          variant="outlined"
                          fullWidth
                          placeholder="Enter first name"
                          {...editLocationRegister("contactFirstName", {
                            required: "First Name is required",
                          })}
                          error={!!editLocationErrors.contactFirstName}
                        />
                        {editLocationErrors.contactFirstName && (
                        <FormHelperText error>{editLocationErrors.contactFirstName.message}</FormHelperText>
                        )}
                      </FormControl>
                      <FormControl
                        variant="standard"
                        className="w-full !mt-[14px] sm:!mt-0"
                      >
                        <TextField
                          size="small"
                          variant="outlined"
                          fullWidth
                          placeholder="Enter last name"
                          {...editLocationRegister("contactLastName", {
                            required: "Last Name is required",
                          })}
                          error={!!editLocationErrors.contactLastName}
                        />
                        {editLocationErrors.contactLastName && (
                        <FormHelperText error>{editLocationErrors.contactLastName.message}</FormHelperText>
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
                                <Radio
                                  sx={{ "&.Mui-checked": { color: "#F14445" } }}
                                  size="small"
                                />
                              }
                              label={<span className="text-[14px]">Pickup only</span>}
                            />
                            <FormControlLabel
                              value="deliver"
                              control={
                                <Radio
                                  sx={{ "&.Mui-checked": { color: "#F14445" } }}
                                  size="small"
                                />
                              }
                              label={<span className="text-[14px]">Delivery only</span>}
                            />
                            <FormControlLabel
                              value="pickup_and_deliver"
                              control={
                                <Radio
                                  sx={{
                                    "&.Mui-checked": {
                                      color: "#F14445",
                                      fontSize: "12px",
                                    },
                                  }}
                                  size="small"
                                />
                              }
                              label={
                                <span className="text-[14px]">
                                  Pickup and delivery available
                                </span>
                              }
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
                                    control={editLocationControl}
                                    defaultValue={true} // Ensure it has a default value
                                    render={({ field: { onChange, value } }) => (
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
                                    control={editLocationControl}
                                    defaultValue={false} // Ensure it has a default value
                                    render={({ field: { onChange, value } }) => (
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
                                      Set your maximum courier delivery distance radius in
                                      miles
                                    </label>
                                    <Controller
                                      name="maxDistance"
                                      control={editLocationControl}
                                      defaultValue={maxRadiusDefault} // Set a default value
                                      rules={{
                                        required: "Max Distance is required",
                                        validate: (value) =>
                                          (!isNaN(value) && parseFloat(value) > 0) ||
                                          "Must be a valid number",
                                      }}
                                      render={({
                                        field: { onChange, value },
                                        fieldState: { error },
                                      }) => (
                                        <TextField
                                          placeholder="Enter miles amount"
                                          className="mt-2 w-full sm:mt-0 sm:w-[50%]"
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

                    {showPickupSection && (
                      <FormControl variant="standard" className="flex flex-col gap-[14px]">
                        <div className="flex flex-col">
                          <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
                            Default pickup days for this location
                          </label>
                          <Controller
                            name="pickupDays"
                            control={editLocationControl}
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
                                {error && (
                                  <Typography variant="caption" color="error">
                                    {error.message}
                                  </Typography>
                                )}
                              </>
                            )}
                          />
                        </div>

                        <div className="flex flex-col">
                          <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
                            Default pickup time-frame for this location
                          </label>
                          <div className="w-full flex flex-col sm:flex-row justify-between gap-[14px]">
                            {/* From Section */}
                            <div className="w-full flex flex-col gap-[5px]">
                              <Typography variant="label">From</Typography>
                              <div className="flex items-center">
                              <FormControl
              className="w-[60%]"
              error={Boolean(errors.pickupFrom)}
            >
              <Controller
                name="pickupFrom"
                control={editLocationControl}
                defaultValue={0} // Set the default value here
                rules={{ required: "Pickup start time is required" }} // Add validation rules
                render={({ field }) => (
                  <Select
                    labelId="demo-simple-select-label"
                    size="small"
                    {...field}
                    className="!rounded-r-[0px]"
                  >
                    {Array.from({ length: 13 }, (_, i) => (
                      <MenuItem
                        key={i}
                        value={i}
                        className="!text-[12px] sm:!text-[14px] !font-gilroy"
                      >
                        {i}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.pickupFrom && (
                <Typography variant="caption" color="error">
                  {errors.pickupFrom.message}
                </Typography>
              )}
            </FormControl>

                                <FormControl
                                  className="w-[40%]"
                                  error={Boolean(errors.pickupFromPeriod)}
                                >
                                  <Select
                                    labelId="demo-simple-select-label"
                                    size="small"
                                    defaultValue={1}
                                    {...editLocationRegister("pickupFromPeriod", {
                                      required: "Pickup period (AM/PM) is required",
                                    })} // Add validation
                                    className="!rounded-l-[0px] -ml-[1px]"
                                  >
                                    <MenuItem
                                      value={1}
                                      className="!text-[12px] sm:!text-[14px] !font-gilroy"
                                    >
                                      AM
                                    </MenuItem>
                                    <MenuItem
                                      value={2}
                                      className="!text-[12px] sm:!text-[14px] !font-gilroy"
                                    >
                                      PM
                                    </MenuItem>
                                  </Select>
                                  {errors.pickupFromPeriod && (
                                    <Typography variant="caption" color="error">
                                      {errors.pickupFromPeriod.message}
                                    </Typography>
                                  )}
                                </FormControl>
                              </div>
                            </div>

                            {/* To Section */}
                            <div className="w-full flex flex-col gap-[5px]">
                              <Typography variant="label">To</Typography>
                              <div className="flex items-center">
                                <FormControl className="w-[60%]" error={Boolean(errors.pickupTo)}>
                                  <Controller
                                    name="pickupTo"
                                    control={editLocationControl}
                                    defaultValue={0} // Set the default value here
                                    rules={{ required: "Pickup end time is required" }} // Add validation rules
                                    render={({ field }) => (
                                      <Select
                                        labelId="demo-simple-select-label"
                                        size="small"
                                        {...field} // Apply Controller field props
                                        className="!rounded-r-[0px]"
                                      >
                                        {Array.from({ length: 13 }, (_, i) => (
                                          <MenuItem
                                            key={i}
                                            value={i}
                                            className="!text-[12px] sm:!text-[14px] !font-gilroy"
                                          >
                                            {i}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    )}
                                  />
                                  {errors.pickupTo && (
                                    <Typography variant="caption" color="error">
                                      {errors.pickupTo.message}
                                    </Typography>
                                  )}
                                </FormControl>

                                <FormControl className="w-[40%]" error={Boolean(errors.pickupToPeriod)}>
                                  <Select
                                    labelId="demo-simple-select-label"
                                    size="small"
                                    defaultValue={1}
                                    {...editLocationRegister("pickupToPeriod", {
                                      required: "Pickup period (AM/PM) is required",
                                    })} // Add validation
                                    className="!rounded-l-[0px] -ml-[1px]"
                                  >
                                    <MenuItem value={1} className="!text-[12px] sm:!text-[14px] !font-gilroy">AM</MenuItem>
                                    <MenuItem value={2} className="!text-[12px] sm:!text-[14px] !font-gilroy">PM</MenuItem>
                                  </Select>
                                  {errors.pickupToPeriod && (
                                    <Typography variant="caption" color="error">
                                      {errors.pickupToPeriod.message}
                                    </Typography>
                                  )}
                                </FormControl>
                              </div>
                            </div>
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
                            control={editLocationControl}
                            defaultValue={[]} // Set default value to an empty array for multiple selections
                            rules={{ required: "Delivery days are required" }} // Add required validation
                            render={({
                              field: { onChange, value },
                              fieldState: { error },
                            }) => (
                              <>
                                <RHFAutocomplete
                                  name="deliveryDays"
                                  placeholder="+ Days"
                                  multiple
                                  freeSolo
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
                            Default delivery time-frame for this location
                          </label>
                          <div className="w-full flex flex-col sm:flex-row justify-between gap-[14px]">
                            {/* From Section */}
                            <div className="w-full flex flex-col gap-[5px]">
                              <Typography variant="label">From</Typography>
                              <div className="flex items-center">
                                <FormControl
                                  className="w-[60%]"
                                  error={Boolean(editLocationErrors.deliveryFrom)}
                                >
                                  <Controller
                                    name="deliveryFrom"
                                    control={editLocationControl}
                                    defaultValue={0}
                                    rules={{ required: "Delivery time from is required", 
                                              validate: (value) => value > 0 || "Delivery time is required",
                                    }} // Add required validation
                                    render={({ field }) => (
                                      <Select
                                        labelId="demo-simple-select-label"
                                        size="small"
                                        {...field}
                                        className="!rounded-r-[0px]"
                                      >
                                        {Array.from({ length: 13 }, (_, i) => (
                                          <MenuItem
                                            key={i}
                                            value={i}
                                            className="!text-[12px] sm:!text-[14px] !font-gilroy"
                                          >
                                            {i}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    )}
                                  />
                                </FormControl>
                                <FormControl
                                  className="w-[40%]"
                                  error={Boolean(editLocationErrors.deliveryFromPeriod)}
                                >
                                  <Controller
                                    name="deliveryFromPeriod"
                                    control={editLocationControl}
                                    defaultValue={1}
                                    rules={{ required: "Period is required" }} // Add required validation
                                    render={({ field }) => (
                                      <Select
                                        labelId="demo-simple-select-label"
                                        size="small"
                                        {...field}
                                        className="!rounded-l-[0px] -ml-[1px]"
                                      >
                                        <MenuItem
                                          value={1}
                                          className="!text-[12px] sm:!text-[14px] !font-gilroy"
                                        >
                                          AM
                                        </MenuItem>
                                        <MenuItem
                                          value={2}
                                          className="!text-[12px] sm:!text-[14px] !font-gilroy"
                                        >
                                          PM
                                        </MenuItem>
                                      </Select>
                                    )}
                                  />
                                  {editLocationErrors.deliveryFromPeriod && (
                                    <Typography variant="caption" color="error">
                                      {editLocationErrors.deliveryFromPeriod.message}
                                    </Typography>
                                  )}
                                </FormControl>
                              </div>
                              {editLocationErrors.deliveryFrom && (
                                <Typography variant="caption" color="error">
                                  {editLocationErrors.deliveryFrom.message}
                                </Typography>
                              )}
                            </div>

                            {/* To Section */}
                            <div className="w-full flex flex-col gap-[5px]">
                              <Typography variant="label">To</Typography>
                              <div className="flex items-center">
                                <FormControl
                                  className="w-[60%]"
                                  error={Boolean(errors.deliveryTo)}
                                >
                                  <Controller
                                    name="deliveryTo"
                                    control={editLocationControl}
                                    defaultValue={0}
                                    rules={{ required: "Delivery time to is required",
                                            validate: (value) => value > 0 || "Delivery time is required",
                                    }} // Add required validation
                                    render={({ field }) => (
                                      <Select
                                        labelId="demo-simple-select-label"
                                        size="small"
                                        {...field}
                                        className="!rounded-r-[0px]"
                                      >
                                        {Array.from({ length: 13 }, (_, i) => (
                                          <MenuItem
                                            key={i}
                                            value={i}
                                            className="!text-[12px] sm:!text-[14px] !font-gilroy"
                                          >
                                            {i}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    )}
                                  />
                                  {errors.deliveryTo && (
                                    <Typography variant="caption" color="error">
                                      {errors.deliveryTo.message}
                                    </Typography>
                                  )}
                                </FormControl>
                                <FormControl
                                  className="w-[40%]"
                                  error={Boolean(errors.deliveryToPeriod)}
                                >
                                  <Controller
                                    name="deliveryToPeriod"
                                    control={editLocationControl}
                                    defaultValue={1}
                                    rules={{ required: "Period is required" }} // Add required validation
                                    render={({ field }) => (
                                      <Select
                                        labelId="demo-simple-select-label"
                                        size="small"
                                        {...field}
                                        className="!rounded-l-[0px] -ml-[1px]"
                                      >
                                        <MenuItem
                                          value={1}
                                          className="!text-[12px] sm:!text-[14px] !font-gilroy"
                                        >
                                          AM
                                        </MenuItem>
                                        <MenuItem
                                          value={2}
                                          className="!text-[12px] sm:!text-[14px] !font-gilroy"
                                        >
                                          PM
                                        </MenuItem>
                                      </Select>
                                    )}
                                  />
                                  {errors.deliveryToPeriod && (
                                    <Typography variant="caption" color="error">
                                      {errors.deliveryToPeriod.message}
                                    </Typography>
                                  )}
                                </FormControl>
                                {editLocationErrors.deliveryFromPeriod && (
                                  <Typography variant="caption" color="error">
                                    {editLocationErrors.deliveryFromPeriod.message}
                                  </Typography>
                                )}
                              </div>
                              {editLocationErrors.deliveryTo && (
                                <Typography variant="caption" color="error">
                                  {editLocationErrors.deliveryTo.message}
                                </Typography>
                              )}
                            </div>
                          </div>
                        </div>
                      </FormControl>
                    )}

                    <TaxRate />

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
                        name="locationPrivate" // Ensure this is the correct field name
                        control={editLocationControl}
                        render={({ field: { onChange, value } }) => (
                          <FormControlLabel
                            className="max-w-fit"
                            label=""
                            control={
                              <IOSSwitch
                                checked={value}
                                onChange={(e) => onChange(e.target.checked)} // Update the value on change
                                sx={{ m: 1 }}
                              />
                            }
                          />
                        )}
                      />
                    </FormControl>
                  </form>
        </FormProvider>
    )
}

export default EditLocationForm;