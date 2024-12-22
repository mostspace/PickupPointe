import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, TextField, Typography, InputAdornment,
  FormHelperText, Autocomplete
} from '@mui/material';
import {
  CardCvcElement, CardExpiryElement, CardNumberElement
} from "@stripe/react-stripe-js";
import AppleIcon from '@mui/icons-material/Apple';
import Iconify from 'src/components/iconify';
import DefaultButton from "src/components/button/default-button.js";
import {countries} from 'src/_mock/assets';

const DEFAULT_COUNTRY = countries.find(country => country.label === 'United States');

const PaymentDialog = (
  {
    open,
    onClose,
    paymentState,
    setPaymentState,
    onSubmit,
    isLoading,
    title,
    okText
  }) => {
  return (
    <Dialog
      className="default-modal"
      open={open}
      onClose={onClose}
      scroll="paper"
      sx={{width: "100% !important"}}
    >
      <DialogTitle className='pt-[32px] sm:!pt-[64px]'>
        <h1 className='text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center font-gilroy'>
          {title || ""}
        </h1>
      </DialogTitle>
      <DialogContent>
        <div className='flex flex-col gap-[14px] font-gilroy sm:px-[60px] py-[16px]'>
          <FormControl variant="standard">
            <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>
              Email
            </label>
            <TextField
              size="small"
              variant='outlined'
              required
              fullWidth
              placeholder='Enter email address'
              value={paymentState?.email || ''}
              onChange={(e) => setPaymentState(prev => ({
                ...prev,
                email: e.target.value,
                errorMessage: {...prev.errorMessage, email: null}
              }))}
            />
            {paymentState.errorMessage.email && (
              <FormHelperText error className="font-gilroy">
                {paymentState.errorMessage.email}
              </FormHelperText>
            )}
          </FormControl>

          <div className="flex flex-col sm:flex-row justify-between w-full gap-[14px] items-start">
            <FormControl variant="standard" className='w-full'>
              <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>
                Full name
              </label>
              <TextField
                size="small"
                variant='outlined'
                required
                fullWidth
                placeholder='Enter full name'
                value={paymentState?.fullName || ''}
                onChange={(e) => setPaymentState(prev => ({
                  ...prev,
                  fullName: e.target.value,
                  errorMessage: {...prev.errorMessage, fullName: null}
                }))}
              />
              {paymentState.errorMessage.fullName && (
                <FormHelperText error className="font-gilroy">
                  {paymentState.errorMessage.fullName}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl variant="standard" className='w-full'>
              <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>
                Country
              </label>
              <Autocomplete
                fullWidth
                autoHighlight
                options={countries}
                getOptionLabel={(option) => option.label}
                value={paymentState?.country ? countries.find(c => c.code === paymentState.country) : DEFAULT_COUNTRY}
                onChange={(event, newValue) => setPaymentState(prev => ({
                  ...prev,
                  country: newValue?.code || prev.country
                }))}
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
                renderOption={(props, option) => (
                  <li {...props} key={option.label}>
                    <Iconify
                      icon={`circle-flags:${option.code.toLowerCase()}`}
                      width={28}
                      sx={{mr: 1}}
                    />
                    {option.label}
                  </li>
                )}
              />
            </FormControl>
          </div>

          {/* Payment Methods */}
          <div className="flex justify-between gap-[15px] items-start">
            <div
              className={`border p-[12px] flex flex-col gap-[4px] w-full rounded-[6px] items-center justify-start sm:justify-center group hover:border-blue hover:text-blue cursor-pointer h-[90px] sm:h-none ${
                (paymentState?.activeMethod || 'card') === 'card' ? 'border-blue text-blue' : ''
              }`}
              onClick={() => setPaymentState(prev => ({...prev, activeMethod: 'card'}))}
            >
              <Iconify icon="oi:credit-card" width={16}/>
              <Typography variant="subtitle2" className={`group-hover:text-blue text-center ${
                (paymentState?.activeMethod || 'card') === 'card' ? 'text-blue' : ''
              }`}>
                Card
              </Typography>
            </div>

            <div
              className="relative border p-[12px] flex flex-col gap-[1px] w-full rounded-[6px] items-center justify-start sm:justify-center group hover:border-blue cursor-pointer h-[90px] sm:h-none">
              <div
                className="absolute inset-0 flex items-center justify-center rounded-[6px] backdrop-blur-[2px] bg-black/60">
                <Typography variant="subtitle3" className="text-white font-bold text-center">
                  Coming Soon
                </Typography>
              </div>
              <AppleIcon className="text-black text-[20px]"/>
              <Typography variant="subtitle2" className="text-center">
                Apple Pay
              </Typography>
            </div>

            <div
              className="relative border p-[12px] flex flex-col gap-[1px] w-full rounded-[6px] items-center justify-start sm:justify-center group hover:border-blue cursor-pointer h-[90px] sm:h-none">
              <div
                className="absolute inset-0 flex items-center justify-center rounded-[6px] backdrop-blur-[2px] bg-black/60">
                <Typography variant="subtitle3" className="text-white font-bold text-center">
                  Coming Soon
                </Typography>
              </div>
              <Iconify icon="logos:paypal" width={16}/>
              <Typography variant="subtitle2" className="text-center">
                PayPal
              </Typography>
            </div>
          </div>

          {/* Card Details */}
          <FormControl variant="standard">
            <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>
              Card number
            </label>
            <TextField
              placeholder="1234 1234 1234 1234"
              InputLabelProps={{shrink: true}}
              InputProps={{
                inputComponent: CardNumberElement,
                endAdornment: (
                  <InputAdornment position="end">
                    <Iconify icon="logos:mastercard" width={24} className="mr-5"/>
                    <Iconify icon="logos:maestro" width={24} className="mr-5"/>
                    <Iconify icon="logos:visa" width={24}/>
                  </InputAdornment>
                ),
              }}
              required
            />
          </FormControl>

          <div className="flex flex-col sm:flex-row justify-between w-full gap-[14px] items-start">
            <FormControl variant="standard" className='w-full'>
              <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>
                Expiration date
              </label>
              <TextField
                placeholder="MM/YY"
                InputLabelProps={{shrink: true}}
                InputProps={{
                  inputComponent: CardExpiryElement
                }}
                required
              />
            </FormControl>

            <FormControl variant="standard" className='w-full'>
              <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>
                CVV code
              </label>
              <TextField
                placeholder="CVV"
                InputLabelProps={{shrink: true}}
                InputProps={{
                  inputComponent: CardCvcElement
                }}
                required
              />
            </FormControl>
          </div>
        </div>
      </DialogContent>
      <DialogActions className="!px-[22px] !pb-[32px] sm:!pb-[64px] sm:!px-[80px] !gap-[14px]">
        <DefaultButton
          value="Cancel"
          className="w-full bg-[#F5F5F5] text-heading hover:bg-[#fef0f0]"
          onClick={onClose}
        />
        <DefaultButton
          width={295}
          value={okText || "OK"}
          loading={paymentState.loading || isLoading}
          className="w-full"
          onClick={onSubmit}
        />
      </DialogActions>
    </Dialog>
  );
};

export default PaymentDialog;