import React, {useState, useRef, useEffect, useCallback, useMemo} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import moment from 'moment';
// Mui
import {Table, Paper, TableHead, TableRow, TableBody, TableCell, Typography, IconButton, InputAdornment, Autocomplete,
  TextField, Tabs, Tab, Chip, Grid, Box, CircularProgress,
} from '@mui/material';
// Components
import Iconify from 'src/components/iconify';
import CalendarView from './calendar/calendar-view';
import TabPanel from "src/components/tab";
import DropdownMenu from "src/components/dropdown-menu";
import ServiceAvailabilityModal from "src/components/modal/service-availability"
import { getLocationAddress } from 'src/components/choose-location-select';
import Searchbar from "src/components/input/searchbar";
import { tabProps } from "src/utils/tab-helpers";
import { StyledTableContainer } from "src/utils/table-helpers";
// Asset
import { PICKUP_ORDERS_PERIOD } from "src/_mock/assets";
// Icons
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CircleIcon from '@mui/icons-material/Circle';
import SortIcon from '@mui/icons-material/Sort';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import DownloadIcon from '@mui/icons-material/Download';
// Reducers
import { fetchShops } from "src/reducers/shopSlice";
import {getOrderCalendar, getOrders, saveServiceAvailability} from "src/reducers/vendor/orderSlice.js";
import dayjs from "dayjs";
import QrCodeRoundedIcon from "@mui/icons-material/QrCodeRounded";
import OrderQRModal from "src/components/modal/order-qr/index.js";
import Pagination from "src/components/pagination/index.js";
import {memoizedOrderName} from "src/utils/utilityFunctions.js";
import OrderStatusChip from "src/components/order-status-chip/order-status-chip.js";

// ----------------------------------------------------------------------

// Awaiting Drop-Off Tab
function createAwaitingDropOffData(status, id, pickup_date, contact, location, units, qr) {
  return { status, id, pickup_date, contact, location, units, qr };
}

const awaitingDropOff = [
  createAwaitingDropOffData(<Chip label="Pending" sx={{color: '#DD7E26', backgroundColor: 'rgba(241, 161, 68, 0.24)', borderRadius: '6px', fontFamily: 'Gilroy', fontSize: '12px', height: '25px'}} />, 'DD726873', 'May 13, 2019', 'lorabrown@gmail.com', 'Pickup Pointe Store #32322', '15', <QrCode2Icon /> ),
  createAwaitingDropOffData(<Chip label="Completed" sx={{color: '#3ACC48', backgroundColor: 'rgba(58, 204, 72, 0.16)', borderRadius: '6px', fontFamily: 'Gilroy', fontSize: '12px', height: '25px'}} />, 'DD345109', 'DD345109', 'johnsmith@yahoo.com', 'Pickup Pointe Store #98931', '10', <QrCode2Icon /> ),
];

// --------------------------------------------------------------------------------------------------

