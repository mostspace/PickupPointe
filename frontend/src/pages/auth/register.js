import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, FormControl, Select, MenuItem, Typography, Box, Stack } from '@mui/material';
import { registerBack, shopperImg, vendorImg } from 'src/assets';
import { useDispatch } from 'react-redux';
import { setRole } from 'src/reducers/roleSlice';
import DefaultButton from 'src/components/button/default-button';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedButton, setSelectedButton] = useState('shopperBtn');
  const [selectedRole, setSelectedRole] = useState('');
  const handleButtonClick = (buttonId) => {
    setSelectedButton(buttonId);
  };

  const roleType = {
    vendor: 'Producer or Product vendor',
    restaurant: 'Restaurant or eatery',
  };

  const redirectRegisterBtnClick = () => {
    dispatch(setRole(selectedRole));
    navigate(`/register/${selectedButton === 'shopperBtn' ? 'shopper-register' : 'vendor-register'}`);
  };

  return (
    <>
      <section id='register' className='w-full flex justify-center items-center min-h-[100vh] bg-[#F6F6F6] p-[15px] sm:p-[32px]'>
        <Box className='bg-white p-[15px] sm:p-[48px] rounded-[24px] max-w-[1312px]'>
          <Grid container spacing={{xs: 2, sm: 4, md: 6}} direction='row' alignItems='center'>
            <Grid item md={6} lg={6} xs={12}>
              <div className='w-full sm:h-full flex justify-center items-center h-[250px] rounded-[18px] overflow-hidden'>
                <img src={registerBack} className='w-full object-contain' loading="lazy"/>
              </div>
            </Grid>
            <Grid item md={6} lg={6} xs={12}>
              <div className='w-full bg-[#fbfbfc] rounded-[24px] flex flex-col gap-[24px] sm:gap-[40px] p-[15px] lg:p-[64px]'>
                <Stack direction="column" spacing={1}>
                  <Typography variant='h2'>Join Pickup Pointe</Typography>
                  <Typography variant='subtitle1' className='text-normal'>Choose your role to get started. Whether you're here to offer your products as a vendor or order them as a shopper.</Typography>
                </Stack>
                <div className='flex justify-center gap-[24px]'>
                  <Grid container direction='column' justifyContent='space-between' alignItems='center'
                    className={`bg-[#F6F6F6] rounded-[16px] gap-[24px] px-[8px] py-[24px] cursor-pointer border ${
                      selectedButton === 'shopperBtn' ? 'border-primary' : 'border-transparent' } duration-200`}
                    onClick={() => handleButtonClick('shopperBtn')}
                  >
                    <img src={shopperImg} alt='Shopper' className='h-[75px] md:h-[150px]' loading="lazy"/>
                    <p className='text-[18px] text-heading font-normal leading-[24px] text-center'>Shopper</p>
                  </Grid>
                  <Grid container direction='column' justifyContent='space-between' alignItems='center'
                    className={`bg-[#F6F6F6] rounded-[16px] gap-[24px] px-[8px] py-[24px] cursor-pointer border ${
                      selectedButton === 'vendorBtn' ? 'border-primary' : 'border-transparent' } duration-200`}
                    onClick={() => handleButtonClick('vendorBtn')}
                  >
                    <img src={vendorImg} alt='Vendor' className='h-[75px] md:h-[150px]' loading="lazy"/>
                    <p className='text-[18px] text-heading font-normal leading-[24px] text-center'>Merchant</p>
                  </Grid>
                </div>
                <div className='flex justify-end w-full'>
                  {selectedButton === 'vendorBtn' ? (
                    <FormControl className='w-full lg:w-1/2'>
                      <Select labelId='select-acount-type' size='small' displayEmpty
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        renderValue={(value) => {
                          if (!value) {
                            return (
                              <Typography className='!text-[14px] !font-gilroy'>
                                Select your account type
                              </Typography>
                            );
                          }
                          return roleType[value];
                        }}
                      >
                        <MenuItem value='restaurant' className='!text-[14px] !font-gilroy'>Restaurant or eatery</MenuItem>
                        <MenuItem value='vendor' className='!text-[14px] !font-gilroy'>Producer or Product vendor</MenuItem>
                      </Select>
                    </FormControl>
                  ) : (
                    ''
                  )}
                </div>
                <div className='flex justify-between items-center gap-[24px]'>
                  <DefaultButton onClick={() => navigate('/')} value={'Cancel'} className="w-full bg-[#F5F5F5] text-heading hover:bg-[#fef0f0]"/>
                  <DefaultButton className='w-full' value={'Sign Up'} onClick={redirectRegisterBtnClick} btnStatus={selectedButton === 'vendorBtn' && selectedRole === ''} />
                </div>
              </div>
            </Grid>
          </Grid>
        </Box>
      </section>
    </>
  );
};

export default Register;