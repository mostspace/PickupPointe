import React, { useEffect, useState, useMemo } from "react";
import { useForm, FormProvider } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  FormControl, Button, Typography, IconButton, InputAdornment, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Autocomplete,
} from '@mui/material';
// Components
import Iconify from "src/components/iconify/iconify";
import BankingCard from "src/components/banking-card";
// Assets
import { countries } from 'src/_mock/assets';
import { banks } from 'src/_mock/assets';
// Icons
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

// ==============================================================================================================================================================

const Main = ({formData}) => {
  
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

  // Payment method modal
  const [openPaymentMethod, setOpenPaymentMethod] = React.useState(false);

  const handleAddNewBankingInformationOpen = () => {
    setOpenPaymentMethod(true);
  };

  const handlePaymentMethodClose = () => {
    setOpenPaymentMethod(false);
  };

  // Payment method Modal Card Active
  const [activePaymentMethod, setActivePaymentMethod] = useState('card');

  const handlePaymentMethodClick = (paymentMethod) => {
    setActivePaymentMethod(paymentMethod);
  };

  return (
    <>
      <FormProvider {...methods} onSubmit={onSubmit}>
        <div className="w-full flex flex-col gap-[48px]">
          <div className="flex flex-col gap-[14px]">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-[6px]">
                <Typography variant="h5" className="capitalize">My Banking information</Typography>
                <Typography variant="subtitle3" className="">Enter the bank account for receiving payments.</Typography>
              </div>
              <IconButton onClick={handleAddNewBankingInformationOpen}>
                <AddCircleIcon className="text-[#aeaeae] text-[26px] hover:text-normal"/>
              </IconButton>
            </div>
            <div className="flex flex-col gap-[14px]">
              <BankingCard />
            </div>
          </div>
        </div>

        {/* Add new banking information modal */}
        <React.Fragment>
          <Dialog className="default-modal"
            open={openPaymentMethod}
            onClose={handlePaymentMethodClose}
            scroll="paper"
            sx={{
              width: "100% !important",
            }}
          >
            <DialogTitle id="" className='pt-[32px] sm:!pt-[64px]'>
              <h1 className='text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center font-gilroy'>Add new banking information</h1>
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
                      className={`border p-[12px] flex flex-col gap-[4px] w-full rounded-[6px] items-center justify-center sm:justify-center group hover:border-blue hover:text-blue cursor-pointer h-[90px] sm:h-none
                                ${activePaymentMethod === 'card' ? 'border-blue text-blue' : ''}`}
                      onClick={() => handlePaymentMethodClick('card')}
                    >
                      <Iconify icon="oi:credit-card" width={16} />
                      <Typography variant="subtitle2" className={`group-hover:text-blue text-center ${activePaymentMethod === 'card' ? 'text-blue' : ''}`}>
                        Card
                      </Typography>
                    </div>
                    <div
                      className={`border p-[12px] flex flex-col gap-[1px] w-full rounded-[6px] items-center justify-center sm:justify-center group hover:border-blue cursor-pointer h-[90px] sm:h-none
                                ${activePaymentMethod === 'iban' ? 'border-blue text-blue' : ''}`}
                      onClick={() => handlePaymentMethodClick('iban')}
                    >
                      <AccountBalanceIcon className={`text-[18px] group-hover:text-blue ${activePaymentMethod === 'iban' ? 'text-blue' : ''}`} />
                      <Typography variant="subtitle2" className={`group-hover:text-blue !font-gilroy text-center ${activePaymentMethod === 'iban' ? 'text-blue' : ''}`}>
                        IBAN
                      </Typography>
                    </div>
                  </div>
                  
                  {activePaymentMethod === 'card' && (
                    <>
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
                          />
                        </FormControl>
                      </div>
                    </>
                  )}

                  {activePaymentMethod === 'iban' && (
                    <>
                      <FormControl variant="standard" className='w-full'>
                        <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Bank name</label>
                        <Autocomplete
                          fullWidth
                          autoHighlight
                          options={banks}
                          getOptionLabel={(option) => option.label}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select your bank name"
                            />
                          )}
                          renderOption={(props, option) => {
                            if (!option.label) {
                              return null;
                            }

                            return (
                              <li {...props} key={option.label}>
                                {/* <Iconify
                                  key={option.label}
                                  icon={`circle-flags:${option.code.toLowerCase()}`}
                                  width={28}
                                  sx={{ mr: 1 }}
                                /> */}
                                {option.label}
                              </li>
                            );
                          }}
                        />
                      </FormControl>
                      <FormControl variant="standard" className=''>
                        <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>IBAN number</label>
                        <TextField
                          placeholder="Enter your IBAN number"
                          InputLabelProps={{ shrink: true }}
                        />
                      </FormControl>
                    </>
                  )}

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
        </React.Fragment>
      </FormProvider>
    </>
  );
};

export default Main;