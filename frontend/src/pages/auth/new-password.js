import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { newPasswordImg } from 'src/assets';
import {
  FormControl,
  Button,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import axios from 'axios';
import { BASE_URL } from 'src/config-global';
import { validateEmail, validatePassword } from 'src/utils/utilityFunctions';

const NewPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {}; // Retrieve the email from state
  const [pwdValues, setValues] = useState({
    password: '',
    showPassword: false,
  });
  const [confirmValues, setConfirmValues] = useState({
    password: '',
    showPassword: false,
  });
  const [error, setError] = useState(''); // Declare error state
  const [success, setSuccess] = useState(''); // Declare success state
  const [passwordError, setPasswordError] = useState(null);

  const handlePwdChange = (prop) => (event) => {
    setValues({ ...pwdValues, [prop]: event.target.value });
    if (error) setError(''); // Clear error on input change
  };

  const handleShowPassword = useCallback(() => {
    setValues((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  }, []);

  const handleMouseDownPassword = useCallback((event) => {
    event.preventDefault();
  }, []);

  const handleConfirmPwdChange = (prop) => (event) => {
    setConfirmValues({ ...confirmValues, [prop]: event.target.value });
    if (error) setError(''); // Clear error on input change
  };

  const handleShowConfirmPassword = useCallback(() => {
    setConfirmValues((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  }, []);

  const handleMouseDownConfirmPassword = useCallback((event) => {
    event.preventDefault();
  }, []);

  useEffect(() => {
    if (pwdValues.password != '') {
      let res = validatePassword(pwdValues.password);
      if (!res.isValid) {
        setPasswordError(res.missing);
      } else {
        setPasswordError(null);
      }
      return;
    } else {
      setPasswordError(null);
    }
  }, [pwdValues.password]);

  const handleSavePassword = async () => {
    if (pwdValues.password !== confirmValues.password) {
      setError(`Passwords don't match`);
      return;
    }

    if (passwordError) {
      return;
    }

    try {
      await axios.post(`${BASE_URL}/api/v1/shopper/create-new-password`, {
        password: pwdValues.password,
        email: email, // Send email along with the new password
      });
      setSuccess('Password saved successfully!'); // Set success message
      setTimeout(() => {
        navigate('/login'); // Redirect to login page after successful password change
      }, 2000); // Optional: Delay for 2 seconds
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        'Error saving password. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <section className='bg-[#F6F6F6] min-h-[100vh] flex justify-center items-center sm:p-[32px]'>
      <div className='max-w-[1312px] w-full p-[10px] sm:p-0'>
        <div className='sm:flex justify-between gap-[48px] bg-white sm:p-[48px] items-center justify-center rounded-[24px] py-[20px]'>
          <div className='w-full h-full flex justify-center items-center p-[5px] sm:p-0'>
            <img
              loading="lazy"
              src={newPasswordImg}
              className='w-[70%] sm:w-auto rounded-[18px]'
              alt='New Password'
            />
          </div>
          <div className='w-full max-w-[578px] p-[24px] sm:p-[64px] bg-white sm:bg-[#fbfbfc] rounded-[24px]'>
            <div className='grid gap-[40px]'>
              <div>
                <h2 className='text-[32px] font-medium leading-[44px] text-heading pb-4 text-center ss:text-left capitalize'>
                  Create new password
                </h2>
                <p className='text-normal text-[16px] leading-[26px] font-normal'>
                  Please enter a new password for your account
                </p>
              </div>
              <div className='grid gap-[14px]'>
                <FormControl variant='outlined' className='w-full'>
                  <label className='font-normal text-normal leading-[20px] text-[14px] pb-[4px]'>
                    New password
                  </label>
                  <TextField
                    variant='outlined'
                    size='small'
                    fullWidth
                    type={pwdValues.showPassword ? 'text' : 'password'}
                    value={pwdValues.password}
                    onChange={handlePwdChange('password')}
                    placeholder='Enter new password'
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            onClick={handleShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge='end'
                          >
                            {pwdValues.showPassword ? (
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
                    value={confirmValues.password}
                    onChange={handleConfirmPwdChange('password')}
                    placeholder='Confirm new password'
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
              </div>
              {error && <p className='text-red-500'>{error}</p>}{' '}
              {/* Display error messages */}
              {success && <p className='text-green-500'>{success}</p>}{' '}
              {/* Display success message */}
            </div>
            <div className='mt-[60px] sm:mt-[100px] md:mt-[150px] lg:mt-[200px] flex justify-between items-center gap-[14px]'>
              <Button
                className='w-full'
                onClick={() => navigate('/login')}
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
              >
                Back to login
              </Button>
              <Button
                onClick={handleSavePassword}
                sx={{
                  width: '100%',
                  height: '44px',
                  fontFamily: 'Gilroy',
                  fontSize: '14px',
                  color: '#ffffff',
                  borderRadius: '8px',
                  backgroundColor: '#F14445',
                  textTransform: 'unset',
                  '&:hover': {
                    backgroundColor: '#E13031',
                  },
                }}
              >
                Save new password
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewPassword;
