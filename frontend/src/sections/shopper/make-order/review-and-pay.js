import React, { useEffect, useState } from "react";
// @mui
import {
  FormControl,
  Radio,
  RadioGroup,
  Checkbox,
  Typography,
  TextField,
  FormControlLabel,
  FormGroup,
  FormHelperText,
} from "@mui/material";
// Components
import IOSSwitch from "src/components/ios-switch";
import PhoneNumberInput from "src/components/phonenumber";
import { useSelector } from "react-redux";
import { Controller, useFormContext } from "react-hook-form";
import PriceSummary from "./price-summary";
import { getLocationAddress } from "src/components/choose-location-select";

// --------------------------------------------------------------------------------------------------

const ReviewAndPay = ({ vendorProfile }) => {
  const cartState = useSelector((state) => state.cart);
  const cartObject = cartState[vendorProfile._id];
  const authState = useSelector((state) => state.auth);
  const activeUser = authState?.user || null;

  const [deliveryFee, setDeliveryFee] = useState(1.99);

  useEffect(() => {
    const deliveryCharge =
      vendorProfile.vendorSettings[0].courierDeliveryFees.chargeBeyondTheFree;
    setDeliveryFee(deliveryCharge);
  }, [vendorProfile]);

  // Handle Email Notification Switch
  const [emailNotificationChecked, setEmailNotificationChecked] =
    useState(false);
  const handleEmailNotificationChange = (event) =>
    setEmailNotificationChecked(event.target.checked);

  // Handle SMS Notification  Switch
  const [smsNotificationChecked, setSmsNotificationChecked] = useState(false);
  const handleSmsNotificationChange = (event) =>
    setSmsNotificationChecked(event.target.checked);

  // Handle Tip Value Change
  const [tipValue, setTipValue] = useState("");

  const handleTipValueChange = (event) => {
    setTipValue(event.target.value);
    if (event.target.value === "custom_tip") {
      setValue("tip", null);
    }
  };

  const handleCustomTip = (event) => {
    if (event.target.value !== "") {
      setValue("tip", `${event.target.value}%`);
      clearErrors("tip");
    } else {
      setValue("tip", null);
    }
  };

  const {
    watch,
    control,
    setError,
    clearErrors,
    setValue,
    formState: { errors },
    register,
  } = useFormContext();

  const formData = watch();
  const deliveryType = formData.deliveryType;

  useEffect(() => {
    if (emailNotificationChecked) {
      setValue("reminder-email", activeUser ? activeUser.email : "");
    } else {
      setValue("reminder-email", "");
    }
  }, [emailNotificationChecked, setValue, activeUser]);

  useEffect(() => {
    if (smsNotificationChecked) {
      setValue(
        "reminder-phonenumber",
        activeUser ? activeUser.contactNumber : ""
      );
    } else {
      setValue("reminder-email", "");
    }
  }, [smsNotificationChecked, setValue, activeUser]);

  return (
    <div className="w-full flex flex-col gap-0 md:flex-row md:gap-[40px] justify-between items-start">
      <PriceSummary
        cartObject={cartObject}
        deliveryFee={deliveryFee}
        deliveryType={deliveryType}
      />
      <div className="w-full flex justify-center">
        <div className="w-full flex flex-col gap-[40px] py-[32px] xl:max-w-[800px]">
          <div className="flex flex-col gap-[14px]">
            <Typography variant="h5" className="capitalize">
              {deliveryType == 1 && "Pick-Up Information"}
              {deliveryType == 2 && "Delivery Information"}
              {deliveryType == 3 && "PostMail Information"}
            </Typography>
            <div className="flex flex-col gap-[24px]">
              <div className="flex gap-[32px] sm:gap-[72px] items-start">
                <FormControl variant="standard" className="w-full">
                  <Typography variant="label1">
                    {deliveryType == 1 && "Pick-up date"}
                    {deliveryType == 2 && "Delivery date"}
                    {deliveryType == 3 && "PostMail date"}
                  </Typography>
                  <Typography variant="subtitle1">
                    {formData.pickupDate.format("dddd, MMMM D, YYYY")}
                  </Typography>
                </FormControl>
                <FormControl variant="standard" className="w-full">
                  <Typography variant="label1">
                    {deliveryType == 1 && "Pick-up time-frame"}
                    {deliveryType == 2 && "Delivery time-frame"}
                    {deliveryType == 3 && "PostMail time-frame"}
                  </Typography>
                  <Typography variant="subtitle1">{`${formData.pickupDate.format("hA")} - ${formData.pickupDate.add(2, "hour").format("hA")}`}</Typography>
                </FormControl>
              </div>
              <div className="flex gap-[32px] sm:gap-[72px] items-start">
                <FormControl variant="standard" className="w-full">
                  <Typography variant="label1">Location</Typography>
                  <Typography variant="subtitle1">
                    {deliveryType == 1 &&
                      getLocationAddress(
                        vendorProfile.locations.filter(
                          (location) => location._id === formData.pickupLocation
                        )[0]
                      )}
                    {deliveryType == 2 && formData.deliveryAddress.label}
                    {deliveryType == 3 && formData.postMailAddress.label}
                  </Typography>
                </FormControl>
                <FormControl variant="standard" className="w-full">
                  <Typography variant="label1">Delivery</Typography>
                  <Typography variant="subtitle1">Pickup Pointe</Typography>
                </FormControl>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-[14px]">
            <Typography variant="h5" className="capitalize">
              Leave the seller a tip
            </Typography>
            <div className="flex gap-[88px] items-start">
              <Controller
                name="tip"
                control={control}
                rules={{ required: "Tip is required" }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.tip}>
                    <RadioGroup
                      row
                      {...field}
                      aria-label="tabs"
                      // name="tabs"
                      value={field.value}
                      onChange={(event, value) => {
                        field.onChange(value);
                        handleTipValueChange(event);
                      }}
                    >
                      <FormControlLabel
                        value="10%"
                        control={
                          <Radio
                            sx={{ "&.Mui-checked": { color: "#F14445" } }}
                            size="small"
                          />
                        }
                        label={<span className="text-[14px]">10%</span>}
                      />
                      <FormControlLabel
                        value="15%"
                        control={
                          <Radio
                            sx={{ "&.Mui-checked": { color: "#F14445" } }}
                            size="small"
                          />
                        }
                        label={<span className="text-[14px]">15%</span>}
                      />
                      <FormControlLabel
                        value="20%"
                        control={
                          <Radio
                            sx={{ "&.Mui-checked": { color: "#F14445" } }}
                            size="small"
                          />
                        }
                        label={<span className="text-[14px]">20%</span>}
                      />
                      <FormControlLabel
                        value="0%"
                        control={
                          <Radio
                            sx={{ "&.Mui-checked": { color: "#F14445" } }}
                            size="small"
                          />
                        }
                        label={<span className="text-[14px]">No tip</span>}
                      />
                      <FormControlLabel
                        value="custom_tip"
                        control={
                          <Radio
                            sx={{ "&.Mui-checked": { color: "#F14445" } }}
                            size="small"
                          />
                        }
                        label={<span className="text-[14px]">Custom tip</span>}
                      />
                    </RadioGroup>
                    {tipValue === "custom_tip" && (
                      <>
                        <TextField
                          className="w-full sm:w-[47%] mt-2"
                          name="customTip"
                          type="number"
                          size="small"
                          variant="outlined"
                          placeholder="Custom tip amount"
                          onChange={handleCustomTip}
                        />
                      </>
                    )}
                    {errors.tip && (
                      <FormHelperText className="font-gilroy">
                        {errors.tip.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              ></Controller>
            </div>
          </div>

          <div className="flex flex-col gap-[14px]">
            <Typography variant="h5" className="capitalize">
              Set a reminder
            </Typography>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-[24px] sm:gap-[48px]">
              <div className="w-full flex flex-col">
                <div className="flex justify-between items-center">
                  <Typography variant="subtitle1">Email notification</Typography>
                  <FormControlLabel
                    control={
                      <IOSSwitch
                        checked={emailNotificationChecked}
                        onChange={handleEmailNotificationChange}
                        sx={{ m: 1 }}
                      />
                    }
                  />
                </div>
                <Controller
                  name="reminder-email"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      size="small"
                      variant="outlined"
                      required
                      fullWidth
                      placeholder="Enter email address"
                      value={value}
                      onChange={onChange}
                      disabled={!emailNotificationChecked}
                    />
                  )}
                />
              </div>
              <div className="w-full flex flex-col">
                <div className="flex justify-between items-center">
                  <Typography variant="subtitle1">SMS notification</Typography>
                  <FormControlLabel
                    control={
                      <IOSSwitch
                        checked={smsNotificationChecked}
                        onChange={handleSmsNotificationChange}
                        sx={{ m: 1 }}
                      />
                    }
                  />
                </div>

                {/* <TextField
                                  InputProps={{
                                      inputComponent: PhoneNumberMaskInput,
                                  }}
                                  size="small"
                                  variant='outlined'
                                  required
                                  fullWidth
                                  placeholder='Enter phone number'
                                  disabled={!smsNotificationChecked}
                              /> */}
                <Controller
                  name="reminder-phonenumber"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <PhoneNumberInput
                      name="phonenumber"
                      placeholder="Enter phone number"
                      fullWidth
                      value={value}
                      disabled={!smsNotificationChecked}
                      onChange={onChange}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-[14px]">
            <Typography variant="h5" className="capitalize">
              Important Seller Notes
            </Typography>
            <Typography variant="subtitle2">
              Please arrive at this location to pick-up your order anytime between
              7AM-7PM on this date. Please note, we are not responsible for your
              order if you fail to pick-up your order on your scheduled day and
              allotted time-frame.
            </Typography>
            <Typography variant="subtitle2">
              If you are unable to pick-up your order due to an emergency, please
              email us at{" "}
              <span className="underline">support@businessname.com</span>
            </Typography>
            <FormGroup className="w-full relative">
              <Controller
                name="checkbox"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        sx={{
                          color: "#A3A3A3",
                          "&.Mui-checked": {
                            color: "#F14445",
                          },
                        }}
                      />
                    }
                    label={
                      <Typography variant="subtitle2">
                        I have read the seller's notes and I understand
                      </Typography>
                    }
                  />
                )}
              />
              {errors.checkbox && (
                <FormHelperText error>{errors.checkbox.message}</FormHelperText>
              )}
            </FormGroup>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewAndPay;
