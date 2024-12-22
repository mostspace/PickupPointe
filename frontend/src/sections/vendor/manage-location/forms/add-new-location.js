import React, {useEffect, useState, useMemo} from "react";
import {Link, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {useForm, FormProvider, Controller} from "react-hook-form";
import * as Yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";

// @mui
import {
  Select,
  FormControl,
  Button,
  Popover,
  Box,
  Autocomplete,
  Checkbox,
  MenuItem,
  Typography,
  IconButton,
  RadioGroup,
  Radio,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Chip,
  Divider,
  FormControlLabel,
  FormHelperText,
} from "@mui/material";

// Icons
import EditLocationOutlinedIcon from "@mui/icons-material/EditLocationOutlined";
import AddLocationAltOutlinedIcon from "@mui/icons-material/AddLocationAltOutlined";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AddIcon from "@mui/icons-material/Add";

// Assets
import {Magnifer, icTrash} from "src/assets";

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
import {RHFAutocomplete, RHFTextField} from "src/components/hook-form";
import useSmartyAutocomplete from "src/hooks/use-smarty-autocomplete";
import {_days} from "src/_mock/assets";
import {TextConstants} from "src/constants/textConstants";
import axiosInstance from "src/utils/axios";
import {BASE_URL} from "src/config-global";
import TaxRate from "src/components/tax-rate";

const AddNewLocationForm = ({addLocationMethods, addLocationErrors, handleAddNewPickupLocationClose}) => {
  return (
    <FormProvider {...addLocationMethods}>
      <form onSubmit={addLocationMethods.handleSubmit(handleAddNewPickupLocationClose)}
            className="flex flex-col gap-[14px] font-gilroy sm:px-[60px] py-[16px]">
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
                  clearIcon={true}
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
                        size="small"
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
              {...addLocationRegister("contactFirstName", {
                required: "First Name is required",
              })}
              error={!!addLocationErrors.contactFirstName}
            />
            {addLocationErrors.contactFirstName && (
              <FormHelperText error>{addLocationErrors.contactFirstName.message}</FormHelperText>
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
              {...addLocationRegister("contactLastName", {
                required: "Last Name is required",
              })}
              error={!!addLocationErrors.contactLastName}
            />
            {addLocationErrors.contactLastName && (
              <FormHelperText error>{addLocationErrors.contactLastName.message}</FormHelperText>
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
                      sx={{"&.Mui-checked": {color: "#F14445"}}}
                      size="small"
                    />
                  }
                  label={<span className="text-[14px]">Pickup only</span>}
                />
                <FormControlLabel
                  value="deliver"
                  control={
                    <Radio
                      sx={{"&.Mui-checked": {color: "#F14445"}}}
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
                        render={({field: {onChange, value}}) => (
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
                        render={({field: {onChange, value}}) => (
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
                                     field: {onChange, value},
                                     fieldState: {error},
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
                rules={{required: "Pickup days are required"}} // Add validation rules
                render={({
                  field: {onChange, value},
                  fieldState: {error},
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
                        {...addLocationRegister("pickupFrom", {
                          required: "Pickup start time is required",
                        })} // Add validation
                      >
                        {Array.from({length: 13}, (_, i) => i).map((i) => (
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
                        {...addLocationRegister("pickupTo", {
                          required: "Pickup end time is required",
                        })} // Add validation
                        className="!rounded-r-[0px]"
                      >
                        {Array.from({length: 13}, (_, i) => i).map((i) => (
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
                        rules={{
                          required: "Delivery time from is required",
                          validate: (value) => value > 0 || "Delivery time is required",
                        }} // Add required validation
                        render={({field}) => (
                          <Select
                            labelId="demo-simple-select-label"
                            size="small"
                            {...field}
                            className="!rounded-r-[0px]"
                          >
                            {Array.from({length: 13}, (_, i) => (
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
                        rules={{required: "Period is required"}} // Add required validation
                        render={({field}) => (
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
                      className="w-[60%]"
                      error={Boolean(errors.deliveryTo)}
                    >
                      <Controller
                        name="deliveryTo"
                        control={control}
                        defaultValue={0}
                        rules={{
                          required: "Delivery time to is required",
                          validate: (value) => value !== 0 || "Delivery time is required",
                        }} // Add required validation
                        render={({field}) => (
                          <Select
                            labelId="demo-simple-select-label"
                            size="small"
                            {...field}
                            className="!rounded-r-[0px]"
                          >
                            {Array.from({length: 13}, (_, i) => (
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
                      error={Boolean(errors.deliveryToPeriod)}
                    >
                      <Controller
                        name="deliveryToPeriod"
                        control={control}
                        defaultValue={1}
                        rules={{required: "Period is required"}} // Add required validation
                        render={({field}) => (
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

        <TaxRate/>

        <FormControl className="w-full flex flex-col gap-[3px] mt-1">
          <div className="flex gap-[5px] items-center">
            <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
              Keep this location’s address private and unlisted
            </label>
            <LightTooltip
              title="If you would like to hide this location’s address from customers, then enable this option. Some vendors may want certain location’s address information private if they have deliveries originating from a private location or warehouse.">
              <InfoOutlinedIcon
                sx={{fontSize: "16px", marginBottom: "3px"}}
              />
            </LightTooltip>
          </div>
          <Controller
            name="locationPrivate" // Ensure this is the correct field name
            control={control}
            render={({field: {onChange, value}}) => (
              <FormControlLabel
                className="max-w-fit"
                label=""
                control={
                  <IOSSwitch
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)} // Update the value on change
                    sx={{m: 1}}
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

export default AddNewLocationForm;