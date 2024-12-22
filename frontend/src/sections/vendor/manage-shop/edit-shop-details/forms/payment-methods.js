import React, { useState, useEffect } from "react";
import {
  FormControl,
  Typography,
  IconButton,
  InputAdornment,
  TextField,
  Autocomplete,
  Checkbox,
} from "@mui/material";
import Iconify from "src/components/iconify/iconify";
import { countries } from "src/_mock/assets";
import AppleIcon from "@mui/icons-material/Apple";
import { MoreHorizOutlined } from "@mui/icons-material";
import {
  CardCvcElement, CardElement, CardExpiryElement, CardNumberElement,
  Elements, LinkAuthenticationElement, PaymentElement, useElements, useStripe
} from "@stripe/react-stripe-js";

const StripeWrappedComponent = React.forwardRef((props, ref) => {
  const { component: Component, onChange, ...other } = props;
  React.useImperativeHandle(ref, () => ({
    focus: () => {},
  }));
  return <Component onChange={onChange} {...other} />;
});

export default function PaymentMethodsForm({setInfo}) {
  // Payment method Modal Card Active
  const elements = useElements();
  const [activePaymentMethod, setActivePaymentMethod] = useState('card');
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("");
  const [errorMessage, setErrorMessage] = useState({});
  const [paymentLoading, setPaymentLoading] = useState(false);

  const handlePaymentMethodClick = async (paymentMethod) => {
    setActivePaymentMethod(paymentMethod);
  };

  useEffect(() => {
    const cardNumber = elements.getElement(CardNumberElement);
    const cardExpiry = elements.getElement(CardExpiryElement);
    const cardCvc = elements.getElement(CardCvcElement);

    cardNumber.on('change', (event) => {
      if (event.complete) setInfo(prev => ({...prev, cardNumber: true}));
      else setInfo(prev => ({...prev, cardNumber: false}));
    });

    cardExpiry.on('change', (event) => {
      if (event.complete) setInfo(prev => ({...prev, cardExpiry: true}));
      else setInfo(prev => ({...prev, cardExpiry: false}));
    });

    cardCvc.on('change', (event) => {
      if (event.complete) setInfo(prev => ({...prev, cardCvc: true}));
      else setInfo(prev => ({...prev, cardCvc: false}));
    });

    return () => {
      cardNumber.off('change');
      cardCvc.off('change');
      cardExpiry.off('change');
    };
  }, []);

  useEffect(() => {
    if (email) setInfo(prev => ({...prev, email}));
    if (fullName) setInfo(prev => ({...prev, fullName}));
    if (country) setInfo(prev => ({...prev, country}));
    if (activePaymentMethod) setInfo(prev => ({...prev, activePaymentMethod}));
  }, [email, fullName, country, activePaymentMethod]);

  return (
    <div className="flex flex-col gap-[14px] font-gilroy mt-2 sm:mt-6">
      <FormControl variant="standard" className="">
        <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
          Email
        </label>
        <TextField
          size="small"
          variant="outlined"
          required
          fullWidth
          placeholder="Enter email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrorMessage((prev) => ({ ...prev, email: null }));
          }}
        />
      </FormControl>
      <div className="flex flex-col sm:flex-row justify-between w-full gap-[14px] items-start">
        <FormControl variant="standard" className="w-full">
          <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
            Full name
          </label>
          <TextField
            size="small"
            variant="outlined"
            required
            fullWidth
            placeholder="Enter full name"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              setErrorMessage((prev) => ({...prev, fullName: null}));
            }}
          />
        </FormControl>
        <FormControl variant="standard" className="w-full">
          <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
            Country
          </label>
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
                  autoComplete: "new-password",
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
            onChange={(event, newValue) => setCountry(newValue.code)}
          />
        </FormControl>
      </div>
      <div className="flex justify-between gap-[15px] items-start">
        <div
          className={`border p-[12px] flex flex-col gap-[4px] w-full rounded-[6px]
            items-center justify-start sm:justify-center group hover:border-blue
            hover:text-blue cursor-pointer h-[90px] sm:h-none
            ${activePaymentMethod === "card" ? "border-blue text-blue" : ""}`}
          onClick={() => handlePaymentMethodClick("card")}
        >
          <Iconify icon="oi:credit-card" width={16} />
          <Typography
            variant="subtitle2"
            className={`group-hover:text-blue text-center ${activePaymentMethod === "card" ? "text-blue" : ""}`}
          >
            Card
          </Typography>
        </div>
        <div
          className={`relative border p-[12px] flex flex-col gap-[1px] w-full rounded-[6px] items-center justify-start sm:justify-center group hover:border-blue
            cursor-pointer h-[90px] sm:h-none ${activePaymentMethod === "applePay" ? "border-blue text-blue" : ""}`}
          onClick={() => handlePaymentMethodClick("applePay")}
        >
          <div className="absolute inset-0 flex items-center justify-center rounded-[6px] backdrop-blur-[2px] bg-black/60">
            <Typography variant="subtitle2" className="text-white font-bold text-center">
              Coming Soon
            </Typography>
          </div>
          <AppleIcon
            className={`text-black text-[20px] group-hover:text-blue ${activePaymentMethod === "applePay" ? "text-blue" : ""}`}
          />
          <Typography
            variant="subtitle2"
            className={`group-hover:text-blue text-center ${activePaymentMethod === "applePay" ? "text-blue" : ""}`}
          >
            Apple Pay
          </Typography>
        </div>

        <div
          className={`relative border p-[12px] flex flex-col gap-[1px] w-full rounded-[6px] items-center justify-start sm:justify-center group hover:border-blue
            cursor-pointer h-[90px] sm:h-none ${activePaymentMethod === "paypal" ? "border-blue text-blue" : ""}`}
          onClick={() => handlePaymentMethodClick("paypal")}
        >
          <div className="absolute inset-0 flex items-center justify-center rounded-[6px] backdrop-blur-[2px] bg-black/60">
            <Typography variant="subtitle2" className="text-white font-bold text-center">
              Coming Soon
            </Typography>
          </div>
          <Iconify icon="logos:paypal" width={16} />
          <Typography
            variant="subtitle2"
            className={`group-hover:text-blue text-center ${activePaymentMethod === "paypal" ? "text-blue" : ""}`}
          >
            PayPal
          </Typography>
        </div>
        {/* <div className="border flex p-[5px] flex-col gap-[4px] w-[40px] rounded-[6px] items-center justify-start h-[90px] sm:h-none">
            <IconButton size="small" edge="end">
              <MoreHorizOutlined className="text-[18px]" />
            </IconButton>
          </div> */}
      </div>
      <FormControl variant="standard" className="">
        <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
          Card number
        </label>
        <TextField
          placeholder="1234 1234 1234 1234"
          slotProps={{
            input: {
              inputComponent: StripeWrappedComponent,
              inputProps: {
                component: CardNumberElement,
              },
              endAdornment: (
                <InputAdornment position="end">
                  <Iconify icon="logos:mastercard" width={24} className="mr-5" />
                  <Iconify icon="logos:maestro" width={24} className="mr-5" />
                  <Iconify icon="logos:visa" width={24} />
                </InputAdornment>
              )
            },
            inputLabel: {
              shrink: true
            }
          }}
          required
        />
      </FormControl>
      <div className="flex flex-col sm:flex-row justify-between w-full gap-[14px] items-start">
        <FormControl variant="standard" className="w-full">
          <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
            Expiration date
          </label>
          <TextField
            placeholder="MM/YY"
            slotProps={{
              input: {
                inputComponent: StripeWrappedComponent,
                inputProps: {
                  component: CardExpiryElement,
                },
              },
              inputLabel: {
                shrink: true
              }
            }}
            required
          />
        </FormControl>
        <FormControl variant="standard" className="w-full">
          <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
            CVV code
          </label>
          <TextField
            placeholder="CVV"
            slotProps={{
              input: {
                inputComponent: StripeWrappedComponent,
                inputProps: {
                  component: CardCvcElement,
                },
              },
              inputLabel: {
                shrink: true
              }
            }}
            required
          />
        </FormControl>
      </div>
    </div>
  );
}
