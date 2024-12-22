import React, { useState } from "react";
import { toast } from "react-toastify";
// @mui
import {
  Typography, TextField, InputAdornment, IconButton, FormControl, ButtonGroup, Button
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { icCoin, icCopy } from "src/assets";
// Components
import LightTooltip from "src/components/LightTooltip";
import ButtonLoader from "src/components/button-loader/ButtonLoader";

// ======================================================================================

const referrals = [
  "You earned a 10% discount:",
  "You earned a 10% discount:",
];

// ======================================================================================

const PaymentMethod = () => {

  const [loading, setLoading] = useState(false);

  // Discount codes
  const handleDiscountCodeSubmit = (e)=>{
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast("Discount code is sent",{
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

  // Clipboard invite link
  const inviteLink = `https://pickuppointe.com/invite/8at3Ptk`;
  const handleCopyClick = () => {
    navigator.clipboard.writeText(inviteLink)
    .then(() => {
      toast("Invite link copied to clipboard!", {
        theme: "light",
        style: {
          backgroundColor: "white",
          color: "primary",
          fontFamily: 'Gilroy',
          fontSize: '14px',
        },
      });
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
    });
  };

  return (
    <>     
      <div className="w-full flex flex-col gap-[48px]">
        <div className="flex flex-col gap-[14px]">
          <Typography variant="h5" className="capitalize">Redeem Discounts</Typography>
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
              Referral Discounts
              <LightTooltip title="Invite a friend to join Pickup Pointe, whether as a vendor or a shopper, and enjoy a discounts on your future orders. Upon your referral's first purchase, you’ll receive a 10% discount. Invite two friends, and you’ll get an additional 10% discount on your following order. You can continue this process, extending your 10% discount benefits until you reach a maximum of (20) 10% discounts." >
                <InfoOutlinedIcon sx={{fontSize: '22px', marginBottom: '5px', marginLeft: '5px' }} /> 
              </LightTooltip> 
            </Typography>
            <Typography variant="label">Discount earned from referrals</Typography>
          </div>
          <div className="flex flex-col gap-[16px] sm:gap-[8px]">
            {referrals.length > 0 ? (
              referrals.map((referral, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-[16px]">
                  <div className="flex gap-0 sm:gap-[12px] items-center">
                    <img src={icCoin} className="" />
                    <Typography variant="subtitle1">{referral}</Typography>
                  </div>
                  <TextField
                    className="sm:w-1/2 w-full"
                    placeholder="Paste your invite link"
                    value={inviteLink}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleCopyClick}><img src={icCopy} /></IconButton>
                      </InputAdornment>
                      ),
                    }}
                  />
                </div>
              ))
            ) : (
              <Typography variant="subtitle3" className="text-center">No discount earned from referrals just yet</Typography>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentMethod;