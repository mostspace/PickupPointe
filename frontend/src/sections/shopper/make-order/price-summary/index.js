import React, { useState } from 'react';
import { Divider, TextField, Typography, InputAdornment, IconButton } from '@mui/material';
import { formattedNumber } from 'src/utils/utilityFunctions';
import CircleIcon from '@mui/icons-material/Circle';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import {useSelector} from "react-redux";

export default function PriceSummary({ cartObject, deliveryFee, deliveryType }) {
  // Stripe processing fee calculation: 2.9% of total + $0.30
  const stripeFeeRate = 0.029;
  const stripeBaseFee = 0.3;
  const {deliveryInfo} = useSelector(state => state.shopper.orders)
  const productPrice = cartObject.total + cartObject.items.reduce((acc, elm) => acc + (elm.quantity * (elm.modifierPrices || []).reduce((acc2, el) => acc2 + el, 0)), 0);
  
  const subtotal = productPrice + (deliveryType !== 1 && deliveryInfo.fee ? deliveryInfo.fee / 100 : 0);
  const stripeFee = subtotal * stripeFeeRate + stripeBaseFee;
  const totalAmount = subtotal + stripeFee;

  // Checking discount
  const [discountCode, setDiscountCode] = useState("");

  const handleDiscountCodeChange = (event) => {
    setDiscountCode(event.target.value);
  };

  return (
    <div className="w-full md:max-w-[360px] flex flex-col gap-[16px] sm:flex-row md:flex-col md:gap-[32px] bg-dark rounded-[16px] p-[15px] md:p-[24px]">
      <div className='flex flex-col gap-[16px] w-full'>
        <Typography variant='h6' className="capitalize">Price summary</Typography>
        <div className='flex flex-col p-[16px] border rounded-[16px]'>
          <div className="flex flex-col gap-[16px]">
            <div className="flex justify-between gap-2">
              <Typography variant="subtitle2">Products price</Typography>
              <Typography variant="subtitle1">${formattedNumber(productPrice)}</Typography>
            </div>
            {deliveryType !== 1 && <div className="flex justify-between gap-2">
                <Typography variant="subtitle2">Delivery charges</Typography>
                <Typography variant="subtitle1">
                  {deliveryInfo.fee ? `$${formattedNumber(deliveryInfo.fee / 100)}` : "-"}
                </Typography>
              </div>}
            <div className="flex justify-between gap-2">
              <Typography variant="subtitle2">Processing</Typography>
              <Typography variant="subtitle1">${formattedNumber(stripeFee)}</Typography>
            </div>
          </div>
          <Divider className="my-[16px]" />
          <div className="flex flex-col gap-[16px]">
            <div className="flex justify-between gap-2">
              <Typography variant="subtitle2">Discount code</Typography>
              <TextField
                size="small"
                variant="outlined"
                required
                fullWidth
                placeholder="Enter discount code"
                value={discountCode}
                onChange={handleDiscountCodeChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        edge="end" 
                        disabled={!discountCode.trim()}
                        // sx={{
                        //   color: discountCode.trim() ? "heading.main" : "text.disabled",
                        // }}
                      >
                        <CheckCircleOutlineRoundedIcon className={`${discountCode.trim() ? "text-heading" : "text-gray-400"}`} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </div>
          <Divider className="my-[16px]" />
          <div className="flex flex-col gap-[24px]">
            <div className="flex justify-between gap-2">
              <Typography variant="subtitle2">Total amount</Typography>
              <Typography variant="subtitle1">${formattedNumber(totalAmount)}</Typography>
            </div>
            <div className='w-full flex justify-center items-center'>
              <div className='w-full p-[3px] rounded-full shadow-sm' style={{background: 'linear-gradient(45deg, #2d2627, #231616, #481d1d, #952e2f, #d53e3e)'}}>
                <div className='w-full rounded-full p-[4px] flex justify-center items-center text-center border border-dashed'>
                  <Typography variant='label' className='text-white'>You're saving <span className='font-gilroyMedium'>22%</span> on this order<br/>vs other apps</Typography>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {cartObject?.items.length > 0 && (
        <div className='flex flex-col gap-[16px] w-full'>
          <Typography variant="h6" className="">
            Items in cart: {cartObject.items.length}
          </Typography>
          <div className="w-full flex flex-col p-[16px] rounded-[16px] border">
            {cartObject.items.map((cartItem, index) => (
              <div key={cartItem._id}>
                <div className="flex flex-col gap-[5px]">
                  <div className="w-full flex gap-[12px] items-center">
                    <img
                      loading="lazy"
                      src={cartItem.photo}
                      className="w-[56px] h-[48px] rounded-[8px] mix-blend-darken"
                    />
                    <div className="w-full flex flex-col gap-[8px]">
                      <div className="w-full flex items-center justify-between gap-[8px]">
                        <Typography variant="subtitle1">{cartItem.name}</Typography>
                        <Typography variant="h6" className="flex items-center">
                          <small>{cartItem.quantity}x</small>
                          <CircleIcon className="text-[3px] mx-[5px]" />{" "}
                          ${formattedNumber(cartItem.quantity * (cartItem.defaultPrice + (cartItem.modifierPrices || []).reduce((acc, ele) => acc + ele, 0)))}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>
                {!(index === cartObject.items.length - 1) && <Divider className="my-[12px]" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
