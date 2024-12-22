import React, {useEffect, useState} from "react";
import { useNavigate, Link } from "react-router-dom";
// @mui
import {
  Typography, Popover, MenuItem, FormControlLabel, Checkbox, Button, Box,
} from "@mui/material";
// Components
import FloatingChatButton from "src/components/floating-chat-button";
import DefaultButton from "src/components/button/default-button";
import {useSelector} from "react-redux";
import LoadingProgress from "src/components/loading-screen/loading-progress.js";
import ConfirmOrderModal from "src/components/modal/confirm-order/index.js";
import MerchantOrderItem from "src/components/merchant-order-item/index.js";
import {toast} from "react-toastify";
import {useSocket} from "src/contexts/socketContext.js";

// ---------------------------------------------------------------------------------------------

const Main = ({ order }) => {
  const navigate = useNavigate();
  const socket = useSocket();
  // Item Menu
  const [openItemMenu, setOpenItemMenu] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const {orderDetail, isLoading} = useSelector((state) => state.merchant.orders);

  const handleItemMenuOpen = (event, item) => {
    setOpenItemMenu(event.currentTarget);
    setSelectedItem(item);
  };

  const handleItemMenuClose = () => {
    setOpenItemMenu(null);
    setSelectedItem(null);
  };

  // Conform Order Modal
  const [openConfirmOrder, setOpenConfirmOrder] = React.useState(false);
  const handleConfirmOrderOpen = () => setOpenConfirmOrder(true);
  const handleConfirmOrderClose = () => setOpenConfirmOrder(false);

  // Handle order note
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const handleCheckboxChange = (event) => setIsCheckboxChecked(event.target.checked);

  const addNewChat = () => {
    if (/^[0-9a-fA-F]{24}$/.test(orderDetail.orderer)) {
      socket.emit("chat.add_new", {_id: orderDetail.orderer, role: "shopper"});
    } else {
      toast("Can't initiate chat with the selected user", {type: "error", className: 'toast-custom'})
    }
  }
  
  useEffect(() => {
    socket.on("chat.refresh_contacts", data => {
      navigate("/merchant/chat");
    })
  }, []);
  
  return (
    <>
      <div className="flex flex-col justify-between h-full">
        {isLoading ? (
          <Box className="w-full h-full flex justify-center items-center relative">
            <LoadingProgress sx={{width: "70px"}}/>
          </Box>
        ) : (
          <div className="flex flex-col gap-[16px] p-[10px] ss:p-[32px]">
            {orderDetail.package?.map((data, idx) => (
              <MerchantOrderItem
                key={`order_${idx}`}
                data={data}
                locationId={orderDetail.pickupLocation}
                showPopOver={true}
              />
            ))}
            {orderDetail?.notes && (
              <div className="flex flex-col gap-[8px]">
                <div className="flex flex-col items-start gap-[2px]">
                  <Typography variant="subtitle1" className="font-gilroyMedium">Customer order note</Typography>
                  <Typography variant="subtitle2">{orderDetail.notes}</Typography>
                </div>
              </div>
            )}
          </div>
        )}

        <Link to="#" onClick={addNewChat}>
          <FloatingChatButton/>
        </Link>

        <div className="border-t p-[15px] ss:p-[32px] flex flex-col gap-[16px]">
          {order?.notes ? (
            <>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    className="p-0 mx-[10px]"
                    checked={isCheckboxChecked}
                    onChange={handleCheckboxChange}
                  />
                }
                label={<span className="text-[14px]">I have read the customer's notes.</span>}
              />

              <Button className='w-full' disabled={!isCheckboxChecked}
                sx={{
                  width: '100%',
                  height: '44px',
                  fontFamily: 'Gilroy',
                  fontSize: '14px',
                  color: isCheckboxChecked ? '#ffffff' : '#181818',
                  borderRadius: '8px',
                  backgroundColor: isCheckboxChecked ? '#F14445' : '#F5F5F5',
                  textTransform: 'unset',
                  '&:hover': {
                    backgroundColor: isCheckboxChecked ? '#E13031' : '#F5F5F5',
                  }
                }}
                onClick={handleConfirmOrderOpen}
              >
                Confirm order
              </Button>
            </>
          ) : (
            <DefaultButton value="Confirm order" onClick={handleConfirmOrderOpen}/>
          )}
        </div>
      </div>

      {/* Item menu Popover */}
      <Popover
        open={Boolean(openItemMenu)}
        anchorEl={openItemMenu}
        onClose={handleItemMenuClose}
        anchorOrigin={{vertical: "bottom", horizontal: "left"}}
        transformOrigin={{vertical: "top", horizontal: "right"}}
        PaperProps={{
          sx: {
            p: 1,
            width: 210,
            "& .MuiMenuItem-root": {
              px: 1,
              typography: "body2",
              borderRadius: 0.75,
              fontFamily: "Gilroy",
            },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            navigate("out-of-stock", {state: {item: selectedItem, locationId: orderDetail.pickupLocation}});
            handleItemMenuClose();
          }}
        >
          Mark Item As Out Of Stock
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate("adjust-order", {state: {item: selectedItem}});
            handleItemMenuClose();
          }}
        >
          Adjust Order
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate("add-additional-charge", {state: {item: selectedItem}});
            handleItemMenuClose();
          }}
        >
          Add An Additional Charge
        </MenuItem>
      </Popover>

      {/* Confirm order Modal */}
      <ConfirmOrderModal
        isOpen={openConfirmOrder}
        onClose={handleConfirmOrderClose}
        order={orderDetail}
      />
    </>
  );
};

export default Main;