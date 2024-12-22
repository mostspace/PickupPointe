import React, { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// @mui
import {
  FormControl, TextField, IconButton, InputAdornment, Typography, Grid, Box, Stack,
} from '@mui/material';

// Components
import Button from 'src/components/button/primary-button';
import Iconify from 'src/components/iconify';
import PhoneNumberInput from "src/components/phonenumber";
// Asset
import { shopperRegisterImg } from 'src/assets';

// Constants
import { BASE_URL } from 'src/config-global';
import { validateEmail, validatePassword } from 'src/utils/utilityFunctions';

// -------------------------------------------------------------------------------------------------------

const ShopperRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({
    firstName: '',
    lastName: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear specific field error on change
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  useEffect(() => {
    if (!validateEmail(formData.email) && formData.email != '') {
      setEmailError(true);
      return;
    } else {
      setEmailError(false);
    }
  }, [formData.email]);

  useEffect(() => {
    if (formData.password != '') {
      let res = validatePassword(formData.password);
      if (!res.isValid) {
        setPasswordError(res.missing);
      } else {
        setPasswordError(null);
      }
      return;
    } else {
      setPasswordError(null);
    }
  }, [formData.password]);

  // Handle toggle password
  const [passwordValue, setValues] = useState({
    password: '',
    showPassword: false,
  });

  const handleShowPassword = useCallback(() => {
    setValues({ ...passwordValue, showPassword: !passwordValue.showPassword });
  }, [passwordValue]);

  const handleMouseDownPassword = useCallback((event) => {
    event.preventDefault();
  }, []);

  // Handle Confirm Password
  const [confirmValues, setConfirmValues] = useState({
    password: '',
    showPassword: false,
  });

  const handleShowConfirmPassword = useCallback(() => {
    setConfirmValues({
      ...confirmValues,
      showPassword: !confirmValues.showPassword,
    });
  }, [confirmValues]);

  const handleMouseDownConfirmPassword = useCallback((event) => {
    event.preventDefault();
  }, []);

  // Handle Register
  const handleRegister = async () => {
    // Simple form validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(`Passwords don't match`);
      return;
    } else {
      setError('');
    }

    if (emailError || passwordError) {
      return;
    }

    try {
      // Example API call using Axios
      const response = await axios.post(`${BASE_URL}/api/v1/shopper/register`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber
      });

      // Handle success
      if (response.status === 200 || response.status === 201) {
        localStorage.setItem('shopperEmail', formData.email);
        navigate('/account-confirm');
      }
    } catch (error) {
      // Handle error
      setError(error.response.data.message || 'Registration failed');
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    // Set field-specific errors on blur
    if (name === 'firstName' && value.trim() === '') {
      setFieldErrors((prevErrors) => ({
        ...prevErrors,
        firstName: 'First name required',
      }));
    }

    if (name === 'lastName' && value.trim() === '') {
      setFieldErrors((prevErrors) => ({
        ...prevErrors,
        lastName: 'Last name required',
      }));
    }
  };

  // // Handle Location Phone Number Validations
  // const handlePhoneNumChange = (event) => {
  //   const { value } = event.target;
  //   setValue("locationPhoneNumber", value, { shouldValidate: true });

  //   if (value.length < 5) {
  //     setError("locationPhoneNumber", {
  //       type: "manual",
  //       message: "location Phone Number name must be at least 5 characters",
  //     });
  //   } else {
  //     clearErrors("locationPhoneNumber");
  //   }
  // };

  return (
    <>
      <section className='w-full flex justify-center items-center min-h-[100vh] bg-[#F6F6F6] p-[15px] sm:p-[32px]'>
        <Box className='bg-white p-[15px] sm:p-[48px] rounded-[24px] max-w-[1312px]'>
          <Grid container spacing={{xs: 2, sm: 4, md: 6}} direction='row' alignItems='center'>
            <Grid item md={6} lg={6} xs={12}>
              <div className='w-full sm:h-full flex justify-center items-center h-[250px] rounded-[18px] overflow-hidden'>
                <img src={shopperRegisterImg} className='w-full object-contain' loading="lazy"/>
              </div>
            </Grid>
            <Grid item md={6} lg={6} xs={12}>
              <div className='w-full bg-[#fbfbfc] rounded-[24px] flex flex-col gap-[24px] sm:gap-[40px] p-[15px] lg:p-[64px]'>
                <Stack direction="column" spacing={1}>
                  <Typography variant='h2'>Join as a Shopper</Typography>
                  <Typography variant='subtitle1' className='text-normal'>Sign up now to find and support local merchants with the tastiest dishes and best quality products right in your backyard.</Typography>
                </Stack>
                <div className='grid gap-[14px]'>
                  <div className='flex justify-between items-start gap-[14px]'>
                    <FormControl variant='standard' className='w-full'>
                      <label className='font-normal text-normal leading-[20px] text-[14px] pb-[4px]'>
                        First name
                      </label>
                      <TextField
                        variant='outlined'
                        size='small'
                        required
                        fullWidth
                        placeholder='Enter first name'
                        name='firstName'
                        value={formData.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {fieldErrors.firstName && (
                        <p className='text-red-500 text-[14px]'>
                          {fieldErrors.firstName}
                        </p>
                      )}
                    </FormControl>
                    <FormControl variant='standard' className='w-full'>
                      <label className='font-normal text-normal leading-[20px] text-[14px] pb-[4px]'>
                        Last name
                      </label>
                      <TextField
                        variant='outlined'
                        size='small'
                        required
                        fullWidth
                        placeholder='Enter last name'
                        name='lastName'
                        value={formData.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {fieldErrors.lastName && (
                        <p className='text-red-500 text-[14px]'>
                          {fieldErrors.lastName}
                        </p>
                      )}
                    </FormControl>
                  </div>
                  <FormControl variant='standard' className='w-full'>
                    <label className='font-normal text-normal leading-[20px] text-[14px] pb-[4px]'>
                      Email address
                    </label>
                    <TextField
                      variant='outlined'
                      size='small'
                      required
                      fullWidth
                      placeholder='Enter your email'
                      name='email'
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {emailError && (
                      <p className='text-red-500 text-[14px]'>
                        Invalid Email Format
                      </p>
                    )}
                  </FormControl>
                  <FormControl variant='standard' className='w-full'>
                    <label className='font-normal text-normal leading-[20px] text-[14px] pb-[4px]'>
                      Phone number
                    </label>
                    <TextField
                      name='phoneNumber'
                      InputProps={{
                        inputComponent: PhoneNumberInput,
                      }}
                      size="small"
                      variant="outlined"
                      required
                      fullWidth
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      // {...register("phoneNumber", {
                      //   required: "Location Phone Number is required",
                      // })}
                      // error={Boolean(errors.phoneNumber)}
                      // helperText={errors.phoneNumber ? errors.phoneNumber.message : ""}
                      // FormHelperTextProps={{
                      //   style: { marginLeft: 0 }, // Remove left margin
                      // }}
                      // onChange={handlePhoneNumChange}
                    />
                  </FormControl>
                  <FormControl variant='outlined' className='w-full'>
                    <label className='font-normal text-normal leading-[20px] text-[14px] pb-[4px]'>
                      Password
                    </label>
                    <TextField
                      variant='outlined'
                      size='small'
                      fullWidth
                      type={passwordValue.showPassword ? 'text' : 'password'}
                      placeholder='Enter password'
                      name='password'
                      value={formData.password}
                      onChange={handleChange}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              onClick={handleShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge='end'
                            >
                              {passwordValue.showPassword ? (
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
                          <p
                            key={index}
                            className='text-red-500 text-[14px] mt-1'
                          >
                            • Password should have {error}
                          </p>
                        ))}
                      </div>
                    )}
                  </FormControl>
                  <FormControl variant='outlined' className='w-full'>
                    <label className='font-normal text-normal leading-[20px] text-[14px] pb-[4px]'>
                      Confirm password
                    </label>
                    <TextField
                      variant='outlined'
                      size='small'
                      fullWidth
                      type={confirmValues.showPassword ? 'text' : 'password'}
                      placeholder='Confirm password'
                      name='confirmPassword'
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              onClick={handleShowConfirmPassword}
                              onMouseDown={handleMouseDownConfirmPassword}
                              edge='end'
                            >
                              {confirmValues.showPassword ? (
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
                  <p className='font-normal text-[14px] leading-[20px] text-normal pt-[16px]'>
                    Already have an account?{' '}
                    <Link to='/login' className='text-heading underline hover:text-primary'>
                      Sign In
                    </Link>
                  </p>
                  {error && <p className='text-red-500 text-sm'>{error}</p>}{' '}
                </div>
                <div className='flex justify-between items-center gap-[14px]'>
                  <Button
                    click={() => navigate('/')}
                    className='w-full'
                    value={'Cancel'}
                    bg={'rgba(245, 245, 245, 1)'}
                    size={'100%'}
                    color={'rgba(24, 24, 24, 1)'}
                  />
                  <Button
                    click={handleRegister}
                    className='w-full'
                    value={'Sign Up'}
                    size={'100%'}
                    bg={'rgba(241, 68, 69, 1)'}
                    color={'rgba(254, 254, 255, 1)'}
                  />
                </div>
              </div>
            </Grid>
          </Grid>
        </Box>
      </section>
    </>
  );
};

export default ShopperRegister;