const Main = () => {
  const dispatch = useDispatch();
  const { shops } = useSelector((state) => state.shops);
  const {isLoading, orderCalendar, serviceTimeDetail, orderList} = useSelector(state => state.vendor.orders);

  const [tabValue, setTabValue] = useState(0);
  const [calendarView, setCalendarView] = useState('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedShop, setSelectedShop] = useState({});
  const [selectedLocation, setSelectedLocation] = useState({});
  const [isServiceInfoModalOpen, setIsServiceInfoModalOpen] = useState(false);
  const [selectedServiceDate, setSelectedServiceDate] = useState("");
  const [selectedServiceWeekDay, setSelectedServiceWeekDay] = useState("");
  const [selectedServiceData, setSelectedServiceData] = useState({});
  const [sortBy, setSortBy] = useState('Last month');
  const [openPickupQRScanned, setOpenPickupQRScanned] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    itemsPerPage: 10,
    searchKeyword: "",
    deliveryType: "Pickup",
    periodTime: "Last Month"
  })

  const toolbarRef = useRef(null);

  useEffect(() => {
    dispatch(fetchShops());
  }, []);

  useEffect(() => {
    if (selectedLocation?._id && tabValue === 0) {
      const params = {
        locationId: selectedLocation._id,
        shopId: selectedShop._id,
        month: moment(selectedDate).format("YYYY-MM")
      }
      dispatch(getOrderCalendar(params))
    } else if (selectedLocation?._id && tabValue === 1) {

    }
  }, [selectedLocation, selectedDate, serviceTimeDetail, tabValue]);

  useEffect(() => {
    if (selectedLocation?._id && tabValue === 1) {
      dispatch(getOrders({
        ...pagination,
        locations: [selectedLocation?._id]
      }));
    }
  }, [selectedLocation, pagination, tabValue]);

  useEffect(() => {
    if (shops?.length > 0) {
      setSelectedShop(shops[0]);
      onShopSelect(shops[0]);
    }
  }, [shops]);

  const onShopSelect = (newValue) => {
      setSelectedShop(newValue);
      setSelectedLocation(newValue?.locations[0]);
  }

  // Navigation Handlers for Calendar
  const handleNavigate = (action) => {
    switch (action) {
      case 'PREV':
        toolbarRef.current && toolbarRef.current.handleNavigate('PREV');
        setSelectedDate(prevDate => moment(prevDate).subtract(1, 'months').toDate());
        break;
      case 'NEXT':
        toolbarRef.current && toolbarRef.current.handleNavigate('NEXT');
        setSelectedDate(prevDate => moment(prevDate).add(1, 'months').toDate());
        break;
      case 'TODAY':
        toolbarRef.current && toolbarRef.current.handleNavigate('TODAY');
        setSelectedDate(new Date());
        break;
      default:
        console.warn(`Unhandled navigation action: ${action}`);
    }
  };

  const handleTabChange = (event, newValue) => setTabValue(newValue);
  const handleSortBy = (newValue) => {
    setSortBy(newValue);
    setPagination(prevState => ({
      ...prevState,
      periodTime: newValue
    }))
  }
  const handleViewChange = (view) => setCalendarView(view);

  // Handle Pickup QR Scanned Dialog
  const handlePickupQRScannedOpen = (data) => {
    setSelectedOrder(data);
    setOpenPickupQRScanned(true);
  }
  const handlePickupQRScannedClose = () => {
    setOpenPickupQRScanned(false);
    setSelectedOrder(null);
  }

  const onServiceAvailabilityModalOpen = (date, isWeek) => {
    if (isWeek) {
      date = date.charAt(0).toUpperCase() + date.slice(1).toLowerCase();
      setSelectedServiceWeekDay(date);
      setSelectedServiceDate("");
    } else {
      setSelectedServiceDate(date);
      setSelectedServiceWeekDay("");
    }

    setIsServiceInfoModalOpen(true);
    const data = orderCalendar?.serviceData?.find(item => item.date === date);
    setSelectedServiceData(data);
  }

  const saveServiceAvailabilityData = (formData) => {
    const isWeek = selectedServiceWeekDay !== "";

    if (selectedLocation._id) {
      console.log(selectedLocation)
      const data = {
        month: moment(selectedDate).format("YYYY-MM"),
        date: isWeek ? selectedServiceWeekDay : dayjs(selectedServiceDate).format("YYYY-MM-DD"),
        isWeek,
        locationId: selectedLocation._id,
        pickupTime: {
          from: formData.pickupFrom ? dayjs(formData.pickupFrom).format("HH:mm") : dayjs(selectedLocation.pickup.from).format("HH:mm"),
          to: formData.pickupTo ? dayjs(formData.pickupTo).format("HH:mm") : dayjs(selectedLocation.pickup.to).format("HH:mm"),
          isAvailable: formData.pickupAvailable || false
        },
        deliveryTime: {
          from: formData.deliveryFrom ? dayjs(formData.deliveryFrom).format("HH:mm") : dayjs(selectedLocation.delivery.from).format("HH:mm"),
          to: formData.deliveryTo ? dayjs(formData.deliveryTo).format("HH:mm") : dayjs(selectedLocation.delivery.to).format("HH:mm"),
          isAvailable: formData.deliveryAvailable || false
        }
      }

      dispatch(saveServiceAvailability(data));
      closeServiceAvailabilityModal(false);
    }
  }

  const closeServiceAvailabilityModal = () => {
    setSelectedServiceDate("");
    setSelectedServiceWeekDay("");
    setIsServiceInfoModalOpen(false)
  };

  const getOrderName = useMemo(() => (ordererInfo) => memoizedOrderName(ordererInfo), []);

  return (
    <div className="flex flex-col gap-[32px] sm:gap-[48px]">
      <Grid container rowSpacing={1}>
        <Grid item xs={12} lg={6}>
          <Typography variant="h6" className="capitalize">Choose shop</Typography>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Autocomplete
            disablePortal
            options={shops || []}
            getOptionLabel={(option) => option.name || ''}
            value={selectedShop}
            onChange={(event, newValue) => onShopSelect(newValue)}
            popupIcon={<KeyboardArrowDownOutlinedIcon />}
            noOptionsText="No shops"
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Choose a shop"
                className="line-clamp-1"
              />
            )}
          />
        </Grid>
      </Grid>
      {selectedShop?._id && (
        <Grid container rowSpacing={1}>
          <Grid item xs={12} lg={6}>
            <Typography variant='h6' className="capitalize">Choose active location</Typography>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Autocomplete
              disablePortal
              options={selectedShop.locations}
              getOptionLabel={(option) => getLocationAddress(option) || ''}
              value={selectedLocation}
              onChange={(event, newValue) => setSelectedLocation(newValue)}
              popupIcon={<KeyboardArrowDownOutlinedIcon />}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Choose a location"
                  className="line-clamp-1"
                />
              )}
            />
          </Grid>
        </Grid>
      )}

      <div className="flex flex-col">
        <div className='flex flex-wrap py-[16px] justify-between gap-[16px]'>
          <div className='flex gap-[24px] items-center justify-between sm:justify-start'>
            <Typography variant="h5" className="capitalize">Orders</Typography>
            {!tabValue && (
              <div className='flex justify-center items-center gap-[10px]'>
                <IconButton onClick={() => handleNavigate('PREV')} className="bg-white text-normal hover:bg-primary hover:text-white drop-shadow-md">
                  <Iconify icon="ic:round-arrow-back-ios" width={14} />
                </IconButton>
                <Typography variant='subtitle1' onClick={() => handleNavigate('TODAY')} className="cursor-pointer font-gilroyMedium mx-1">{moment(selectedDate).format('MMMM YYYY')}</Typography>
                <IconButton onClick={() => handleNavigate('NEXT')} className="bg-white text-heading hover:bg-primary hover:text-white drop-shadow-md">
                  <Iconify icon="ic:round-arrow-forward-ios" width={14} />
                </IconButton>
              </div>
            )}
          </div>

          <div className={`flex flex-wrap gap-[24px] items-center sm:mt-0 ${tabValue ? 'hidden' : ''}`}>
            <div className='flex items-center gap-[5px]'>
              <CircleIcon className='text-[7px] text-success' />
              <Typography variant='label'>ordering opened</Typography>
            </div>
            {/* <div className='flex items-center gap-[5px]'>
              <CircleIcon className='text-[7px] text-warning' />
              <Typography variant='label'>ordering is about to close</Typography>
            </div> */}
            <div className='flex items-center gap-[5px]'>
              <CircleIcon className='text-[7px] text-danger' />
              <Typography variant='label'>ordering closed</Typography>
            </div>
          </div>

          <div className="flex justify-end items-center">
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="Location details" className="flex items-center">
              <Tab label={<CalendarTodayOutlinedIcon className="text-[18px]" />} {...tabProps(0)} className="min-w-[20px] min-h-[25px]" sx={{width: '20px', height: '25px'}} />
              <Tab label={<SortIcon className="text-[18px] !px-0" />} {...tabProps(1)} className="min-w-[20px] min-h-[25px]" sx={{width: '20px', height: '25px'}} />
            </Tabs>
          </div>         
        </div>

        <div className="w-full">
          <TabPanel value={tabValue} index={0}>
            <Box position="relative" width="100%" border="none">
              <CalendarView
                ref={toolbarRef}
                selectedDate={selectedDate}
                calendarData={orderCalendar}
                onServiceAvailabilityModalOpen={(date, isWeek) => onServiceAvailabilityModalOpen(date, isWeek)}
                locationInfo={selectedShop?.locations?.find(location => location._id === selectedLocation._id)}/>

              {isLoading && (
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  width="100%"
                  height="100%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  bgcolor="rgba(255, 255, 255, 0.8)"
                  zIndex={11}
                >
                  <CircularProgress />
                </Box>
            )}
            </Box>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <div className="flex flex-col gap-[24px]">
              <div className="sm:flex justify-between">
                <Searchbar
                  className="mb-5 sm:mb-0"
                  placeholder="Search item#, item name or keyword..."
                  onSearch={(value) => setPagination(prevState =>  ({...prevState, searchKeyword: value, page: 1}))}
                  startAdornment={
                    <InputAdornment position="start">
                      <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                    </InputAdornment>
                  }
                />
                <div className="flex justify-end">
                  <DropdownMenu title="Period:" sort={sortBy} onSort={handleSortBy} sortOptions={PICKUP_ORDERS_PERIOD} />
                </div>
              </div>
              <StyledTableContainer component={Paper} className="overflow-x-auto">
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white" >STATUS</TableCell>
                      <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white">ID</TableCell>
                      <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white">CUSTOMER</TableCell>
                      <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white">DATE</TableCell>
                      <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white">SHOP</TableCell>
                      <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white">LOCATION</TableCell>
                      <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white">UNITS</TableCell>
                      <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white">QR</TableCell>
                      <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white"><DownloadIcon /></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderList?.result?.map((row) => (
                      <TableRow key={`order_list_${row._id}`} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell align="left" className="font-gilroy text-[14px] text-heading">
                          <OrderStatusChip status={row?.status}/>
                        </TableCell>
                        <TableCell align="left" className="font-gilroy text-[14px] text-heading underline">
                          {`${row.deliveryType === "Pickup" ? 'PP' : row.deliveryType === "Delivery" ? "DD" : "SS"}${row._id}`}
                        </TableCell>
                        <TableCell align="left" className="font-gilroy text-[14px] text-heading">
                          {getOrderName(row?.ordererInfo[0] || row?.orderer || "")}.
                        </TableCell>
                        <TableCell align="left" className="font-gilroy text-[14px] text-heading" sx={{ minWidth: 130 }}>
                          {dayjs(row.time.pickupDate).format("DD MMM YYYY")}<br/>
                          <Typography variant="label1">{dayjs(row.time.pickupTime).format("h:mm a")}</Typography>
                        </TableCell>
                        <TableCell align="left" className="font-gilroy text-[14px] text-heading">
                          {row.shopInfo[0].name}
                        </TableCell>
                        <TableCell align="left" className="font-gilroy text-[14px] text-heading" sx={{ minWidth: 200 }}>
                          {row.deliveryType === "Pickup" ? getLocationAddress(row.locationInfo[0]) : row.orderLocation}
                        </TableCell>
                        <TableCell align="center" className="font-gilroy text-[14px] text-heading">
                          {row.package.length}
                        </TableCell>
                        <TableCell align="center" className="font-gilroy text-[14px] text-heading" onClick={() => handlePickupQRScannedOpen(row)}>
                          <QrCodeRoundedIcon/>
                        </TableCell>
                        <TableCell align="center">
                          <div className="flex">
                            <Link to={`/vendor/manage-orders/order-details/${row._id}`}>
                              <IconButton size="large" color="inherit">
                                <ArrowForwardIosIcon sx={{fontSize: '16px'}} />
                              </IconButton>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </StyledTableContainer >
              {(orderList?.result && !isLoading) && (
                <Box display="flex" justifyContent="space-between" alignItems="center" padding={0} className="mt-2">
                  <Typography variant="subtitle1">
                    Order(s): {orderList.totalCount}
                  </Typography>
                  <Pagination count={orderList?.totalCount} page={orderList?.page} handleChange={(page) => setPagination(prevState => ({...prevState, page}))} itemsPerPage={10} />
                </Box>
              )}
            </div>
          </TabPanel>
        </div>
      </div>

      {/* Pickup QR scanned */}
      <React.Fragment>
        <ServiceAvailabilityModal
          isOpen={isServiceInfoModalOpen}
          onClose={() => closeServiceAvailabilityModal()}
          onSave={(data) => saveServiceAvailabilityData(data)}
          date={selectedServiceWeekDay !== "" ? selectedServiceWeekDay : selectedServiceDate}
          data={selectedServiceData}
          locationInfo={selectedLocation}
          isWeek={selectedServiceWeekDay !== ""}
        />

        {/*<Dialog className="w-full"
          open={openPickupQRScanned}
          onClose={handlePickupQRScannedClose}
          sx={{
          width: "100% !important",
          }}
        >
          <DialogTitle id="" className='pt-[32px] sm:!pt-[64px] flex flex-col gap-[6px] items-center'>
            <h1 className='text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center font-gilroy'>Order #DD726873 QR code</h1>
          </DialogTitle>
          <DialogContent dividers={scroll === 'paper'} className="px-[85px]">
            <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
              <div className='flex sm:px-[92px] sm:py-[43px] justify-center bg-dark rounded-[12px] my-[32px]'>
                <img src={qrCodeImg} className='w-auto'/>
              </div>
            </DialogContentText>
          </DialogContent>
        </Dialog>*/}
        <OrderQRModal
          isOpen={openPickupQRScanned}
          onClose={handlePickupQRScannedClose}
          action={handlePickupQRScannedClose}
          orderId={`${selectedOrder?.deliveryType === "Pickup" ? 'PP' : selectedOrder?.deliveryType === "Delivery" ? "DD" : "SS"}${selectedOrder?._id}`}
          value={`https://pickuppointe.com/vendor/manage-orders/order-details/${selectedOrder?._id}`}
        />
      </React.Fragment>
    </div>
  );
};

export default Main;