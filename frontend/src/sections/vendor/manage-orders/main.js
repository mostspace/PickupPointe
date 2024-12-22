import React, {useState, useCallback, useEffect, useMemo} from "react";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from 'lodash';
import { useNavigate, Link } from 'react-router-dom';
import dayjs from "dayjs";
// @mui
import {
  Table, Paper, Popover, TableHead, Box, TableRow, MenuItem, TableBody, TableCell, IconButton, Tabs, Tab, Chip, Grid, Typography, Autocomplete, TextField, InputAdornment, FormControl,
} from '@mui/material';
// Icons
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import QrCodeRoundedIcon from '@mui/icons-material/QrCodeRounded';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
// Assets
import { icDownload } from 'src/assets';
import { ORDER_TYPE_OPTIONS } from "src/_mock/assets";
// Components
import Iconify from 'src/components/iconify';
import DropdownMenu from "src/components/dropdown-menu";
import ChooseLocation, { getLocationAddress } from 'src/components/choose-location-select';
import SearchField from 'src/components/search-filed';
import DefaultButton from "src/components/button/default-button";
import ButtonLoader from "src/components/button-loader/ButtonLoader";
import BasicPagination from "src/components/pagination";
import { tabProps } from "src/utils/tab-helpers";
import { StyledTableContainer } from "src/utils/table-helpers";
import OrderQRModal from "src/components/modal/order-qr/index.js";
import Scrollbar from "src/components/scrollbar";
import Searchbar from "src/components/input/searchbar";
// Reducers
import { getOrders } from "src/reducers/vendor/orderSlice";
import {getAllLocations} from "src/reducers/locationSlice.js";
import { fetchShops } from "src/reducers/shopSlice";
import {memoizedOrderName} from "src/utils/utilityFunctions.js";
import OrderStatusChip from "src/components/order-status-chip/order-status-chip.js";

// --------------------------------------------------------------------------------------------------

