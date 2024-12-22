import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Chip, Badge } from "@mui/material";
import CircleIcon from "@mui/icons-material/FiberManualRecord";
import dayjs from "dayjs";
import {memoizedOrderName} from "src/utils/utilityFunctions.js";
import { icMessageSquare } from "src/assets";

// ==================================================================================================

const statusStyles = {
  Submitted: {
    label: "New",
    color: "#F14445",
    backgroundColor: "rgba(211, 47, 47, 0.15)",
  },
  Pending: {
    label: "In Progress",
    color: "#FFA726",
    backgroundColor: "rgba(255, 167, 38, 0.15)",
  },
  Completed: {
    label: "Completed",
    color: "#4CAF50",
    backgroundColor: "rgba(76, 175, 80, 0.15)",
  },
};

// ==================================================================================================

const OrderListItem = ({ order }) => {
  const navigate = useNavigate();

  const currentStatus = statusStyles[order.status];
  const getOrderName = useMemo(() => (ordererInfo) => memoizedOrderName(ordererInfo), []);

  return (
    <Box
      onClick={() => order.status === "Submitted" && navigate("order-details/" + order._id)}
      className="flex flex-col ss:flex-row click-item p-[8px] ss:px-[16px] ss:py-[12px] justify-between ss:items-center gap-[12px] self-stretch rounded-[12px] cursor-pointer bg-white hover:shadow-sm hover:bg-secondary duration-200"
      sx={{
        boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.04)",
        border: "1px solid #00000010",
      }}
    >
      <div className="flex flex-col items-start gap-[10px]">
        <div className="flex flex-col items-start gap-[5px]">
          <div className="flex flex-wrap gap-[5px] items-center">
            <Typography className="text-[14px] ss:text-[16px] font-gilroyMedium">
              #{order.deliveryType === "Pickup" ? "PP" : order.deliveryType === "Delivery" ? "DD" : "SS"}
              {order._id.slice(0, 8)}
            </Typography>
            <CircleIcon className="text-[4px] text-heading" />
            {order?.notes ? (
              <Badge
                badgeContent={<img src={icMessageSquare} alt="Message Icon" className="w-[14px] ml-2" />}
              >
                <Typography className="text-[14px] ss:text-[16px] font-gilroyMedium">
                  {getOrderName(order.ordererName)}.
                </Typography>
              </Badge>
            ) : (
              <Typography className="text-[14px] ss:text-[16px] font-gilroyMedium">
                {getOrderName(order.ordererName)}.
              </Typography>
            )}
          </div>
          <div className="flex gap-[5px] items-center">
            <Typography variant="subtitle3">{order.packageCount} items</Typography>
            <CircleIcon className="text-[3px] text-normal" />
            <Typography variant="subtitle3">
              {/*{order.deliveryType}*/}Pickup at {dayjs(order.pickupTime).format("h:mm A, ")}
              {dayjs(order.pickupTime).format("MM-DD") === dayjs().format("MM-DD") ? "Today" : dayjs(order.pickupTime).format("MMM DD, YYYY")}
            </Typography>
          </div>
        </div>
      </div>
      {currentStatus && (
        <div className="flex justify-end">
          <Chip
            label={currentStatus.label}
            sx={{
              color: currentStatus.color,
              backgroundColor: currentStatus.backgroundColor,
              borderRadius: "6px",
              fontFamily: "Gilroy-Medium",
              fontSize: "14px",
              width: "96px",
              height: "32px",
            }}
          />
        </div>
      )}
    </Box>
  );
};

export default OrderListItem;