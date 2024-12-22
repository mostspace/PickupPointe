import React, { useEffect, useState, useMemo } from "react";

// @mui
import {
  FormControl, Typography, InputAdornment, TextField, Autocomplete,
} from '@mui/material';

// Components
import Iconify from "src/components/iconify/iconify";

// Assets
import { countries } from 'src/_mock/assets';
import { banks } from 'src/_mock/assets';

// Icons
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';


export default function AddBankingInfo() {
    // Banking Info Modal Card Active
    const [activePaymentMethod, setActivePaymentMethod] = useState('card');

    const handlePaymentMethodClick = (paymentMethod) => {
        setActivePaymentMethod(paymentMethod);
    };

    return (
        <div className='flex flex-col gap-[14px] font-gilroy mt-6'>
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
    )
}