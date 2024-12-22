import React, { useState } from "react";
import { toast } from "react-toastify";
// @mui
import {
  ButtonGroup, FormControl, Button, Typography, TextField,
} from '@mui/material';
// Components
import LightTooltip from "src/components/LightTooltip";
import ButtonLoader from "src/components/button-loader/ButtonLoader";
// import Discounts from "src/components/discounts";
import Discounts from "./discounts";
// Icons
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
// Assets
import { icCoin } from "src/assets";

// ======================================================================================

const referrals = [
  // "You earned a 1% POS fee reduction until 8/3/2024",
  // "You earned a 1% POS fee reduction until 9/3/2024",
  // "You earned a 1% POS fee reduction until 10/3/2024",
];

// ======================================================================================

const PaymentMethod = () => {

  const [loading, setLoading] = useState(false);

  // Discount codes
  const handleDiscountCodeSubmit = (e)=>{
    setLoading(true)
    setTimeout(() => {
        setLoading(false)
        toast("Discount code is changed",{
          theme: "light",
          style: {
            backgroundColor: "white",
            color: "primary",
            fontFamily: 'Gilroy',
            fontSize: '14px',
          },
        })
    }, 1000);
  }

  return (
    <div className="w-full flex flex-col gap-[48px]">
      <Discounts />
      
      {/* <Discounts /> */}

      <div className="flex flex-col gap-[14px]">
        <Typography variant="h5" className="capitalize">Discount Codes</Typography>
        <FormControl variant="standard" className='gap-[10px]'>
          <Typography variant="subtitle3">If you have received a discount code, enter it below.</Typography>
          <ButtonGroup variant="text" className="flex items-end">
            <FormControl className="">
              <TextField 
                name="lastname" 
                placeholder='Enter the discount code' 
                type="number" 
                className="border-[1px]"
                sx={{
                  borderRadius: '0 !important',
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderWidth: '1px',
                    },
                  },
                }}
              />
            </FormControl>
            {
              loading ? <Button
                className="w-20 -ml-1"
                sx={{
                  padding: '4px 2px',
                  height: '41px',
                  fontFamily: 'Gilroy',
                  fontSize: '14px',
                  borderRadius: "8px",
                  border: "1px solid red",
                  backgroundColor: "white",
                }}
                disabled={loading}
              >
                <ButtonLoader/>
              </Button> : <Button
                className="w-20 -ml-1"
                sx={{
                  padding: '4px 2px',
                  height: '41px',
                  fontFamily: 'Gilroy',
                  fontSize: '14px',
                  color:"rgba(254, 254, 255, 1)",
                  borderRadius: "8px",
                  backgroundColor: "rgba(241, 68, 69, 1)",
                  textTransform: "unset",
                  "&:hover": {
                    backgroundColor: "rgba(300, 68, 69, 1)",
                  },
                }}
                onClick={handleDiscountCodeSubmit}
              >
                Submit
              </Button>
            }
          </ButtonGroup>
        </FormControl>
      </div>

      <div className="flex flex-col gap-[14px]">
        <div className="w-full flex flex-col gap-[8px]">  
          <Typography variant="h5" className="capitalize">
            Referral Reductions
            <LightTooltip title="Invite a friend to join Pickup Pointe, whether as a vendor or a shopper, and enjoy a reduction in your POS fees. Upon their first purchase, you’ll receive a 1% reduction on your POS fees for 30 days. Invite two friends, and you’ll get an additional 30 days of reduced fees. You can continue this process, extending your benefit period until you reach a maximum of one year." >
              <InfoOutlinedIcon sx={{fontSize: '20px', marginBottom: '3px', marginLeft: '5px' }} /> 
            </LightTooltip> 
          </Typography>
          <Typography variant="subtitle3">Fee reduction earned from referrals</Typography>
        </div>
        <div className="flex flex-col gap-[8px]">
          {referrals.length > 0 ? (
            referrals.map((referral, index) => (
              <div key={index} className="flex gap-[12px] items-center">
                <img src={icCoin} className="" />
                <Typography variant="subtitle1">{referral}</Typography>
              </div>
            ))
          ) : (
            <Typography variant="subtitle3" className="text-center my-5">No POS fee reductions earned from referrals just yet</Typography>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;