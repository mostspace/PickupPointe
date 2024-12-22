import React from 'react';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography} from "@mui/material";
import DefaultButton from "src/components/button/default-button.js";
import { icTrash, icRemove } from "src/assets";

const ConfirmDelete = ({confirmMsg, isOpen, onClose, onConfirm, description, cancelText, confirmText}) => {
  return (
    <Dialog
      className="w-full"
      open={isOpen}
      onClose={onClose}
      sx={{
        width: "100% !important",
      }}
    >
      <DialogTitle className='pt-[32px] sm:!pt-[64px] flex flex-col gap-[6px] items-center'>
        <img src={icTrash} alt={"Trash Icon"} className='w-[40%]'/>
      </DialogTitle>
      <DialogContent dividers={scroll === 'paper'}>
        <div className='flex flex-col gap-[14px] font-gilroy sm:px-[60px] py-[16px]'>
          <Typography variant="h3" className="text-center">{confirmMsg}</Typography>
          <Typography variant="subtitle1" className="text-normal text-center">
            {description}
          </Typography>
        </div>
      </DialogContent>
      <DialogActions className="!px-[22px] !pb-[32px] sm:!pb-[64px] sm:!px-[80px] !gap-[14px]">
        <DefaultButton value={cancelText || "Cancel"} className="w-full bg-[#F5F5F5] text-heading hover:bg-[#fef0f0]" onClick={onClose} />
        <DefaultButton value={confirmText || "Delete"} className="w-full" onClick={onConfirm} />
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDelete;