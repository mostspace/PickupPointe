import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
// @mui
import {Select, FormControl, Button, Grid, Radio, RadioGroup, MenuItem, Typography, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, TextField, FormControlLabel, Autocomplete, FormHelperText,
} from "@mui/material";
// Icons
import CircleIcon from "@mui/icons-material/Circle";
// Assets
import { TextConstants } from "src/constants/textConstants";
import useSmartyAutocomplete from "src/hooks/use-smarty-autocomplete";
import {useDispatch, useSelector} from "react-redux";
import { Controller, useFormContext } from "react-hook-form";
import dayjs from "dayjs";
import PriceSummary from "./price-summary";
import _ from "lodash";
import { getLocationAddress } from "src/components/choose-location-select";
import {getDeliveryFee} from "src/reducers/shopper/orderSlice.js";
import {toast} from "react-toastify";
import {convertToMinutes} from "src/utils/date.js";

// --------------------------------------------------------------------------------------------------

const styles = {
  cancelBtnPickup: {
    width: "100%",
    height: "44px",
    fontFamily: "Gilroy",
    fontSize: "14px",
    color: "#181818",
    borderRadius: "8px",
    backgroundColor: "#F5F5F5",
    textTransform: "unset",
  },
  chooseLocationBtn: {
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
  },
};

