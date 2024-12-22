import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

//@mui
import { 
  Checkbox, FormControlLabel, FormGroup, Grid, TextField, Typography, InputLabel, InputAdornment, IconButton
} from '@mui/material';

// Components
import ChooseLocation from 'src/components/choose-location-select';
import Iconify from 'src/components/iconify';
import PhoneNumberInput from 'src/components/phonenumber';

// Context
import { useModalDispatch, useModalState } from 'src/contexts/ModalContext';

// Utilities
import { validateEmail, validatePassword, validateUSPhoneNumber } from 'src/utils/utilityFunctions';

// Reducers
import { CALLBACK_MODAL } from 'src/reducers/modalReducer';

// ------------------------------------------------------------------------------------------------------------

export default function AddUserForm() {

  const modalDispatch = useModalDispatch();
  const modalState = useModalState();
  const { locations } = useSelector(state => state.locations)

  const [fieldsError, setFieldsError] = useState({
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
    contactEmail: "",
  });

  // State to manage visibility of each password field
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
    contactEmail: "",
    locations: [],
    permissions: [],
  });

  const handleDefaultError = () => {
    setFieldsError({
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
      contactNumber: "",
      contactEmail: "",
    })
  }

  // Handlers for password visibility toggle
  const handleClickShowPassword = (field) => () => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };
  // Handle input change
  const handleChange = (name) => (event) => {
    handleDefaultError();
    const data = {
      ...formData,
      [name]: event.target.value,
    }
    setFormData(data);
    modalDispatch({
      data,
    });
  };

  const handleAddLocationSelectionChange = (event, newValue) => {
    handleDefaultError();
    const data = {
      ...formData,
      locations: newValue,
    }
    setFormData(data);
    modalDispatch({
      data,
    });
  };

  const handleChangePermission = (newValue) => {
    handleDefaultError();
    let permissions = [...formData.permissions]
    if (formData.permissions.includes(newValue)) {
      permissions = formData.permissions.filter(elem => elem !== newValue)
    } else {
      permissions.push(newValue)
    }
    const data = {
      ...formData,
      permissions: permissions,
    }
    setFormData(data)
    modalDispatch({
      data,
    });
  }

  const validateFields = (data) => {
    const errors = {};

    const isEmpty = (value) =>
      value === undefined || value === null || value === "";

    if (isEmpty(data.firstName)) errors.firstName = "First name is required";
    if (isEmpty(data.lastName)) errors.lastName = "Last name is required";
    if (isEmpty(data.password)) {
      errors.password = "Password is required"
    } else if (data.password !== data.confirmPassword) {
      errors.confirmPassword = "Confirm Password is not same Password"
    }
    if (isEmpty(data.contactNumber)) {
      errors.contactNumber = "Contact number is required";
    } else if (!validateUSPhoneNumber(data.contactNumber)) {
      errors.contactNumber = "Contact number is invalid";
    }
    if (isEmpty(data.contactEmail)) {
      errors.contactEmail = "Contact email is required";
    } else if (!validateEmail(data.contactEmail)) {
      errors.contactEmail = "Contact email is invalid";
    }
    setFieldsError(errors);

    return Object.keys(errors).length === 0;
  };

  const [passwordError, setPasswordError] = useState(null);

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
    modalDispatch({
      type: CALLBACK_MODAL,
      callback: () => validateFields(formData)
    })
  }, [formData])

  useEffect(() => {
    setFieldsError((previousState) => ({
      ...previousState,
      contactEmail: modalState.error 
    }))
  }, [modalState])

  return (
    <Grid container className='mt-5'>
      <Grid item xs={12} md={12} lg={12}>
        <Typography variant="h6">User Info</Typography>
      </Grid>

      {/* User Edit Form Section */}
      <Grid item xs={12} md={12} lg={12} className='mt-4'>
        <Grid container columnSpacing={2} rowSpacing={2}>
          <Grid item xs={6} md={6} lg={6}>
            <Typography variant='label1'>First name</Typography>
            <TextField
              fullWidth
              id='outlined-basic'
              variant='outlined'
              onChange={handleChange('firstName')}
            />
            {fieldsError.firstName && (
              <span className="font-normal text-danger leading-[20px] text-[12px] py-[4px]">
                {fieldsError.firstName}
              </span>
            )}
          </Grid>
          <Grid item xs={6} md={6} lg={6}>
            <Typography variant='label1'>Last name</Typography>
            <TextField
              fullWidth
              id='outlined-basic'
              variant='outlined'
              onChange={handleChange('lastName')}
            />
            {fieldsError.lastName && (
              <span className="font-normal text-danger leading-[20px] text-[12px] py-[4px]">
                {fieldsError.lastName}
              </span>
            )}
          </Grid>

          <Grid item xs={6} md={6} lg={6}>
            <Typography variant='label1'>Contact number</Typography>
            <PhoneNumberInput onChange={handleChange('contactNumber')} />
            {fieldsError.contactNumber && (
              <span className="font-normal text-danger leading-[20px] text-[12px] py-[4px]">
                {fieldsError.contactNumber}
              </span>
            )}
          </Grid>
          <Grid item xs={6} md={6} lg={6}>
            <Typography variant='label1'>Contact email</Typography>
            <TextField
              fullWidth
              id='outlined-basic'
              variant='outlined'
              onChange={handleChange('contactEmail')}
            />
            {fieldsError.contactEmail && (
              <span className="font-normal font-gilroy text-danger leading-[20px] text-[12px] py-[4px]">
                {fieldsError.contactEmail}
              </span>
            )}
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} md={12} lg={12} className='mt-6'>
        <Grid container columnSpacing={2} rowSpacing={2}>
          <Grid item xs={12} md={12} lg={12}>
            <Typography variant="h6">Permissions</Typography>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <Grid container columnSpacing={2} rowSpacing={2}>
              <Grid item xs={12} md={12} lg={12}>
                <FormGroup className='w-full relative flex flex-row gap-10 pl-2'>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.permissions.includes('vendor-portal')}
                        onChange={() => handleChangePermission('vendor-portal')}
                        size='small'
                      />
                    }
                    label={
                      <Typography variant='subtitle2'>Merchant Portal</Typography>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.permissions.includes('tablet-user')}
                        onChange={() => handleChangePermission('tablet-user')}
                        size='small'
                      />
                    }
                    label={
                      <Typography variant='subtitle2'>Tablet User</Typography>
                    }
                  />
                </FormGroup>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Set Password Section */}
      <Grid item xs={12} md={12} lg={12} className='mt-6'>
        <Grid container columnSpacing={2} rowSpacing={2}>
          <Grid item xs={12} md={12} lg={12}>
            <Typography variant="h6">User Password</Typography>
          </Grid>
          <Grid item xs={6} md={6} lg={6}>
            <Typography variant='label1'>Password</Typography>
            <TextField
              variant='outlined'
              size='small'
              fullWidth
              type={passwordVisibility.password ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange('password')}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={handleClickShowPassword('password')}
                      edge='end'
                    >
                      {passwordVisibility.password ? (
                        <Iconify icon='solar:eye-bold' width={24} />
                      ) : (
                        <Iconify icon='solar:eye-closed-bold' width={24} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {fieldsError.password && (
              <span className="font-normal text-danger leading-[20px] text-[12px] py-[4px]">
                {fieldsError.password}
              </span>
            )}
            {passwordError && (
              <div>
                {passwordError.map((error, index) => (
                  <p key={index} className="text-red-500 text-[12px] mt-1">
                    • Password should have {error}
                  </p>
                ))}
              </div>
            )}
          </Grid>
          <Grid item xs={6} md={6} lg={6}>
            <Typography variant='label1'>Confirm password</Typography>
            <TextField
              variant='outlined'
              size='small'
              fullWidth
              type={passwordVisibility.confirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={handleClickShowPassword('confirmPassword')}
                      edge='end'
                    >
                      {passwordVisibility.confirmPassword ? (
                        <Iconify icon='solar:eye-bold' width={24} />
                      ) : (
                        <Iconify icon='solar:eye-closed-bold' width={24} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {fieldsError.confirmPassword && (
              <span className="font-normal text-danger leading-[20px] text-[12px] py-[4px]">
                {fieldsError.confirmPassword}
              </span>
            )}
          </Grid>
        </Grid>
      </Grid>

      {/* Set Location Section */}
      <Grid item xs={12} md={12} lg={12} className='mt-6'>
        <Grid container columnSpacing={2} rowSpacing={2}>
          <Grid item xs={12} md={12} lg={12}>
            <Typography variant="h6">Set a location</Typography>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <Typography variant='label1'>Location</Typography>
            <ChooseLocation
              options={locations}
              selectedOptions={formData.locations}
              onSelectionChange={handleAddLocationSelectionChange}
              chipClassName={'font-gilroy'}
              listClassName={'font-gilroy'}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
