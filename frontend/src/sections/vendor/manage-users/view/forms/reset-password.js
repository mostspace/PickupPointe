import { useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import { Grid, Typography } from '@mui/material';
import SecondaryButton from 'src/components/button/secondary-button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Iconify from 'src/components/iconify';
import { useModalDispatch, useModalState } from 'src/contexts/ModalContext';
import { changePassword } from 'src/api/vendor/users';
import { toast } from 'react-toastify';
import { CLOSE_MODAL } from 'src/reducers/modalReducer';

export default function ResetPasswordForm() {
  const { data } = useModalState();
  const modalDispatch = useModalDispatch();

  // State to manage visibility of each password field
  const [passwordVisibility, setPasswordVisibility] = useState({
    currentPassword: false,
    newPassword: false,
  });
  // State to manage password values
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
  });

  // Handlers for password visibility toggle
  const handleClickShowPassword = (field) => () => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Handle input change
  const handleChange = (name) => (event) => {
    const data = {
      ...formData,
      [name]: event.target.value,
    }
    setFormData(data);
  };

  const handleChangePassword = async () => {
    try {
      await changePassword(data._id, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      toast("Change Password Successful", {
        type: 'success',
        className: 'toast-custom',
      });
      modalDispatch({
        type: CLOSE_MODAL,
      })
    } catch (error) {
      toast("Change Password Failed", {
        type: 'error',
        className: 'toast-custom',
      });
    }
  }

  return (
    <Grid container className='mt-2'>
      <div className=' border border-secondary rounded-xl p-4'>
        <Grid item xs={12} md={12} lg={12}>
          <h2 className='text-lg font-semibold font-gilroy'>Security</h2>
        </Grid>
        {/* User Current Password Section */}
        <Grid item xs={12} md={12} lg={12} className='mt-4'>
          <Grid container columnSpacing={2} rowSpacing={2} alignItems={'end'}>
            <Grid item xs={6} md={6} lg={6}>
              <InputLabel
                variant='standard'
                htmlFor='uncontrolled-native'
                className='text-xs text-normal font-gilroy font-normal mb-3'
              >
                Current Password
              </InputLabel>
              <TextField
                variant='outlined'
                size='small'
                fullWidth
                type={passwordVisibility.currentPassword ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={handleChange('currentPassword')}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        onClick={handleClickShowPassword('currentPassword')}
                        edge='end'
                      >
                        {passwordVisibility.currentPassword ? (
                          <Iconify icon='solar:eye-bold' width={24} />
                        ) : (
                          <Iconify icon='solar:eye-closed-bold' width={24} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* User New Password Section */}

            <Grid item xs={6} md={6} lg={6}>
              <Typography
                variant='body2'
                gutterBottom
                className='text-xs text-black font-gilroy'
              >
                If you want to change this user's password, first enter their
                current password
              </Typography>
            </Grid>

            <Grid item xs={6} md={6} lg={6}>
              <InputLabel
                variant='standard'
                htmlFor='uncontrolled-native'
                className='text-xs text-normal font-gilroy font-normal mb-3'
              >
                Password
              </InputLabel>
              <TextField
                variant='outlined'
                size='small'
                fullWidth
                type={passwordVisibility.newPassword ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={handleChange('newPassword')}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        onClick={handleClickShowPassword('newPassword')}
                        edge='end'
                      >
                        {passwordVisibility.newPassword ? (
                          <Iconify icon='solar:eye-bold' width={24} />
                        ) : (
                          <Iconify icon='solar:eye-closed-bold' width={24} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={12} lg={6} className='mt-6'>
          <SecondaryButton value={'Change password'} size={'100%'} click={handleChangePassword} />
        </Grid>
      </div>
    </Grid>
  );
}