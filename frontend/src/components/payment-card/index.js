import React from "react";
import { toast } from "react-toastify";
// @mui
import {
  Button, MenuItem, Typography, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
// Components
import StyledMenu from "src/components/menu";
// Icons
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import CircleIcon from '@mui/icons-material/Circle';
// Assets
import { icTrash } from "src/assets";

// ==========================================================================================================================

const PaymentCard = ({ cardInfo, onDelete, onPrimary, isPrimary }) => {
  // Payment method setting menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleSettingPaymentMethodClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleSettingPaymentMethodClose = () => {
    if (onPrimary) {
      onPrimary(cardInfo._id);
    }
    setAnchorEl(null);
  };

  // Delete payment method modal
  const [openDeletePaymentMethod, setOpenDeletePaymentMethod] = React.useState(false);

  const handleDeletePaymentMethodOpen = () => {
    handleSettingPaymentMethodClose();
    setOpenDeletePaymentMethod(true);
  };

  const handleDeletePaymentMethodClose = () => {
    setOpenDeletePaymentMethod(false);
  };

  // Delete payment method(My Payment methods)
  const handleDeletePaymentMethodClick = async () => {
    try {
      if (onDelete) {
        onDelete(cardInfo._id);
      }
      toast("Payment method deleted.",{
        theme: "light",
        style: {
          backgroundColor: "white",
          color: "primary",
          fontFamily: 'Gilroy',
          fontSize: '14px',
        },
      }),
      handleDeletePaymentMethodClose();
    } catch (error) {
      toast("Deleting the payment method Failed", {
        type: 'error',
        className: 'toast-custom',
      });
    }
  }

  return (
    <>
        <div className="flex px-[12px] py-[16px] justify-between items-center gap-12px self-stretch rounded-[12px] border border-[rgba(0, 0, 0, 0.08)] bg-white">
            <div className="flex flex-col items-start gap-[2px]">
                <div className="flex items-center gap-[8px]">
                    <p className="text-[16px] font-normal leading-[25px] text-heading">{cardInfo.title || 'Payment method'}</p>
                    {isPrimary && <CircleIcon className="text-[5px] text-primary" /> }
                    {isPrimary && <Typography variant="subtitle2" className="text-primary">primary card</Typography>}
                </div>
                <p className="text-[14px] font-normal leading-[22px] text-normal">•••• •••• •••• {cardInfo.last4}</p>
            </div>
            <div>
                <IconButton onClick={handleSettingPaymentMethodClick}>
                    <MoreVertOutlinedIcon sx={{color: "#181818", fontSize:"22px"}} />
                </IconButton>
                <StyledMenu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleSettingPaymentMethodClose}
                    className="min-w-[133px]"
                    >
                    <MenuItem onClick={handleSettingPaymentMethodClose} className="!font-gilroy !text-[14px] !text-heading !font-normal !leading-[22px]">
                        Make primary
                    </MenuItem>
                    <MenuItem onClick={handleDeletePaymentMethodOpen} className="!font-gilroy !text-[14px] !text-primary !font-normal !leading-[22px]">
                        Delete method
                    </MenuItem>
                </StyledMenu>
            </div>
        </div>

        {/* Delete payment method */}
        <React.Fragment>
          <Dialog
            className="w-full"
            open={openDeletePaymentMethod}
            onClose={handleDeletePaymentMethodClose}
            sx={{
              width: "100% !important",
            }}
          >
            <DialogTitle
              id=""
              className="pt-[32px] sm:!pt-[64px] flex flex-col gap-[6px] items-center"
            >
              <img src={icTrash} className="w-[40%]" loading="lazy" />
            </DialogTitle>
            <DialogContent dividers={scroll === "paper"}>
              <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
                <div className="flex flex-col gap-[14px] font-gilroy sm:px-[60px] py-[16px]">
                  <h1 className="text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center font-gilroy">
                    Are you sure you want to delete this payment method?
                  </h1>
                  <p className="text-normal font-light leading-[25px] text-[16px] text-center">
                    You won’t be able to recover it afterwards.
                  </p>
                </div>
              </DialogContentText>
            </DialogContent>
            <DialogActions className="!px-[22px] !pb-[32px] sm:!pb-[64px] sm:!px-[80px] !gap-[14px]">
              <Button
                sx={{
                  width: "100%",
                  height: "44px",
                  fontFamily: "Gilroy",
                  fontSize: "14px",
                  color: "#181818",
                  borderRadius: "8px",
                  backgroundColor: "#F5F5F5",
                  textTransform: "unset",
                }}
                onClick={handleDeletePaymentMethodClose}
              >
                Cancel
              </Button>
              <Button
                className="w-full"
                sx={{
                  width: "100%",
                  height: "44px",
                  fontFamily: "Gilroy",
                  fontSize: "14px",
                  color: "#ffffff",
                  borderRadius: "8px",
                  backgroundColor: "#F14445",
                  textTransform: "unset",
                  "&:hover": {
                    backgroundColor: "#E13031",
                  },
                }}
                onClick={handleDeletePaymentMethodClick}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
    </>
  );
};

export default PaymentCard;