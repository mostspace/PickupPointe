import React, {useState, useCallback, useEffect, useMemo} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import dayjs from "dayjs";
// Icons
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import QrCodeRoundedIcon from '@mui/icons-material/QrCodeRounded';

// Assets
import { PERIOD } from "src/_mock/assets";
// Components
import DropdownMenu from "src/components/dropdown-menu";
import { getLocationAddress } from 'src/components/choose-location-select';
import SearchField from 'src/components/search-filed';
import ButtonLoader from "src/components/button-loader/ButtonLoader";
import BasicPagination from "src/components/pagination";
import { tabProps } from "src/utils/tab-helpers";
import { StyledTableContainer } from "src/utils/table-helpers";
// @mui
import {
  Table, Paper, TableHead, Box, TableRow, TableBody, TableCell, IconButton, Tabs, Tab, Chip, Grid, Typography,
} from '@mui/material';
// Reducers
import { getOrders } from "src/reducers/shopper/orderSlice";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import OrderQRModal from "src/components/modal/order-qr/index.js";
import {memoizedOrderName} from "src/utils/utilityFunctions.js";
import OrderStatusChip from "src/components/order-status-chip/order-status-chip.js";

// --------------------------------------------------------------------------------------------------

dayjs.extend(quarterOfYear);

// --------------------------------------------------------------------------------------------------

