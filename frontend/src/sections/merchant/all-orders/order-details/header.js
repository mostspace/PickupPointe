import React, {useEffect, useMemo, useState} from "react";
import { useNavigate } from "react-router-dom";
// Icons
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CircleIcon from "@mui/icons-material/Circle";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
// @mui
import { Container, IconButton, Typography, Popover, MenuItem } from '@mui/material';
import { memoizedOrderName } from "src/utils/utilityFunctions.js";
import { getOrderById } from "src/reducers/merchant/orderSlice.js";
import {useDispatch, useSelector} from "react-redux";
import dayjs from "dayjs";
import {icLoading} from "src/assets";

const Header = ({order}) => {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [openMainMenu, setOpenMainMenu] = useState(null);
  const {orderDetail, isLoading} = useSelector((state) => state.merchant.orders);

  const handleBack = () => {
    navigate(-1);
  };


  const handleMainMenuOpen = (event) => setOpenMainMenu(event.currentTarget);
  const handleMainMenuClose = () => setOpenMainMenu(null);

  const getOrderName = useMemo(() => (ordererInfo) => memoizedOrderName(ordererInfo), []);

  return (
    <>
      <div className="flex justify-center items-start">
        <Container
          className="rounded-[16px]"
          sx={{
            padding: { xs: '16px', md: '16px 32px' },
            background: '#fff',
            width: { xs: '100%', md: '100%' },
            maxWidth: { xs: '100%', md: '960px' },
          }}
        >
          <div className="w-full flex justify-between items-start ss:items-center">
            <div className="flex flex-wrap items-center gap-[10px]">
              <IconButton onClick={handleBack}>
                <KeyboardBackspaceIcon className="text-heading" />
              </IconButton>
              {!isLoading && orderDetail?._id ? (
                <div className="flex flex-col items-start gap-[2px]">
                  <div className="w-full flex flex-wrap gap-[5px] items-center justify-center">
                    <Typography variant="h6" className="font-gilroyMedium">
                      #{orderDetail?.deliveryType === "Pickup" ? "PP" : orderDetail?.deliveryType === "Delivery" ? "DD" : "SS"}{orderDetail?._id}
                    </Typography>
                    <CircleIcon className="hidden ss:block text-[4px] text-heading"/>
                    <Typography variant="h6">{getOrderName(orderDetail?.ordererName)}</Typography>
                    <CircleIcon className="text-[4px] text-heading"/>
                    <Typography variant="h6">{orderDetail?.status}</Typography>
                  </div>
                  <div className="w-full flex flex-wrap gap-[5px] items-center">
                    <Typography variant="subtitle3">{orderDetail.package?.length} items</Typography>
                    <CircleIcon className="text-[3px] text-normal"/>
                    <Typography variant="subtitle3">
                      {/*{orderDetail?.deliveryType}*/}Pickup at {dayjs(orderDetail.time?.pickupDate).format("h:mm A, ")}
                      {dayjs(orderDetail.time?.pickupTime).format("MM-DD") === dayjs().format("MM-DD") ? "Today" : dayjs(orderDetail?.pickupTime).format("MMM DD, YYYY")}
                    </Typography>
                  </div>
                </div>
              ) : (
                <img src={icLoading}/>
              )}
            </div>
            <IconButton onClick={handleMainMenuOpen}>
              <MoreVertIcon className="text-heading" />
            </IconButton>
          </div>
        </Container>
      </div>

      <Popover
        open={Boolean(openMainMenu)}
        anchorEl={openMainMenu}
        onClose={handleMainMenuClose}
        anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
        transformOrigin={{vertical: 'top', horizontal: 'right'}}
        PaperProps={{
          sx: {
            p: 1,
            width: 210,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
              fontFamily: 'Gilroy'
            },
          },
        }}
      >
        <MenuItem onClick={() => navigate("/merchant/chat")}>
          Contact customer
        </MenuItem>
        <MenuItem onClick={() => navigate("/merchant/get-help")}>
          Get help from Pickup Pointe
        </MenuItem>
      </Popover>
    </>
  );
};

export default Header;