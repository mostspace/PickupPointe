import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

// Constant
import { BASE_URL } from 'src/config-global';

// MUI
import {
  Grid,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  Typography,
  FormControl,
  Button,
  Dialog,
  TextField,
  Alert,
} from '@mui/material';
// Icons
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

// Asset
import { vendorRegisterLogo, vendorRegisterMap } from 'src/assets';
import { useForm, FormProvider } from 'react-hook-form';
import { successFormImg } from 'src/assets';

// Components
import PrimaryButton from 'src/components/button/primary-button';
import VendorRegisterModal from 'src/components/vendor-register-form';

const VendorRegister = () => {
  const navigate = useNavigate();
  const selectedRole = useSelector((state) => state.role.selectedRole);
  const [locations, setLocations] = useState({
    pickupLocation: false,
    ownLocation: false,
  });
  const [success, setSuccess] = useState(''); // Declare success state

  const handleButtonClick = (buttonId) => {
    setLocations((prevLocations) => ({
      ...prevLocations,
      [buttonId]: !prevLocations[buttonId],
    }));
  };

  const getLinkDestination = () => {
    if (locations.pickupLocation && locations.ownLocation) {
      return '/register/vendor-register/both-location';
    } else if (locations.pickupLocation) {
      return '/register/vendor-register/pickup-location';
    } else if (locations.ownLocation) {
      return '/register/vendor-register/own-location';
    } else {
      return '/register';
    }
  };

  const handleSetupButtonClick = () => {
    const destination = getLinkDestination();
    navigate(destination);
  };

  // Manage form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');

  // Handle input changes
  const handleInputChange = (prop) => (event) => {
    setFormData({ ...formData, [prop]: event.target.value });
  };

  // Modal
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
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
  const [confirmCode, setConfirmCode] = useState('');

  // Handle confirmation code input change
  const handleConfirmCodeChange = (e) => {
    setConfirmCode(e.target.value);
  };

  const [showAlert, setShowAlert] = useState(false);

  // Handle form validation
  const validationForm = () => {
    // Simple regex for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required.');
      return false;
    }

    // Validate email format
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return false;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }

    setError('');
    return true;
  };

  // Handle create new account button click
  const handleCreateFreeAccount = async () => {
    // Validate form input
    if (!validationForm()) {
      return;
    }

    try {
      let data={
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role:selectedRole
      }
      console.log('data',data)
      setLoading(true)
      // Send POST request to register the user
      const response = await axios.post(`${BASE_URL}/api/v1/vendor/quick-register`, data);

      // Open success dialog or navigate
      console.log('res',response);
      if(response) {
        setLoading(false)
        handleClickConfirmSuccessOpen();
      } // Assuming this is a function to show success message
    } catch (err) {
      // Log the error for debugging
      console.log('Registration error:', err,err.response);
        setLoading(false)

      if (err.response) {
        // Check for specific error responses from the server
        if (err.response.status === 401) {
          setError('Invalid email or password. Please try again.');
        } else if (err.response.data.message) {
          // Use specific error message from the server if available
          setError(err.response.data.message);
        } else {
          // Default error message for other cases
          setError('An unexpected error occurred. Please try again.');
        }
      } else {
        // Network or other non-server related errors
        setError('Network error. Please check your connection.');
      }
    }
  };

  const [loading, setLoading] = useState(false);

  const handleReSendCode = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post(`${BASE_URL}/api/v1/vendor/send-verification-code`, {
        email:formData.email,
      });
      setSuccess('A new confirmation code has been sent to your email.');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to resend confirmation code. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Function to verify the confirmation code
  const handleConfirmCodeVerification = async () => {
    try {
      // Send POST request to verify the confirmation code
      const response = await axios.post(BASE_URL + '/api/v1/vendor/verify', {
        email: formData.email,
        confirmCode: confirmCode,
      });

      if (response) {
        // If successful, redirect the user or show a success message
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          window.location.href = '/login';
        }, 1000);
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError('Invalid confirmation code. Please try again.');
    }
  };

  const onSubmit = () => {
    console.log(formData);
  };
  return (
    <>
      <section
        id='vendorRegister'
        className='bg-[#F6F6F6] min-h-[100vh] flex justify-center items-center sm:py-[32px] sm:px-[64px] px-[15px]'
      >
        <div className='max-w-[1312px] w-full h-full bg-white rounded-[24px] py-[48px] px-[15px] sm:p-[48px] relative'>
          <Link to='/register'>
            <IconButton className='absolute right-7 top-7 bg-secondary'>
              <CloseOutlinedIcon sx={{ color: '#181818', fontSize: '20px' }} />
            </IconButton>
          </Link>
          <Grid
            container
            direction='column'
            justifyContent='start'
            alignItems='center'
            className='h-full gap-[100px]'
          >
            <div className='w-full gap-[40px] flex flex-col items-center'>
              <h2 className='text-[32px] font-medium leading-[44px] text-heading text-center'>
                Become a merchant
              </h2>
              <div className='w-full sm:w-[624px]'>
                <p className='text-[20px] font-normal leading-[30px] text-heading mb-[18px] text-center sm:text-start'>
                  What locations would you like to use?
                </p>
                <div className='grid gap-[14px]'>
                  <div className='w-full'>
                    <FormGroup className='w-full relative'>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={locations.ownLocation}
                            sx={{
                              color: '#a7b1bc',
                              '&.Mui-checked': {
                                color: '#F14445',
                              },
                              '&.Mui-disabled': {
                                color: '#e5e7eb',
                              },
                            }}
                            onChange={() => handleButtonClick('ownLocation')}
                          />
                        }
                        label={<div className='ml-2'>Add my own locations</div>}
                        className={`border rounded-[12px] w-full py-[26px] px-[16px] z-[100] !mx-0 ${
                          locations.ownLocation
                            ? 'border-primary'
                            : 'border-[rgba(0, 0, 0, 0.08)]'
                        } duration-200`}
                      />
                      <img
                        loading="lazy"
                        src={vendorRegisterMap}
                        className={`absolute right-[5%] top-[29%] z-[1] ${locations.ownLocation ? 'svg-active' : ''}`}
                        alt='Vendor Register Map'
                      />
                    </FormGroup>
                  </div>
                  <div className='w-full'>
                    <FormGroup className='w-full relative'>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled
                            checked={locations.pickupLocation}
                            sx={{
                              color: 'rgba(0, 0, 0, 0.08)',
                              '&.Mui-checked': {
                                color: '#F14445',
                              },
                              '&.Mui-disabled': {
                                color: '#e5e7eb',
                              },
                            }}
                            onChange={() => handleButtonClick('pickupLocation')}
                          />
                        }
                        label={
                          <div className='ml-2'>
                            Pickup Pointe locations
                            <br />
                            <span className='text-sm text-gray-500'>
                              Coming soon
                            </span>
                          </div>
                        }
                        className={`border rounded-[12px] w-full py-[26px] px-[16px] z-[100] !mx-0 ${
                          locations.pickupLocation
                            ? 'border-primary'
                            : 'border-[rgba(0, 0, 0, 0.08)]'
                        } duration-200`}
                      />
                      <img
                        loading="lazy"
                        src={vendorRegisterLogo}
                        className={`absolute right-[5%] top-[35%] z-[1] ${locations.pickupLocation ? 'svg-active' : ''}`}
                        alt='Vendor Register Logo'
                      />
                    </FormGroup>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex items-end gap-[32px]'>
              <Typography
                variant='subtitle1'
                gutterBottom
                sx={{ display: 'block' }}
                className='cursor-pointer underline hover:text-primary transition duration-300 ease-in-out'
                onClick={handleClickOpen}
              >
                Skip for now
              </Typography>
              <PrimaryButton
                value={'Set up my first location'}
                weight={400}
                bg={'rgba(241, 68, 69, 1)'}
                color={'#fff'}
                btnStatus={!locations.ownLocation}
                click={() => handleSetupButtonClick()}
              />
            </div>
          </Grid>
        </div>
      </section>
      <VendorRegisterModal
        open={open}
        handleClose={handleClose}
        handleCreateFreeAccount={handleCreateFreeAccount}
        formData={formData}
        handleInputChange={handleInputChange}
        error={error}
        loading={loading}
      />
      {/* Create free account Modal */}
      {/* <React.Fragment>
        <Dialog
          className='w-full'
          open={open}
          onClose={handleClose}
          scroll='paper'
          sx={{
            width: '100% !important',
          }}
        >
          <DialogTitle className='pt-[32px] sm:!pt-[64px] flex flex-col gap-[6px] items-center sm:px-[88px]'>
            <h1 className='text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center'>
              Finish creating your free vendor account
            </h1>
            <p className='text-normal font-light leading-[25px] text-[16px] text-center sm:px-16'>
              After creating your account, you will need to submit your profile
              for final approval before going live.
            </p>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id='scroll-dialog-description' tabIndex={-1}>
              <div
                className='flex flex-col gap-[14px] font-gilroy sm:px-[60px] py-[16px]'
                id='createVendorAccount'
              >
                <FormControl variant='standard'>
                  <label className='font-normal text-normal leading-[20px] text-[14px] pb-[4px]'>
                    Email address
                  </label>
                  <TextField
                    name='email'
                    size='small'
                    variant='outlined'
                    required
                    fullWidth
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    placeholder='ryan@mybusiness.com'
                  />
                    {emailError && (
                        <p className='text-red-500 text-[14px]'>
                          Invalid Email Format
                        </p>
                      )}
                </FormControl>
                <FormControl variant='outlined' className='relative'>
                  <label className='font-normal text-normal leading-[20px] text-[14px] pb-[4px]'>
                    Password
                  </label>
                  <TextField
                    size='small'
                    variant='outlined'
                    name='password'
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    placeholder='Enter password'
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            onMouseDown={(event) => event.preventDefault()}
                            edge='end'
                          >
                            {showPassword ? (
                              <Iconify icon='solar:eye-bold' width={24} />
                            ) : (
                              <Iconify
                                icon='solar:eye-closed-bold'
                                width={24}
                              />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                    {passwordError && (
                  <div>
                    {passwordError.map((error, index) => (
                      <p key={index} className="text-red-500 text-[14px] mt-1">
                       • Password should have {error}
                      </p>
                    ))}
                  </div>
                )}
                </FormControl>
                <FormControl variant='outlined' className='relative'>
                  <label className='font-normal text-normal leading-[20px] text-[14px] pb-[4px]'>
                    Confirm Password
                  </label>
                  <TextField
                    size='small'
                    variant='outlined'
                    name='confirm_password'
                    fullWidth
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange('confirmPassword')}
                    placeholder='Confirm password'
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            onMouseDown={(event) => event.preventDefault()}
                            edge='end'
                          >
                            {showConfirmPassword ? (
                              <Iconify icon='solar:eye-bold' width={24} />
                            ) : (
                              <Iconify
                                icon='solar:eye-closed-bold'
                                width={24}
                              />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
                <p className='text-primary text-[16px] text-center'>{error}</p>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions className='!px-[22px] !pb-[32px] sm:!pb-[64px] sm:!px-[80px] !gap-[14px]'>
            <Button
              sx={{
                width: '100%',
                height: '44px',
                fontFamily: 'Gilroy',
                fontSize: '14px',
                color: '#181818',
                borderRadius: '8px',
                backgroundColor: '#F5F5F5',
                textTransform: 'unset',
              }}
              onClick={handleClose}
            >
              Back to details
            </Button>
            <Button
              className='w-full'
              disabled={!isFormValid()}
              sx={{
                width: '100%',
                height: '44px',
                fontFamily: 'Gilroy',
                fontSize: '14px',
                color: isFormValid() ? '#ffffff' : '#181818', // Change text color if needed
                borderRadius: '8px',
                backgroundColor: isFormValid() ? '#F14445' : '#F5F5F5', // Change background color
                textTransform: 'unset',
                '&:hover': {
                  backgroundColor: isFormValid() ? '#E13031' : '#F5F5F5', // Change hover background color
                },
              }}
              onClick={methods.handleSubmit(handleCreateFreeAccount)}
            >
              Create free account
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment> */}

      {/* Confirm Code */}
      <React.Fragment>
        <Dialog open={openSuccessForm} onClose={handleSuccessFormClose}>
          <div className='flex flex-col gap-[40px] px-[25px] py-[40px] sm:px-[88px] sm:px-[64px]'>
            {showAlert && (
              <Alert variant='outlined' severity='success'>
                Congratulations! Your account is verified. Redirecting...
              </Alert>
            )}
            <div className='flex flex-col gap-[6px] items-center'>
              <img src={successFormImg} className='w-[30%]' loading="lazy" />
              <h1 className='text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center'>
                Congratulations! Your account was created successfully.
              </h1>
              <p className='text-normal font-light leading-[25px] text-[16px] text-center'>
                We have sent you a confirmation code to your email address
              </p>
            </div>
            <div className='flex flex-col gap-[14px]'>
              <FormControl variant='standard' className=''>
                <label className='font-normal text-normal leading-[20px] text-[14px] pb-[4px]'>
                  Confirmation code
                </label>
                <TextField
                  size='small'
                  variant='outlined'
                  required
                  fullWidth
                  onChange={handleConfirmCodeChange}
                  value={confirmCode}
                  placeholder='Paste confirmation code here'
                />
              </FormControl>
              <p className='text-[14px] font-normal leading-[23px] text-[#666] mt-[16px]'>
                Didn't receive the code? Check your spam or resend a new code.
              </p>
              <p className='text-primary text-[16px] text-center'>{error}</p>
              {success && <p className='text-green-500'>{success}</p>}
            </div>
            <div className='flex justify-between items-center gap-[14px]'>
              <Button
                sx={{
                  width: '100%',
                  height: '44px',
                  fontFamily: 'Gilroy',
                  fontSize: '14px',
                  color: '#181818',
                  borderRadius: '8px',
                  backgroundColor: '#F5F5F5',
                  textTransform: 'unset',
                }}
                onClick={handleReSendCode}
              >
                Resend code
              </Button>
              <Button
                disabled={loading || !confirmCode}
                sx={{
                  width: '100%',
                  height: '44px',
                  fontFamily: 'Gilroy',
                  fontSize: '14px',
                  color: confirmCode ? '#ffffff' : '#181818', // Change text color if needed
                  borderRadius: '8px',
                  backgroundColor: confirmCode ? '#F14445' : '#F5F5F5', // Change background color
                  textTransform: 'unset',
                  '&:hover': {
                    backgroundColor: confirmCode ? '#E13031' : '#F5F5F5', // Change hover background color
                  },
                }}
                onClick={handleConfirmCodeVerification}
              >
                {loading ? 'Confirming...' : 'Confirm'}
              </Button>
            </div>
          </div>
        </Dialog>
      </React.Fragment>
    </>
  );
};

export default VendorRegister;