const Main = () => {
  const dispatch = useDispatch();

  const orderStore = useSelector((state) => state.shopper.orders);

  const {isLoading, orderList: orders} = orderStore;

  const [selectedId, setSelectedId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [selectedDeliveryType, setSelectedDeliveryType] = useState(null);

  const [pagination, setPagination] = useState({
    page: 1,
    itemsPerPage: 10,
    searchKeyword: "",
    deliveryType: "Pickup", // Pickup, Delivery, Post Mail
    periodType: "All" // All, Completed, Pending, Cancelled
  })
  useEffect(() => {
    dispatch(getOrders(pagination));
  }, [pagination]);

  const changePagination = (field, value, initPage = false) => {
    setPagination(prevState => ({
      ...prevState,
      [field]: value,
      ...(initPage && { page: 1 })
    }));
  }

  const onDeliveryTypeChange = (e, value) => {
    const deliveryTypeData = ["Pickup", "Delivery", "PostMail"];
    changePagination("deliveryType", deliveryTypeData[value], true);
    setTabValue(value);
  }
  
  // Tabs
  const [tabValue, setTabValue] = useState(0);

  // Category Sortby
  const [sortBy, setSortBy] = useState('All');
  const handleSortBy = useCallback((newValue) => {
    setSortBy(newValue);
    setPagination(prevState => ({
      ...prevState,
      periodType: newValue
    }))
  }, []);

  // Pickup QR scanned Modal
  const [openPickupQRScanned, setOpenPickupQRScanned] = useState(false);
  const handlePickupQRScannedOpen = (id, type) => {
    setOpenPickupQRScanned(true);
    setSelectedId(id);
    setSelectedDeliveryType(type)
  };
  const handlePickupQRScannedClose = () => setOpenPickupQRScanned(false);

  // Function to get the button label based on the active tab
  const getButtonLabel = () => {
    switch (tabValue) {
      case 0:
        return 'Manually confirm pickup';
      case 1:
        return 'Manually confirm delivery';
      case 2:
        return 'Confirm autopay';
      default:
        return 'Confirm';
    }
  };

  const getStartDateForPeriod = (period) => {
    const now = dayjs();
    switch (period) {
      case 'This week':
        return now.startOf('week');
      case 'Last week':
        return now.subtract(1, 'week').startOf('week');
      case 'Last month':
        return now.subtract(1, 'month').startOf('month');
      case 'Last quarter':
        return now.subtract(1, 'quarter').startOf('quarter');
      case 'Last year':
        return now.subtract(1, 'year').startOf('year');
      default:
        return dayjs().startOf('day');
    }
  };

  const onSearch = (keyword) => {
    setPagination(prevState => ({
      ...prevState,
      searchKeyword: keyword
    }));
  }

  const getOrderName = useMemo(() => (ordererInfo) => memoizedOrderName(ordererInfo), []);

  const DataTable = () => {
    return (
      <>
        <StyledTableContainer component={Paper} className="overflow-x-auto">
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white uppercase" >STATUS</TableCell>
                  <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white uppercase">ID</TableCell>
                  <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white uppercase">CUSTOMER</TableCell>
                  <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white uppercase">DATE</TableCell>
                  <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white uppercase">SHOP</TableCell>
                  <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white uppercase">LOCATION</TableCell>
                  {/* <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white uppercase">CONTACT</TableCell> */}
                  {/* <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white uppercase">UNITS</TableCell> */}
                  <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white uppercase">ITEMS</TableCell>
                  <TableCell align="center" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white uppercase">QR</TableCell>
                  <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white uppercase">
                    {/* <IconButton onClick={handleMenuOpen('ordersDownloadMenu')}> */}
                      {/* <img src={icDownload} alt="Download" /> */}
                    {/* </IconButton> */}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.result.map((order) => (
                  <TableRow key={order._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align="left" className="font-gilroy text-[12px] text-heading" >
                      <OrderStatusChip status={order?.status}/>
                    </TableCell>
                    <TableCell align="left" className="font-gilroy text-[12px] text-heading underline" sx={{ minWidth: 200 }}>
                      <Link to={`order-details/${order._id}`}>
                        {`${order.deliveryType === "Pickup" ? 'PP' : order.deliveryType === "Delivery" ? "DD" : "SS"}${order._id}`}
                      </Link>
                    </TableCell>
                    <TableCell align="left" className="font-gilroy text-[12px] text-heading" sx={{ minWidth: 150 }}>
                      {getOrderName(order?.ordererInfo[0] || order?.orderer || "")}.
                    </TableCell>
                    <TableCell align="left" className="font-gilroy text-[12px] text-heading" sx={{ minWidth: 110 }}>
                      {dayjs(order.time.pickupDate).format("DD MMM YYYY ")}<br/>
                      <Typography variant="label1">{dayjs(order.time.pickupTime).format("h:mm a")}</Typography>
                    </TableCell>
                    <TableCell align="left" className="font-gilroy text-[12px] text-heading" sx={{ minWidth: 150 }}>
                      {order.shopInfo[0].name}
                    </TableCell>
                    <TableCell align="left" className="font-gilroy text-[12px] text-heading" sx={{ minWidth: 200 }}>
                      {order.deliveryType === "Pickup" ? getLocationAddress(order.locationInfo[0]) : order.orderLocation}
                    </TableCell>
                    {/* <TableCell align="left" className="font-gilroy text-[12px] text-heading">{row.contact}</TableCell> */}
                    <TableCell align="center" className="font-gilroy text-[12px] text-heading">
                      {order.package.length}
                    </TableCell>
                    {/* <TableCell align="left" className="font-gilroy text-[12px] text-heading" sx={{ minWidth: 150 }}>
                      {
                        order.package.map((pack, idx) => (
                          <React.Fragment key={idx}>
                            {pack.name}: {pack.quantity}
                            {idx < order.package.length - 1 && <br/>}
                          </React.Fragment>
                        ))
                      }
                    </TableCell> */}
                    <TableCell align="left">
                      <IconButton onClick={() => handlePickupQRScannedOpen(order._id, order.deliveryType)}>
                        <QrCodeRoundedIcon className="text-heading"/>  
                      </IconButton>
                    </TableCell>
                    <TableCell align="left">
                      <div className="flex">
                        <Link to={`order-details/${order._id}`}>
                          <IconButton size="large" color="inherit">
                            <ArrowForwardIosIcon sx={{fontSize: '16px'}} />
                          </IconButton>
                        </Link>
                        {/* <IconButton size="large" color="inherit" onClick={handleMenuOpen('awaitingPickup')}>
                          <Iconify icon={'eva:more-vertical-fill'} />
                        </IconButton> */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {orders.result.length < 1 && <TableCell colSpan={12} style={{ textAlign: 'center' }} className="font-gilroy">No order data</TableCell>}
              </TableBody>
            </Table>
        </StyledTableContainer >
        <div className='flex justify-end'>
          <BasicPagination
            count={orders.totalCount}
            handleChange={(e, value) => changePagination("page", value)}
            page={orders.page}
            itemsPerPage={pagination.itemsPerPage}
          />
        </div>
      </>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-[32px] sm:gap-[48px]">
        <div className='flex flex-col gap-[24px] sm:gap-[32px]'>
          <Grid container rowSpacing={1}>
            <Grid item xs={12} md={12} lg={6}>
              <Typography variant='h6' className="capitalize">Orders</Typography>
            </Grid>
            <Grid item xs={12} md={12} lg={6}>
              <SearchField
                onSearch={(value) => onSearch(value)}
                placeholder="Search order..." />
            </Grid>
          </Grid>
        </div>

        <div id="tabs" className="flex flex-col gap-[24px]">
          <div id="tab-label" className="sm:flex justify-between items-center">
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className="mb-5 sm:mb-0">
              <Tabs value={tabValue} onChange={onDeliveryTypeChange} aria-label="Input Preference" variant="scrollable" scrollButtons="auto">
                <Tab label="Pickup" {...tabProps(0)} className="!font-gilroy !text-[14px] !normal-case" />
                <Tab label="Delivery" {...tabProps(1)} className="!font-gilroy !text-[14px] !normal-case" />
                <Tab label="PostMail" {...tabProps(2)} className="!font-gilroy !text-[14px] !normal-case" />
              </Tabs>
            </Box>
            <DropdownMenu title="Period:" sort={sortBy} onSort={handleSortBy} sortOptions={PERIOD} />
          </div>

          <div id="tab-panel">
            {isLoading ?
              <ButtonLoader /> :
              <div className="flex flex-col gap-[30px]">
                <DataTable />
              </div>
            }
          </div>
        </div>
      </div>

      {/* Pickup QR scanned */}
      <OrderQRModal
        isOpen={openPickupQRScanned}
        onClose={handlePickupQRScannedClose}
        action={handlePickupQRScannedClose}
        orderId={`${selectedDeliveryType === "Pickup" ? 'PP' : selectedDeliveryType === "Delivery" ? "DD" : "SS"}${selectedId}`}
        value={`https://pickuppointe.com/vendor/manage-orders/order-details/${selectedId}`}
      />
    </>
  )
}

export default Main;