import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

//@mui
import { 
  FormControlLabel, FormGroup, Grid, TextField, Typography, InputLabel, InputAdornment, IconButton, Button, Checkbox, Stack
} from '@mui/material';

// Components
import ChooseLocation from 'src/components/choose-location-select';
import Iconify from 'src/components/iconify';
import PhoneNumberInput from 'src/components/phonenumber';

// Contexts
import { useModalDispatch, useModalState } from 'src/contexts/ModalContext';

// Utilities
import { generatePassword, validateEmail, validatePassword, validateUSPhoneNumber } from 'src/utils/utilityFunctions';

// Reducers
import { CALLBACK_MODAL, CONTENT_MODAL, TOAST_MODAL } from 'src/reducers/modalReducer';

// Icons
import { Cached, ContentCopy } from '@mui/icons-material';

// --------------------------------------------------------------------------------------------------------------------------------------------------

export default function EditUserForm() {
  const modalDispatch = useModalDispatch();
  const { data } = useModalState();
  const { locations } = useSelector(state => state.locations)
  const [fieldsError, setFieldsError] = useState({});
  const [passwordVisibility, setPasswordVisibility] = useState({password: false,});
  const [editData, setEditData] = useState({
    _id: "",
    firstName: "",
    lastName: "",
    password: "",
    contactNumber: "",
    contactEmail: "",
    locations: [],
    permissions: [],
    status: "",
  });
  const [formData, setFormData] = useState({
    _id: "",
    firstName: "",
    lastName: "",
    password: "",
    contactNumber: "",
    contactEmail: "",
    locations: [],
    permissions: [],
    status: "",
  });

  const handleDefaultError = () => {
    setFieldsError({
      firstName: "",
      lastName: "",
      password: "",
      contactNumber: "",
      contactEmail: "",
      status: "",
    })
  }

  // Handlers for password visibility toggle
  const handleClickShowPassword = (field) => () => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };
  const handleChange = (name) => (event) => {
    handleDefaultError()
    const data = {
      ...formData,
      [name]: event.target.value,
    }
    setFormData(data);
    modalDispatch({
      data,
    });
  };
  const handleEditLocationSelectionChange = (event, newValue) => {
    handleDefaultError()
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
    handleDefaultError()
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

  const handleGeneratePassword = () => {
    handleDefaultError()
    const newPassword = generatePassword();
    const data = {
      ...formData,
      ['password']: newPassword,
    }
    setFormData(data);
    modalDispatch({
      data,
    });
  }

  const handleCopyPassword = () => {
    modalDispatch({
      type: TOAST_MODAL,
      toast: {
        message: 'Password copied',
        type: 'success',
        className: 'toast-custom'
      }
    })
    setTimeout(() => {
      modalDispatch({
        type: TOAST_MODAL,
        toast: {
          message: ''
        }
      })
    }, 500)
    navigator.clipboard.writeText(formData.password)
  }

  const validateFields = (data) => {
    const errors = {};

    const isEmpty = (value) =>
      value === undefined || value === null || value === "";

    if (isEmpty(data.firstName)) errors.firstName = "First name is required";
    if (isEmpty(data.lastName)) errors.lastName = "Last name is required";
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

  const disabledPrimaryButton = () => {
    return JSON.stringify(editData) === JSON.stringify(formData)
  }

  const [passwordError, setPasswordError] = useState(null);

  useEffect(() => {
    if (formData.password) {
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
      data: formData,
    });
    modalDispatch({
      type: CONTENT_MODAL,
      content: {
        disabledPrimaryButton: disabledPrimaryButton()
      }
    })
    modalDispatch({
      type: CALLBACK_MODAL,
      callback: () => validateFields(formData)
    })
  }, [formData])

  useEffect(() => {
    const newData = {
      _id: data._id,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
      contactNumber: data.contactNumber,
      contactEmail: data.contactEmail,
      locations: data.locations,
      status: data.status,
      permissions: data.permissions
    }
    setFormData(newData);
    setEditData(newData);
  }, [])
  return (
    <Grid container className='mt-2'>
      <Grid item xs={12} md={12} lg={12}>
        <Typography variant="h5">User Info</Typography>
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
              value={formData.firstName}
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
              value={formData.lastName}
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
            <PhoneNumberInput value={formData.contactNumber} onChange={handleChange('contactNumber')} />
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
              value={formData.contactEmail}
              onChange={handleChange('contactEmail')}
            />
            {fieldsError.contactEmail && (
              <span className="font-normal text-danger leading-[20px] text-[12px] py-[4px]">
                {fieldsError.contactEmail}
              </span>
            )}
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} md={12} lg={12} className='mt-6'>
        <Grid container columnSpacing={2} rowSpacing={2}>
          <Grid item xs={12} md={12} lg={12}>
            <Typography variant="h5">Permissions</Typography>
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
                      />
                    }
                    label={
                      <Typography variant='subtitle2'>Tablet User</Typography>
                    }
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={12} md={12} lg={12}>
                <Stack gap={2} direction="row">
                  <Stack flex={1}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant='label1'>Password</Typography>
                      <Typography 
                        variant='label1' 
                        className='cursor-pointer underline'
                        onClick={() => handleGeneratePassword()}
                      >
                        <Cached className='mr-1 w-[16px]' />
                        Regenerate password
                      </Typography>
                    </Stack>
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
                    {passwordError && (
                      <div>
                        {passwordError.map((error, index) => (
                          <p key={index} className="text-red-500 text-[12px] mt-1">
                            • Password should have {error}
                          </p>
                        ))}
                      </div>
                    )}
                  </Stack>
                  <Button
                    sx={{
                      height: '44px',
                      fontFamily: 'Gilroy',
                      fontSize: '14px',
                      color: '#181818',
                      borderRadius: '8px',
                      backgroundColor: '#F5F5F5',
                      textTransform: 'unset',
                      padding: '8px 40px 8px 40px',
                      marginTop: 'auto'
                    }}
                    onClick={() => handleCopyPassword()}
                  >
                    <ContentCopy className='mr-2' /> Copy
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Set Location Section */}
      <Grid item xs={12} md={12} lg={12} className='mt-6'>
        <Grid container columnSpacing={2} rowSpacing={2}>
          <Grid item xs={12} md={12} lg={12}>
            <Typography variant="h5">Assign to location</Typography>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <Typography variant='label1'>Location</Typography>
            <ChooseLocation
              options={locations}
              selectedOptions={formData.locations}
              onSelectionChange={handleEditLocationSelectionChange}
              chipClassName={'font-gilroy'}
              listClassName={'font-gilroy'}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );

}



