/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Controller } from "react-hook-form";

// @mui
import {
  Select, FormControl, Autocomplete, Checkbox, MenuItem, Typography, RadioGroup, Radio, TextField, Chip, FormControlLabel, FormHelperText,
} from "@mui/material";

// Components
import IOSSwitch from "src/components/ios-switch";
import LightTooltip from "src/components/LightTooltip";
import PhoneNumberMaskInput from "src/components/phonenumber-mask-input";
import useSmartyAutocomplete from "src/hooks/use-smarty-autocomplete";

// Icons
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

// Asset
import { _days } from "src/_mock/assets";

// Hook form
import { RHFAutocomplete, RHFTextField } from "src/components/hook-form";

// Constants
import { TextConstants } from "src/constants/textConstants";
import PhoneNumberInput from "src/components/phonenumber";

const MyPickupLocation = ({ methods }) => {
  const {
    register,
    control,
    setValue,
    formState: { errors },
    clearErrors,
    setError,
    watch,
  } = methods;
  const { suggestions, error, handleInputChange } = useSmartyAutocomplete();

  // Delivery Details
  const [localDeliveryAvailable, setLocalDeliveryAvailable] =
    useState("deliver");
  const [showDeliverySection, setShowDeliverySection] = useState(true);
  const [showPickupSection, setShowPickupSection] = useState(false);
  const [inputValue, setInputValue] = useState("");

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

    const isCourierChecked =
      value === "courier" ? checked : showDeliveryOption.courier;
    const isPostChecked = value === "post" ? checked : showDeliveryOption.post;
    const isPickupAndDeliverSelected =
      localDeliveryAvailable === "pickup_and_deliver";
    const isDeliverSelected = localDeliveryAvailable === "deliver";

    // Update setShowDeliverySection based on conditions
    if (isCourierChecked && isPostChecked) {
      setShowDeliverySection(true);
    } else if (!isCourierChecked && isPostChecked) {
      setShowDeliverySection(false);
    } else if (
      isCourierChecked &&
      !isPostChecked &&
      (isPickupAndDeliverSelected || isDeliverSelected)
    ) {
      setShowDeliverySection(true);
    } else {
      setShowDeliverySection(isPickupAndDeliverSelected || isDeliverSelected);
    }
  };

  // Validation chacker for input changes
  // Handle Location Name Validations
  const handleNameChange = (event) => {
    const { value } = event.target;
    setValue("locationName", value, { shouldValidate: true });
    if (value.length < 5) {
      setError("locationName", {
        type: "manual",
        message: "Location name must be at least 5 characters",
      });
    } else {
      clearErrors("locationName");
    }
  };
  // Handle Location Phone Number Validations
  const handlePhoneNumChange = (event) => {
    const { value } = event.target;
    setValue("locationPhoneNumber", value, { shouldValidate: true });

    if (value.length < 5) {
      setError("locationPhoneNumber", {
        type: "manual",
        message: "location Phone Number name must be at least 5 characters",
      });
    } else {
      clearErrors("locationPhoneNumber");
    }
  };

  // Handle Location Contact First Name Validations
  const handleFNameChange = (event) => {
    const { value } = event.target;
    setValue("locationContactFirstName", value, { shouldValidate: true });

    // Additional custom validation
    if (value.length === 0) {
      setError("locationContactFirstName", {
        type: "manual",
        message: "Location Contact Name is required",
      });
    } else {
      clearErrors("locationContactFirstName");
    }
  };
  // Handle Location Contact Last Name Validations
  const handleLNameChange = (event) => {
    const { value } = event.target;
    setValue("locationContactLastName", value, { shouldValidate: true });
    if (value.length === 0) {
      setError("locationContactLastName", {
        type: "manual",
        message: "Location Contact Name is required",
      });
    } else {
      clearErrors("locationContactLastName");
    }
  };

  // Handle Street Address Change Validation
  const handleStreetChange = (_event, value) => {
    setInputValue(value);

    if (value.length === 0) {
      setError("address", { type: "manual", message: "Address is required" });
    } else {
      clearErrors("address");
    }

    handleInputChange(value);
    setValue("address", value);
  };

  const handleStreetSelect = (_event, newValue) => {
    if (newValue) {
      setInputValue(newValue.value);
      setValue("address", newValue.value);
      clearErrors("address");
    }
  };

  return (
    <div className="flex flex-col gap-[24px]">
      <div className="">
        <Typography variant="h5" className="capitalize">
          My location
        </Typography>
      </div>

      <div className="flex flex-col gap-[14px] font-gilroy">
        <TextField
          size="small"
          variant="outlined"
          required
          fullWidth
          placeholder="Enter location name"
          {...register("locationName", {
            required: "Location name is required",
            minLength: {
              value: 5,
              message: "Location name must be at least 5 characters long",
            },
            maxLength: {
              value: 100,
              message: "Location name must be less than 100 characters",
            },
          })}
          error={Boolean(errors.locationName)}
          helperText={errors.locationName ? errors.locationName.message : ""}
          FormHelperTextProps={{
            style: { marginLeft: 0 }, // Remove left margin
          }}
          onChange={handleNameChange}
          onBlur={() => console.log("Field was blurred")}
        />

        <div className="flex flex-col gap-[14px]">
          <div className="flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between gap-[14px] items-center">
              <FormControl variant="standard" className="w-full">
                <Typography variant="label1">{TextConstants.StreetAddress}</Typography>
                <Autocomplete
                  clearIcon={false}
                  freeSolo
                  value={inputValue}
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
                        placeholder={TextConstants.LocalStreetPlaceHolder}
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
            </div>
          </div>
        </div>

        <FormControl variant="standard" className="">
          <Typography variant="label1">{TextConstants.LocationPhoneNumber}</Typography>
          <TextField
            InputProps={{
              inputComponent: PhoneNumberInput,
            }}
            size="small"
            variant="outlined"
            required
            fullWidth
            placeholder="Enter phone number"
            {...register("phoneNumber", {
              required: "Location Phone Number is required",
            })}
            error={Boolean(errors.phoneNumber)}
            helperText={errors.phoneNumber ? errors.phoneNumber.message : ""}
            FormHelperTextProps={{
              style: { marginLeft: 0 }, // Remove left margin
            }}
            onChange={handlePhoneNumChange}
          />
        </FormControl>
        <div className="flex justify-between w-full gap-[14px] items-center">
          <FormControl
            variant="standard"
            className="w-full"
            style={{
              minHeight:
                errors.locationContactFirstName ||
                errors.locationContactLastName
                  ? "100px"
                  : "auto", // Adjust height dynamically based on errors
            }}
          >
            <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
              {TextConstants.LocationContact}
            </label>
            <TextField
              size="small"
              variant="outlined"
              required
              fullWidth
              placeholder="Enter first name"
              {...register("locationContactFirstName", {
                required: "Location Contact First Name is required",
              })}
              error={Boolean(errors.locationContactFirstName)}
              helperText={
                errors.locationContactFirstName
                  ? errors.locationContactFirstName.message
                  : ""
              }
              FormHelperTextProps={{
                style: { marginLeft: 0 }, // Remove left margin
              }}
              onChange={handleFNameChange}
              onBlur={() => console.log("Field was blurred")}
            />
          </FormControl>

          <FormControl
            variant="standard"
            className="w-full"
            style={{
              minHeight:
                errors.locationContactFirstName ||
                errors.locationContactLastName
                  ? "100px"
                  : "auto", // Ensure this matches the first field's height
            }}
          >
            <label className="font-normal opacity-0 text-normal leading-[20px] text-[12px] pb-[4px]">
              {TextConstants.LocationContact}
            </label>
            <TextField
              size="small"
              variant="outlined"
              required
              fullWidth
              placeholder="Enter last name"
              {...register("locationContactLastName", {
                required: "Location Contact Last Name is required",
              })}
              error={Boolean(errors.locationContactLastName)}
              helperText={
                errors.locationContactLastName
                  ? errors.locationContactLastName.message
                  : ""
              }
              FormHelperTextProps={{
                style: { marginLeft: 0 }, // Remove left margin
              }}
              onChange={handleLNameChange}
              onBlur={() => console.log("Field was blurred")}
            />
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
                          Set your maximum courier delivery distance radius in
                          miles
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
                      <Select
                        labelId="demo-simple-select-label"
                        size="small"
                        defaultValue={0}
                        className="!rounded-r-[0px]"
                        {...register("pickupFrom", {
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
                      </Select>
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
                        {...register("pickupFromPeriod", {
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
                    <FormControl
                      className="w-[60%]"
                      error={Boolean(errors.pickupTo)}
                    >
                      <Select
                        labelId="demo-simple-select-label"
                        size="small"
                        defaultValue={0}
                        {...register("pickupTo", {
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
                      </Select>
                      {errors.pickupTo && (
                        <Typography variant="caption" color="error">
                          {errors.pickupTo.message}
                        </Typography>
                      )}
                    </FormControl>
                    <FormControl
                      className="w-[40%]"
                      error={Boolean(errors.pickupToPeriod)}
                    >
                      <Select
                        labelId="demo-simple-select-label"
                        size="small"
                        defaultValue={1}
                        {...register("pickupToPeriod", {
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
              <div className="w-full flex flex-col sm:flex-row justify-between gap-[14px]">
                {/* From Section */}
                <div className="w-full flex flex-col gap-[5px]">
                  <Typography variant="label">From</Typography>
                  <div className="flex items-center">
                    <FormControl
                      className="w-[60%]"
                      error={Boolean(errors.deliveryFrom)}
                    >
                      <Controller
                        name="deliveryFrom"
                        control={control}
                        defaultValue={0}
                        rules={{ required: "Delivery time from is required" }} // Add required validation
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
                    </FormControl>
                  </div>
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
                        control={control}
                        defaultValue={0}
                        rules={{ required: "Delivery time to is required" }} // Add required validation
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
                    </FormControl>
                  </div>
                </div>
              </div>
            </div>
          </FormControl>
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
      </div>
    </div>
  );
};

export default MyPickupLocation;
