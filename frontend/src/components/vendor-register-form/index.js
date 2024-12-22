import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField, FormControl, InputAdornment, IconButton, Typography
} from '@mui/material';

import Iconify from 'src/components/iconify';

import { validateEmail, validatePassword } from 'src/utils/utilityFunctions';

const VendorRegisterModal = ({
  open,
  handleClose,
  handleCreateFreeAccount,
  formData,
  handleInputChange,
  error,
  loading=false
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstNameError, setFirstNameError] = useState(null);
  const [lastNameError, setLastNameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  useEffect(() => {
    if (formData.firstName == "") {
      setFirstNameError(true)
    } else {
      setFirstNameError(null)
    }
    if (formData.lastName == "") {
      setLastNameError(true)
    } else {
      setLastNameError(null)
    }
  }, [formData.firstName, formData.lastName])

  useEffect(() => {
    if (formData.password !== '') {
      let res = validatePassword(formData.password);
      if (!res.isValid) {
        setPasswordError(res.missing);
      } else {
        setPasswordError(null);
      }
    } else {
      setPasswordError(null);
    }
  }, [formData.password]);

  useEffect(() => {
    if (!validateEmail(formData.email) && formData.email !== '') {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  }, [formData.email]);

  const isFormValid = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.password &&
      formData.confirmPassword &&
      formData.password === formData.confirmPassword &&
      emailError === false &&
      passwordError === null
    );
  };

  return (
    <React.Fragment>
      <Dialog
        className="w-full"
        open={open}
        onClose={handleClose}
        scroll="paper"
        sx={{
          width: '100% !important',
        }}
      >
        <DialogTitle className="pt-[32px] sm:!pt-[64px] flex flex-col gap-[6px] items-center sm:px-[88px]">
          <h1 className="text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center">
            Finish creating your free vendor account
          </h1>
          <p className="text-normal font-light leading-[25px] text-[16px] text-center sm:px-16">
            After creating your account, you will need to submit your profile
            for final approval before going live.
          </p>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
            <div
              className="flex flex-col gap-[14px] font-gilroy sm:px-[60px] py-[16px]"
              id="createVendorAccount"
            >
              <FormControl variant="standard">
                <Typography variant='label1'>First name</Typography>
                <TextField
                  name="email"
                  size="small"
                  variant="outlined"
                  required
                  fullWidth
                  value={formData.firstName}
                  onChange={handleInputChange('firstName')}
                  placeholder="Enter first name"
                />
                {firstNameError && (
                  <Typography variant="label" className="text-primary mt-1">First name is required</Typography>
                )}
              </FormControl>
              <FormControl variant="standard">
                <Typography variant='label1'>Last name</Typography>
                <TextField
                  name="email"
                  size="small"
                  variant="outlined"
                  required
                  fullWidth
                  value={formData.lastName}
                  onChange={handleInputChange('lastName')}
                  placeholder="Enter last name"
                />
                {lastNameError && (
                  <Typography variant="label" className="text-primary mt-1">Last name is required</Typography>
                )}
              </FormControl>
              <FormControl variant="standard">
                <Typography variant='label1'>Email address</Typography>
                <TextField
                  name="email"
                  size="small"
                  variant="outlined"
                  required
                  fullWidth
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  placeholder="Enter your email"
                />
                {emailError && (
                  <Typography variant="label" className="text-primary mt-1">Invalid Email Format</Typography>
                )}
              </FormControl>
              <FormControl variant="outlined" className="relative">
                <Typography variant='label1'>Password</Typography>
                <TextField
                  size="small"
                  variant="outlined"
                  name="password"
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange('password')}
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
                            <Iconify icon="solar:eye-closed-bold" width={24} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {passwordError && (
                  <div>
                    {passwordError.map((error, index) => (
                      <Typography variant="label" key={index} className="text-primary mt-1">
                       • Password should have {error}
                       </Typography>
                    ))}
                  </div>
                )}
              </FormControl>
              <FormControl variant="outlined" className="relative">
                <Typography variant='label1'>Confirm Password</Typography>
                <TextField
                  size="small"
                  variant="outlined"
                  name="confirm_password"
                  fullWidth
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
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
                            <Iconify icon="solar:eye-closed-bold" width={24} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
              <Typography variant="subtitle1" className="text-primary text-center">{error}</Typography>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions className="!px-[22px] !pb-[32px] sm:!pb-[64px] sm:!px-[80px] !gap-[14px]">
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
            className="w-full"
            disabled={!isFormValid()}
            sx={{
              width: '100%',
              height: '44px',
              fontFamily: 'Gilroy',
              fontSize: '14px',
              color: isFormValid() ? '#ffffff' : '#181818',
              borderRadius: '8px',
              backgroundColor: isFormValid() ? '#F14445' : '#F5F5F5',
              textTransform: 'unset',
              '&:hover': {
                backgroundColor: isFormValid() ? '#E13031' : '#F5F5F5',
              },
            }}
            onClick={handleCreateFreeAccount}
          >
            {loading ? 'Creating account...' : 'Create free account'}
            
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default VendorRegisterModal;