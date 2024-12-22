import React, {useEffect, useState,} from "react";
import {Link,} from 'react-router-dom';

// Assets
import {Magnifer, searchOrderImg, searchNotFound} from 'src/assets';

// @mui
import {FormControl, Button, Typography, TextField, Box, Chip, IconButton,} from '@mui/material';
import {useDispatch, useSelector} from "react-redux";
import {getSearchOrders} from "src/reducers/vendor/searchSlice.js";
import {getLocationAddress} from "src/components/choose-location-select/index.js";
import LoadingProgress from "src/components/loading-screen/loading-progress.js";
import QrCodeRoundedIcon from "@mui/icons-material/QrCodeRounded";
import OrderQRModal from "src/components/modal/order-qr/index.js";
import OrderStatusChip from "src/components/order-status-chip/order-status-chip.js";

// ------------------------------------------------------------------------------------------------------------------------------------------

export default function Main() {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState("");
  const {orderList, isLoading} = useSelector((state) => state.vendor.search);
  const [openPickupQRScanned, setOpenPickupQRScanned] = React.useState(false);
  const [QRScanInfo, setQRScanInfo] = React.useState({_id: "", deliveryType: ""});

  useEffect(() => {
    handleSearchOrder("");
  }, []);

  const handleSearchOrder = (keyword = searchQuery) => {
    dispatch(getSearchOrders(keyword));
    setSubmittedQuery(keyword);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value === "") {
      handleSearchOrder(value);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchOrder();
    }
  };

  const handlePickupQRScannedOpen = (_id, deliveryType) => {
    setOpenPickupQRScanned(true);
    setQRScanInfo({_id, deliveryType});
  }

  const RenderOrderItem = ({item, openQR}) => (
    <div className="w-full flex flex-col justify-center items-center gap-[14px]">
      <div className="w-full max-w-[624px] flex flex-col gap-[16px]">
        <div className="flex flex-col gap-[12px]">
          <div className="flex flex-col px-[12px] py-[16px] self-stretch rounded-[12px] border border-[rgba(0, 0, 0, 0.08)] bg-white">
            <div className="flex flex-col xs:flex-row justify-between xs:items-center gap-[14px] xs:gap-0">
              <div className="flex flex-col ss:flex-row items-start ss:items-center gap-[3px] ss:gap-[8px]">
                <Typography variant="subtitle1 underline font-gilroyMedium">
                  <Link to={`/vendor/manage-orders/order-details/${item._id}`}>
                    #{item.deliveryType === "Pickup" ? "PP" : item.deliveryType === "Delivery" ? "DD" : "SS"}{item._id}
                  </Link>
                </Typography>
              </div>
              <OrderStatusChip status={item?.status}/>
            </div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mt-5 xs:mt-1">
              <Typography variant="subtitle3">{getLocationAddress(item.orderLocation)}</Typography>
              <IconButton onClick={() => openQR(item._id, item.deliveryType)}>
                <QrCodeRoundedIcon className="text-[22px] text-heading"/>
              </IconButton>
            </div>
          </div>
        </div>
      </div>
      <OrderQRModal
        isOpen={openPickupQRScanned}
        onClose={() => setOpenPickupQRScanned(false)}
        orderId={`${QRScanInfo?.deliveryType === "Pickup" ? 'PP' : QRScanInfo?.deliveryType === "Delivery" ? "DD" : "SS"}${QRScanInfo?._id}`}
        value={`https://pickuppointe.com/vendor/manage-orders/order-details/${QRScanInfo?._id}`}
      />
    </div>
  );

  return (
    <div className={`relative w-full h-full flex flex-col gap-[48px] sm:gap-[40px] ${orderList.result.length <= 0 && "justify-between"}`}>
      {/* Search Section */}
      <div className="flex flex-col items-center gap-[16px] p-[24px] sm:p-[48px] bg-[#f9f9fa] rounded-[24px]">
        <Typography variant="h2" className="text-[26px] sm:text-[32px] font-gilroyMedium">
          Search your order
        </Typography>
        <div className="w-full flex justify-center">
          <FormControl variant="standard" className="w-full max-w-[564px]">
            <div className='flex justify-between items-center gap-[16px]'>
              <TextField
                size="small"
                variant={'outlined'}
                required
                fullWidth
                placeholder='Search order #, zip code'
                value={searchQuery}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />

              <Button
                sx={{
                  minWidth: '40px',
                  width: '40px',
                  height: '40px',
                  padding: 0,
                  margin: 0,
                  color: '#ffffff',
                  borderRadius: '8px',
                  backgroundColor: '#F14445',
                  textTransform: 'unset',
                  textAlign: 'center',
                  '&:hover': {
                    backgroundColor: '#E13031',
                  }
                }}
                onClick={() => handleSearchOrder()}
                startIcon={<img src={Magnifer} className="w-[20px] h-[20px] !m-0 !p-0"/>}
              />
            </div>
          </FormControl>
        </div>
      </div>

      {/* Results Section */}
      {!isLoading && orderList?.result.length > 0 && (
        <div className="w-full flex flex-col justify-center items-center gap-[24px]">
          <div className="w-full max-w-[624px] flex flex-col gap-[24px]">
            {orderList.result.map(item => (
              <RenderOrderItem item={item} openQR={handlePickupQRScannedOpen}/>
            ))}
          </div>
          <Typography variant="subtitle3" className="text-center max-w-[624px]">
            If your Pickup Pointe location isn't listed, please verify that you've correctly entered your order number or zip code in the search field, and try again.
          </Typography>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <Box className="w-full h-[calc(100vh-500px)] flex justify-center items-center">
          <LoadingProgress sx={{width: "70px"}}/>
        </Box>
      )}

      {/* No Results State */}
      {!isLoading && orderList?.result?.length === 0 && (
        <div className="w-full h-full flex flex-col justify-end">
          {submittedQuery !== "" ? (
            <div className="w-full h-full flex justify-center items-center">
              <div className="flex flex-col justify-center items-center gap-[24px]">
                <img src={searchNotFound} className="w-[214px]" loading="lazy" alt="No results found"/>
                <div className="flex flex-col text-center gap-[5px]">
                  <Typography variant="subtitle1">We couldn't find any orders matching your search keyword.</Typography>
                  <Typography variant="subtitle3">
                    If your Pickup Pointe location isn't listed, please verify that you've
                    correctly entered your order number, zip code, or business name in the search field, and try
                    again.
                  </Typography>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center">
              <img src={searchOrderImg} loading="lazy" alt="Search orders"/>
            </div>
          )}
        </div>
      )}
    </div>
  );
}