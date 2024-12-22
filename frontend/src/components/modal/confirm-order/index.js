import React, { useMemo, useState, useEffect } from "react";
import {
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Typography
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DefaultButton from "src/components/button/default-button.js";
import { memoizedOrderName } from "src/utils/utilityFunctions.js";
import dayjs from "dayjs";
import {confirmDelivery, confirmOrder} from "src/reducers/merchant/orderSlice.js";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {toast} from "react-toastify";

const ConfirmOrderModal = ({ isOpen, onClose, order }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const getOrderName = useMemo(() => (ordererInfo) => memoizedOrderName(ordererInfo), []);
  
  console.log(order.time?.pickupTime)
  const [pickupTime, setPickupTime] = useState(dayjs(order.time?.pickupTime));
  const originalPickupTime = useMemo(() => dayjs(order.time?.pickupTime), [order.time?.pickupTime]);

  const handleTimeChange = (increment) => {
    console.log(pickupTime)
    const newTime = increment ? pickupTime.add(10, 'minute') : pickupTime.subtract(10, 'minute');
    setPickupTime(newTime);
  };

  useEffect(() => {
    if (!isOpen) {
      setPickupTime(originalPickupTime); // Reset to original when modal is closed or canceled
    }
  }, [isOpen, onClose, originalPickupTime]);

  const calculateTimeDifference = () => {
    const now = dayjs();
    const difference = pickupTime.diff(now, 'minute'); // Directly calculate difference in minutes
    if (difference > 0) {
      if (difference > 60) {
        // Convert to hours and minutes format
        const hours = Math.floor(difference / 60);
        const minutes = difference % 60;
        return `${hours} hr ${minutes} min`;
      } else {
        return `${difference} min`;
      }
    }
    return "Past";
  };
  
  const onConfirm = async () => {
    await dispatch(confirmOrder({id: order._id, pickupTime: pickupTime.toISOString()}));
    toast("Order confirmed successfully", {type: "success", className: 'toast-custom'})
    navigate('/merchant/all-orders', {state: {order}});
  }

  const timeDifference = calculateTimeDifference();

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      scroll="paper"
      sx={{ width: "100% !important" }}
    >
      <DialogTitle className='pt-[32px]'>
        <Typography variant="h2" className="font-gilroyMedium">Confirm order</Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <div className='flex flex-col gap-[32px] py-[12px] font-gilroy'>
            <div className="flex justify-between items-center border px-[16px] py-[12px] rounded-[12px]">
              <div className="flex flex-col items-start gap-[5px]">
                <div className="flex flex-wrap gap-[5px] items-center">
                  <Typography variant="h6" className="text-[16px] ss:text-[18px] font-gilroyMedium">
                    #{order.deliveryType === "Pickup" ? "PP" : order.deliveryType === "Delivery" ? "DD" : "SS"}{order._id}
                  </Typography>
                  <CircleIcon className="text-[4px] text-heading" />
                  {order?.notes ? (
                    <Typography variant="subtitle1" className="text-[12px] ss:text-[16px] font-gilroyMedium">{getOrderName(order.ordererName)}.</Typography>
                  ) : (
                    <Typography variant="subtitle1" className="text-[12px] ss:text-[16px] font-gilroyMedium">{getOrderName(order.ordererName)}.</Typography>
                  )}
                </div>
                <div className="flex flex-wrap gap-[5px] items-center">
                  <Typography variant="subtitle3">{order.package?.length} items</Typography>
                  <CircleIcon className="text-[3px] text-normal" />
                  <Typography variant="subtitle3">
                    Pickup at {dayjs(order.time?.pickupTime).format("h:mm A, ")}
                    {dayjs(order.time?.pickupTime).format("MM-DD") === dayjs().format("MM-DD") ? "Today" : dayjs(order.time?.pickupTime).format("MMM DD, YYYY")}
                  </Typography>
                </div>
              </div>
              <Typography variant="subtitle1">{order?.total_price}</Typography>
            </div>

            <div className="rounded-[12px] bg-[#F5F5F5] p-[16px] flex flex-col items-center gap-[12px]">
              <Typography variant="subtitle1" className="text-[#a3a3a3]">Pickup at</Typography>
              <div className="flex items-center gap-[16px]">
                <IconButton sx={{ border: '1px solid #ddd' }} className="border rounded-[6px]" onClick={() => handleTimeChange(false)}>
                  <RemoveOutlinedIcon className="text-heading" />
                </IconButton>
                <Typography variant="h5">{pickupTime.format("h:mm A")}</Typography>
                <IconButton sx={{ border: '1px solid #ddd' }} className="border rounded-[6px]" onClick={() => handleTimeChange(true)}>
                  <AddOutlinedIcon className="text-heading" />
                </IconButton>
              </div>
              <div className="flex items-center gap-[12px]">
                <Typography variant="subtitle2">Today</Typography>
                <CircleIcon className="text-[#666] w-[3px]" />
                <Typography variant="subtitle2" className="text-primary">{timeDifference}</Typography>
              </div>
            </div>
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions className="!px-[22px] !py-[32px] !gap-[14px] border-t">
        <DefaultButton value="Cancel" onClick={onClose} className="w-full bg-[#F5F5F5] text-heading hover:bg-[#fef0f0]" />
        <DefaultButton value="Confirm" onClick={onConfirm} className="w-full" btnStatus={timeDifference === "Past"}/>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmOrderModal;
