import React, { useState } from 'react';
// @mui components
import {
  FormControlLabel, IconButton, Typography, Popover, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
} from '@mui/material';
// Icons
import MoreVertIcon from "@mui/icons-material/MoreVert";
// Components
import IOSSwitch from 'src/components/ios-switch';
import Iconify from 'src/components/iconify';
import DefaultButton from 'src/components/button/default-button';
// Assets
import { icTrash, } from 'src/assets';

// -------------------------------------------------------------------------------------------------

export default function DiscountItemReadOnly({
  discount,
  index,
  updateActiveStatus,
  handleRemoveDiscount,
  id,
  isActive,
}) {

  // Remove Discounts Popper Menu
  const [openDiscountsMenu, setOpenDiscountsMenu] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  // State for the active status of the discount
  const [isSwitchActive, setIsSwitchActive] = useState(isActive);

  const handleDiscountMenuOpen = (event) => {
    setOpenDiscountsMenu(event.currentTarget);
  };

  const handleDiscountMenuClose = () => {
    setOpenDiscountsMenu(null);
  };

  const handleRemoveDiscountClick = () => {
    setOpenConfirmDialog(true); // Open the confirmation dialog
  };

  const handleCancelRemoveDiscount = () => {
    handleDiscountMenuClose()
    setOpenConfirmDialog(false); // Close the dialog if user cancels
  };

  const handleSwitchToggle = async () => {
    const previousState = isSwitchActive;
    setIsSwitchActive(!isSwitchActive); // Optimistically toggle the switch

    try {
      // Call the API to update the active status
      await updateActiveStatus(id, !isSwitchActive);
    } catch (error) {
      // Revert the switch back if the API fails
      setIsSwitchActive(previousState);
      alert("Failed to update the discount status. Please try again.");
    } finally {
    }
  };

  return (
    <div className={`w-full flex flex-col xs:flex-row gap-3 my-1 border-[#d9d9d9] border rounded-xl p-4 ${isActive?'opacity-100': 'opacity-40'} `}>
      <div className='w-full flex items-start gap-3 sm:gap-10'>
        <div className='flex flex-col gap-2 w-1/4 justify-center'>
          <Typography variant={'subtitle1'} className=' text-sm lg:text-md' > Discount Code </Typography>
          <Typography variant={'subtitle2'} className=' text-[12px] lg:text-sm' >{discount.discountCode} </Typography>
        </div> 
        <div className='flex flex-col gap-2 w-1/4 justify-center'>
          <Typography variant={'subtitle1'} className=' text-sm lg:text-md' > Discount Amount </Typography>
          <Typography variant={'subtitle2'} className=' text-[12px] lg:text-sm' >{discount.discountAmount} </Typography>
        </div> 
        <div className='flex flex-col gap-2 w-1/4 justify-center'>
          <Typography variant={'subtitle1'} className=' text-sm lg:text-md' > Discount Method </Typography>
          <Typography variant={'subtitle2'} className=' text-[12px] lg:text-sm' >{discount.method} </Typography>
        </div>
      </div>
      <div className='w-fit flex items-center gap-2 pl-2'>
        <FormControlLabel
          className='max-w-fit'
          label=''
          control={
            <IOSSwitch
            checked={isSwitchActive}
            onChange={handleSwitchToggle}
          />
          }
        />
        <IconButton
          className='bg-[#F5F5F5] p-[5px] w-[32px] h-[32px]'
          // onClick={() => handleRemoveDiscount(id,index)}
          onClick={handleDiscountMenuOpen}
        >
          <MoreVertIcon
            sx={{ color: "#181818", fontSize: "18px" }}
            className="cursor-pointer"
          />
          {/* <RemoveIcon className='text-[20px] text-heading' /> */}
        </IconButton>
      </div>

      {/* Handle Discounts Menu */}
      <Popover
        open={Boolean(openDiscountsMenu)}
        anchorEl={openDiscountsMenu}
        onClose={handleDiscountMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 0.6,
            width: 160,
            "& .MuiMenuItem-root": {
              px: 1,
              typography: "body2",
              borderRadius: 0.75,
              fontFamily: "Gilroy",
            },
          },
        }}
      >
        <MenuItem onClick={handleRemoveDiscountClick} className='text-primary'>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 1 }} /> Delete discount
        </MenuItem>
      </Popover>

      {/* Remove Discount Confirmation Modal */}
      <React.Fragment>
        <Dialog className="w-full"
          open={openConfirmDialog}
          onClose={handleCancelRemoveDiscount}
          sx={{
            width: "100% !important",
          }}
        >
          <DialogTitle className='pt-[32px] sm:!pt-[64px] flex flex-col gap-[6px] items-center'>
            <img src={icTrash} className='w-[40%]' loading="lazy"/>
          </DialogTitle>
          <DialogContent dividers={scroll === 'paper'}>
            <DialogContentText>
              <div className='flex flex-col gap-[14px] font-gilroy sm:px-[60px] py-[16px]'>
                <Typography variant="h3" className="text-center">Are you sure you want to delete this discount?</Typography>
                <Typography variant="subtitle1" className="text-normal text-center">You won’t be able to recover it afterwards.</Typography>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions className="!px-[22px] !pb-[32px] sm:!pb-[64px] sm:!px-[80px] !gap-[14px]">
            <DefaultButton value="Cancel" className="w-full bg-[#F5F5F5] text-heading hover:bg-[#fef0f0]" onClick={handleCancelRemoveDiscount} />
            <DefaultButton value="Delete" className="w-full" onClick={() => {
              handleCancelRemoveDiscount()
              handleRemoveDiscount(id,index)
            }} />
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </div>
  );
}
