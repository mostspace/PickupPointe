/**
 * This is copy of original main.js
 * Just backup file.
 * */

import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm, FormProvider, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import {
  FormControl, Button, Popover, Box, Autocomplete, Checkbox, MenuItem, Typography, IconButton, RadioGroup, Radio, Tabs, Tab, useMediaQuery, useTheme,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Chip, Divider, FormControlLabel, FormHelperText,
  Select,
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
import PhoneNumberInput from "src/components/phonenumber";
import ButtonLoader from "src/components/button-loader/ButtonLoader";
import DefaultButton from "src/components/button/default-button";
import LoadingProgress from "src/components/loading-screen/loading-progress";
// Hook form
import { RHFAutocomplete, RHFTextField } from "src/components/hook-form";
import useSmartyAutocomplete from "src/hooks/use-smarty-autocomplete";
import { _days } from "src/_mock/assets";
import { TextConstants } from "src/constants/textConstants";
import axiosInstance from "src/utils/axios";
import { BASE_URL } from "src/config-global";
import TaxRate from "src/components/tax-rate";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

// ==================================================================================================================================

function tabProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

// Example usage
const checkboxDataFromBackend = [
  {
    id: 1,
    label: "Pickup Pointe Store #32322",
    subLabel: "7384 Hayward Way, Laguna CA, 93453",
  },
  {
    id: 2,
    label: "Pickup Pointe Store #32323",
    subLabel: "1234 Elm Street, Springfield, IL, 62701",
  },
  // Add more data as needed
];

// ==================================================================================================================================

const LocationDetails = ({ formData }) => {
  const navigate = useNavigate();

  // Pagination
  const [page, setPage] = React.useState(1);
  const itemsPerPage = 10;

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Selected Location ID
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Habdle Tab Change
  const [value, setValue] = React.useState(0);

  // Locations
  const [locations, setLocations] = useState([]);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryTimeRange, setDeliveryTimeRange] = useState({ from: null, to: null });
  const [pickupTimeRange, setPickupTimeRange] = useState({ from: null, to: null });

  // Total number of Locations
  const [totalNumberOfLocations, setTotalNumberOfLocations] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [taxRate, setTaxRate] = useState(null);
  const [taxRateTexts, setTaxRateTexts] = useState({
    success: "",
    error: "",
    saved: true,
  });

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
      clearEditLocationError("taxRate")
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
    pickupFrom: Yup.number().required("Address is required").min(1, "pickup time from must be greater than 0"),
    pickupTo: Yup.number().required("Address is required").moreThan(0, "pickup time from must be greater than 0"),
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
      pickupFrom: 0,
      pickupTo: 0,
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
        `${BASE_URL}/api/v1/location?pageSize=${itemsPerPage}&page=${page}`,
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

  useEffect(() => {
    getLocations();
  }, []);

  const methods = useForm({
    resolver: yupResolver(NewFormDataSchema),
    defaultValues,
  });

  // Add Location Methods
  const [extFormData, setExtFormData] = useState({});

  const addLocationMethods = useForm({

    defaultValues: { locationPrivate: false }
  })

  const {
    register: addLocationRegister,
    formState: { errors: addLocationErrors },
    setError: setAddLocationError,
    clearErrors: clearAddLocationError,
    control,
    reset: resetAddLocationForm
  } = addLocationMethods;

  // Edit Location Methods
  const editLocationMethods = useForm({
    defaultValues: {
      locationPrivate: false,
      address: '',
      pickupDays: [],
      deliveryDays: []
    }
  })

  // Edit Location States
  const [locationDoorToDoorDeliveryMethod, setlocationDoorToDoorDeliveryMethod] = useState(null)
  const [locationPostMailDeliveryMethod, setLocationPostMailDeliveryMethod] = useState(null)

  const {
    register: editLocationRegister,
    formState: { errors: editLocationErrors },
    setError: setEditLocationError,
    clearErrors: clearEditLocationError,
    control: editLocationControl,
    reset: resetEditLocationForm,
    setValue: setEditValue,
    watch: editWatch
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
    if (formData) {
      reset(defaultValues);
    }
  }, [formData, defaultValues, reset]);

  // ------------------------  Modal ------------------------------------

  // Pro Add New Pickup Pointe Location Modal
  const [openAddNewPickupPointeLocation, setOpenAddNewPickupPointeLocation] =
    React.useState(false);

  const handleAddNewPickupPointeLocationOpen = () => {
    setOpenAddNewPickupPointeLocation(true);
  };

  const handleAddNewPickupPointeLocationClose = () => {
    setOpenAddNewPickupPointeLocation(false);
    clearValues()
  };

  // Add New Location Modal
  const [openAddNewPickupLocation, setOpenAddNewPickupLocation] =
    React.useState(false);

  const handleAddNewPickupLocationOpen = () => {
    setOpenAddNewPickupLocation(true);
  };

  // Delete Location Modal
  const [openDeleteLocationModal, setOpenDeleteLocationModal] = useState(false);

  const openConfirmDeleteLocationModal = () => {
    handleLocaionsMenuClose();
    setOpenDeleteLocationModal(true); // Open the confirmation dialog
  };

  const closeConfirmDeleteLocationModal = () => {
    setOpenDeleteLocationModal(false); // Close the dialog if user cancels
  };

  // Loading State
  const [loading, setLoading] = useState(false)

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


  const handleAddNewPickupLocationClose = async (data) => {
    validationTime("add");
    // const values = methods.getValues();
    const isValid = await addLocationMethods.trigger();
    const parsedAddress = parseAddress(data.address);

    if (!parsedAddress) {
      setError("Invalid address format.");
      setRegisterLoading(false);
      return;
    }

    if (isValid) {
      const locationInfo = {
        name: data.locationName,
        address: parsedAddress,
        contact: {
          phoneNumber: extFormData.phoneNumber,
          firstName: data.contactFirstName,
          lastName: data.contactLastName,
        },
        pickup: {
          days: data.pickupDays,
          // from: data.pickupFrom,
          // to: data.pickupTo,
          from: dayjs(pickupTimeRange.from),
          to: dayjs(pickupTimeRange.to),
          isUse: showPickupSection
        },
        delivery: {
          doorToDoor: {
            use: data.deliveryOptionsCourier,
            maxDistance: parseInt(data.maxDistance, 10),
          },
          postMail: data.deliveryOptionsPost,
          days: data.deliveryDays,
          // from: data.deliveryFrom,
          // to: data.deliveryTo,
          from: dayjs(deliveryTimeRange.from),
          to: dayjs(deliveryTimeRange.to),
          isUse: showDeliverySection
        },
        isPrivate: data.locationPrivate,
        taxRate: data.taxRate
      };

      try {
        setLoading(true)
        // Send POST request to verify the confirmation code
        const response = await axiosInstance.post(
          BASE_URL + "/api/v1/location",
          locationInfo
        ); // Removed nesting

        if (response) {
          toast("Location Added successfully", { type: "success", className: 'toast-custom' });
          resetAddLocationForm()
          setOpenAddNewPickupLocation(false);
          getLocations()
        }
      } catch (err) {
        // Extract relevant error information
        const errorMessage =
          err.response?.data?.message || err.message || "An error occurred";

        // Set the extracted error message
        setError(errorMessage);
        toast(errorMessage, { type: "error", className: 'toast-custom' });
      } finally {
        setLoading(false)
        clearValues();
      }
    }
  };

  // Edit Location Modal
  const [openEditPickupLocation, setOpenEditPickupLocation] =
    React.useState(false);

  const handleEditPickupLocationOpen = () => {
    setOpenEditPickupLocation(true);
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
      console.log("location", location, location?.delivery?.from, dayjs(location?.delivery?.from), dayjs(location?.delivery?.from).isValid())
      if (location) {
        const formattedAddress = formatAddress(location.address);
        if (location?.delivery?.doorToDoor?.maxDistance) {
          setMaxRadiusDefault(location.delivery.doorToDoor.maxDistance)
        }
        resetEditLocationForm({
          name: location.name,
          address: formattedAddress,
          contactPhoneNumber: location.contact.phoneNumber,
          contactFirstName: location.contact.firstName,
          contactLastName: location.contact.lastName,
          pickupDays: location.pickup.days,
          deliveryDays: location.delivery.days,
          deliveryFrom: dayjs(location.delivery.from),
          deliveryTo: dayjs(location.delivery.to),
          pickupFrom: dayjs(location.pickup.from),
          pickupTo: dayjs(location.pickup.to),
          taxRate: location.taxRate
        });
        setTaxRate(location.taxRate);
        setEditValue(formattedAddress)
        setEditValue("pickupDays", location.pickup.days)
        setEditValue("deliveryDays", location.delivery.days)
        setExtFormData({
          ...extFormData,
          phoneNumber: location.contact.phoneNumber
        })
        if (location?.delivery?.doorToDoor?.use) {
          setlocationDoorToDoorDeliveryMethod(location.delivery.doorToDoor.use)
        }
        if (location?.delivery?.postMail) {
          setLocationPostMailDeliveryMethod(location.delivery.postMail)
        }
        setEditValue("locationPrivate", location.isPrivate)
        setDeliveryTimeRange({
          from: location?.delivery?.from ? dayjs(location?.delivery?.from) : null,
          to: location?.delivery?.to ? dayjs(location?.delivery?.to) : null
        });
        setPickupTimeRange({
          from: location?.pickup?.from ? dayjs(location?.pickup?.from) : null,
          to: location?.pickup?.to ? dayjs(location?.pickup?.to) : null,
        })
      }
    }
  }, [selectedLocation, editLocationMethods]);


  const handleEditPickupLocationClose = async (data) => {
    setOpenEditPickupLocation(false)
  };

  const validationTime = (type) => {
    console.log("validationTime", type, deliveryTimeRange.from, deliveryTimeRange.to, pickupTimeRange.from, addLocationErrors.deliveryFrom)
    const setValidationError = type === "add" ? setAddLocationError : setError
    if (deliveryTimeRange.from == null) {
      setValidationError("deliveryFrom", "Times is required");
    }
    if (deliveryTimeRange.to == null) {
      setValidationError("deliveryTo", "Times is required");
    }
    if (pickupTimeRange.from == null) {
      setValidationError("pickupFrom", "Times is required");
    }
    if (pickupTimeRange.to == null) {
      setValidationError("pickupTo", "Times is required");
    }
    console.log("addLocationErrors", addLocationErrors, addLocationErrors.deliveryFrom)
  }

  const onSubmit = async (data) => {
    console.log(data)
    const isValid = await editLocationMethods.trigger();
    const parsedAddress = parseAddress(data.address);

    console.log("isValid", isValid, editLocationErrors)

    if (!parsedAddress) {
      setError("Invalid address format.");
      setRegisterLoading(false);
      return;
    }

    validationTime();
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
          isUse: showPickupSection,
          days: data.pickupDays,
          from: dayjs(pickupTimeRange.from),
          to: dayjs(pickupTimeRange.to),
        },
        delivery: {
          isUse: showDeliverySection,
          doorToDoor: {
            use: locationDoorToDoorDeliveryMethod,
            maxDistance: parseInt(data.maxDistance, 10),
          },
          postMail: locationPostMailDeliveryMethod,
          days: data.deliveryDays,
          from: dayjs(deliveryTimeRange.from),
          to: dayjs(deliveryTimeRange.to),
        },
        isPrivate: data.locationPrivate,
        taxRate: data.taxRate
      };
      try {
        setLoading(true)
        const response = await axiosInstance.put(
          BASE_URL + `/api/v1/location/${selectedLocation}`, locationInfo
        );

        if (response) {
          toast("Location updated successfully", { type: "success", className: 'toast-custom' });
          resetEditLocationForm()
          handleEditPickupLocationClose()
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
        clearValues();
      }
    }
  };

  const clearValues = () => {
    setDeliveryTimeRange({
      from: null,
      to: null
    });
    setPickupTimeRange({
      from: null,
      to: null
    });
    setFormValue("address", "");
    setTaxRate(null);
    setLocalDeliveryAvailable("deliver")
  }

  // Delete Pickup Location Modal
  const [openDeletePickupLocation, setOpenDeletePickupLocation] = React.useState(false);

  const handleDeletePickupLocationClose = () => {
    setOpenDeletePickupLocation(false);
  };

  // ------------------------  Dropdown Menu ------------------------------------

  const handleDropOff = () => {
    handleLocaionsMenuClose();
    navigate("/vendor/location-details/add-drop-off");
  };

  const handleEditLocation = () => {
    handleLocaionsMenuClose();
    handleEditPickupLocationOpen();
  };

  const handleDeleteLocation = async () => {
    closeConfirmDeleteLocationModal();
    try {
      const response = await axiosInstance.delete(
        `${BASE_URL}/api/v1/location/${selectedLocation}`
      );
      toast("Location Deleted successfully", { type: "success", className: 'toast-custom' });
      getLocations()

    } catch (err) {
      setError(err.message);
    }
  };

  // Locations Popper Menu
  const [openLocationsMenu, setOpenLocationsMenu] = useState(null);

  const handleLocaionsMenuOpen = (event) => {
    setOpenLocationsMenu(event.currentTarget);
  };

  const handleLocaionsMenuClose = () => {
    setOpenLocationsMenu(null);
  };

  // Pickup Pointe Locations Popper Menu
  const [openPickupLocationsMenu, setOpenPickupLocationsMenu] = useState(null);

  const handlePickupLocaionsMenuOpen = (event) => {
    setOpenPickupLocationsMenu(event.currentTarget);
  };

  const handlePickupLocaionsMenuClose = () => {
    setOpenPickupLocationsMenu(null);
  };

  // Action Menu Awaiting Payment
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openAwaitingPaymentMenu = Boolean(anchorEl);
  const handleAwaitingPaymentMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleAwaitingPaymentMenuClose = () => {
    setAnchorEl(null);
  };

  // Edit Location Default Values
  const [formValues, setFormValues] = useState({
    location_name: "My Store #46",
    full_address: "21 Cress Street, Laguna CA, 93453",
    pickup_contact: "+1 433 7543 854",
    business_time: "Mon-Fri: 9 AM - 5 PM, Sat: 10 AM - 2 PM",
    location_contact: "Nicholas Walker",
    business_phone: "+1 (842) 757-2913",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
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

  const handleDeliveryOption = (event) => {
    const { value, checked } = event.target;

    setShowDeliveryOption((prevOptions) => ({
      ...prevOptions,
      [value]: checked,
    }));

    const isCourierChecked = value === "courier" ? checked : showDeliveryOption.courier;
    const isPostChecked = value === "post" ? checked : showDeliveryOption.post;
    const isPickupAndDeliverSelected = localDeliveryAvailable === "pickup_and_deliver";
    const isDeliverSelected = localDeliveryAvailable === "deliver";

    // Update setShowDeliverySection based on conditions
    if (isCourierChecked && isPostChecked) {
      setShowDeliverySection(true);
    } else if (!isCourierChecked && isPostChecked) {
      setShowDeliverySection(false);
    } else if (
      isCourierChecked && !isPostChecked && (isPickupAndDeliverSelected || isDeliverSelected)
    ) {
      setShowDeliverySection(true);
    } else {
      setShowDeliverySection(isPickupAndDeliverSelected || isDeliverSelected);
    }
  };

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

  useEffect(() => {
    if (openAddNewPickupLocation) {
      setExtFormData({})
    }
  }, [openAddNewPickupLocation])

  const displayedLocations = locations.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <>
      <FormProvider {...methods} >
        <div id="tabs" className="w-full h-full flex flex-col gap-[48px]">
          <div id="tab-label" className="flex flex-col sm:flex-row justify-between sm:items-center gap-[24px] sm:gap-0">
            <Typography variant="h5" className="capitalize">Location details</Typography>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs value={value} onChange={handleChange} aria-label="Location details">
                {/* <Tab label="Pickup Pointe Location(s)" {...tabProps(0)} className="!font-gilroy !text-[14px] !text-disabled !normal-case px-2 ss:px-3" /> */}
                <Tab
                  label="My Location(s)"
                  {...tabProps(0)}
                  className="!font-gilroy !text-[14px] !text-heading !normal-case px-2 ss:px-3"
                />
              </Tabs>
            </Box>
          </div>

          <div id="tab-panel" className='flex-1'>
            {/* <TabPanel value={value} index={0}>
                <div className="flex justify-between mb-[14px]">
                  <Typography variant="h5" className="">Location(s): 6</Typography>
                  <AddCircleIcon className='cursor-pointer' sx={{color: "#aeaeae", fontSize:"26px"}} onClick={handleAddNewPickupPointeLocationOpen} />
                </div>
                <div className="flex flex-col gap-[14px] font-gilroy">
                  <div className="flex flex-col px-[12px] py-[16px] self-stretch rounded-[12px] border border-[rgba(0, 0, 0, 0.08)] bg-white">
                    <div className="flex flex-col xs:flex-row justify-between xs:items-center gap-[14px] xs:gap-0">
                      <div className="flex flex-col ss:flex-row items-start ss:items-center gap-[3px] ss:gap-[8px]">
                        <Typography variant="subtitle1">Pickup Pointe Store #32322</Typography>
                        <CircleIcon className="text-[5px] text-normal hidden ss:block" />
                        <Typography variant="subtitle1"
                          className="text-primary"
                          aria-controls={openAwaitingPaymentMenu ? 'awaiting-payment' : undefined}
                          aria-haspopup="true"
                          aria-expanded={openAwaitingPaymentMenu ? 'true' : undefined}
                          onClick={handleAwaitingPaymentMenuClick}
                        >
                          awaiting payment
                        </Typography>
                        <Menu
                          id="awaiting-payment"
                          anchorEl={anchorEl}
                          open={openAwaitingPaymentMenu}
                          onClose={handleAwaitingPaymentMenuClose}
                          MenuListProps={{
                            'aria-labelledby': 'basic-button',
                          }}
                        >
                          <MenuItem onClick={handleAwaitingPaymentMenuClose}><Typography variant="subtitle2">Withdraw shelf space request</Typography></MenuItem>
                        </Menu>
                      </div>
                      <Typography variant="subtitle1">$200/month</Typography>
                    </div>
                    <div className="flex justify-between items-center mt-5 xs:mt-1">
                      <Typography variant="subtitle3">7384 Hayward Way, Laguna CA, 93453</Typography>
                      <IconButton onClick={handlePickupLocaionsMenuOpen}><MoreVertOutlinedIcon sx={{color: "#181818", fontSize:"22px"}} className="cursor-pointer" /></IconButton>
                    </div>
                    <Divider className="my-[12px]" />
                    <div className="flex flex-col xs:flex-row justify-between xs:items-center gap-[14px] xs:gap-0">
                      <Typography variant="subtitle3">You need to pay for your subscription to activate this location</Typography>
                      <Link to="/vendor/customer-loyalty">
                        <Button className="flex items-center"
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
                        >
                          To payments <ArrowForwardIosIcon className="text-heading text-[14px] ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className="flex flex-col px-[12px] py-[16px] self-stretch rounded-[12px] border border-[rgba(0, 0, 0, 0.08)] bg-white">
                    <div className="flex flex-col xs:flex-row justify-between xs:items-center gap-[14px] xs:gap-0">
                      <div className="flex flex-col ss:flex-row items-start ss:items-center gap-[3px] ss:gap-[8px]">
                        <Typography variant="subtitle1">Pickup Pointe Store #32322</Typography>
                        <CircleIcon className="text-[5px] text-normal hidden ss:block" />
                        <Typography variant="subtitle1"
                          className="text-primary"
                          aria-controls={openAwaitingPaymentMenu ? 'awaiting-payment' : undefined}
                          aria-haspopup="true"
                          aria-expanded={openAwaitingPaymentMenu ? 'true' : undefined}
                          onClick={handleAwaitingPaymentMenuClick}
                        >
                          awaiting payment
                        </Typography>
                        <Menu
                          id="awaiting-payment"
                          anchorEl={anchorEl}
                          open={openAwaitingPaymentMenu}
                          onClose={handleAwaitingPaymentMenuClose}
                          MenuListProps={{
                            'aria-labelledby': 'basic-button',
                          }}
                        >
                          <MenuItem onClick={handleAwaitingPaymentMenuClose}><Typography variant="subtitle2">Withdraw shelf space request</Typography></MenuItem>
                        </Menu>
                      </div>
                      <Typography variant="subtitle1">$200/month</Typography>
                    </div>
                    <div className="flex justify-between items-center mt-5 xs:mt-1">
                      <Typography variant="subtitle3">7384 Hayward Way, Laguna CA, 93453</Typography>
                      <IconButton onClick={handlePickupLocaionsMenuOpen}><MoreVertOutlinedIcon sx={{color: "#181818", fontSize:"22px"}} className="cursor-pointer" /></IconButton>
                    </div>
                    <Divider className="my-[12px]" />
                    <div className="flex flex-col xs:flex-row justify-between xs:items-center gap-[14px] xs:gap-0">
                      <Typography variant="subtitle3">You need to pay for your subscription to activate this location</Typography>
                      <Link to="/vendor/payment-method">
                        <Button className="flex items-center"
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
                        >
                          To payments <ArrowForwardIosIcon className="text-heading text-[14px] ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className="flex flex-col px-[12px] py-[16px] self-stretch rounded-[12px] border border-[rgba(0, 0, 0, 0.08)] bg-white">
                    <div className="flex flex-col xs:flex-row justify-between xs:items-center gap-[14px] xs:gap-0">
                      <div className="flex flex-col ss:flex-row items-start ss:items-center gap-[3px] ss:gap-[8px]">
                        <Typography variant="subtitle1">Pickup Pointe Store #32322</Typography>
                        <CircleIcon className="text-[5px] text-normal hidden ss:block" />
                        <Typography variant="subtitle1" className="text-success">active</Typography>
                      </div>
                      <Typography variant="subtitle1">$300/month</Typography>
                    </div>
                    <div className="flex justify-between items-center mt-5 xs:mt-1">
                      <div className="flex flex-col ss:flex-row items-start ss:items-center gap-[3px] ss:gap-[8px]">
                        <Typography variant="subtitle3">#034</Typography>
                        <CircleIcon className="text-[5px] text-normal hidden ss:block" />
                        <Typography variant="subtitle3">7384 Hayward Way, Laguna CA, 93453</Typography>
                      </div>
                      <IconButton onClick={handlePickupLocaionsMenuOpen}><MoreVertOutlinedIcon sx={{color: "#181818", fontSize:"22px"}} className="cursor-pointer" /></IconButton>
                    </div>
                    <Divider className="my-[12px]" />
                    <div className="flex flex-col xs:flex-row justify-between xs:items-center gap-[14px] xs:gap-0">
                      <Typography variant="subtitle3">You need to pay for your subscription to activate this location</Typography>
                      <Link to="/vendor/payment-method">
                        <Button className="flex items-center"
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
                        >
                          To payments <ArrowForwardIosIcon className="text-heading text-[14px] ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                </div>
                <div className="flex justify-center mt-[32px]">
                  <Pagination />
                </div>
              </TabPanel> */}

            <TabPanel value={value} index={0} className="h-full flex flex-col">
              <div className="flex justify-between mb-[14px]">
                <Typography variant="h6" className="">My Location(s): {totalNumberOfLocations}</Typography>
                <IconButton onClick={handleAddNewPickupLocationOpen}>
                  <AddCircleIcon className="cursor-pointer text-[#aeaeae] text-[26px] hover:text-normal" />
                </IconButton>
              </div>
              <div className="flex flex-col gap-[16px] font-gilroy">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center min-h-[35vh]">
                    <LoadingProgress sx={{ width: '50px' }} />
                  </div>
                ) : (
                  displayedLocations && displayedLocations.length > 0 ? (
                    displayedLocations.map((location, index) => {
                      const locationAddress =
                        location.address.street +
                        ", " +
                        location.address.city +
                        " " +
                        location.address.state +
                        ", " +
                        location.address.countryCode +
                        ", " +
                        location.address.zipCode;
                      return (
                        <div
                          key={index}
                          className="flex px-[12px] py-[16px] justify-between items-center gap-12px self-stretch rounded-[12px] border border-[rgba(0, 0, 0, 0.08)] bg-white"
                        >
                          <div className="flex flex-col items-start gap-[2px]">
                            <p className="text-[16px] font-normal leading-[25px] text-heading">
                              {location.name}
                            </p>
                            <p className="text-[14px] font-normal leading-[22px] text-normal">
                              {locationAddress}
                            </p>
                          </div>
                          <IconButton>
                            <MoreVertOutlinedIcon
                              sx={{ color: "#181818", fontSize: "22px" }}
                              onClick={(e) => {
                                if (location && location._id) {
                                  console.log("location._id", location._id);
                                  setSelectedLocation(location._id);
                                  handleLocaionsMenuOpen(e);
                                }
                              }}
                              className="cursor-pointer"
                            />
                          </IconButton>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center min-h-[35vh]">
                      <Typography variant="subtitle3" className="text-center">No Location Added</Typography>
                    </div>
                  )
                )}

                {(displayedLocations && !isLoading) && (
                  <div className="flex justify-center mt-[32px]">
                    <Pagination count={locations.length} page={page} handleChange={handlePageChange} itemsPerPage={itemsPerPage} />
                  </div>
                )}
              </div>
            </TabPanel>
          </div>
        </div>

        {/* Handle Pickup Locations Menu */}
        <Popover
          open={Boolean(openPickupLocationsMenu)}
          anchorEl={openPickupLocationsMenu}
          onClose={handlePickupLocaionsMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            sx: {
              p: 1,
              width: 245,
              "& .MuiMenuItem-root": {
                px: 1,
                typography: "body2",
                borderRadius: 0.75,
                fontFamily: "Gilroy",
              },
            },
          }}
        >
          <MenuItem onClick={handlePickupLocaionsMenuClose}>Deactivate location</MenuItem>
          <MenuItem onClick={() => navigate('/vendor/location-details/upgrade-downgrade-services')}>Upgrade/Downgrade services</MenuItem>
          <MenuItem onClick={handlePickupLocaionsMenuClose}>Request a new feature or service</MenuItem>
          <Divider />
          <MenuItem onClick={handlePickupLocaionsMenuClose} className="text-primary">Terminate location service</MenuItem>
        </Popover>

        {/* Handle My Locations Menu */}
        <Popover
          open={Boolean(openLocationsMenu)}
          anchorEl={openLocationsMenu}
          onClose={handleLocaionsMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            sx: {
              p: 1,
              width: 210,
              "& .MuiMenuItem-root": {
                px: 1,
                typography: "body2",
                borderRadius: 0.75,
                fontFamily: "Gilroy",
              },
            },
          }}
        >
          <MenuItem onClick={handleEditLocation}>Edit location</MenuItem>
          <MenuItem onClick={() => navigate('/vendor/location-details/add-drop-off')}>Deactivate location</MenuItem>
          <Divider />
          <MenuItem onClick={openConfirmDeleteLocationModal} className="text-primary">Delete location</MenuItem>
          {/* <MenuItem onClick={handleDeleteLocation} className="text-primary">Delete location</MenuItem> */}
        </Popover>

        {/* Edit Location Modal */}
        <React.Fragment>
          <Dialog
            className="w-full !font-gilroy"
            open={openEditPickupLocation}
            onClose={() => {
              setOpenEditPickupLocation(false);
              clearValues();
              resetEditLocationForm()
            }}
            scroll="paper"
            sx={{
              width: "100% !important",
            }}
          >
            <DialogTitle id="" className="pt-[32px] sm:!pt-[64px]">
              <h1 className="text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center font-gilroy">
                {TextConstants.EditLocation}
                <EditLocationOutlinedIcon className="text-[24px] sm:text-[30px] ml-2 mb-1 sm:mb-2" />
              </h1>
            </DialogTitle>
            <DialogContent dividers={scroll === "paper"}>
              <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
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
                        error={!!addLocationErrors.contactPhoneNumber}
                      />
                      {editLocationErrors.contactPhoneNumber && (
                        <FormHelperText error>{editLocationErrors.contactPhoneNumber.message}</FormHelperText>
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
                          {...editLocationRegister("contactFirstName", {
                            required: "First name is required",
                          })}
                          error={!!editLocationErrors.contactFirstName}
                        />
                        {editLocationErrors.contactFirstName && (
                          <FormHelperText error>{editLocationErrors.contactFirstName.message}</FormHelperText>
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
                                {/* {error && (
                                    <Typography variant="caption" color="error">
                                      {error.message}
                                    </Typography>
                                  )} */}
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
                                  error={Boolean(editLocationErrors.pickupFrom)}
                                >
                                  <Controller
                                    name="pickupFrom"
                                    defaultValue={0}
                                    control={editLocationControl}
                                    render={({ field }) => (
                                      // <Select
                                      //   labelId="demo-simple-select-label"
                                      //   size="small"
                                      //   {...field}
                                      //   className="!rounded-r-[0px]"
                                      // >
                                      //   {Array.from({ length: 13 }, (_, i) => (
                                      //     <MenuItem
                                      //       key={i}
                                      //       value={i}
                                      //       className="!text-[12px] sm:!text-[14px] !font-gilroy"
                                      //     >
                                      //       {i}
                                      //     </MenuItem>
                                      //   ))}
                                      // </Select>
                                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <TimePicker
                                          name="pickupFrom"
                                          {...editLocationRegister("pickupFrom", {
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
                                            setPickupTimeRange((prev) => ({ ...prev, from: newValue }))
                                            clearEditLocationError("pickupFrom")
                                          }

                                          }
                                        />
                                      </LocalizationProvider>
                                    )}
                                  />
                                </FormControl>

                                {/* <FormControl
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
                                  </FormControl> */}
                                {/* <FormControl>
                                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                                      <TimePicker
                                          renderInput={(params) => (
                                              <TextField
                                                  {...params}
                                                  placeholder="08 : 00 AM"
                                                  id={`timeframe-textfield-from`}
                                              />
                                          )}
                                          value={pickupTimeRange.from}
                                          onChange={(newValue) =>{
                                              setPickupTimeRange((prev) => ({ ...prev, from: newValue }))

                                          }

                                          }
                                      />
                                  </LocalizationProvider>
                                </FormControl> */}
                              </div>
                              {editLocationErrors.pickupFrom && (
                                <Typography variant="caption" color="error">
                                  {editLocationErrors.pickupFrom.message}
                                </Typography>
                              )}
                            </div>

                            {/* To Section */}
                            <div className="w-full flex flex-col gap-[5px]">
                              <Typography variant="label">To</Typography>
                              <div className="flex items-center">
                                <FormControl className="w-full" error={Boolean(editLocationErrors.pickupTo)}>
                                  <Controller
                                    name="pickupTo"
                                    control={editLocationControl}
                                    defaultValue={null} // Set the default value here
                                    rules={{ required: "Pickup end time is required" }} // Add validation rules
                                    render={({ field }) => (
                                      // <Select
                                      //   labelId="demo-simple-select-label"
                                      //   size="small"
                                      //   {...field} // Apply Controller field props
                                      //   className="!rounded-r-[0px]"
                                      // >
                                      //   {Array.from({ length: 13 }, (_, i) => (
                                      //     <MenuItem
                                      //       key={i}
                                      //       value={i}
                                      //       className="!text-[12px] sm:!text-[14px] !font-gilroy"
                                      //     >
                                      //       {i}
                                      //     </MenuItem>
                                      //   ))}
                                      // </Select>
                                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <TimePicker
                                          name="pickupTo"
                                          {...editLocationRegister("pickupTo", {
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
                                            setPickupTimeRange((prev) => ({ ...prev, to: newValue }))
                                            clearEditLocationError("pickupTo")
                                          }

                                          }
                                        />
                                      </LocalizationProvider>
                                    )}
                                  />

                                </FormControl>

                                {/* <FormControl className="w-[40%]" error={Boolean(errors.pickupToPeriod)}>
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
                                  </FormControl> */}
                                {/* <FormControl>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <TimePicker
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    placeholder="08 : 00 AM"
                                                    id={`timeframe-textfield-from`}
                                                />
                                            )}
                                            value={pickupTimeRange.to}
                                            onChange={(newValue) =>{
                                                setPickupTimeRange((prev) => ({ ...prev, to: newValue }))

                                            }

                                            }
                                        />
                                    </LocalizationProvider>
                                  </FormControl> */}
                              </div>
                              {editLocationErrors.pickupTo && (
                                <Typography variant="caption" color="error">
                                  {editLocationErrors.pickupTo.message}
                                </Typography>
                              )}
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
                          <div className="w-full flex justify-between gap-[14px]">
                            {/* From Section */}
                            <div className="w-full flex flex-col gap-[5px]">
                              <Typography variant="label">From</Typography>
                              <div className="flex items-center">
                                <FormControl
                                  className="w-full"
                                  error={Boolean(editLocationErrors.deliveryFrom)}
                                >
                                  <Controller
                                    name="deliveryFrom"
                                    control={editLocationControl}
                                    defaultValue={0}
                                    rules={{
                                      required: "Delivery time from is required",
                                    }} // Add required validation
                                    render={({ field }) => (
                                      // <Select
                                      //   labelId="demo-simple-select-label"
                                      //   size="small"
                                      //   {...field}
                                      //   className="!rounded-r-[0px]"
                                      // >
                                      //   {Array.from({ length: 13 }, (_, i) => (
                                      //     <MenuItem
                                      //       key={i}
                                      //       value={i}
                                      //       className="!text-[12px] sm:!text-[14px] !font-gilroy"
                                      //     >
                                      //       {i}
                                      //     </MenuItem>
                                      //   ))}
                                      // </Select>
                                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <TimePicker
                                          name="deliveryFrom"
                                          {...editLocationRegister("deliveryFrom", {
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
                                            clearEditLocationError("deliveryFrom")
                                          }

                                          }
                                        />
                                      </LocalizationProvider>
                                    )}
                                  />
                                </FormControl>
                                {/* <FormControl
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
                                  </FormControl> */}
                                {/* <FormControl>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <TimePicker
                                            name="deliveryFrom"
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    placeholder="08 : 00 AM"
                                                    id={`timeframe-textfield-from`}
                                                />
                                            )}
                                            value={deliveryTimeRange.from}
                                            onChange={(newValue) =>{
                                                setDeliveryTimeRange((prev) => ({ ...prev, from: newValue }))

                                            }

                                            }
                                        />
                                    </LocalizationProvider>
                                  </FormControl> */}
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
                                  className="w-full"
                                  error={Boolean(errors.deliveryTo)}
                                >
                                  <Controller
                                    name="deliveryTo"
                                    control={editLocationControl}
                                    defaultValue={0}
                                    rules={{
                                      required: "Delivery time to is required",
                                    }} // Add required validation
                                    render={({ field }) => (
                                      // <Select
                                      //   labelId="demo-simple-select-label"
                                      //   size="small"
                                      //   {...field}
                                      //   className="!rounded-r-[0px]"
                                      // >
                                      //   {Array.from({ length: 13 }, (_, i) => (
                                      //     <MenuItem
                                      //       key={i}
                                      //       value={i}
                                      //       className="!text-[12px] sm:!text-[14px] !font-gilroy"
                                      //     >
                                      //       {i}
                                      //     </MenuItem>
                                      //   ))}
                                      // </Select>
                                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <TimePicker
                                          name="deliveryTo"
                                          {...editLocationRegister("deliveryTo", {
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
                                            clearEditLocationError("deliveryTo")
                                          }

                                          }
                                        />
                                      </LocalizationProvider>
                                    )}
                                  />
                                  {editLocationErrors.deliveryTo && (
                                    <Typography variant="caption" color="error">
                                      {editLocationErrors.deliveryTo.message}
                                    </Typography>
                                  )}
                                </FormControl>
                                {/* <FormControl
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
                                  </FormControl> */}
                                {/* <FormControl>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <TimePicker
                                            name="deliveryTo"
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    placeholder="08 : 00 AM"
                                                    id={`timeframe-textfield-from`}
                                                />
                                            )}
                                            value={deliveryTimeRange.to}
                                            onChange={(newValue) =>{
                                                setDeliveryTimeRange((prev) => ({ ...prev, to: newValue }))

                                            }

                                            }
                                        />
                                    </LocalizationProvider>
                                  </FormControl> */}
                                {/* {editLocationErrors.deliveryFromPeriod && (
                                    <Typography variant="caption" color="error">
                                      {editLocationErrors.deliveryFromPeriod.message}
                                    </Typography>
                                  )} */}
                              </div>
                              {/* {editLocationErrors.deliveryTo && (
                                  <Typography variant="caption" color="error">
                                    {editLocationErrors.deliveryTo.message}
                                  </Typography>
                                )} */}
                            </div>
                          </div>
                        </div>
                      </FormControl>
                    )}
                    {/* <TaxRate /> */}
                    <FormControl className="w-full">
                      <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
                        What is your jurisdiction's tax rate?
                      </label>
                      <Controller
                        name="taxRate"
                        control={editLocationControl}
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
                onClick={() => {
                  setOpenEditPickupLocation(false)
                  clearValues();
                  resetEditLocationForm();
                }}
              >
                {TextConstants.Cancel}
              </Button>
              {
                loading ? <Button
                  className="w-full"
                  sx={{
                    width: "100%",
                    height: "44px",
                    fontSize: "14px",
                    borderRadius: "8px",
                    border: "1px solid red",
                    backgroundColor: "transparent",
                  }}
                  disabled={loading}
                >
                  <ButtonLoader />
                </Button> : <DefaultButton
                  onClick={editLocationMethods.handleSubmit(onSubmit)}
                  className='w-full'
                  value={'Update'} // Change button text based on loading state
                  size='100%'
                  bg='rgba(241, 68, 69, 1)'
                  color='rgba(254, 254, 255, 1)'
                />
              }
            </DialogActions>
          </Dialog>
        </React.Fragment>

        {/* Delete Location Modal */}
        <React.Fragment>
          <Dialog className="w-full"
                  open={openDeleteLocationModal}
                  onClose={closeConfirmDeleteLocationModal}
                  sx={{
                    width: "100% !important",
                  }}
          >
            <DialogTitle className='pt-[32px] sm:!pt-[64px] flex flex-col gap-[6px] items-center'>
              <img src={icTrash} className='w-[40%]'/>
            </DialogTitle>
            <DialogContent dividers={scroll === 'paper'}>
              <DialogContentText>
                <div className='flex flex-col gap-[14px] font-gilroy sm:px-[60px] py-[16px]'>
                  <Typography variant="h3" className="text-center">Are you sure you want to delete this location?</Typography>
                  <Typography variant="subtitle1" className="text-normal text-center">You won’t be able to recover it afterwards.</Typography>
                </div>
              </DialogContentText>
            </DialogContent>
            <DialogActions className="!px-[22px] !pb-[32px] sm:!pb-[64px] sm:!px-[80px] !gap-[14px]">
              <DefaultButton value="Cancel" className="w-full bg-[#F5F5F5] text-heading hover:bg-[#fef0f0]" onClick={closeConfirmDeleteLocationModal} />
              <DefaultButton value="Delete" className="w-full" onClick={handleDeleteLocation} />
            </DialogActions>
          </Dialog>
        </React.Fragment>

        {/* Add New Pickup Location Modal */}
        <React.Fragment>
          <Dialog
            className="w-full !font-gilroy"
            open={openAddNewPickupLocation}
            onClose={() => {
              setOpenAddNewPickupLocation(false)
              resetAddLocationForm();
              clearValues();
            }}
            scroll="paper"
            sx={{
              width: "100% !important",
            }}
          >
            <DialogTitle id="" className="pt-[32px] sm:!pt-[64px]">
              <h1 className="text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center font-gilroy">
                {TextConstants.AddNewLocation}
                <AddLocationAltOutlinedIcon className="text-[24px] sm:text-[30px] ml-2 mb-1 sm:mb-2" />
              </h1>
            </DialogTitle>
            <DialogContent dividers={scroll === "paper"}>
              <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
                <FormProvider {...addLocationMethods}>
                  <form onSubmit={addLocationMethods.handleSubmit(handleAddNewPickupLocationClose)} className="flex flex-col gap-[14px] font-gilroy sm:px-[60px] py-[16px]">
                    <FormControl variant="standard" className="">
                      <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
                        {TextConstants.LocationName}
                      </label>
                      <TextField
                        size="small"
                        variant="outlined"
                        fullWidth
                        name="locationName"
                        placeholder="Enter location name"
                        {...addLocationRegister("locationName", {
                          required: "Location name is required",
                        })}
                        error={!!addLocationErrors.locationName}
                      />
                      {addLocationErrors.locationName && (
                        <FormHelperText error>{addLocationErrors.locationName.message}</FormHelperText>
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
                              value={watch("address")}
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
                                    {...addLocationRegister("address", {
                                      required: "Address is required",
                                    })}
                                    error={!!addLocationErrors.address}
                                  />
                                  {(addLocationErrors.address || error) && (
                                    <FormHelperText error>
                                      {error ? error : addLocationErrors.address.message}
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

                    {/* <FormControl variant="standard" className='w-full !mt-[14px] sm:!mt-0'>
                        <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Business phone number</label>
                        <TextField
                          InputProps={{
                            inputComponent: PhoneNumberMaskInput,
                          }}
                          size="small"
                          variant='outlined'
                          required
                          fullWidth
                          placeholder='Enter phone number'
                        />
                      </FormControl> */}

                    <FormControl variant="standard" className="">
                      <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
                        Location phone number
                      </label>
                      <TextField
                        InputProps={{
                          inputComponent: PhoneNumberInput,
                        }}
                        size="small"
                        variant="outlined"
                        fullWidth
                        placeholder="Enter contact number"
                        {...addLocationRegister("contactPhoneNumber", {
                          required: "Phone Number is required"
                        })}
                        value={extFormData.phoneNumber}
                        onChange={(e) => setExtFormData({
                          ...extFormData,
                          phoneNumber: e.target.value
                        })}
                        error={!!addLocationErrors.contactPhoneNumber}
                      />
                      {/* <PhoneNumberInput
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
                            error={!!addLocationErrors.contactPhoneNumber}
                        /> */}
                      {addLocationErrors.contactPhoneNumber && (
                        <FormHelperText error>{addLocationErrors.contactPhoneNumber.message}</FormHelperText>
                      )}
                      {/* <TextField
                          InputProps={{
                            inputComponent: PhoneNumberMaskInput,
                          }}
                          size="small"
                          variant="outlined"
                          fullWidth
                          placeholder="Enter contact number"
                          {...addLocationRegister("contactPhoneNumber", {
                            required: "Phone Number is required"
                          })}
                          value={extFormData.phoneNumber}
                          onChange={(e) => setExtFormData({
                            ...extFormData,
                            phoneNumber: e.target.value
                          })}
                          error={!!addLocationErrors.contactPhoneNumber}
                        />
                        {addLocationErrors.contactPhoneNumber && (
                          <FormHelperText error>{addLocationErrors.contactPhoneNumber.message}</FormHelperText>
                        )} */}
                    </FormControl>

                    <FormControl variant="standard" className="">
                      <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
                        Location contact
                      </label>
                      <div className="flex justify-between w-full gap-[14px] items-start">
                        <FormControl variant="standard" className="w-full">
                          <TextField
                            size="small"
                            variant="outlined"
                            fullWidth
                            placeholder="Enter first name"
                            {...addLocationRegister("contactFirstName", {
                              required: "First name is required",
                            })}
                            error={!!addLocationErrors.contactFirstName}
                          />
                          {addLocationErrors.contactFirstName && (
                            <FormHelperText error>{addLocationErrors.contactFirstName.message}</FormHelperText>
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
                            {...addLocationRegister("contactLastName", {
                              required: "Last name is required",
                            })}
                            error={!!addLocationErrors.contactLastName}
                          />
                          {addLocationErrors.contactLastName && (
                            <FormHelperText error>{addLocationErrors.contactLastName.message}</FormHelperText>
                          )}
                        </FormControl>
                      </div>
                    </FormControl>

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

                          {(localDeliveryAvailable === "pickup_and_deliver" || localDeliveryAvailable === "deliver") && (
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
                                    render={({ field: { onChange, value } }) => (
                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            size="small"
                                            checked={value} // Sync only with form state (remove local state from here)
                                            onChange={(e) => {
                                              // Update both local and form state
                                              setShowDeliveryOption((prev) => ({
                                                ...prev,
                                                courier: e.target.checked,
                                              }));
                                              onChange(e.target.checked); // Update form state
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
                                    render={({ field: { onChange, value } }) => (
                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            size="small"
                                            checked={value} // Sync only with form state (remove local state from here)
                                            onChange={(e) => {
                                              // Update both local and form state
                                              setShowDeliveryOption((prev) => ({
                                                ...prev,
                                                post: e.target.checked,
                                              }));
                                              onChange(e.target.checked); // Update form state
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
                                      defaultValue="" // Set a default value
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

                    {showPickupSection && (
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
                                  error={Boolean(addLocationErrors.pickupFrom)}
                                >
                                  {/* <Select
                                      labelId="demo-simple-select-label"
                                      size="small"
                                      defaultValue={0}
                                      className="!rounded-r-[0px]"
                                      {...addLocationRegister("pickupFrom", {
                                        required: "Pickup start time is required",
                                      })} // Add validation
                                    >
                                      {Array.from({ length: 13 }, (_, i) => i).map((i) => (
                                        <MenuItem
                                          key={i}
                                          value={i}
                                          className="!text-[12px] sm:!text-[14px] !font-gilroy"
                                        >
                                          {i}
                                        </MenuItem>
                                      ))}
                                    </Select> */}
                                  <Controller
                                    name="pickupFrom"
                                    control={control}
                                    defaultValue={0}
                                    render={({field}) => (
                                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <TimePicker
                                          name="pickupFrom"
                                          {...addLocationRegister("pickupFrom", {
                                            required: "Times is required",
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
                                            setPickupTimeRange((prev) => ({ ...prev, from: newValue }))
                                            clearAddLocationError("pickupFrom")
                                          }

                                          }
                                        />
                                      </LocalizationProvider>
                                    )}
                                  >
                                  </Controller>

                                  {addLocationErrors.pickupFrom && (
                                    <Typography variant="caption" color="error">
                                      {addLocationErrors.pickupFrom.message}
                                    </Typography>
                                  )}
                                </FormControl>
                                {/* <FormControl
                                    className="w-[40%]"
                                    error={Boolean(errors.pickupFromPeriod)}
                                  >
                                    <Select
                                      labelId="demo-simple-select-label"
                                      size="small"
                                      defaultValue={1}
                                      {...addLocationRegister("pickupFromPeriod", {
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
                                  </FormControl> */}
                                {/* <FormControl>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <TimePicker
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    placeholder="08 : 00 AM"
                                                    id={`timeframe-textfield-from`}
                                                />
                                            )}
                                            value={pickupTimeRange.from}
                                            onChange={(newValue) =>{
                                                setPickupTimeRange((prev) => ({ ...prev, from: newValue }))

                                            }

                                            }
                                        />
                                    </LocalizationProvider>
                                  </FormControl> */}
                              </div>
                            </div>

                            {/* To Section */}
                            <div className="w-full flex flex-col gap-[5px]">
                              <Typography variant="label">To</Typography>
                              <div className="flex items-center">
                                <FormControl
                                  className="w-full"
                                  error={Boolean(addLocationErrors.pickupTo)}
                                >
                                  {/* <Select
                                      labelId="demo-simple-select-label"
                                      size="small"
                                      defaultValue={0}
                                      {...addLocationRegister("pickupTo", {
                                        required: "Pickup end time is required",
                                      })} // Add validation
                                      className="!rounded-r-[0px]"
                                    >
                                      {Array.from({ length: 13 }, (_, i) => i).map((i) => (
                                        <MenuItem
                                          key={i}
                                          value={i}
                                          className="!text-[12px] sm:!text-[14px] !font-gilroy"
                                        >
                                          {i}
                                        </MenuItem>
                                      ))}
                                    </Select> */}
                                  <Controller
                                    name="pickupTo"
                                    control={control}
                                    defaultValue={0}
                                    render={({field}) => (
                                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <TimePicker
                                          name="pickupTo"
                                          {...addLocationRegister("pickupTo", {
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
                                            setPickupTimeRange((prev) => ({ ...prev, to: newValue }))
                                            clearAddLocationError("pickupTo")
                                          }

                                          }
                                        />
                                      </LocalizationProvider>
                                    )}
                                  >
                                  </Controller>

                                  {addLocationErrors.pickupTo && (
                                    <Typography variant="caption" color="error">
                                      {addLocationErrors.pickupTo.message}
                                    </Typography>
                                  )}
                                </FormControl>
                                {/* <FormControl
                                    className="w-[40%]"
                                    error={Boolean(errors.pickupToPeriod)}
                                  >
                                    <Select
                                      labelId="demo-simple-select-label"
                                      size="small"
                                      defaultValue={1}
                                      {...addLocationRegister("pickupToPeriod", {
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
                                    {errors.pickupToPeriod && (
                                      <Typography variant="caption" color="error">
                                        {errors.pickupToPeriod.message}
                                      </Typography>
                                    )}
                                  </FormControl> */}
                                {/* <FormControl>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <TimePicker
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    placeholder="08 : 00 AM"
                                                    id={`timeframe-textfield-from`}
                                                />
                                            )}
                                            value={pickupTimeRange.to}
                                            onChange={(newValue) =>{
                                                setPickupTimeRange((prev) => ({ ...prev, to: newValue }))

                                            }

                                            }
                                        />
                                    </LocalizationProvider>
                                  </FormControl> */}
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
                            control={control}
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
                          <div className="w-full flex justify-between gap-[14px]">
                            {/* From Section */}
                            <div className="w-full flex flex-col gap-[5px]">
                              <Typography variant="label">From</Typography>
                              <div className="flex items-center">
                                <FormControl
                                  className="w-full"
                                  error={Boolean(addLocationErrors.deliveryFrom)}
                                >
                                  <Controller
                                    name="deliveryFrom"
                                    control={control}
                                    defaultValue={0}
                                    rules={{
                                      required: "Delivery time to is required",
                                    }} // Add required validation
                                    render={({ field }) => (
                                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <TimePicker
                                          name="deliveryFrom"
                                          {...addLocationRegister("deliveryFrom", {
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
                                            clearAddLocationError("deliveryFrom")
                                          }

                                          }
                                        />
                                      </LocalizationProvider>
                                    )}
                                  />
                                </FormControl>
                                {/* <FormControl
                                    className="w-[40%]"
                                    error={Boolean(errors.deliveryFromPeriod)}
                                  >
                                    <Controller
                                      name="deliveryFromPeriod"
                                      control={control}
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
                                    {errors.deliveryFromPeriod && (
                                      <Typography variant="caption" color="error">
                                        {errors.deliveryFromPeriod.message}
                                      </Typography>
                                    )}
                                  </FormControl> */}
                                {/* <FormControl>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <TimePicker
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    placeholder="08 : 00 AM"
                                                    id={`timeframe-textfield-from`}
                                                />
                                            )}
                                            value={deliveryTimeRange.from}
                                            onChange={(newValue) =>{
                                                setDeliveryTimeRange((prev) => ({ ...prev, from: newValue }))

                                            }

                                            }
                                        />
                                    </LocalizationProvider>
                                  </FormControl> */}
                              </div>
                              {addLocationErrors.deliveryFrom && (
                                <Typography variant="caption" color="error">
                                  {addLocationErrors.deliveryFrom.message}
                                </Typography>
                              )}
                            </div>

                            {/* To Section */}
                            <div className="w-full flex flex-col gap-[5px]">
                              <Typography variant="label">To</Typography>
                              <div className="flex items-center">
                                <FormControl
                                  className="w-full"
                                  error={Boolean(addLocationErrors.deliveryTo)}
                                >
                                  <Controller
                                    name="deliveryTo"
                                    control={control}
                                    defaultValue={0}
                                    rules={{
                                      required: "Delivery time to is required",
                                    }} // Add required validation
                                    render={({ field }) => (
                                      // <Select
                                      //   labelId="demo-simple-select-label"
                                      //   size="small"
                                      //   {...field}
                                      //   className="!rounded-r-[0px]"
                                      // >
                                      //   {Array.from({ length: 13 }, (_, i) => (
                                      //     <MenuItem
                                      //       key={i}
                                      //       value={i}
                                      //       className="!text-[12px] sm:!text-[14px] !font-gilroy"
                                      //     >
                                      //       {i}
                                      //     </MenuItem>
                                      //   ))}
                                      // </Select>
                                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <TimePicker
                                          name="deliveryTo"
                                          {...addLocationRegister("deliveryTo", {
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
                                            clearAddLocationError("deliveryTo")
                                          }

                                          }
                                        />
                                      </LocalizationProvider>
                                    )}
                                  />
                                </FormControl>
                                {/* <FormControl
                                    className="w-[40%]"
                                    error={Boolean(errors.deliveryToPeriod)}
                                  >
                                    <Controller
                                      name="deliveryToPeriod"
                                      control={control}
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
                                  </FormControl> */}
                                {/* <FormControl>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <TimePicker
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    placeholder="08 : 00 AM"
                                                    id={`timeframe-textfield-from`}
                                                />
                                            )}
                                            value={deliveryTimeRange.to}
                                            onChange={(newValue) =>{
                                                setDeliveryTimeRange((prev) => ({ ...prev, to: newValue }))

                                            }

                                            }
                                        />
                                    </LocalizationProvider>
                                  </FormControl> */}
                              </div>
                              {addLocationErrors.deliveryTo && (
                                <Typography variant="caption" color="error">
                                  {addLocationErrors.deliveryTo.message}
                                </Typography>
                              )}
                            </div>
                          </div>
                        </div>
                      </FormControl>
                    )}
                    {/* <TaxRate /> */}
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
                        name="locationPrivate" // Ensure this is the correct field name
                        control={control}
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
                onClick={() => {
                  setOpenAddNewPickupLocation(false);
                  resetAddLocationForm()
                  clearValues()
                }}
              >
                {TextConstants.Cancel}
              </Button>
              {
                loading ? <Button
                  className="w-full"
                  sx={{
                    width: "100%",
                    height: "44px",
                    fontSize: "14px",
                    borderRadius: "8px",
                    border: "1px solid red",
                    backgroundColor: "transparent",
                  }}
                  disabled={loading}
                >
                  <ButtonLoader />
                </Button> : <DefaultButton
                  onClick={addLocationMethods.handleSubmit(handleAddNewPickupLocationClose)} // Submit the form
                  className='w-full'
                  value={'Add Location'} // Change button text based on loading state
                  size='100%'
                  bg='rgba(241, 68, 69, 1)'
                  color='rgba(254, 254, 255, 1)'
                />
              }
            </DialogActions>
          </Dialog>
        </React.Fragment>

        {/* Pro Location Details Add New Pickup Location Modal */}
        <React.Fragment>
          <Dialog
            className="w-full !font-gilroy"
            open={openAddNewPickupPointeLocation}
            onClose={handleAddNewPickupPointeLocationClose}
            scroll="paper"
            sx={{
              width: "100% !important",
            }}
          >
            <DialogTitle id="" className="pt-[32px] sm:!pt-[64px]">
              <h1 className="text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center font-gilroy">
                Add new pickup location
              </h1>
            </DialogTitle>
            <DialogContent dividers={scroll === "paper"}>
              <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
                <div className="w-full flex flex-col gap-[16px] mt-5 sm:px-[60px]">
                  <div className="flex justify-center">
                    <Button
                      sx={{
                        width: "auto",
                        padding: "5px 5px",
                        fontFamily: "Gilroy",
                        fontSize: "14px",
                        color: "#181818",
                        borderRadius: "8px",
                        backgroundColor: "transparent",
                        textTransform: "unset",
                      }}
                    >
                      Request new Pickup Pointe location
                      <AddIcon
                        className="ml-2"
                        sx={{ color: "#181818", fontSize: "18px" }}
                      />
                    </Button>
                  </div>
                  <div className="grid gap-[14px]">
                    <FormControl variant="standard" className="">
                      <label className="font-normal text-normal leading-[20px] text-[14px] pb-[6px] font-gilroy">
                        Location zip code
                      </label>
                      <div className="flex justify-between items-center gap-[16px]">
                        <TextField
                          size="small"
                          type="number"
                          variant={"outlined"}
                          required
                          fullWidth
                          placeholder="Enter location name"
                        />
                        <IconButton className="bg-primary rounded-[5px] w-[41px] h-[41px] hover:bg-primary">
                          <img src={Magnifer} className="w-[20px] h-[20px]" />
                        </IconButton>
                      </div>
                    </FormControl>
                  </div>

                  <div className="flex flex-col gap-[14px] mt-[16px]">
                    <div>
                      <label className="font-normal text-normal leading-[20px] text-[14px] font-gilroy">
                        By this zip code 2 locations are available. Select one
                        or more that work for your dropoffs{" "}
                      </label>
                    </div>
                    <CheckboxList checkboxData={checkboxDataFromBackend} />
                  </div>
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
                onClick={handleAddNewPickupPointeLocationClose}
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
                onClick={handleAddNewPickupPointeLocationClose}
              >
                Add
              </Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>

        {/* Delete Pickup Location Modal */}
        <React.Fragment>
          <Dialog
            className="w-full"
            open={openDeletePickupLocation}
            onClose={handleDeletePickupLocationClose}
            sx={{
              width: "100% !important",
            }}
          >
            <DialogTitle
              id=""
              className="pt-[32px] sm:!pt-[64px] flex flex-col gap-[6px] items-center"
            >
              <img src={icTrash} className="w-[40%]"/>
            </DialogTitle>
            <DialogContent dividers={scroll === "paper"}>
              <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
                <div className="flex flex-col gap-[14px] font-gilroy sm:px-[60px] py-[16px]">
                  <h1 className="text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center font-gilroy">
                    Are you sure you want to delete your pickup location?
                  </h1>
                  <p className="text-normal font-light leading-[25px] text-[16px] text-center">
                    You won’t be able to recover it afterwards.
                  </p>
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
                onClick={handleDeletePickupLocationClose}
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
                onClick={handleDeletePickupLocationClose}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
      </FormProvider>
    </>
  );
};

export default LocationDetails;