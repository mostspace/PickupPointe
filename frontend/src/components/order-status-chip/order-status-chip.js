import {Chip} from "@mui/material";
import React from "react";

const OrderStatusChip = ({status}) => {
  const color = {
    "Submitted": "#265add",
    "Pending": "#DD7E26",
    "Completed": "#4CAF50",
    "Canceled": "#D32F2F"
  }

  const bgColor = {
    "Submitted": "rgba(47,118,211,0.24)",
    "Pending": "rgba(241, 161, 68, 0.24)",
    "Completed": "rgba(76, 175, 80, 0.24)",
    "Canceled": "rgba(211, 47, 47, 0.24)"
  }
  return (
    <Chip
      label={status}
      sx={{
        color: color[status],
        backgroundColor: bgColor[status],
        borderRadius: '6px',
        fontFamily: 'Gilroy',
        fontSize: '12px',
        height: '25px',
        width: '90px'
      }}/>
  );
}

export default OrderStatusChip;