// --------------------------------------------------------------------------------------------------
const ScheduleOrder = ({ vendorProfile, locationId }) => {
  const dispatch = useDispatch();
  const cartState = useSelector((state) => state.cart);
  const authState = useSelector((state) => state.auth);
  const {deliveryInfo} = useSelector(state => state.shopper.orders);
  const cartObject = cartState[vendorProfile._id];
  const {items : cartItems} = cartObject;
  
  const bufferTime = 10;
  
  const currentLocation = vendorProfile.locations.find(
    (location) => location._id === locationId
  );

  const { suggestions, error, handleInputChange } = useSmartyAutocomplete();
  const {
    suggestions: postMailSuggestions,
    error: postMailError,
    handleInputChange: postMailHandleInputChange,
  } = useSmartyAutocomplete();

  // State to track the selected menu item
  const [inputValue, setInputValue] = useState("");
  const [postMailInputValue, setPostMailInputValue] = useState("");
  const [pickupStores, setPickupStores] = useState(vendorProfile.locations);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [prepareTime, setPrepareTime] = useState(0);
  const [openPickupLocationsNearby, setOpenPickupLocationsNearby] = React.useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [scheduleType, setScheduleType] = useState("earliest-pickup");
  
  const {
    register,
    control,
    watch,
    formState: { errors },
    clearErrors,
    setError,
    setValue,
  } = useFormContext();

  const deliveryType = watch().deliveryType;
  const deliveryAddress = watch().deliveryAddress;
  const activeUser = authState?.user || null;
  

  const getClosestLocation = () => {
    return vendorProfile.locations?.reduce((closest, current) => {
        return current.distance < (closest?.distance ?? Infinity) ? current : closest;
    }, null);
  }
  
  const getEarliestPickupTime = () => {
    const now = dayjs();
    const currentDay = now.format('ddd');
    const currentTime = now.format('HH:mm');
    const fromTime = dayjs(currentLocation.pickup.from).format('HH:mm');
    const toTime = dayjs(currentLocation.pickup.to).format('HH:mm');
    const days = currentLocation.pickup.days;
    
    if (currentTime >= fromTime && currentTime <= toTime) {
      if (days.includes(currentDay)) {
        return now;
      } else {
        const nextDay = days.find(day => dayjs().day(day).isAfter(now)) || days[0];
        return dayjs().day(nextDay).set('hour', dayjs(currentLocation.pickup.from).hour()).set('minute', dayjs(currentLocation.pickup.from).minute());
      }
    } else if (currentTime < fromTime) {
      return now.set('hour', dayjs(currentLocation.pickup.from).hour()).set('minute', dayjs(currentLocation.pickup.from).minute());
    } else {
      const nextDay = days.find(day => dayjs().day(day).isAfter(now)) || days[0];
      return dayjs().day(nextDay).set('hour', dayjs(currentLocation.pickup.from).hour()).set('minute', dayjs(currentLocation.pickup.from).minute());
    }
  };
  
  useEffect(() => {
    if (scheduleType === "earliest-pickup") {
      const earliestPickupTime = getEarliestPickupTime();
      
      let totalPrepareTime = 0;
      for (const item of cartItems) {
        const {time, unit} = item.attributes.prepareTime;
        const timeInMinutes = convertToMinutes(time, unit);
        totalPrepareTime += timeInMinutes;
      }
      setPrepareTime(totalPrepareTime + bufferTime);
      const pickupDate = earliestPickupTime.add(totalPrepareTime + bufferTime, "minutes");
      setValue("pickupDate", pickupDate);
      setValue("pickupTime", pickupDate);
    } else {
      setValue("pickupDate", null);
      setValue("pickupTime", null);
    }
  }, [cartItems, deliveryType, scheduleType]);
  
  useEffect(() => {
    if (!deliveryInfo.external_delivery_id && deliveryInfo.message) {
      setError("deliveryAddress", {
        type: "manual",
        message: deliveryInfo.message,
      });
    }
  }, [deliveryInfo]);
  
  useEffect(() => {
    const deliveryCharge = vendorProfile.vendorSettings[0].courierDeliveryFees.chargeBeyondTheFree;
    setDeliveryFee(currentLocation.deliveryFee / 100 || deliveryCharge);
    const firstLocation = getClosestLocation()
    setValue("pickupLocation", firstLocation?._id || "");
  }, [vendorProfile, currentLocation, setValue]);

  // calc delivery fee by type and location
  useEffect(() => {
    if (deliveryType === 2) { // delivery mode.
      const {street, city, state, countryCode, zipCode} = getClosestLocation().address;
      const pickupAddress = `${street}, ${city}, ${state}, ${countryCode}, ${zipCode}`;
      const deliveryAddress = watch().deliveryAddress?.label
      if (pickupAddress && deliveryAddress && activeUser?.contactNumber) {
        const earliestPickupTime = getEarliestPickupTime();
        const pickupTime = earliestPickupTime
          .add(prepareTime, "minutes")
          .toISOString()
        dispatch(getDeliveryFee({
          pickupAddress,
          dropOffAddress: deliveryAddress,
          dropOffPhoneNumber: `+${activeUser.contactNumber.replace(/\D/g, "")}`,
          pickupTime
        }));
      }
    }
  }, [deliveryType, currentLocation, deliveryAddress]);

  /*useEffect(() => {
    if (scheduleType === "earliest-pickup") {
      setValue("pickupTime", dayjs());
      setValue("pickupDate", dayjs());
    } else {
      setValue("pickupTime", null);
      setValue("pickupDate", null);
    }
  }, [scheduleType, setValue]);*/
  
  useEffect(() => {
    if (selectedStore) setValue("pickupLocation", selectedStore);
  }, [selectedStore, setValue]);
  
  const handlePickupLocationsNearbyClose = () => {
    setOpenPickupLocationsNearby(false);
  };
  
  const handleSelectedStore = (index) => {
    setSelectedStore(index);
  };
  
  const handleStreetChange = (_event, value) => {
    setInputValue(value);
    handleInputChange(value);
  };
  
  const handlePostMailStreetChange = (_event, value) => {
    setPostMailInputValue(value);
    postMailHandleInputChange(value);
  };
  
  const handleSchedulePickupTime = (event) => {
    setScheduleType(event.target.value);
  };
  
  return (
    <>
      <div className="w-full">
        <div className="w-full flex flex-col gap-0 md:flex-row md:gap-[40px] justify-between items-start">
          <PriceSummary cartObject={cartObject} deliveryFee={deliveryFee} deliveryType={deliveryType} />
          <div className="w-full flex justify-center">
            <div className="w-full flex flex-col gap-[40px] py-[32px] xl:max-w-[800px]">
              <div className="flex flex-col gap-[14px]">
                <Typography variant="h5" className="capitalize">
                  Delivery preferences
                </Typography>
                <Controller
                  name="deliveryType"
                  control={control}
                  defaultValue={1}
                  rules={{ required: "Delivery Type is requried" }}
                  render={({ field }) => (
                    <FormControl
                      className="w-full"
                      fullWidth
                      error={!!errors.deliveryType}
                    >
                      <Select
                        {...field}
                        labelId="demo-simple-select-label"
                        size="small"
                        // defaultValue={1}
                        // value={selectedValue}
                        // onChange={handleChangeSelect}
                      >
                        <MenuItem
                          value={1}
                          className="!text-[12px] sm:!text-[14px] !font-gilroy"
                        >
                          Pickup your order at location
                        </MenuItem>
                        <MenuItem
                          value={2}
                          className="!text-[12px] sm:!text-[14px] !font-gilroy"
                        >
                          Get your order delivered by a driver
                        </MenuItem>
                        {currentLocation.delivery.postMail && (
                          <MenuItem
                            value={3}
                            className="!text-[12px] sm:!text-[14px] !font-gilroy"
                          >
                            Get your order delivered via post mail
                          </MenuItem>
                        )}
                      </Select>
                      {errors.deliveryType && (
                        <FormHelperText className="font-gilroy">
                          {errors.deliveryType.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                ></Controller>
              </div>

              <div className="flex flex-col gap-[14px]">
                <Typography variant="h5" className="capitalize">
                  {deliveryType === 1 ? "Confirm Pickup Name" : "Confirm Recipient Name"}
                </Typography>
                <FormControl variant="standard" className="w-full">
                  <Controller
                    name="ordererName"
                    control={control}
                    defaultValue={
                      activeUser ? `${activeUser.firstName} ${activeUser.lastName}` : ""
                    }
                    rules={{ required: "This field is required" }}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        value={value}
                        onChange={onChange}
                        placeholder={
                          deliveryType === 1
                            ? "Enter pickup name"
                            : "Enter recipient's name"
                        }
                        error={!!errors.ordererName}
                        helperText={
                          errors.ordererName?.message && (
                            <span className="text-red-600">{errors.ordererName.message}</span>
                          )
                        }
                      />
                    )}
                  />
                </FormControl>
              </div>

              {deliveryType === 1 && (
                <div className="w-full flex flex-col gap-[14px]">
                  <Typography variant="h5" className="capitalize">
                    Confirm Pickup Location
                  </Typography>
                  <div className="w-full flex flex-col">
                    <div className="w-full flex justify-between items-center">
                      <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
                        Location
                      </label>
                      {/* <label
                        className="font-normal text-normal leading-[20px] text-[12px] pb-[4px] underline cursor-pointer"
                        onClick={handlePickupLocationsNearbyOpen}
                      >
                        <PlaceOutlinedIcon className="text-[14px] mr-1" />
                        Use my current location
                      </label> */}
                    </div>
                    <Controller
                      name="pickupLocation"
                      control={control}
                      defaultValue="" // Set an initial value for controlled input
                      render={({ field }) => (
                        <FormControl fullWidth error={!!errors.pickupLocation}>
                          <Select
                            {...field}
                            size="small"
                            displayEmpty
                            readOnly
                            renderValue={(value) => {
                              if (!value) {
                                return (
                                  <Typography className="text-[14px] text-gray-400 font-gilroy">
                                    Select a pickup location
                                  </Typography>
                                );
                              }
                              const selected = vendorProfile.locations.find(
                                (_) => _._id === value
                              );
                              return selected ? getLocationAddress(selected) : "";
                            }}
                          >
                            {vendorProfile.locations.map((location, index) => (
                              <MenuItem
                                key={index} // Add unique key
                                value={location._id}
                                className="!text-[12px] sm:!text-[14px] !font-gilroy"
                              >
                                {getLocationAddress(location)}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.pickupLocation && (
                            <FormHelperText className="font-gilroy">
                              {errors.pickupLocation.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </div>
                  <Typography variant="label" className="text-normal">
                    Please arrive at this location to pick-up your order anytime
                    between 7AM-7PM on this date. Please note, we are not
                    responsible for your order if you fail to pick-up your order
                    on your scheduled day and allotted time-frame.
                  </Typography>
                </div>
              )}

              {deliveryType === 2 && (
                <div className="flex flex-col gap-[14px]">
                  <Typography variant="h5" className="capitalize">
                    Enter Delivery Address
                  </Typography>
                  <div className="flex flex-col">
                    <div className="flex flex-col sm:flex-row justify-between gap-[14px] items-center">
                      <Controller
                        name="deliveryAddress"
                        control={control}
                        defaultValue={activeUser && activeUser.deliveryAddress && {
                          label: `${activeUser.deliveryAddress.street}, ${activeUser.deliveryAddress.city}, ${activeUser.deliveryAddress.state} ${activeUser.deliveryAddress.zipCode}`,
                          value: `${activeUser.deliveryAddress.street}, ${activeUser.deliveryAddress.city}, ${activeUser.deliveryAddress.state} ${activeUser.deliveryAddress.zipCode}`,
                          key: `${activeUser.deliveryAddress.street}-${activeUser.deliveryAddress.zipCode}`,
                        }}
                        render={({ field }) => (
                          <FormControl
                            className="w-full"
                            error={!!errors.deliveryAddress}
                          >
                            <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
                              {TextConstants.StreetAddress}
                            </label>
                            <Autocomplete
                              {...field}
                              clearIcon={false}
                              freeSolo
                              value={field.value || inputValue}
                              options={suggestions}
                              onInputChange={handleStreetChange}
                              // onChange={handleStreetSelect}
                              onChange={(event, value) => field.onChange(value)}
                              renderInput={(params) => (
                                <div>
                                  <TextField
                                    {...params}
                                    name="street"
                                    variant="outlined"
                                    required
                                    placeholder={
                                      TextConstants.LocalStreetPlaceHolder
                                    }
                                    autoComplete="off"
                                  />
                                </div>
                              )}
                              renderOption={(props, option) => (
                                <li {...props} key={option.key}>
                                  {option.label}
                                </li>
                              )}
                            />
                            {error && (
                              <span className="font-normal text-danger leading-[20px] text-[12px] py-[4px]">
                                {error}
                              </span>
                            )}
                            {errors.deliveryAddress && (
                              <FormHelperText className="font-gilroy">
                                {errors.deliveryAddress.message}
                              </FormHelperText>
                            )}
                          </FormControl>
                        )}
                      ></Controller>
                    </div>
                  </div>
                </div>
              )}

              {deliveryType === 3 && (
                <div className="flex flex-col gap-[14px]">
                  <Typography variant="h5" className="capitalize">
                    Enter post mail delivery details
                  </Typography>
                  <FormControl className="w-full">
                    <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
                      Postal supplier
                    </label>
                    <Select
                      labelId="demo-simple-select-label"
                      size="small"
                      defaultValue={1}
                    >
                      <MenuItem
                        value={1}
                        className="!text-[12px] sm:!text-[14px] !font-gilroy"
                      >
                        Priority Mail
                      </MenuItem>
                      <MenuItem
                        value={2}
                        className="!text-[12px] sm:!text-[14px] !font-gilroy"
                      >
                        Secondary Mail
                      </MenuItem>
                    </Select>
                  </FormControl>

                  <div className="flex flex-col">
                    <div className="flex flex-col sm:flex-row justify-between gap-[14px] items-center">
                      <Controller
                        name="postMailAddress"
                        control={control}
                        render={({ field }) => (
                          <FormControl
                            className="w-full"
                            error={errors.postMailAddress}
                          >
                            <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
                              {TextConstants.StreetAddress}
                            </label>
                            <Autocomplete
                              {...field}
                              clearIcon={false}
                              freeSolo
                              value={field.value || postMailInputValue}
                              options={postMailSuggestions}
                              onInputChange={handlePostMailStreetChange}
                              // onChange={handlePostMailStreetSelect}
                              onChange={(event, value) => field.onChange(value)}
                              renderInput={(params) => (
                                <div>
                                  <TextField
                                    {...params}
                                    name="street"
                                    variant="outlined"
                                    required
                                    placeholder={
                                      TextConstants.LocalStreetPlaceHolder
                                    }
                                    autoComplete="off"
                                  />
                                </div>
                              )}
                              renderOption={(props, option) => (
                                <li {...props} key={option.key}>
                                  {option.label}
                                </li>
                              )}
                            />
                            {postMailError && (
                              <span className="font-normal text-danger leading-[20px] text-[12px] py-[4px]">
                                {postMailError}
                              </span>
                            )}
                            {errors.postMailAddress && (
                              <FormHelperText className="font-gilroy">
                                {errors.postMailAddress.message}
                              </FormHelperText>
                            )}
                          </FormControl>
                        )}
                      ></Controller>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-[14px]">
                <FormControl className="w-full">
                  <RadioGroup
                    className="w-fit inline"
                    value={scheduleType}
                    aria-label="schedule-pickup-radio-groups"
                    name="schedule-pickup"
                    onChange={handleSchedulePickupTime}
                  >
                    <FormControlLabel
                      className="-ml-[12px]"
                      value="earliest-pickup"
                      control={
                        <Radio
                          sx={{ "&.Mui-checked": { color: "#F14445" } }}
                          size="small"
                        />
                      }
                      label={
                        <span className="text-[16px]">
                          {deliveryType === 2
                            ? "Earliest delivery time"
                            : "Earliest Pickup time"}
                        </span>
                      }
                    />
                    <FormControlLabel
                      className="-ml-[12px]"
                      value="schedule-pickup"
                      control={
                        <Radio
                          sx={{ "&.Mui-checked": { color: "#F14445" } }}
                          size="small"
                        />
                      }
                      label={
                        <span className="text-[16px]">
                          {deliveryType === 2
                            ? "Schedule delivery time"
                            : "Schedule Pickup"}
                        </span>
                      }
                    />
                  </RadioGroup>
                </FormControl>

                {scheduleType === "earliest-pickup" && (
                  <Typography variant="subtitle2">
                    {deliveryType === 2
                      ? "Estimated delivery time: "
                      : "Estimated Pickup Time: "}{" "}
                    <strong className="font-gilroyBold">
                      {deliveryType === 2
                        ? deliveryInfo.dropoff_time_estimated
                          ? dayjs(deliveryInfo.dropoff_time_estimated).format("hh:mm A dddd, MMMM D, YYYY")
                          : ""
                        : dayjs().format("hh:mm A dddd, MMMM D, YYYY")}
                    </strong>
                  </Typography>
                )}
              </div>

              {scheduleType === "schedule-pickup" && (
                <div className="flex flex-col gap-[14px]">
                  <Typography variant="h5" className="capitalize">
                    Select date and time for order{" "}
                    {deliveryType === 1 ? "pickup" : "delivery"}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item lg={6}>
                      <div className="flex flex-col gap-[32px]">
                        {/* {scheduleType === 'schedule-pickup' ? ( */}
                        <div className="flex flex-col items-start justify-start">
                          <Typography variant="label1">
                            {deliveryType === 1 ? "Pickup" : "Delivery"} time
                          </Typography>
                          <div className="flex flex-col gap-[16px]">
                            <Controller
                              name="pickupTime"
                              control={control}
                              render={({ field }) => (
                                <FormControl
                                  fullWidth
                                  error={!!errors.pickupTime}
                                >
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <TimePicker
                                      {...field}
                                      value={
                                        field.value ? dayjs(field.value) : null
                                      }
                                      onChange={(value) => {
                                        field.onChange(value);
                                        clearErrors("pickupTime");
                                      }}
                                    />
                                  </LocalizationProvider>
                                  {errors.pickupTime && (
                                    <FormHelperText className="font-gilroy">
                                      {errors.pickupTime.message}
                                    </FormHelperText>
                                  )}
                                </FormControl>
                              )}
                            />
                            <Controller
                              name="pickupDate"
                              control={control}
                              render={({ field }) => (
                                <FormControl
                                  fullWidth
                                  error={!!errors.pickupDate}
                                >
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DateCalendar
                                      {...field}
                                      sx={{
                                        border:
                                          "1px solid var(--stroke-8, rgba(0, 0, 0, 0.08))",
                                        borderRadius: "16px",
                                        margin: 0,
                                      }}
                                      minDate={dayjs().startOf("day")}
                                      onChange={(value) => {
                                        field.onChange(value);
                                        clearErrors("pickupDate");
                                      }}
                                    />
                                  </LocalizationProvider>
                                  {errors.pickupDate && (
                                    <FormHelperText className="font-gilroy">
                                      {errors.pickupDate.message}
                                    </FormHelperText>
                                  )}
                                </FormControl>
                              )}
                            />
                          </div>
                        </div>
                        {/* ) : (
                          <FormControl className="w-full">
                            <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Pick-up time-frame</label>
                            <RadioGroup
                              aria-label="tabs"
                              name="tabs"
                            >
                              <FormControlLabel className="-ml-[12px]"
                                value="9_12"
                                control={<Radio sx={{ '&.Mui-checked': { color: '#F14445' } }} size="small"/>}
                                label={<span className="text-[14px]">9AM - 12PM</span>}
                              />
                              <FormControlLabel className="-ml-[12px]"
                                value="12_2"
                                control={<Radio sx={{ '&.Mui-checked': { color: '#F14445' } }} size="small" />}
                                label={<span className="text-[14px]">12PM - 2PM</span>}
                              />
                              <FormControlLabel className="-ml-[12px]"
                                value="2_4"
                                control={<Radio sx={{ '&.Mui-checked': { color: '#F14445' } }} size="small" />}
                                label={<span className="text-[14px]">2PM - 4PM</span>}
                              />
                              <FormControlLabel className="-ml-[12px]"
                                value="4_6"
                                control={<Radio sx={{ '&.Mui-checked': { color: '#F14445' } }} size="small" />}
                                label={<span className="text-[14px]">4PM - 6PM</span>}
                              />
                            </RadioGroup>
                          </FormControl>
                      )} */}
                      </div>
                    </Grid>
                    <Grid item lg={6}>
                      {/* <Controller
                          name="pickupDate"
                          control={control}
                          render={({field}) => (
                            <FormControl fullWidth error={!!errors.pickupDate}>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateCalendar
                                  {...field}
                                  sx={{
                                    border: '1px solid var(--stroke-8, rgba(0, 0, 0, 0.08))',
                                    borderRadius: '16px',
                                    margin: 0
                                  }}
                                  minDate={dayjs().startOf('day')}
                                  onChange={(value) => {
                                    field.onChange(value);
                                    clearErrors("pickupDate")
                                  }}
                                />
                              </LocalizationProvider>
                              {errors.pickupDate && <FormHelperText className="font-gilroy">{errors.pickupDate.message}</FormHelperText>}
                            </FormControl>
                          )}
                      /> */}
                    </Grid>
                  </Grid>
                </div>
              )}

              {deliveryType === 2 && (
                <div className="flex flex-col gap-[14px]">
                  <Typography variant="h5" className="capitalize">
                    Choose your drop-off method
                  </Typography>
                  <FormControl className="w-full">
                    <Select
                      labelId="demo-simple-select-label"
                      size="small"
                      defaultValue={1}
                    >
                      <MenuItem
                        value={1}
                        className="!text-[12px] sm:!text-[14px] !font-gilroy"
                      >
                        Hand it to me
                      </MenuItem>
                      <MenuItem
                        value={2}
                        className="!text-[12px] sm:!text-[14px] !font-gilroy"
                      >
                        Leave at front-door
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
              )}

              <div className="flex flex-col gap-[14px]">
                <Typography variant="h5" className="capitalize">
                  Important Order Notes
                </Typography>
                <FormControl variant="standard" className="w-full">
                  <TextField
                    {...register("orderNotes")}
                    name="orderNotes"
                    size="small"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows="3"
                    placeholder="Leave a note for the seller pertaining to this order."
                  />
                </FormControl>
              </div>

              {deliveryType === 2 && (
                <div className="flex flex-col gap-[14px]">
                  <Typography variant="h5" className="capitalize">
                    Special delivery instructions
                  </Typography>

                  <div className="flex flex-col">
                    <div className="flex flex-col sm:flex-row justify-between gap-[14px] items-center">
                      <FormControl variant="standard" className="w-full">
                        <Typography variant="label1">
                          Provide any special instructions the driver may need to
                          find your drop-off location easier
                        </Typography>
                        <Controller
                          name="special-delivery-instruction"
                          control={control}
                          defaultValue={activeUser ? activeUser.specialDeliveryInstruction : ''}
                          render={({field: { onChange, value }}) => (
                            <TextField
                              value={value}
                              onChange={onChange}
                              multiline
                              rows="3"
                              placeholder="Call upon arrival, or use the side gate and enter code 3333 to enter the premises for delivery."
                            />
                          )}
                        />
                      </FormControl>
                    </div>
                  </div>
                </div>
              )}

              {/* <div className="flex flex-col gap-[14px]">
                    <div className="flex justify-between items-center">
                      <Typography variant="h5" className="capitalize">Auto-Pay</Typography>
                      <FormControlLabel
                        control={<IOSSwitch checked={autoPayChecked} onChange={handleAutoPaySwitchChange} sx={{ m: 1 }} />}
                      />
                    </div>
                    <Typography variant="label" className="text-normal">When enabling the auto pay feature at checkout, your payment method will be charged automatically. This allows you to pick up these same items either weekly or monthly on pre-scheduled days at the same location without having to manually pay for each order. You will be able to cancel your auto-pay at any time.</Typography>

                    {autoPayChecked && (
                        <>
                          <div className="flex justify-between items-center">
                            <FormControl className="w-full">
                              <label className='font-normal text-normal leading-[20px] text-[12px]'>Frequency</label>
                              <RadioGroup className="w-fit inline"
                                  defaultValue={'every'}
                                  aria-label="tabs"
                                  name="tabs"
                              >
                                <FormControlLabel className="-ml-[12px]"
                                  value="every"
                                  control={<Radio sx={{ '&.Mui-checked': { color: '#F14445' } }} size="small"/>}
                                  label={<span className="text-[14px]">Every</span>}
                                />
                                <FormControlLabel className="-ml-[12px]"
                                  value="every_other"
                                  control={<Radio sx={{ '&.Mui-checked': { color: '#F14445' } }} size="small" />}
                                  label={<span className="text-[14px]">Every other</span>}
                                />
                              </RadioGroup>
                            </FormControl>
                              <FormControl className="w-full">
                                <label className='font-normal text-normal leading-[20px] text-[12px]'>Time</label>
                                <RadioGroup className="w-fit inline"
                                  defaultValue={'week'}
                                  aria-label="tabs"
                                  name="tabs"
                                >
                                  <FormControlLabel className="-ml-[12px]"
                                    value="week"
                                    control={<Radio sx={{ '&.Mui-checked': { color: '#F14445' } }} size="small"/>}
                                    label={<span className="text-[14px]">Week</span>}
                                  />
                                  <FormControlLabel className="-ml-[12px]"
                                    value="month"
                                    control={<Radio sx={{ '&.Mui-checked': { color: '#F14445' } }} size="small" />}
                                    label={<span className="text-[14px]">Month</span>}
                                  />
                                </RadioGroup>
                              </FormControl>
                            </div>
                          <FormControl className="w-full">
                            <label className='font-normal text-normal leading-[20px] text-[12px]'>Day</label>
                            <RadioGroup className="w-fit inline"
                              aria-label="tabs"
                              name="tabs"
                            >
                              <FormControlLabel className="-ml-[12px]"
                                value="mon"
                                control={<Radio sx={{ '&.Mui-checked': { color: '#F14445' } }} size="small"/>}
                                label={<span className="text-[14px]">Mon</span>}
                              />
                              <FormControlLabel className="-ml-[12px]"
                                value="tue"
                                control={<Radio sx={{ '&.Mui-checked': { color: '#F14445' } }} size="small" />}
                                label={<span className="text-[14px]">Tue</span>}
                              />
                              <FormControlLabel className="-ml-[12px]"
                                value="wed"
                                control={<Radio sx={{ '&.Mui-checked': { color: '#F14445' } }} size="small" />}
                                label={<span className="text-[14px]">Wed</span>}
                              />
                              <FormControlLabel className="-ml-[12px]"
                                value="thu"
                                control={<Radio sx={{ '&.Mui-checked': { color: '#F14445' } }} size="small" />}
                                label={<span className="text-[14px]">Thu</span>}
                              />
                              <FormControlLabel className="-ml-[12px]"
                                value="fri"
                                control={<Radio sx={{ '&.Mui-checked': { color: '#F14445' } }} size="small" />}
                                label={<span className="text-[14px]">Fri</span>}
                              />
                              <FormControlLabel className="-ml-[12px]"
                                value="sat"
                                control={<Radio sx={{ '&.Mui-checked': { color: '#F14445' } }} size="small" />}
                                label={<span className="text-[14px]">Sat</span>}
                              />
                              <FormControlLabel className="-ml-[12px]"
                                value="sun"
                                control={<Radio sx={{ '&.Mui-checked': { color: '#F14445' } }} size="small" />}
                                label={<span className="text-[14px]">Sun</span>}
                              />
                            </RadioGroup>
                          </FormControl>
                        </>
                    )}
                </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Pro Location Details Add New Pickup Location Modal */}
      <React.Fragment>
        <Dialog
          className="w-full !font-gilroy"
          open={openPickupLocationsNearby}
          onClose={handlePickupLocationsNearbyClose}
          scroll="paper"
          sx={{
            width: "100% !important",
          }}
        >
          <DialogTitle id="" className="pt-[32px] sm:!pt-[64px]">
            <h1 className="text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center font-gilroy">
              Pick-up locations nearby{" "}
            </h1>
          </DialogTitle>
          <DialogContent dividers={scroll === "paper"}>
            <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
              <div className="w-full flex flex-col gap-[16px] mt-5 sm:px-[60px]">
                <div className="flex flex-col gap-[14px] mt-[16px]">
                  {pickupStores.length > 0 &&
                    _.sortBy(pickupStores, "distance").map((item, index) => (
                      <div
                        key={index}
                        className={`flex flex-col px-[12px] py-[16px] self-stretch rounded-[12px] border bg-white cursor-pointer ${
                          selectedStore === item._id
                            ? "border-red-500"
                            : "border-[rgba(0, 0, 0, 0.08)]"
                        }`}
                        onClick={() => handleSelectedStore(item._id)}
                      >
                        <div className="flex flex-col xs:flex-row justify-between xs:items-center gap-[14px] xs:gap-0">
                          <div className="flex flex-col ss:flex-row items-start ss:items-center gap-[3px] ss:gap-[8px]">
                            <Typography variant="subtitle1">
                              {item.name}
                            </Typography>
                          </div>
                          <div className="flex items-start items-center gap-[8px]">
                            {/* <Typography variant="subtitle1">{item.price}</Typography> */}
                            <CircleIcon className="text-[5px] text-normal" />
                            <Typography variant="subtitle1">
                              {new Intl.NumberFormat("en-US").format(
                                item.distance.toFixed(2)
                              )}{" "}
                              miles
                            </Typography>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-5 xs:mt-1">
                          <Typography variant="subtitle3">
                            {getLocationAddress(item)}
                          </Typography>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions className="!px-[22px] !pb-[32px] sm:!pb-[64px] sm:!px-[80px] !gap-[14px]">
            <Button
              sx={styles.cancelBtnPickup}
              onClick={() => setOpenPickupLocationsNearby(false)}
            >
              {TextConstants.Cancel}
            </Button>
            <Button
              className="w-full"
              sx={styles.chooseLocationBtn}
              onClick={handlePickupLocationsNearbyClose}
            >
              {TextConstants.ChooseLocation}
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </>
  );
};

ScheduleOrder.propTypes = {
  vendorProfile: PropTypes.object,
  locationId: PropTypes.string,
};

export default ScheduleOrder;