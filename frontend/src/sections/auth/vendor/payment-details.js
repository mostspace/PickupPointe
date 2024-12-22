import React, { useEffect, useState, useMemo } from "react";
import { icTrash } from "src/assets";
// @mui
import {
  FormControl, Button, Typography, IconButton, InputAdornment, useMediaQuery, useTheme, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Autocomplete,
} from '@mui/material';
// Components
import Iconify from "src/components/iconify/iconify";
// Assets
import { countries } from 'src/_mock/assets';
// Icons
import AppleIcon from '@mui/icons-material/Apple';
import { useForm, FormProvider } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { MoreHorizOutlined } from "@mui/icons-material";


const PaymentDetails = ({formData}) => {

  const onSubmit = (data) => {
    console.log(data);
  };

  // RHF Hook Form
  const NewFormDataSchema = Yup.object().shape({
    firstname: Yup.string().required('First Name is required'),
    lastname: Yup.string().required('Last Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    supportemail: Yup.string().email('Email must be a valid email address'),
    phoneNumber: Yup.string().required('Phone number is required'),
    supportNumber: Yup.string(),
    address: Yup.string().required('Address is required'),
    country: Yup.string().required('Country is required'),
    company: Yup.string().required('Company is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    role: Yup.string().required('Role is required'),
    website: Yup.string(),
    zipCode: Yup.string().required('Zip code is required'),
    avatarUrl: Yup.mixed().nullable().required('Avatar is required'),
    // not required
    status: Yup.string(),
    isVerified: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      firstname: formData?.firstname || '',
      lastname: formData?.lastname || '',
      city: formData?.city || '',
      role: formData?.role || '',
      email: formData?.email || '',
      state: formData?.state || '',
      status: formData?.status || '',
      address: formData?.address || '',
      country: formData?.country || '',
      zipCode: formData?.zipCode || '',
      company: formData?.company || '',
      avatarUrl: formData?.avatarUrl || null,
      phoneNumber: formData?.phoneNumber || '',
      isVerified: formData?.isVerified || true,
      website: formData?.website || true,
      supportNumber: formData?.supportNumber || true,
      supportEmail: formData?.supportEmail || true,
      dbaName: formData?.dbaName || true,
    }),
    [formData]
  );

  const methods = useForm({
    resolver: yupResolver(NewFormDataSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (formData) {
      reset(defaultValues);
    }
  }, [formData, defaultValues, reset]);

  // ------------------------  Modal ------------------------------------

  // Add New Pickup Location Modal
  const [openPaymentMethod, setOpenPaymentMethod] = React.useState(false);

  const handlePaymentMethodOpen = () => {
    setOpenPaymentMethod(true);
  };

  const handlePaymentMethodClose = () => {
    setOpenPaymentMethod(false);
  };

  // ------------------------  Dropdown Menu ------------------------------------

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Delete Pickup Location Modal
  const [openDeletePaymentMethod, setOpenDeletePaymentMethod] = React.useState(false);

  const handleDeletePaymentMethodOpen = () => {
    handleClose();
    setOpenDeletePaymentMethod(true);
  };
 
   const handleDeletePaymentMethodClose = () => {
     setOpenDeletePaymentMethod(false);
   };

  // Payment method Modal Card Active
  const [activePaymentMethod, setActivePaymentMethod] = useState(null);

  const handlePaymentMethodClick = (paymentMethod) => {
    setActivePaymentMethod(paymentMethod);
  };

  return (
    <>
      <div className="w-full flex justify-center">
        <div className="w-full flex flex-col gap-[14px] sm:max-w-[624px]">
            <Typography variant="h5" className="capitalize">Add Payment Method</Typography>
            <Typography variant="subtitle2" className="text-normal">You are seeing this payment method option because you expressed interest in using our local physical Pickup Pointe location. Rest assured, you won't be charged for any rack space until we receive your first drop-off at our retail location. Your card information will simply be kept on file for when you're ready to make your first drop-off.</Typography>
            <div className='flex flex-col gap-[14px] font-gilroy'>
                <FormControl variant="standard" className=''>
                    <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Email</label>
                    <TextField
                        size="small"
                        variant='outlined'
                        required
                        fullWidth
                        placeholder='Enter email address'
                    />
                </FormControl>
                <div className="flex flex-col sm:flex-row justify-between w-full gap-[14px] items-start">
                <FormControl variant="standard" className='w-full'>
                    <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Full name</label>
                    <TextField
                    size="small"
                    variant='outlined'
                    required
                    fullWidth
                    placeholder='Enter full name'
                    />
                </FormControl>
                <FormControl variant="standard" className='w-full'>
                    <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Country</label>
                    <Autocomplete
                    fullWidth
                    autoHighlight
                    options={countries}
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => (
                        <TextField
                        {...params}
                        placeholder="Choose a country"
                        inputProps={{
                            ...params.inputProps,
                            autoComplete: 'new-password',
                        }}
                        />
                    )}
                    renderOption={(props, option) => {
                        if (!option.label) {
                        return null;
                        }

                        return (
                        <li {...props} key={option.label}>
                            <Iconify
                            key={option.label}
                            icon={`circle-flags:${option.code.toLowerCase()}`}
                            width={28}
                            sx={{ mr: 1 }}
                            />
                            {option.label}
                        </li>
                        );
                    }}
                    />
                </FormControl>
                </div>
                <div className="flex justify-between gap-[15px] items-start">
                <div
                    className={`border p-[12px] flex flex-col gap-[4px] w-full rounded-[6px] items-center justify-start sm:justify-center group hover:border-blue hover:text-blue cursor-pointer h-[90px] sm:h-none
                            ${activePaymentMethod === 'card' ? 'border-blue text-blue' : ''}`}
                    onClick={() => handlePaymentMethodClick('card')}
                >
                    <Iconify icon="oi:credit-card" width={16} />
                    <Typography variant="subtitle2" className={`group-hover:text-blue text-center ${activePaymentMethod === 'card' ? 'text-blue' : ''}`}>
                    Card
                    </Typography>
                </div>
                <div
                    className={`border p-[12px] flex flex-col gap-[1px] w-full rounded-[6px] items-center justify-start sm:justify-center group hover:border-blue cursor-pointer h-[90px] sm:h-none
                            ${activePaymentMethod === 'applePay' ? 'border-blue text-blue' : ''}`}
                    onClick={() => handlePaymentMethodClick('applePay')}
                >
                    <AppleIcon className={`text-black text-[20px] group-hover:text-blue ${activePaymentMethod === 'applePay' ? 'text-blue' : ''}`} />
                    <Typography variant="subtitle2" className={`group-hover:text-blue text-center ${activePaymentMethod === 'applePay' ? 'text-blue' : ''}`}>
                    Apple Pay
                    </Typography>
                </div>
                <div
                    className={`border p-[12px] flex flex-col gap-[4px] w-full rounded-[6px] items-center justify-start sm:justify-center group hover:border-blue hover:text-blue cursor-pointer h-[90px] sm:h-none
                            ${activePaymentMethod === 'paypal' ? 'border-blue text-blue' : ''}`}
                    onClick={() => handlePaymentMethodClick('paypal')}
                >
                    <Iconify icon="logos:paypal" width={16} />
                    <Typography variant="subtitle2" className={`group-hover:text-blue text-center ${activePaymentMethod === 'paypal' ? 'text-blue' : ''}`}>
                    PayPal
                    </Typography>
                </div>
                <div className="border flex p-[5px] flex-col gap-[4px] w-[40px] rounded-[6px] items-center justify-start h-[90px] sm:h-none">
                    <IconButton size="small" edge="end">
                    <MoreHorizOutlined className="text-[18px]" />
                    </IconButton>
                </div>
                </div>
                <FormControl variant="standard" className=''>
                    <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Card number</label>
                    <TextField
                    placeholder="1234 1234 1234 1234"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                        endAdornment: (
                        <InputAdornment position="end">
                            <Iconify icon="logos:mastercard" width={24} className="mr-5" />
                            <Iconify icon="logos:maestro" width={24} className="mr-5" />
                            <Iconify icon="logos:visa" width={24} />
                        </InputAdornment>
                        ),
                    }}
                    />
                </FormControl>
                <div className="flex flex-col sm:flex-row justify-between w-full gap-[14px] items-start">
                <FormControl variant="standard" className='w-full'>
                    <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Expiration date</label>
                    <TextField
                        placeholder="MM/YY"
                        InputLabelProps={{ shrink: true }}
                    />
                </FormControl>
                <FormControl variant="standard" className='w-full'>
                    <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>CVV code</label>
                    <TextField
                        placeholder="CVV"
                        type="password"
                        InputLabelProps={{ shrink: true }}
                    />
                </FormControl>
                </div>
            </div>
        </div>
      </div>     

      {/* Payment Method Modal */}
      <React.Fragment>
        <FormProvider {...methods} onSubmit={onSubmit}>
          <Dialog className="default-modal"
              open={openPaymentMethod}
              onClose={handlePaymentMethodClose}
              scroll="paper"
              sx={{
                width: "100% !important",
              }}
          >
            <DialogTitle id="" className='pt-[32px] sm:!pt-[64px]'>
              <h1 className='text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center font-gilroy'>Add new payment method</h1>
            </DialogTitle>
            <DialogContent dividers={scroll === 'paper'}>
              <DialogContentText
                id="scroll-dialog-description"
                tabIndex={-1}
              >
                <div className='flex flex-col gap-[14px] font-gilroy sm:px-[60px] py-[16px]'>
                  <FormControl variant="standard" className=''>
                      <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Email</label>
                      <TextField
                          size="small"
                          variant='outlined'
                          required
                          fullWidth
                          placeholder='Enter email address'
                      />
                  </FormControl>
                  <div className="flex flex-col sm:flex-row justify-between w-full gap-[14px] items-start">
                    <FormControl variant="standard" className='w-full'>
                      <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Full name</label>
                      <TextField
                        size="small"
                        variant='outlined'
                        required
                        fullWidth
                        placeholder='Enter full name'
                      />
                    </FormControl>
                    <FormControl variant="standard" className='w-full'>
                      <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Country</label>
                      <Autocomplete
                        fullWidth
                        autoHighlight
                        options={countries}
                        getOptionLabel={(option) => option.label}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Choose a country"
                            inputProps={{
                              ...params.inputProps,
                              autoComplete: 'new-password',
                            }}
                          />
                        )}
                        renderOption={(props, option) => {
                          if (!option.label) {
                            return null;
                          }

                          return (
                            <li {...props} key={option.label}>
                              <Iconify
                                key={option.label}
                                icon={`circle-flags:${option.code.toLowerCase()}`}
                                width={28}
                                sx={{ mr: 1 }}
                              />
                              {option.label}
                            </li>
                          );
                        }}
                      />
                    </FormControl>
                  </div>
                  <div className="flex justify-between gap-[15px] items-start">
                    <div
                      className={`border p-[12px] flex flex-col gap-[4px] w-full rounded-[6px] items-center justify-start sm:justify-center group hover:border-blue hover:text-blue cursor-pointer h-[90px] sm:h-none
                                ${activePaymentMethod === 'card' ? 'border-blue text-blue' : ''}`}
                      onClick={() => handlePaymentMethodClick('card')}
                    >
                      <Iconify icon="oi:credit-card" width={16} />
                      <Typography variant="subtitle2" className={`group-hover:text-blue text-center ${activePaymentMethod === 'card' ? 'text-blue' : ''}`}>
                        Card
                      </Typography>
                    </div>
                    <div
                      className={`border p-[12px] flex flex-col gap-[1px] w-full rounded-[6px] items-center justify-start sm:justify-center group hover:border-blue cursor-pointer h-[90px] sm:h-none
                                ${activePaymentMethod === 'applePay' ? 'border-blue text-blue' : ''}`}
                      onClick={() => handlePaymentMethodClick('applePay')}
                    >
                      <AppleIcon className={`text-black text-[20px] group-hover:text-blue ${activePaymentMethod === 'applePay' ? 'text-blue' : ''}`} />
                      <Typography variant="subtitle2" className={`group-hover:text-blue text-center ${activePaymentMethod === 'applePay' ? 'text-blue' : ''}`}>
                        Apple Pay
                      </Typography>
                    </div>
                    <div
                      className={`border p-[12px] flex flex-col gap-[4px] w-full rounded-[6px] items-center justify-start sm:justify-center group hover:border-blue hover:text-blue cursor-pointer h-[90px] sm:h-none
                                ${activePaymentMethod === 'paypal' ? 'border-blue text-blue' : ''}`}
                      onClick={() => handlePaymentMethodClick('paypal')}
                    >
                      <Iconify icon="logos:paypal" width={16} />
                      <Typography variant="subtitle2" className={`group-hover:text-blue text-center ${activePaymentMethod === 'paypal' ? 'text-blue' : ''}`}>
                        PayPal
                      </Typography>
                    </div>
                    <div className="border flex p-[5px] flex-col gap-[4px] w-[40px] rounded-[6px] items-center justify-start h-[90px] sm:h-none">
                      <IconButton size="small" edge="end">
                        <MoreHorizOutlined className="text-[18px]" />
                      </IconButton>
                    </div>
                  </div>
                  <FormControl variant="standard" className=''>
                      <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Card number</label>
                      <TextField
                        placeholder="1234 1234 1234 1234"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Iconify icon="logos:mastercard" width={24} className="mr-5" />
                              <Iconify icon="logos:maestro" width={24} className="mr-5" />
                              <Iconify icon="logos:visa" width={24} />
                            </InputAdornment>
                          ),
                        }}
                      />
                  </FormControl>
                  <div className="flex flex-col sm:flex-row justify-between w-full gap-[14px] items-start">
                    <FormControl variant="standard" className='w-full'>
                      <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Expiration date</label>
                      <TextField
                        placeholder="MM/YY"
                        InputLabelProps={{ shrink: true }}
                      />
                    </FormControl>
                    <FormControl variant="standard" className='w-full'>
                      <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>CVV code</label>
                      <TextField
                        placeholder="CVV"
                        InputLabelProps={{ shrink: true }}
                        // InputProps={{
                        //   endAdornment: (
                        //     <InputAdornment position="end">
                        //       <IconButton size="small" edge="end">
                        //         <Iconify icon="eva:info-outline" />
                        //       </IconButton>
                        //     </InputAdornment>
                        //   ),
                        // }}
                      />
                    </FormControl>
                  </div>
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
                onClick={handlePaymentMethodClose}
              >
                Cancel
              </Button>
              <Button className='w-full'
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
                    }
                }}
                onClick={handlePaymentMethodClose}
              > 
                Add
              </Button>
            </DialogActions>
          </Dialog>
        </FormProvider>
      </React.Fragment>

      {/* Delete Pickup Location Modal */}
      <React.Fragment>
        <Dialog className="w-full"
            open={openDeletePaymentMethod}
            onClose={handleDeletePaymentMethodClose}
            sx={{
              width: "100% !important",
            }}
        >
          <DialogTitle id="" className='pt-[32px] sm:!pt-[64px] flex flex-col gap-[6px] items-center'>
            <img src={icTrash} className='w-[40%]' loading="lazy"/>
          </DialogTitle>
          <DialogContent dividers={scroll === 'paper'}>
            <DialogContentText
              id="scroll-dialog-description"
              tabIndex={-1}
            >
              <div className='flex flex-col gap-[14px] font-gilroy sm:px-[60px] py-[16px]'>
                <h1 className='text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center font-gilroy'>Are you sure you want to delete payment method?</h1>
                <p className='text-normal font-light leading-[25px] text-[16px] text-center'>You won’t be able to recover it afterwards.</p>
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
              onClick={handleDeletePaymentMethodClose}
            >
              Cancel
            </Button>
            <Button className='w-full'
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
                  }
              }}
              onClick={handleDeletePaymentMethodClose}
            > 
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </>
  );
};

export default PaymentDetails;