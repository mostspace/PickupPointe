import React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography} from "@mui/material";
import DefaultButton from "src/components/button/default-button.js";
import { icTrash } from "src/assets";
import {QRCodeSVG} from "qrcode.react";

const OrderQRModal = ({isOpen, onClose, value, orderId, action}) => {
  /*const getButtonLabel = () => {
    switch (tabValue) {
      case 0:
        return 'Manually confirm pickup';
      case 1:
        return 'Manually confirm delivery';
      case 2:
        return 'Confirm autopay';
      default:
        return 'Confirm';
    }
  };*/

  return (
    <Dialog
      className="w-full"
      open={isOpen}
      onClose={onClose}
      sx={{
        width: "100% !important",
      }}
    >
      <DialogTitle id="" className='pt-[32px] sm:!pt-[64px] flex flex-col gap-[6px] items-center'>
        <h1 className='text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center font-gilroy'>
          Order <span className="font-gilroyMedium underline">{orderId}</span> QR code
        </h1>
      </DialogTitle>
      <DialogContent className="px-[85px]">
        <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
          <div className='flex sm:px-[92px] sm:py-[43px] justify-center bg-dark rounded-[12px] my-[32px]'>
            <QRCodeSVG width="100%" height="100%" value={value} className='w-auto' />
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions className="!px-[22px] !pb-[32px] sm:!pb-[64px] sm:!px-[80px] !gap-[14px]">
        <DefaultButton className='w-full' value={action ? "Manually Confirm" : "Close"} onClick={action ? action : onClose}/>
      </DialogActions>
    </Dialog>
  )
};

export default OrderQRModal;