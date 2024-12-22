import React, {useState,} from "react";
import {Link,} from 'react-router-dom';

// Icons
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

// Assets
import {Magnifer, searchOrderImg, smallscan, blurQrImg, qrCodeImg, searchNotFound} from 'src/assets';

// @mui
import {
  FormControl,
  Button,
  Divider,
  Typography,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField, Box,
} from '@mui/material';
import {getSearchOrders} from "../../../reducers/shopper/searchSlice.js";
import {useDispatch, useSelector} from "react-redux";
import {getLocationAddress} from "../../../components/choose-location-select/index.js";
import LoadingProgress from "../../../components/loading-screen/loading-progress.js";

// ------------------------------------------------------------------------------------------------------------------------------------------

const orders = [
  {
    id: 'PP86307332',
    title: 'Pickup Pointe Store #36462',
    disc: '832 Leghorn Avenue, Laguna CA, 93453',
    status: 'Ready to pickup'
  },
  {
    id: 'PP86307333',
    title: 'Pickup Pointe Store #32322',
    disc: '7384 Hayward Way, Laguna CA, 93453',
    status: 'Awaiting drop-off'
  },
]

// ------------------------------------------------------------------------------------------------------------------------------------------

export default function Main() {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  // const [filteredOrders, setFilteredOrders] = useState([]);
  const {orderList, isLoading} = useSelector((state) => state.shopper.search);
  const [submittedQuery, setSubmittedQuery] = useState("");

  const handleSearchOrder = (keyword = searchQuery) => {
    dispatch(getSearchOrders(keyword))
    setSubmittedQuery(keyword);
    // const query = searchQuery.toLowerCase();
    // const filtered = orders.filter(order =>
    //   order.id.toLowerCase().includes(query) ||
    //   order.title.toLowerCase().includes(query) ||
    //   order.disc.toLowerCase().includes(query)
    // );
    // setFilteredOrders(filtered);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value === "") {
      handleSearchOrder("");
    }
    // if (e.target.value === '') {
    //   setFilteredOrders([]);
    // }
    // handleSearchOrder();
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSearchOrder();
    }
  };

  /* const handleBackClick = () => {
    setSearchQuery('');
  }

  // Pickup QR scanned Modal
  const [openPickupQRScanned, setOpenPickupQRScanned] = React.useState(false);

  const handlePickupQRScannedOpen = () => {
    setOpenPickupQRScanned(true);
  };

  const handlePickupQRScannedClose = () => {
    setOpenPickupQRScanned(false);
  };
  // getSearchOrders*/

  return (
    <>
      <div className="w-full h-full flex flex-col gap-[48px] sm:gap-[40px]">
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
                  placeholder='Search order #, zip code or business name'
                  value={searchQuery}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
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
                    textTransform: 'unset',
                    textAlign: 'center',
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

        {/* Searched Items */}
        {orderList?.result.length > 0 && orderList.result.map(item => (
          <div className="w-full flex flex-col justify-center items-center gap-[14px]">
            <div className="w-full max-w-[624px] flex flex-col gap-[16px]">
              {/*<div className="flex flex-col gap-[12px]">
                <div className="flex">
                  <Button sx={{
                    color: "#181818",
                    textTransform: "unset",
                    fontFamily: "Gilroy",
                    fontWeight: '400',
                  }}
                          onClick={handleBackClick}
                  >
                    <ArrowBackIosIcon sx={{
                      fontSize: "10px",
                      marginRight: "5px",
                    }}/> Back
                  </Button>
                </div>
                <div
                  className="flex flex-col px-[12px] py-[16px] self-stretch rounded-[12px] border border-[rgba(0, 0, 0, 0.08)] bg-white">
                  <div className="flex flex-col xs:flex-row justify-between xs:items-center gap-[14px] xs:gap-0">
                    <div className="flex flex-col ss:flex-row items-start ss:items-center gap-[3px] ss:gap-[8px]">
                      <Typography variant="subtitle1">Pickup Pointe Store #32322</Typography>
                    </div>
                    <Typography variant="subtitle1" className="text-success">Ready to pickup</Typography>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center mt-5 xs:mt-1">
                    <Typography variant="subtitle3">7384 Hayward Way, Laguna CA, 93453</Typography>
                    <Typography variant="subtitle3">curbside / drive-thru eligible <CheckCircleOutlineIcon
                      sx={{fontSize: "16px", marginBottom: "1px",}}/> </Typography>
                  </div>
                  <Divider className="my-[12px]"/>
                  <div className="flex flex-col xs:flex-row justify-between xs:items-center gap-[14px] xs:gap-0">
                    <div className="flex flex-col gap-[12px]">
                      <img src={smallscan} className="w-[20px] cursor-pointer" onClick={handlePickupQRScannedOpen}
                           loading="lazy"/>
                      <Typography variant="subtitle3">Scan QR code and confirm pickup name upon arrival to the
                        location.</Typography>
                    </div>
                    <div className="w-fit flex relative cursor-pointer" onClick={handlePickupQRScannedOpen}>
                      <Typography variant="subtitle2" className="underline absolute top-[40%] left-[12%]">Show QR
                        code</Typography>
                      <img src={blurQrImg} className="w-[124px]" loading="lazy"/>
                    </div>

                  </div>
                </div>
              </div>*/}

              <div className="flex flex-col gap-[12px]">
                {/*<div className="flex">
                  <Button sx={{
                    color: "#181818",
                    textTransform: "unset",
                    fontFamily: "Gilroy",
                    fontWeight: '400',
                  }}
                          onClick={handleBackClick}
                  >
                    <ArrowBackIosIcon sx={{
                      fontSize: "10px",
                      marginRight: "5px",
                    }}/> Back
                  </Button>
                </div>*/}
                <div
                  className="flex flex-col px-[12px] py-[16px] self-stretch rounded-[12px] border border-[rgba(0, 0, 0, 0.08)] bg-white">
                  <div className="flex flex-col xs:flex-row justify-between xs:items-center gap-[14px] xs:gap-0">
                    <div className="flex flex-col ss:flex-row items-start ss:items-center gap-[3px] ss:gap-[8px]">
                      <Typography variant="subtitle1 underline">
                        <Link to={`/shopper/orders-history/order-details/${item._id}`}>
                          #{item.deliveryType === "Pickup" ? "PP" : item.deliveryType === "Delivery" ? "DD" : "SS"}{item._id}
                        </Link>
                      </Typography>
                    </div>
                    <Typography
                      variant="subtitle1"
                      className={`text-${item.status === "Pending" ? "warning" : item.status === "Completed" ? "success" : "primary"}`}>
                      {item.Status === "Pending" ? "Pending" : item.status === "Completed" ? "Completed" : "Canceled"} order
                    </Typography>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center mt-5 xs:mt-1">
                    <Typography variant="subtitle3">{getLocationAddress(item.orderLocation)}</Typography>
                    <Typography variant="subtitle3">curbside / drive-thru eligible
                      <HighlightOffIcon sx={{fontSize: "16px", marginBottom: "1px",}}/>
                    </Typography>

                  </div>
                </div>
              </div>

              {/*{filteredOrders.map((order) => (
                <div key={order.id} id="searchItem"
                     className="flex px-[12px] py-[16px] justify-between items-center gap-12px self-stretch rounded-[12px] border border-[rgba(0, 0, 0, 0.08)] bg-white">
                  <div className="flex flex-col items-start gap-[2px]">
                    <p className="text-[16px] font-normal leading-[25px] text-heading">{order.title}</p>
                    <p className="text-[14px] font-normal leading-[22px] text-normal">{order.disc}</p>
                  </div>
                  <IconButton>
                    <ArrowForwardIosIcon sx={{color: "#181818", fontSize: "18px"}}/>
                  </IconButton>
                </div>
              ))}*/}

            </div>
          </div>
        ))}
        {isLoading && (
          <Box className="w-full h-full flex justify-center items-center absolute">
            <LoadingProgress sx={{width: "70px"}}/>
          </Box>
        )}
        {orderList?.result?.length === 0 && (
          <div className="flex flex-col gap-[72px] sm:mt-[32px]">
            {/*<div className="flex flex-col sm:flex-row justify-between gap-[48px] sm:gap-[64px] sm:px-[48px]">
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
            </div>*/}
            {!isLoading && submittedQuery !== "" && (
              <div className="w-full h-full flex justify-center items-center min-h-[50vh]">
                <div className="flex flex-col justify-center items-center gap-[24px]">
                  <img src={searchNotFound} className="w-[214px]" loading="lazy"/>
                  <div className="flex flex-col text-center gap-[5px]">
                    <Typography variant="subtitle1">We couldn’t find any orders matching your search keyword.</Typography>
                    <Typography variant="subtitle3">
                      If your Pickup Pointe location isn't listed, please verify that you've
                      correctly entered your order number, zip code, or business name in the search field, and try
                      again.
                    </Typography>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {submittedQuery === "" && orderList?.result?.length === 0 && (
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
                      Sign in as merchant
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
        )}
      </div>
    </>
  );
}

