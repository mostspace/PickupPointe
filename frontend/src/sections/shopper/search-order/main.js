import React, {useEffect, useState,} from "react";
import {Link,} from 'react-router-dom';
import {Magnifer, searchOrderImg, searchNotFound} from 'src/assets';
import {
  FormControl,
  Button,
  Typography,
  TextField,
  Box, Chip, IconButton,
} from '@mui/material';
import {getSearchOrders} from "src/reducers/shopper/searchSlice.js";
import {useDispatch, useSelector} from "react-redux";
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
  const {orderList, isLoading} = useSelector((state) => state.shopper.search);
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
      handleSearchOrder("");
    }
  };

  const handlePickupQRScannedOpen = (_id, deliveryType) => {
    setOpenPickupQRScanned(true);
    setQRScanInfo({_id, deliveryType});
  }

  const renderSearchResults = () => {
    if (isLoading) {
      return (
        <Box className="w-full h-[calc(100vh-500px)] flex justify-center items-center">
          <LoadingProgress sx={{width: "70px"}}/>
        </Box>
      );
    }

    if (!orderList?.result?.length) {
      if (submittedQuery) {
        return <NoResultsFound />;
      }
      return <VendorPromotion />;
    }

    return (
      <div className="flex flex-col gap-[24px]">
        <div className="flex flex-col gap-[24px]">
          {orderList.result.map(item => (
            <OrderListItem key={item._id} item={item} openQR={handlePickupQRScannedOpen}/>
          ))}
          <div className="w-full flex justify-center items-center">
            <Typography variant="subtitle3" className="text-center max-w-[624px]">
              If your Pickup Pointe location isn't listed, please verify that you've correctly entered your order number or zip code in the search field, and try again.
            </Typography>
          </div>
        </div>
        <OrderQRModal
          isOpen={openPickupQRScanned}
          onClose={() => setOpenPickupQRScanned(false)}
          orderId={`${QRScanInfo?.deliveryType === "Pickup" ? 'PP' : QRScanInfo?.deliveryType === "Delivery" ? "DD" : "SS"}${QRScanInfo?._id}`}
          value={`https://pickuppointe.com/shopper/orders-history/order-details/${QRScanInfo?._id}`}
        />
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col gap-[48px] sm:gap-[40px] relative">
      <SearchHeader 
        searchQuery={searchQuery}
        handleInputChange={handleInputChange}
        handleSearchOrder={handleSearchOrder}
        isLoading={isLoading}
      />
      {renderSearchResults()}
    </div>
  );
}

const SearchHeader = ({searchQuery, handleInputChange, handleSearchOrder, isLoading}) => (
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
            onKeyDown={(e) => e.keyCode === 13 && handleSearchOrder()}
          />
          <Button
            disabled={isLoading}
            sx={{
              minWidth: '40px',
              width: '40px',
              height: '40px',
              padding: 0,
              margin: 0,
              color: '#ffffff',
              borderRadius: '8px',
              backgroundColor: '#F14445',
              '&:hover': {
                backgroundColor: '#E13031',
              }
            }}
            onClick={() => handleSearchOrder()}
            startIcon={<img src={Magnifer} className="w-[20px] h-[20px] !m-0 !p-0" loading="lazy"/>}
          />
        </div>
      </FormControl>
    </div>
  </div>
);

const OrderListItem = ({item, openQR}) => (
  <div className="w-full flex flex-col justify-center items-center gap-[14px]">
    <div className="w-full max-w-[624px] flex flex-col gap-[16px]">
      <div className="flex flex-col gap-[12px]">
        <div className="flex flex-col px-[12px] py-[16px] self-stretch rounded-[12px] border border-[rgba(0, 0, 0, 0.08)] bg-white">
          <div className="flex flex-col xs:flex-row justify-between xs:items-center gap-[14px] xs:gap-0">
            <div className="flex flex-col ss:flex-row items-start ss:items-center gap-[3px] ss:gap-[8px]">
              <Typography variant="subtitle1 underline font-gilroyMedium">
                <Link to={`/shopper/orders-history/order-details/${item._id}`}>
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
  </div>
);

const NoResultsFound = () => (
  <div className="w-full h-full flex justify-center items-center">
    <div className="flex flex-col justify-center items-center gap-[24px]">
      <img src={searchNotFound} className="w-[214px]" loading="lazy"/>
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
);

const VendorPromotion = () => (
  <div className="flex flex-col gap-[72px] sm:mt-[32px]">
    <div className="flex flex-col sm:flex-row justify-between gap-[48px] sm:gap-[64px] sm:px-[48px]">
      <div className="w-full flex flex-col gap-[24px]">
        <Typography variant="h2" className="text-[24px] sm:text-[28px]">Become a merchant, rent some rack space
          for your customer drop-offs</Typography>
        <div className="flex items-center gap-[14px]">
          <Link to="/register/vendor-register">
            <Button
              sx={{
                padding: '8px 40px',
                height: '44px',
                fontFamily: 'Gilroy',
                fontSize: '14px',
                lineHeight: '1.2',
                color: '#ffffff',
                borderRadius: '8px',
                backgroundColor: '#F14445',
                textTransform: 'unset',
                '&:hover': {
                  backgroundColor: '#E13031',
                }
              }}
            >
              Become a merchant
            </Button>
          </Link>
          <Link to="/login">
            <Button
              sx={{
                padding: '8px 40px',
                height: '44px',
                fontFamily: 'Gilroy',
                fontSize: '14px',
                color: '#181818',
                lineHeight: '1.2',
                borderRadius: '8px',
                backgroundColor: '#F5F5F5',
                textTransform: 'unset',
              }}
            >
              Login as merchant
            </Button>
          </Link>
        </div>
      </div>
      <div className="w-full flex flex-col gap-[16px]">
        <Typography variant="h3" className="capitalize text-[24px] sm:text-[28px]">How it works</Typography>
        <Typography variant="subtitle1" className="text-normal">Select the amount of rack space suited to your
          business needs, then subscribe as a vendor. After a quick approval process, you'll sign our vendor
          agreements, choose a payment plan, and start using your new Pickup Pointe location for customer
          pickups and drop-offs.</Typography>
      </div>
    </div>

    <div className="flex justify-center items-center">
      <img src={searchOrderImg} loading="lazy"/>
    </div>
  </div>
);

