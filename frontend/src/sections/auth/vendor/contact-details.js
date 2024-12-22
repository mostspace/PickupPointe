import React, { useState } from "react";

import { TextareaAutosize } from "@mui/base/TextareaAutosize";

// @mui
import {
  FormControl,
  Radio,
  RadioGroup,
  FormLabel,
  Autocomplete,
  Typography,
  Checkbox,
  TextField,
  FormControlLabel,
  FormGroup,
} from "@mui/material";

// Components
import Iconify from "src/components/iconify/iconify";
import Modifiers from "src/components/modifiers";

// Assets
import { countries } from "src/_mock/assets";
import { Controller, useFormContext } from "react-hook-form";
import PhoneNumberInput from "src/components/phonenumber";

// ------------------------------------------------------------------------------------------------------------------------------------------

// Custom Tab Panel Component
const RadioTabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div className="flex flex-col gap-[48px]">{children}</div>
      )}
    </div>
  );
};

// ------------------------------------------------------------------------------------------------------------------------------------------

const ContactDetails = ({ methods }) => {
  // Radio Other Option
  const [selectedOption, setSelectedOption] = useState("");

  const handleOtherOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  // Function to validate email format
  function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  // Function to validate website (URL) format
  function validateWebsite(url) {
    const urlPattern = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
    return urlPattern.test(url);
  }

  // Function to validate phone number format
  function validatePhoneNumber(phoneNumber) {
    const phonePattern =
      /^(\+?\d{1,4}[\s-]?)?((\(\d{1,4}\))|\d{1,4})[\s-]?\d{1,4}[\s-]?\d{1,9}$/;
    return phonePattern.test(phoneNumber);
  }

  const {
    control,
    register,
    formState: { errors },
  } = useFormContext(); // Use useFormContext for accessing form methods

  // State management for field values
  const [formData, setFormData] = useState({
    supportEmail: "",
    contactEmail: "",
    supportPhone: "",
    contactPhone: "",
    website: "",
  });

  // State management for field errors
  const [fieldErrors, setFieldErrors] = useState({
    supportEmail: false,
    contactEmail: false,
    supportPhone: false,
    contactPhone: false,
    website: false,
  });

  // Handle input change for form fields
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    // Update form data state
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    // Validate fields and update errors
    switch (name) {
      case "supportEmail":
      case "contactEmail":
        setFieldErrors((prevErrors) => ({
          ...prevErrors,
          [name]: !validateEmail(value),
        }));
        break;

      case "supportPhone":
      case "contactPhone":
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

  return (
    <div className="w-full ">
      <div className="grid justify-center">
        <div className="w-full flex flex-col gap-[24px] sm:gap-[48px]">
          <div className="w-full flex flex-col gap-[24px] sm:gap-[48px]">
            <div className="w-full flex flex-col gap-[24px] sm:gap-[48px]">
              <div className="w-full flex flex-col gap-[14px]">
                <Typography variant="h5">Legal business entity details</Typography>
                <div className="flex flex-col sm:flex-row gap-[16px]">
                  <div className="w-full flex flex-col gap-[14px]">
                    <FormControl variant="standard" className="w-full">
                      <label className="font-normal text-normal leading-[20px] text-[14px] pb-[4px]">
                        Name
                      </label>
                      <Controller
                        name="name"
                        control={control}
                        rules={{
                          required: "Business name is required",
                          minLength: {
                            value: 3,
                            message:
                              "Name should be at least 3 characters long",
                          },
                          maxLength: {
                            value: 100,
                            message: "Name should not exceed 100 characters",
                          },
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            placeholder="Enter business name"
                            error={Boolean(errors.name)}
                            helperText={errors.name?.message}
                          />
                        )}
                      />
                    </FormControl>
                    
                    <FormControl fullWidth>
                      <label className="font-normal text-normal leading-[20px] text-[14px] pb-[4px]">
                        Website
                      </label>
                      <Controller
                        name="website"
                        control={control}
                        rules={{
                          required: "Website is required",
                          validate: (value) =>
                            validateWebsite(value) ||
                            "Please enter a valid website URL",
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            placeholder="Enter business website"
                            error={Boolean(errors.website)}
                            helperText={errors.website?.message}
                          />
                        )}
                      />
                    </FormControl>
                    
                    {/* <FormControl fullWidth>
                      <label className="font-normal text-normal leading-[20px] text-[14px] pb-[4px]">
                        Support Email
                      </label>
                      <Controller
                        name="supportEmail"
                        control={control}
                        rules={{
                          required: "Support email is required",
                          validate: (value) =>
                            validateEmail(value) ||
                            "Please enter a valid email",
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            placeholder="Enter support email"
                            error={Boolean(errors.supportEmail)}
                            helperText={errors.supportEmail?.message}
                          />
                        )}
                      />
                    </FormControl>
                    <FormControl fullWidth>
                      <label className="font-normal text-normal leading-[20px] text-[14px] pb-[4px]">
                        Support Phone
                      </label>
                      <Controller
                        name="supportNumber"
                        control={control}
                        rules={{
                          required: "Support phone number is required",
                          validate: (value) =>
                            validatePhoneNumber(value) ||
                            "Please enter a valid phone number",
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            placeholder="Enter support phone number"
                            error={Boolean(errors.supportNumber)}
                            helperText={errors.supportNumber?.message}
                          />
                        )}
                      />
                    </FormControl> */}
                  </div>
                  <div className="w-full flex flex-col gap-[14px]">
                    <FormControl variant="standard" className="w-full">
                      <label className="font-normal text-normal leading-[20px] text-[14px] pb-[4px]">
                        Legal business entity or DBA name
                      </label>
                      <Controller
                        name="entity"
                        control={control}
                        rules={{
                          required: "Business entity is required",
                          minLength: {
                            value: 3,
                            message:
                              "Business Entity should be at least 3 characters long",
                          },
                          maxLength: {
                            value: 100,
                            message:
                              "Business Entity should not exceed 100 characters",
                          },
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            placeholder="Enter business entity or DBA name"
                            error={Boolean(errors.entity)}
                            helperText={errors.entity?.message}
                          />
                        )}
                      />
                    </FormControl>

                    <FormControl fullWidth>
                      <label className="font-normal text-normal leading-[20px] text-[14px] pb-[4px]">
                        Business address
                      </label>
                      <Controller
                        name="street"
                        control={control}
                        rules={{ required: "Business address is required" }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            placeholder="Enter Business Address"
                            error={Boolean(errors.address)}
                            helperText={errors.address?.message}
                          />
                        )}
                      />
                    </FormControl>
                    {/* <FormControl fullWidth>
                      <label className="font-normal text-normal leading-[20px] text-[14px] pb-[4px]">
                        Country
                      </label>
                      <Controller
                        name="country"
                        control={control}
                        rules={{ required: "Country is required" }}
                        render={({ field }) => (
                          <Autocomplete
                            {...field}
                            options={countries}
                            getOptionLabel={(option) => option.label}
                            onChange={(event, value) => {
                              // Set the field value to the selected country label or desired property
                              field.onChange(value ? value.label : ""); // Pass the country name (label) to the form
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Select country"
                                error={Boolean(errors.country)}
                                helperText={errors.country?.message}
                              />
                            )}
                          />
                        )}
                      />
                    </FormControl>
                    <FormControl fullWidth>
                      <label className="font-normal text-normal leading-[20px] text-[14px] pb-[4px]">
                        City
                      </label>
                      <Controller
                        name="city"
                        control={control}
                        rules={{ required: "City is required" }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            placeholder="Enter city"
                            error={Boolean(errors.city)}
                            helperText={errors.city?.message}
                          />
                        )}
                      />
                    </FormControl>
                    <FormControl fullWidth>
                      <label className="font-normal text-normal leading-[20px] text-[14px] pb-[4px]">
                        State
                      </label>
                      <Controller
                        name="state"
                        control={control}
                        rules={{ required: "State is required" }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            placeholder="Enter state"
                            error={Boolean(errors.state)}
                            helperText={errors.state?.message}
                          />
                        )}
                      />
                    </FormControl>
                    <FormControl fullWidth>
                      <label className="font-normal text-normal leading-[20px] text-[14px] pb-[4px]">
                        Zip Code
                      </label>
                      <Controller
                        name="zipCode"
                        control={control}
                        rules={{ required: "Zip code is required" }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            placeholder="Enter zip code"
                            error={Boolean(errors.zipCode)}
                            helperText={errors.zipCode?.message}
                          />
                        )}
                      />
                    </FormControl> */}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-[14px]">
                <Typography variant="h5">Authorized business primary contact details</Typography>
                <div className="flex flex-col sm:flex-row gap-[16px] w-full">
                  <FormControl fullWidth>
                    <label className="font-normal text-normal leading-[20px] text-[14px] pb-[4px]">
                      First name
                    </label>
                    <Controller
                      name="firstName"
                      control={control}
                      rules={{ required: "First name is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          placeholder="Enter first name"
                          error={Boolean(errors.firstName)}
                          helperText={errors.firstName?.message}
                        />
                      )}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <label className="font-normal text-normal leading-[20px] text-[14px] pb-[4px]">
                      Last name
                    </label>
                    <Controller
                      name="lastName"
                      control={control}
                      rules={{ required: "Last name is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          placeholder="Enter last name"
                          error={Boolean(errors.lastName)}
                          helperText={errors.lastName?.message}
                        />
                      )}
                    />
                  </FormControl>
                </div>
                <div className="flex flex-col sm:flex-row gap-[16px] w-full">
                  <FormControl fullWidth>
                    <label className="font-normal text-normal leading-[20px] text-[14px] pb-[4px]">
                      Contact number
                    </label>
                    <Controller
                      name="contactNumber"
                      control={control}
                      rules={{
                        required: "Contact number is required",
                        validate: (value) =>
                          validatePhoneNumber(value) ||
                          "Please enter a valid phone number",
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          inputProps={<PhoneNumberInput />}
                          placeholder="Enter contact number"
                          error={Boolean(errors.contactNumber)}
                          helperText={errors.contactNumber?.message}
                        />
                      )}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <label className="font-normal text-normal leading-[20px] text-[14px] pb-[4px]">
                      Contact email
                    </label>
                    <Controller
                      name="contactEmail"
                      control={control}
                      rules={{
                        required: "Contact email is required",
                        validate: (value) =>
                          validateEmail(value) || "Please enter a valid email",
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          placeholder="Enter contact email"
                          error={Boolean(errors.contactEmail)}
                          helperText={errors.contactEmail?.message}
                        />
                      )}
                    />
                  </FormControl>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-[14px]">
              <Typography variant="h5">What is the primary purpose of your vendor account?</Typography>
              <Controller
                name="primaryPurpose"
                control={control}
                defaultValue={{
                  foodsDrops: false,
                  packagedGoods: false,
                  packagedMerchandise: false,
                  looseGoods: false,
                  courierDropOffs: false,
                  personalMail: false,
                  other: false,
                }}
                rules={{
                  validate: (value) =>
                    Object.values(value).some((v) => v === true) ||
                    "Please select at least one option",
                }}
                render={({ field }) => (
                  <div>
                    <FormGroup className="w-full relative">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value.foodsDrops || false}
                            onChange={(e) =>
                              field.onChange({
                                ...field.value,
                                foodsDrops: e.target.checked,
                              })
                            }
                          />
                        }
                        label="Food drops"
                      />
                    </FormGroup>

                    <FormGroup className="w-full relative">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value.packagedGoods || false}
                            onChange={(e) =>
                              field.onChange({
                                ...field.value,
                                packagedGoods: e.target.checked,
                              })
                            }
                          />
                        }
                        label="Packaged and enclosed consumable goods"
                      />
                    </FormGroup>

                    <FormGroup className="w-full relative">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value.packagedMerchandise || false}
                            onChange={(e) =>
                              field.onChange({
                                ...field.value,
                                packagedMerchandise: e.target.checked,
                              })
                            }
                          />
                        }
                        label="Packaged merchandise"
                      />
                    </FormGroup>

                    <FormGroup className="w-full relative">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value.looseGoods || false}
                            onChange={(e) =>
                              field.onChange({
                                ...field.value,
                                looseGoods: e.target.checked,
                              })
                            }
                          />
                        }
                        label="Loose goods"
                      />
                    </FormGroup>

                    <FormGroup className="w-full relative">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value.courierDropOffs || false}
                            onChange={(e) =>
                              field.onChange({
                                ...field.value,
                                courierDropOffs: e.target.checked,
                              })
                            }
                          />
                        }
                        label="Courier drop-offs"
                      />
                    </FormGroup>

                    <FormGroup className="w-full relative">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value.personalMail || false}
                            onChange={(e) =>
                              field.onChange({
                                ...field.value,
                                personalMail: e.target.checked,
                              })
                            }
                          />
                        }
                        label="Personal mail or deliveries"
                      />
                    </FormGroup>

                    <FormGroup
                      // onChange={handleOtherOptionChange}
                      className="w-full relative"
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value.otherPrimaryPurpose || false}
                            onChange={(e) =>
                              field.onChange({
                                ...field.value,
                                otherPrimaryPurpose: e.target.checked,
                              })
                            }
                          />
                        }
                        label="Other"
                      />
                    </FormGroup>

                    {/* {selectedOption === "Other" && (
                      <FormControl className="w-full sm:w-[464px] mt-1">
                        <TextareaAutosize
                          maxRows="10"
                          minRows="2"
                          className="border rounded-[8px] p-[16px] text-[14px] focus-visible:border-primary focus-visible:outline-none"
                          placeholder="Describe your other option"
                          value={otherText}
                          onChange={(e) => setOtherText(e.target.value)}
                        />
                      </FormControl>
                    )} */}

                    {errors.vendorPurpose && (
                      <span className="text-danger">
                        {errors.vendorPurpose.message}
                      </span>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="flex flex-col gap-[14px]">
              <Typography variant="h5">How do you sell your items currently? Check all that apply</Typography>
              <Controller
                name="sellMethod"
                control={control}
                defaultValue={{
                  storefront: false,
                  farmersMarkets: false,
                  mobileFoodTrucks: false,
                  onlineOrders: false,
                  other: false,
                }}
                rules={{
                  validate: (value) =>
                    Object.values(value).some((v) => v === true) ||
                    "Please select at least one option",
                }}
                render={({ field }) => (
                  <div>
                    <FormGroup className="w-full relative">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value.storefront || false}
                            onChange={(e) =>
                              field.onChange({
                                ...field.value,
                                storefront: e.target.checked,
                              })
                            }
                          />
                        }
                        label="Storefront"
                      />
                    </FormGroup>

                    <FormGroup className="w-full relative">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value.farmersMarkets || false}
                            onChange={(e) =>
                              field.onChange({
                                ...field.value,
                                farmersMarkets: e.target.checked,
                              })
                            }
                          />
                        }
                        label="Farmers markets or mobile popups"
                      />
                    </FormGroup>

                    <FormGroup className="w-full relative">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value.mobileFoodTrucks || false}
                            onChange={(e) =>
                              field.onChange({
                                ...field.value,
                                mobileFoodTrucks: e.target.checked,
                              })
                            }
                          />
                        }
                        label="Mobile food trucks"
                      />
                    </FormGroup>

                    <FormGroup className="w-full relative">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value.onlineOrders || false}
                            onChange={(e) =>
                              field.onChange({
                                ...field.value,
                                onlineOrders: e.target.checked,
                              })
                            }
                          />
                        }
                        label="Online orders"
                      />
                    </FormGroup>

                    <FormGroup className="w-full relative">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value.otherSellMethod || false}
                            onChange={(e) =>
                              field.onChange({
                                ...field.value,
                                otherSellMethod: e.target.checked,
                              })
                            }
                          />
                        }
                        label="Other"
                      />
                    </FormGroup>

                    {errors.sellingOptions && (
                      <span className="text-danger">
                        {errors.sellingOptions.message}
                      </span>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="flex flex-col gap-[14px]">
              <Typography variant="h5">For your online orders, check all that apply</Typography>
              <Controller
                name="onlineOrders"
                control={control}
                defaultValue={{
                  uberEats: false,
                  hotPlate: false,
                  facebookMarketplace: false,
                  offerUp: false,
                  craigslist: false,
                  socialMediaStorefront: false,
                  businessWebsite: false,
                  other: false,
                }}
                rules={{
                  validate: (value) =>
                    Object.values(value).some((v) => v === true) ||
                    "Please select at least one option",
                }}
                render={({ field }) => (
                  <div>
                    <FormGroup className="w-full relative">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value.uberEats || false}
                            onChange={(e) =>
                              field.onChange({
                                ...field.value,
                                uberEats: e.target.checked,
                              })
                            }
                          />
                        }
                        label="Uber Eats, Door Dash etc."
                      />
                    </FormGroup>

                    <FormGroup className="w-full relative">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value.hotPlate || false}
                            onChange={(e) =>
                              field.onChange({
                                ...field.value,
                                hotPlate: e.target.checked,
                              })
                            }
                          />
                        }
                        label="Hot Plate"
                      />
                    </FormGroup>

                    <FormGroup className="w-full relative">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value.facebookMarketplace || false}
                            onChange={(e) =>
                              field.onChange({
                                ...field.value,
                                facebookMarketplace: e.target.checked,
                              })
                            }
                          />
                        }
                        label="Facebook Marketplace"
                      />
                    </FormGroup>

                    <FormGroup className="w-full relative">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value.offerUp || false}
                            onChange={(e) =>
                              field.onChange({
                                ...field.value,
                                offerUp: e.target.checked,
                              })
                            }
                          />
                        }
                        label="OfferUp"
                      />
                    </FormGroup>

                    <FormGroup className="w-full relative">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value.craigslist || false}
                            onChange={(e) =>
                              field.onChange({
                                ...field.value,
                                craigslist: e.target.checked,
                              })
                            }
                          />
                        }
                        label="Craigslist or other listing ad sites"
                      />
                    </FormGroup>

                    <FormGroup className="w-full relative">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value.socialMediaStorefront || false}
                            onChange={(e) =>
                              field.onChange({
                                ...field.value,
                                socialMediaStorefront: e.target.checked,
                              })
                            }
                          />
                        }
                        label="Social Media storefront"
                      />
                    </FormGroup>

                    <FormGroup className="w-full relative">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value.businessWebsite || false}
                            onChange={(e) =>
                              field.onChange({
                                ...field.value,
                                businessWebsite: e.target.checked,
                              })
                            }
                          />
                        }
                        label="Business website"
                      />
                    </FormGroup>

                    <FormGroup className="w-full relative">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value.otherOnlineOrders || false}
                            onChange={(e) =>
                              field.onChange({
                                ...field.value,
                                otherOnlineOrders: e.target.checked,
                              })
                            }
                          />
                        }
                        label="Other"
                      />
                    </FormGroup>

                    {errors.onlineOrderOptions && (
                      <span className="text-danger">
                        {errors.onlineOrderOptions.message}
                      </span>
                    )}
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;