const Main = () => {
  const navigate = useNavigate();

  const orderStore = useSelector((state) => state.vendor.orders);
  const {isLoading, orderList: orders} = orderStore;
  const { locations } = useSelector((state) => state.locations);

  const dispatch = useDispatch();
  const { shops } = useSelector((state) => state.shops);
  const [selectedShop, setSelectedShop] = useState(null);

  const [searchText, setSearchText] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedDeliveryType, setSelectedDeliveryType] = useState(null);
  const [openPickupQRScanned, setOpenPickupQRScanned] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    itemsPerPage: 10,
    searchKeyword: "",
    deliveryType: "Pickup",
    statusType: "All"
  })
  const selectedShopLocationsIds = selectedShop?.locations?.map(location => location._id) || [];

  useEffect(() => {
    dispatch(fetchShops());
  }, []);

  useEffect(() => {
    dispatch(getOrders({
      ...pagination,
      locations: selectedLocations.length === 0 && selectedShop
        ? selectedShop?.locations?.map(item => item._id)
        : selectedLocations.map(item => item._id)
    }));
  }, [pagination, selectedLocations, selectedShop]);

  const changePagination = (field, value, initPage = false) => {
    setPagination(prevState => ({
      ...prevState,
      [field]: value,
      ...(initPage && { page: 1 })
    }));
  }

  const onDeliveryTypeChange = (e, value) => {
    const deliveryType = ["Pickup", "Delivery", "PostMail"];
    setTabValue(value);
    changePagination("deliveryType", deliveryType[value], true)
  }

  const handlePickupQRScannedOpen = (id, type) => {
    setOpenPickupQRScanned(true);
    setSelectedId(id);
    setSelectedDeliveryType(type)
  };
  const handlePickupQRScannedClose = () => setOpenPickupQRScanned(false);

  const handleLocationSelectionChange = useCallback((event, newValue) => {
    setSelectedLocations(newValue);
  }, []);


  const onShopSelect = (newValue) => {
    console.log(newValue);
    setSelectedShop(newValue);
    setSelectedLocations([]);
  };

  const gotoDetailPage = (id) => {
    navigate(`/vendor/manage-orders/order-details/${id}`)
  };

  const getOrderName = useMemo(() => (ordererInfo) => ordererInfo && memoizedOrderName(ordererInfo), []);

  const PopperMenu = ({ open, anchorEl, onClose, options }) => (
    <Popover
      open={Boolean(open)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      PaperProps={{
        sx: {
          p: 1,
          width: 200,
          '& .MuiMenuItem-root': {
            px: 1,
            typography: 'body2',
            borderRadius: 0.75,
          },
        },
      }}
    >
      {options.map(({ label, action, isPrimary }, idx) => (
        <React.Fragment key={idx}>
          <MenuItem className={`!font-gilroy ${isPrimary ? 'text-primary' : ''}`} onClick={action}>
            {label}
          </MenuItem>
          {/* {idx === options.length - 2 && <Divider />} */}
        </React.Fragment>
      ))}
    </Popover>
  );

  const DataTable = () => {
    // Popper states
    const [menuState, setMenuState] = useState({
      ordersDownloadMenu: null,
      awaitingPickup: null,
      awaitingDelivery: null,
      autoPay: null,
    });

    // Generic menu opening and closing handlers
    const handleMenuOpen = (menuName) => (event) => setMenuState((prevState) => ({ ...prevState, [menuName]: event.currentTarget }));
    const handleMenuClose = (menuName) => () => setMenuState((prevState) => ({ ...prevState, [menuName]: null }));

    return (
      <>
        <StyledTableContainer component={Paper} className="overflow-x-auto">
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                {/* {["STATUS", "ID", "SHOP", "NAME", "DATE", "TIME", "LOCATION", "UNITS", "ITEMS", "QR"].map((head) => ( */}
                {["STATUS", "ID", "CUSTOMER", "DATE", "SHOP",  "LOCATION", "ITEMS", "QR"].map((head) => (
                  <TableCell key={head} align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white uppercase">
                    {head}
                  </TableCell>
                ))}
                <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white uppercase">
                  {/* <IconButton onClick={handleMenuOpen('ordersDownloadMenu')}> */}
                  <IconButton>
                    <img src={icDownload} alt="Download" />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.result && orders.result.length > 0 ? (
                orders.result.map((order) => (
                  <TableRow
                    key={order._id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell align="left" className="font-gilroy text-[12px] text-heading">
                      <OrderStatusChip status={order.status}/>
                    </TableCell>
                    <TableCell align="left" className="font-gilroy text-[12px] text-heading underline" sx={{ minWidth: 200 }}>
                      <Link to={`/vendor/manage-orders/order-details/${order._id}`}>
                        {`${order.deliveryType === "Pickup" ? 'PP' : order.deliveryType === "Delivery" ? "DD" : "SS"}${order._id}`}
                      </Link>
                    </TableCell>
                    <TableCell align="left" className="font-gilroy text-[12px] text-heading" sx={{ minWidth: 100 }}>
                      {getOrderName(order?.ordererInfo[0] || order?.orderer || "")}.
                    </TableCell>
                    <TableCell align="left" className="font-gilroy text-[12px] text-heading" sx={{ minWidth: 110 }}>
                      {/* {dayjs(order.time.pickupDate).format("MMMM D, YYYY")}<br/> {dayjs(order.time.pickupTime).format("hh:mm A")} */}
                      {dayjs(order.time.pickupDate).format("DD MMM YYYY")}<br/>
                      <Typography variant="label1">{dayjs(order.time.pickupTime).format("h:mm a")}</Typography>
                    </TableCell>
                    <TableCell align="left" className="font-gilroy text-[12px] text-heading" sx={{ minWidth: 150 }}>
                      {order.shopInfo[0].name}
                    </TableCell>
                    {/* <TableCell align="left" className="font-gilroy text-[12px] text-heading">
                      {dayjs(order.time.pickupTime).format("hh:mm A")}
                    </TableCell> */}
                    <TableCell align="left" className="font-gilroy text-[12px] text-heading" sx={{ minWidth: 200 }}>
                      {order.deliveryType === "Pickup" ? getLocationAddress(order.locationInfo[0]) : order.orderLocation}
                    </TableCell>
                    <TableCell align="center" className="font-gilroy text-[12px] text-heading">
                      {order.package.length}
                    </TableCell>
                    {/* <TableCell align="left" className="font-gilroy text-[12px] text-heading" sx={{ minWidth: 150 }}>
                      {order.package?.map((pack, idx) => (
                        <React.Fragment key={idx}>
                          {pack.name}: {pack.quantity}
                          {idx < order.package.length - 1 && <br />}
                        </React.Fragment>
                      )) || "No items"}
                    </TableCell> */}
                    <TableCell align="center" className="font-gilroy text-[12px] text-heading" onClick={() => handlePickupQRScannedOpen(order._id, order.deliveryType)}>
                      <QrCodeRoundedIcon/>
                    </TableCell>
                    <TableCell align="left">
                      <div className="flex items-center gap-[5px]">
                        <IconButton size="large" color="inherit" onClick={() => gotoDetailPage(order._id)}>
                          <ArrowForwardIosIcon sx={{fontSize: '16px'}} />
                        </IconButton>
                        <IconButton size="large" color="inherit" onClick={handleMenuOpen('awaitingPickup')}>
                          <Iconify icon={'eva:more-vertical-fill'} />
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} style={{ textAlign: 'center' }}>
                    <Typography variant="subtitle3">No order data</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Popper Menus */}
          <PopperMenu
            open={menuState.ordersDownloadMenu}
            anchorEl={menuState.ordersDownloadMenu}
            onClose={handleMenuClose('ordersDownloadMenu')}
            options={[
              { label: 'Order report', action: () => {navigate('order-report')} },
              { label: 'Picklist', action: () => {navigate('pick-list')} },
            ]}
          />
          <PopperMenu
            open={menuState.awaitingPickup}
            anchorEl={menuState.awaitingPickup}
            onClose={handleMenuClose('awaitingPickup')}
            options={[
              { label: 'Manually edit order', action: handleMenuClose('awaitingPickup') },
              { label: 'Partial refund', action: handleMenuClose('awaitingPickup') },
              { label: 'Reschedule order', action: handleMenuClose('awaitingPickup') },
              { label: 'Cancel order and refund', action: handleMenuClose('awaitingPickup'), isPrimary: true },
            ]}
          />
          <PopperMenu
            open={menuState.awaitingDelivery}
            anchorEl={menuState.awaitingDelivery}
            onClose={handleMenuClose('awaitingDelivery')}
            options={[
              { label: 'Manually edit order', action: handleMenuClose('awaitingDelivery') },
              { label: 'Partial refund', action: handleMenuClose('awaitingDelivery') },
              { label: 'Reschedule order', action: handleMenuClose('awaitingDelivery') },
              { label: 'Cancel order and refund', action: handleMenuClose('awaitingDelivery'), isPrimary: true },
            ]}
          />
          <PopperMenu
            open={menuState.autoPay}
            anchorEl={menuState.autoPay}
            onClose={handleMenuClose('autoPay')}
            options={[
              { label: 'Manually edit Auto-pay', action: handleMenuClose('autoPay') },
              { label: 'Cancel auto-pay order', action: handleMenuClose('autoPay') },
              { label: 'Remove auto-pay permanently', action: handleMenuClose('autoPay'), isPrimary: true },
            ]}
          />
        </StyledTableContainer >
        
        <div className='flex justify-center items-center'>
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
                popupIcon={<KeyboardArrowDownOutlinedIcon/>}
                noOptionsText="No shops"
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" placeholder="Choose a shop" className="line-clamp-1"/>
                )}
              />
            </Grid>
          </Grid>
          {tabValue === 0 && (
            <Grid container rowSpacing={1}>
              <Grid item xs={12} md={12} lg={6}>
                <Typography variant='h6' className="capitalize">Choose active location</Typography>
              </Grid>

              <Grid item xs={12} md={12} lg={6}>
                <ChooseLocation
                  disabled={!selectedShop?._id}
                  options={selectedShopLocationsIds.length === 0 ? locations : locations.filter(location => selectedShopLocationsIds.includes(location._id))}
                  selectedOptions={selectedLocations}
                  listClassName={'line-clamp-1'}
                  onSelectionChange={handleLocationSelectionChange}
                />
              </Grid>
            </Grid>)}

          {/* <Grid container rowSpacing={1}>
              <Grid item xs={12} md={12} lg={6}>
              <Typography variant='h6' className="capitalize">Orders</Typography>
              </Grid>
              <Grid item xs={12} md={12} lg={6}>
              <SearchField value={searchText} onChange={handleSearchChange} placeholder="Search order#, item name or keyword..." />
              </Grid>
            </Grid> */}
        </div>


        <div id="tabs" className="flex flex-col gap-[16px]">
          <div id="tab-label" className="sm:flex justify-between items-center">
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className="mb-5 sm:mb-0">
              <Tabs value={tabValue} onChange={onDeliveryTypeChange} aria-label="Input Preference" variant="scrollable" scrollButtons="auto">
                <Tab label="Pickup" {...tabProps(0)} className="!font-gilroy !text-[14px] !normal-case" />
                <Tab label="Delivery" {...tabProps(1)} className="!font-gilroy !text-[14px] !normal-case" />
                <Tab label="PostMail" {...tabProps(2)} className="!font-gilroy !text-[14px] !normal-case" />
              </Tabs>
            </Box>
          </div>

          <div className='flex gap-[16px] justify-between'>
            <Searchbar
              onSearch={value => changePagination("searchKeyword", value, true)}
              placeholder="Search order#, item name or keyword..."
              startAdornment={
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                </InputAdornment>
              }
              sx={{width: 464}}
            />

            <div className="flex justify-end">
              <DropdownMenu
                // title="Type:"
                sort={pagination.statusType}
                onSort={(value) => changePagination("statusType", value, true)}
                sortOptions={ORDER_TYPE_OPTIONS} 
              />
            </div>
          </div>

          <div id="tab-panel">
            { isLoading ? <ButtonLoader /> :
              <div className="flex flex-col gap-[30px]">
                <DataTable/>
                {/* <div className="flex justify-end py-[30px]">
                  <DefaultButton value="Make an order for Pickup" />
                </div> */}
              </div>
            }
          </div>
        </div>
      </div>

      {/* Pickup QR scanned */}
      <React.Fragment>
        <OrderQRModal
          isOpen={openPickupQRScanned}
          onClose={handlePickupQRScannedClose}
          action={handlePickupQRScannedClose}
          orderId={`${selectedDeliveryType === "Pickup" ? 'PP' : selectedDeliveryType === "Delivery" ? "DD" : "SS"}${selectedId}`}
          value={`https://pickuppointe.com/vendor/manage-orders/order-details/${selectedId}`}
        />
      </React.Fragment>
    </>
  )
}

export default Main;