import React from "react";
import { Popover, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CircleIcon from "@mui/icons-material/Circle";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const NotificationItem = ({ notification, onClick }) => (
  <li className="hover:bg-hover cursor-pointer px-[16px]" onClick={onClick}>
    <div className="text-heading border-b py-[12px]">
      <Typography variant="subtitle2" className="text-heading list-desc">
        {notification.text}
      </Typography>
      <div className="flex items-center gap-[6px]">
        <Typography variant="label">{notification.time}</Typography>
        <CircleIcon className="text-[4px] text-gray-400" />
        <Typography variant="label">{notification.date}</Typography>
      </div>
    </div>
  </li>
);

export default function NotificationPopover({ open, anchorEl, onClose, headerType, notifications }) {
  const navigate = useNavigate();

  return (
    <Popover
      className="mt-6"
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      PaperProps={{
        sx: {
          width: 364,
          "& .MuiMenuItem-root": {
            px: 1,
            typography: "body2",
            borderRadius: 0.75,
            fontFamily: "Gilroy",
          },
        },
      }}
    >
      <ul>
        {notifications.map((notification, index) => (
          <NotificationItem
            key={index}
            notification={notification}
            // onClick={() => navigate(notification.link)}
            onClick={() => navigate(headerType === 'vendor' ? '/vendor/notifications' : '/shopper/notifications')}
          />
        ))}
        <li
          className="hover:bg-hover cursor-pointer px-[16px] py-[8px] text-center"
          onClick={() => navigate(headerType === 'vendor' ? '/vendor/notifications' : '/shopper/notifications')}
        >
          <Typography variant="subtitle2">
            See all notifications{" "}
            <ArrowForwardIosIcon className="text-heading text-[14px] mb-1 ml-1" />
          </Typography>
        </li>
      </ul>
    </Popover>
  );
}
