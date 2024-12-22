import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

// Constant
import { BASE_URL } from 'src/config-global';
import { TextConstants } from 'src/constants/textConstants';

// @mui
import { FormControl, TextField, Button, IconButton, InputAdornment, Grid, Box, Stack, Typography, } from '@mui/material';

// Components
import DefaultButton from 'src/components/button/default-button';
import ButtonLoader from 'src/components/button-loader/ButtonLoader';
import Iconify from 'src/components/iconify';

// Reducers
import { setUserInfo, setToken } from 'src/reducers/userSlice';

// Asset
import { setUser } from 'src/reducers/authSlice';
import { LoginShopper, LoginVendor } from 'src/assets';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const [selectedRole, setSelectedRole] = useState('shopper');

  const handleChange = (prop) => (event) => {
    setFormData({ ...formData, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  const handleMouseDownPassword = useCallback((event) => {
    event.preventDefault();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Set loading state to true

    try {
      const endpoint = selectedRole === 'shopper' ? `${BASE_URL}/api/v1/shopper/login` : `${BASE_URL}/api/v1/vendor/login`;
      const response = await axios.post(endpoint, formData);

      if(response.status==200){
        dispatch(setUserInfo(response.data.user))
        if(!response.data?.user?.verified){
          navigate('/account-confirm');
        }
        else{
          dispatch(setToken(response.data.token));
          localStorage.setItem('token', response.data.token);
          // navigate(selectedRole === 'shopper' ? '/shopper' : '/vendor');
          dispatch( setUser({ user: response.data.user, token: response.data.token, type: selectedRole }) )
          navigate(selectedRole === 'shopper' ? '/shopper' : '/vendor');
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Incorrect email or password'; // Show server error if available
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const activeRoleStyle = `text-primary bg-primaryLight border-2 border-primary hover:border-2`;
  const RoleButtonStyle = `text-sm p-2 px-6 rounded-md w-1/2`;

  const getButtonProps = (role) => ({
    variant: selectedRole === role ? 'outlined' : 'text',
    className: `font-gilroy ${RoleButtonStyle} ${selectedRole === role ? activeRoleStyle : ''}`,
  });

  return (
    <section className='w-full flex justify-center items-center min-h-[100vh] bg-[#F6F6F6] p-[15px] sm:p-[32px]'>
      <Box className='bg-white p-[15px] sm:p-[48px] rounded-[24px] max-w-[1312px]'>
        <Grid container spacing={{xs: 2, sm: 4, md: 6}} direction='row' alignItems='center'>
          <Grid item md={6} lg={6} xs={12}>
            <div className='w-full sm:h-full flex justify-center items-center h-[250px] rounded-[18px] overflow-hidden'>
              {selectedRole === 'shopper' ? (<img src={LoginShopper} className='w-full object-contain' loading="lazy"/>) : (<img loading="lazy" src={LoginVendor} className='w-full object-contain' />)}
            </div>
          </Grid>
          <Grid item md={6} lg={6} xs={12}>
            <div className='w-full bg-[#fbfbfc] rounded-[24px] flex flex-col gap-[24px] sm:gap-[40px] p-[15px] lg:p-[64px]'>
              <Stack direction="column" spacing={1}>
                <Typography variant='h2'>{TextConstants.LoginAccount}</Typography>
                <Typography variant='subtitle1' className='text-normal'>{TextConstants.WelcomeText}</Typography>
              </Stack>
              <div className='flex border border-gray-200 rounded-md p-1 gap-1'>
                <Button
                  {...getButtonProps('shopper')}
                  onClick={() => setSelectedRole('shopper')}
                >
                  Shopper
                </Button>
                <Button
                  {...getButtonProps('vendor')}
                  onClick={() => setSelectedRole('vendor')}
                >
                  Merchant
                </Button>
              </div>
              <div className='grid gap-[16px]'>
                <FormControl variant='standard'>
                  <label className='font-normal text-normal leading-[20px] text-[14px] pb-[4px]'>
                    Email address
                  </label>
                  <TextField
                    variant='outlined'
                    type='email'
                    size='small'
                    fullWidth
                    placeholder='ryan@mybusiness.com'
                    value={formData.email}
                    onChange={handleChange('email')}
                    required
                  />
                </FormControl>
                <FormControl variant='outlined' className='relative'>
                  <label className='font-normal text-normal leading-[20px] text-[14px] pb-[4px]'>
                    Password
                  </label>
                  <Link to='/forgot-password' className='text-heading text-[14px] leading-[20px] underline font-normal absolute right-0 hover:text-primary'>
                    Forgot password?
                  </Link>
                  <TextField
                    variant='outlined'
                    size='small'
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange('password')}
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
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
                </FormControl>
                {error && <p className='text-red-500'>{error}</p>}
                <p className='font-normal text-[14px] leading-[20px] text-normal py-[16px]'>
                  Don’t have an account?{' '}
                  <Link to='/register' className='text-heading underline hover:text-primary'>
                    Sign Up
                  </Link>
                </p>
              </div>
              <div className='flex justify-between items-center gap-[14px]'>
                <DefaultButton onClick={() => navigate('/')} value={'Cancel'} className="w-full bg-[#F5F5F5] text-heading hover:bg-[#fef0f0]"/>
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
                >
                  <ButtonLoader />
                </Button> : <DefaultButton
                  onClick={handleSubmit}
                  className='w-full'
                  value={'Sign In'}
                  size='100%'
                  bg='rgba(241, 68, 69, 1)'
                  color='rgba(254, 254, 255, 1)'
                />
                }
              </div>
            </div>
          </Grid>
        </Grid>
      </Box>
    </section>
  );
};

export default Login;