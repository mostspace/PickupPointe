import React, {useState} from 'react';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {TextConstants} from "src/constants/textConstants.js";
import AddLocationAltOutlinedIcon from "@mui/icons-material/AddLocationAltOutlined";
import EditLocationOutlinedIcon from "@mui/icons-material/EditLocationOutlined";
import {AddDiscountItem} from "src/sections/vendor/customer-loyalty/discounts/add-discount.js";
import DefaultButton from "src/components/button/default-button.js";

const DiscountEditModal = (
  {
    isOpen,
    discount,
    discountErrors,
    handleDiscountChange,
    handleRemoveDiscount,
    saveDiscount,
    loading,
    closeModal
  }) => {
  const index = 0;
  const onModalClose = () => {
    handleRemoveDiscount(-1, index);
    closeModal();
  }

  return (
    <Dialog
      className="w-full !font-gilroy"
      open={isOpen}
      onClose={closeModal}
      scroll="paper"
      sx={{width: "100% !important",}}
    >
      <DialogTitle className="pt-[32px] sm:!pt-[64px]">
        <h1 className="text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center font-gilroy">
          Add new discount
        </h1>
      </DialogTitle>
      <DialogContent className="sm:px-[40px] py-[32px]">
        <AddDiscountItem
          discount={discount}
          errors={discountErrors[index]}
          index={index}
          handleDiscountChange={handleDiscountChange}
        />
      </DialogContent>
      <DialogActions className="!px-[22px] !pb-[32px] sm:!pb-[64px] sm:!px-[40px] !gap-[14px]">
        <DefaultButton value={TextConstants.Cancel} className="w-full bg-[#F5F5F5] text-heading hover:bg-[#fef0f0]" onClick={onModalClose}/>
        <DefaultButton loading={loading} className='w-full' value={"Save Discount"} onClick={saveDiscount}/>
      </DialogActions>
    </Dialog>
  )
}

export default DiscountEditModal;