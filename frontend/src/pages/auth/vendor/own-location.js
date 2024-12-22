import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
// Constant
import { BASE_URL } from "src/config-global";
// @MUI
import {
  Stepper,
  Step,
  StepLabel,
  FormControl,
  Button,
  Box,
  IconButton,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Alert,
} from "@mui/material";
// Components
import Iconify from "src/components/iconify";
import ContactDetails from "src/sections/auth/vendor/contact-details";
// Icons
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
// Asset
import { successFormImg } from "src/assets";

import MyPickupLocation from "src/sections/auth/vendor/my-pickup-location";
import ButtonLoader from "src/components/button-loader/ButtonLoader";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const steps = ["My own location", "Contact details"];

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const OwnLocationRegister = () => {
  const navigate = useNavigate();
  //   Loading State for Register Function
  const [registerLoading, setRegisterLoading] = useState(false);

  //   Role
  const selectedRole = useSelector((state) => state.role.selectedRole);

  console.log(selectedRole);

  const methods = useForm({
    defaultValues: {
      locationPrivate: false,
    },
  });

  //   Reset Form State
  const { reset } = methods;

  // Manage form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Modal
  const [open, setOpen] = React.useState(false);

  // Stepper
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());

  //   Error Message

  const [error, setError] = useState("");


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
  
  const onSubmit = async (data) => {
    setRegisterLoading(true);

    // Parse the address string into the expected format
  const parsedAddress = parseAddress(data.address);
  
  if (!parsedAddress) {
    setError("Invalid address format.");
    setRegisterLoading(false);
    return;
  }



    const vendorInfo = {
      email: formData.email,
      password: formData.password,
      firstName: data.firstName,
      lastName: data.lastName,
      contactNumber: data.contactNumber,
      contactEmail: data.contactEmail,
      role: selectedRole,
      location: {
        name: data.locationName,
        address: parsedAddress,
        contact: {
          phoneNumber: data.phoneNumber,
          firstName: data.locationContactFirstName,
          lastName: data.locationContactLastName,
        },
        pickup: {
          days: data.pickupDays,
          from: data.pickupFrom,
          to: data.pickupTo,
        },
        delivery: {
          doorToDoor: {
            use: data.deliveryOptionsCourier,
            maxDistance: parseInt(data.maxDistance, 10),
          },
          postMail: data.deliveryOptionsPost,
          days: data.deliveryDays,
          from: data.deliveryFrom,
          to: data.deliveryTo,
        },
        isPrivate: data.locationPrivate,
      },
      entityDetail: {
        name: data.name,
        entity: data.entity,
        website: data.website,
        supportNumber: data.supportNumber,
        supportEmail: data.supportEmail,
        countryCode: data.country,
        city: data.city,
        state: data.state,
        street: data.street,
        zipCode: data.zipCode,
      },
      selection: {
        primaryPurpose: {
          foodsDrops: data.primaryPurpose.foodsDrops,
          packagedGoods: data.primaryPurpose.packagedGoods,
          packagedMerchandise: data.primaryPurpose.packagedMerchandise,
          looseGoods: data.primaryPurpose.looseGoods,
          courierDropOffs: data.primaryPurpose.courierDropOffs,
          personalMail: data.primaryPurpose.personalMail,
          other: data.primaryPurpose.otherPrimaryPurpose,
        },
        sellMethod: {
          storeFront: data.sellMethod.storeFront,
          marketOrPopups: data.sellMethod.marketOrPopups,
          foodTrucks: data.sellMethod.foodTrucks,
          onlineOrders: data.sellMethod.onlineOrders,
          other: data.sellMethod.otherSellMethod,
        },
        onlineOrders: {
          uberOrDoorDash: data.onlineOrders.uberOrDoorDash,
          hotPlate: data.onlineOrders.hotPlate,
          facebook: data.onlineOrders.facebook,
          offerUp: data.onlineOrders.offerUp,
          adSites: data.onlineOrders.adSites,
          businessWebsite: data.onlineOrders.businessWebsite,
          other: data.onlineOrders.otherOnlineOrders,
        },
      },
    };

    // try {
    //   // Send POST request to verify the confirmation code
    //   const response = await axios.post(
    //     BASE_URL + "/api/v1/vendor/register",
    //     vendorInfo
    //   ); // Removed nesting

    //   if (response) {
    //     // Handle success response
    //     setShowAlert(true);
    //     setOpen(false);
    //     setActiveStep(0);
    //     reset();
    //     toast("Registration successful", {
    //       theme: "light",
    //       style: {
    //         backgroundColor: "white",
    //         color: "primary",
    //       },
    //     });
    //     // setTimeout(() => {
    //     //   window.location.href = "/login";
    //     // }, 1000);
    //   }
    // } catch (err) {
    //   // Extract relevant error information
    //   const errorMessage =
    //     err.response?.data?.message || err.message || "An error occurred";

    //   // Set the extracted error message
    //   setError(errorMessage);

    //   // Optionally display a toast or alert with the error
    //   toast(errorMessage, {
    //     style: {
    //       backgroundColor: "red",
    //       color: "white",
    //     },
    //   });
    // } finally {
    //   setRegisterLoading(false);
    // }
    console.log(data)
  };

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = async () => {
    const isValid = await methods.trigger();

    if (isValid) {
      let newSkipped = skipped;
      if (isStepSkipped(activeStep)) {
        newSkipped = new Set(newSkipped.values());
        newSkipped.delete(activeStep);
      }

      // Move to the next step and reset validation
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Handle input changes
  const handleInputChange = (prop) => (event) => {
    setFormData({ ...formData, [prop]: event.target.value });
  };

  const handleClickOpen = async () => {
    const isValid = await methods.trigger();
    if (!isValid) {
      return;
    } else {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Success Modal
  const [openSuccessForm, setOpenSuccessForm] = React.useState(false);

  const handleClickConfirmSuccessOpen = () => {
    handleClose();
    setOpenSuccessForm(true);
  };

  const handleSuccessFormClose = () => {
    setOpenSuccessForm(false);
  };

  // State to track the user ID and confirmation code
  const [confirmCode, setConfirmCode] = useState("");

  // Handle confirmation code input change
  const handleConfirmCodeChange = (e) => {
    setConfirmCode(e.target.value);
  };

  const [showAlert, setShowAlert] = useState(false);

  // Function to verify the confirmation code
  const handleConfirmCodeVerification = async () => {
    try {
      // Send POST request to verify the confirmation code
      const response = await axios.post(BASE_URL + "/api/v1/vendor/verify", {
        email: formData.email,
        confirmCode: confirmCode,
      });

      if (response) {
        // If successful, redirect the user or show a success message
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          window.location.href = "/login";
        }, 1000);
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError("Invalid confirmation code. Please try again.");
    }
  };

  // Toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Check if form is valid
  const isFormValid = () => {
    return (
      formData.email &&
      formData.password &&
      formData.confirmPassword &&
      formData.password === formData.confirmPassword &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) // Ensure email is valid
    );
  };

  // Handle form validation
  const validationForm = () => {
    // Simple regex for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required.");
      return false;
    }

    // Validate email format
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    setError("");
    return true;
  };

  // Form submission handler
  const handleCreateFreeAccount = async (e) => {
    e.preventDefault();

    // Validate form input
    if (!validationForm()) {
      return;
    }

    try {
      // Send POST request to register the user
      const response = await axios.post(`${BASE_URL}/api/v1/vendor/register`, {
        email: formData.email,
        password: formData.password,
      });

      // Open success dialog or navigate
      handleClickConfirmSuccessOpen(); // Assuming this is a function to show success message
    } catch (err) {
      // Log the error for debugging
      console.error("Registration error:", err);

      if (err.response) {
        // Check for specific error responses from the server
        if (err.response.status === 401) {
          setError("Invalid email or password. Please try again.");
        } else if (err.response.data && err.response.data.error) {
          // Use specific error message from the server if available
          setError(err.response.data.error);
        } else {
          // Default error message for other cases
          setError("An unexpected error occurred. Please try again.");
        }
      } else {
        // Network or other non-server related errors
        setError("Network error. Please check your connection.");
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <section className="bg-[#F6F6F6] min-h-[100vh] flex justify-center items-center sm:py-[32px] sm:px-[64px]">
          <div className="max-w-[1312px] w-full h-full bg-white rounded-[24px] py-[48px] px-[15px] sm:p-[48px] relative">
            <Link to="/register">
              <IconButton className="absolute right-7 top-7 bg-secondary">
                <CloseOutlinedIcon
                  sx={{ color: "#181818", fontSize: "20px" }}
                />
              </IconButton>
            </Link>
            <div className="flex flex-col gap-[40px]">
              <div className="w-full gap-[40px] flex flex-col items-center">
                <h2 className="text-[32px] font-medium leading-[44px] text-heading text-center">
                  Become a merchant
                </h2>
                <div className="w-full sm:w-[624px]">
                  <Box sx={{ width: "100%" }}>
                    <Stepper activeStep={activeStep} className="mb-[40px]">
                      {steps.map((label, index) => {
                        const stepProps = {};
                        const labelProps = {};
                        if (isStepSkipped(index)) {
                          stepProps.completed = false;
                        }
                        return (
                          <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                          </Step>
                        );
                      })}
                    </Stepper>
                    {activeStep === steps.length ? (
                      <h5 className="text-[20px] font-normal text-heading leading-[30px]">
                        Finish
                      </h5>
                    ) : (
                      <React.Fragment>
                        <React.Fragment>
                          <div className="grid gap-[14px]">
                            {activeStep === 0 && (
                              <MyPickupLocation methods={methods} />
                            )}
                            {activeStep === 1 && (
                              <ContactDetails methods={methods} />
                            )}
                          </div>
                        </React.Fragment>
                      </React.Fragment>
                    )}
                  </Box>
                </div>
              </div>
              <div className="flex gap-[14px] justify-center">
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{
                      mr: 1,
                      padding: "8px 40px",
                      height: "44px",
                      fontFamily: "Gilroy",
                      fontSize: "14px",
                      color: "#181818",
                      borderRadius: "8px",
                      backgroundColor: "#F5F5F5",
                      textTransform: "unset",
                    }}
                  >
                    Back
                  </Button>
                  <Box sx={{ flex: "1 1 auto" }} />

                  <Button
                    onClick={
                      activeStep === steps.length - 1
                        ? handleClickOpen
                        : handleNext
                    }
                    sx={{
                      mr: 1,
                      padding: "8px 40px",
                      height: "44px",
                      fontFamily: "Gilroy",
                      fontSize: "14px",
                      color: "#181818",
                      borderRadius: "8px",
                      backgroundColor: "#F5F5F5",
                      textTransform: "unset",
                    }}
                  >
                    {activeStep === steps.length - 1 ? "Finish" : "Continue"}
                  </Button>
                </Box>
              </div>
            </div>
          </div>
        </section>

        {/* Create free account Modal */}
        <React.Fragment>
          <Dialog
            className="w-full"
            open={open}
            onClose={handleClose}
            scroll="paper"
            sx={{
              width: "100% !important",
            }}
          >
            <DialogTitle className="pt-[32px] sm:!pt-[64px] flex flex-col gap-[6px] items-center sm:px-[88px]">
              <h1 className="text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center">
                Finish creating your free merchant account
              </h1>
              <p className="text-normal font-light leading-[25px] text-[16px] text-center sm:px-16">
                After creating your account, you will need to submit your
                profile for final approval before going live.
              </p>
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
                <div
                  className="flex flex-col gap-[14px] font-gilroy sm:px-[60px] py-[16px]"
                  id="createVendorAccount"
                >
                  <FormControl variant="standard">
                    <label className="font-normal text-normal leading-[20px] text-[14px] pb-[4px]">
                      Email address
                    </label>
                    <TextField
                      name="email"
                      size="small"
                      variant="outlined"
                      required
                      fullWidth
                      value={formData.email}
                      onChange={handleInputChange("email")}
                      placeholder="ryan@mybusiness.com"
                    />
                  </FormControl>
                  <FormControl variant="outlined" className="relative">
                    <label className="font-normal text-normal leading-[20px] text-[14px] pb-[4px]">
                      Password
                    </label>
                    <TextField
                      size="small"
                      variant="outlined"
                      name="password"
                      fullWidth
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange("password")}
                      placeholder="Enter password"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              onMouseDown={(event) => event.preventDefault()}
                              edge="end"
                            >
                              {showPassword ? (
                                <Iconify icon="solar:eye-bold" width={24} />
                              ) : (
                                <Iconify
                                  icon="solar:eye-closed-bold"
                                  width={24}
                                />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </FormControl>
                  <FormControl variant="outlined" className="relative">
                    <label className="font-normal text-normal leading-[20px] text-[14px] pb-[4px]">
                      Confirm Password
                    </label>
                    <TextField
                      size="small"
                      variant="outlined"
                      name="confirm_password"
                      fullWidth
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleInputChange("confirmPassword")}
                      placeholder="Confirm password"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              onMouseDown={(event) => event.preventDefault()}
                              edge="end"
                            >
                              {showConfirmPassword ? (
                                <Iconify icon="solar:eye-bold" width={24} />
                              ) : (
                                <Iconify
                                  icon="solar:eye-closed-bold"
                                  width={24}
                                />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </FormControl>
                  <p className="text-primary text-[16px] text-center">
                    {error}
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
                onClick={handleClose}
              >
                Back to details
              </Button>
              {registerLoading ? (
                <Button
                  className="w-full"
                  sx={{
                    width: "100%",
                    height: "44px",
                    fontSize: "14px",
                    borderRadius: "8px",
                    border: "1px solid red",
                    backgroundColor: "transparent", // Change background color
                  }}
                >
                  <ButtonLoader />
                </Button>
              ) : (
                <Button
                  className="w-full"
                  disabled={!isFormValid()}
                  sx={{
                    width: "100%",
                    height: "44px",
                    fontFamily: "Gilroy",
                    fontSize: "14px",
                    color: isFormValid() ? "#ffffff" : "#181818", // Change text color if needed
                    borderRadius: "8px",
                    backgroundColor: isFormValid() ? "#F14445" : "#F5F5F5", // Change background color
                    textTransform: "unset",
                    "&:hover": {
                      backgroundColor: isFormValid() ? "#E13031" : "#F5F5F5", // Change hover background color
                    },
                  }}
                  onClick={methods.handleSubmit(onSubmit)}
                >
                  Create free account
                </Button>
              )}
            </DialogActions>
          </Dialog>
        </React.Fragment>

        {/* Confirm Code */}
        <React.Fragment>
          <Dialog open={openSuccessForm} onClose={handleSuccessFormClose}>
            <div className="flex flex-col gap-[40px] px-[25px] py-[40px] sm:px-[88px] sm:px-[64px]">
              {showAlert && (
                <Alert variant="outlined" severity="success">
                  Congratulations! Your account is verified. Redirecting...
                </Alert>
              )}
              <div className="flex flex-col gap-[6px] items-center">
                <img src={successFormImg} className="w-[30%]" loading="lazy"/>
                <h1 className="text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center">
                  Congratulations! Your account was created successfully.
                </h1>
                <p className="text-normal font-light leading-[25px] text-[16px] text-center">
                  We have sent you a confirmation code to your email address
                </p>
              </div>
              <div className="flex flex-col gap-[14px]">
                <FormControl variant="standard" className="">
                  <label className="font-normal text-normal leading-[20px] text-[14px] pb-[4px]">
                    Confirmation code
                  </label>
                  <TextField
                    size="small"
                    variant="outlined"
                    required
                    fullWidth
                    onChange={handleConfirmCodeChange}
                    value={confirmCode}
                    placeholder="Paste confirmation code here"
                  />
                </FormControl>
                <p className="text-[14px] font-normal leading-[23px] text-[#666] mt-[16px]">
                  Didn't receive the code? Check your spam or resend a new code.
                </p>
                <p className="text-primary text-[16px] text-center">{error}</p>
              </div>
              <div className="flex justify-between items-center gap-[14px]">
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
                  onClick={handleSuccessFormClose}
                >
                  Resend code
                </Button>
                <Button
                  disabled={!confirmCode}
                  sx={{
                    width: "100%",
                    height: "44px",
                    fontFamily: "Gilroy",
                    fontSize: "14px",
                    color: confirmCode ? "#ffffff" : "#181818", // Change text color if needed
                    borderRadius: "8px",
                    backgroundColor: confirmCode ? "#F14445" : "#F5F5F5", // Change background color
                    textTransform: "unset",
                    "&:hover": {
                      backgroundColor: confirmCode ? "#E13031" : "#F5F5F5", // Change hover background color
                    },
                  }}
                  onClick={handleConfirmCodeVerification}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </Dialog>
        </React.Fragment>
      </form>
    </FormProvider>
  );
};

export default OwnLocationRegister;
