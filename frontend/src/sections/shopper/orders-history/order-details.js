import React, {useEffect, useMemo, useState} from "react";
import {useLocation, useNavigate, useParams} from 'react-router-dom';
// Icons
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
// Components
import DefaultButton from "src/components/button/default-button";
import {StyledTableContainer} from "src/utils/table-helpers";
import Iconify from "src/components/iconify/iconify.js";
import ConfirmDelete from "src/components/modal/confirm-delete";
// @mui
import {
  Table, Paper, TableHead, TableRow, TableBody, TableCell, Typography, Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions, Chip, Stack, IconButton, Grid, Popover, MenuItem,
} from '@mui/material';
import dayjs from "dayjs";
import {useDispatch, useSelector} from "react-redux";
import ButtonLoader from "src/components/button-loader/ButtonLoader";
import {QRCodeSVG} from "qrcode.react";
import OrderQRModal from "src/components/modal/order-qr/index.js";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import QrCodeRoundedIcon from "@mui/icons-material/QrCodeRounded";
import {getOrderById, withdrawOrder} from "src/reducers/shopper/orderSlice.js";
import {getLocationAddress} from "src/components/choose-location-select/index.js";
import CircleIcon from "@mui/icons-material/Circle";
import { icRemove } from "src/assets";
import {memoizedOrderName} from "src/utils/utilityFunctions.js";
import OrderStatusChip from "src/components/order-status-chip/order-status-chip.js";
// --------------------------------------------------------------------------------------------------

const OrderDetailsView = () => {
  const navigate = useNavigate();
  const orderStore = useSelector((state) => state.shopper.orders);
  const {isLoading, orderDetail} = orderStore;

  const {id} = useParams();

  const dispatch = useDispatch();
  const [element, setElement] = useState(null);
  const [openPickupQRScanned, setOpenPickupQRScanned] = React.useState(false);
  const [openWithdraw, setOpenWithdraw] = useState(null);
  const [openWithdrawOrderModal, setOpenWithdrawOrderModal] = useState(false);

  useEffect(() => {
    dispatch(getOrderById(id));
  }, [id])

  useEffect(() => {
    if (Object.keys(orderDetail).length > 0) {
      setElement(orderDetail)
    }
  }, [orderDetail])

  // Pickup QR scanned Modal
  const handlePickupQRScannedOpen = (id) => {
    setOpenPickupQRScanned(true);
  };
  const handlePickupQRScannedClose = () => setOpenPickupQRScanned(false);

  // Withdraw popover
  const handleWithdrawPopoverOpen = (event) => setOpenWithdraw(event.currentTarget);
  const handleWithdrawPopoverClose = () => setOpenWithdraw(null);

  // Widraw order Modal
  const closeWithdrawOrderModal = () => setOpenWithdrawOrderModal(false);
  const openConfirmWithdrawOrderModal = () => {
    handleWithdrawPopoverClose();
    setOpenWithdrawOrderModal(true);
  };

  const confirmWithdrawOrder = () => {
    dispatch(withdrawOrder(element._id));
    setOpenWithdrawOrderModal(false);
  }

  const getOrderName = useMemo(() => (ordererInfo) => memoizedOrderName(ordererInfo), []);

  return (
    <>
      {isLoading ? <div className="h-full flex justify-center"><ButtonLoader/></div> :
        <div className="flex flex-col gap-[24px]">
          <div className="flex gap-[10px] items-center">
            <IconButton onClick={() => navigate('/shopper/orders-history')}>
              <KeyboardBackspaceIcon className="text-[24px] text-heading"/>
            </IconButton>
            {element &&
              <div className="flex items-center gap-[5px] rounded-sm">
                <Typography variant="h6" className="text-[16px] sm:text-[18px]">
                  Pickup{" "}
                  <span className="font-gilroyMedium underline">{`#${element.deliveryType === "Pickup" ? 'PP' : element.deliveryType === "Delivery" ? "DD" : "SS"}${element._id}`}</span>
                </Typography>
                <IconButton onClick={() => handlePickupQRScannedOpen(element._id)}>
                  <QrCodeRoundedIcon className="text-[22px] text-heading"/>
                </IconButton>
              </div>
            }
          </div>

          <StyledTableContainer component={Paper} className="overflow-x-auto">
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white uppercase">STATUS</TableCell>
                  {/* <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white uppercase">ID</TableCell> */}
                  <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white uppercase">CUSTOMER</TableCell>
                  <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white uppercase">DATE</TableCell>
                  <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white uppercase">SHOP</TableCell>
                  <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white uppercase">LOCATION</TableCell>
                  <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white uppercase"></TableCell>
                  {/* <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white uppercase">UNITS</TableCell>
                      <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white uppercase">ITEMS</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  element &&
                  <TableRow
                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                  >
                    <TableCell align="left" className="font-gilroy text-[12px] text-heading">
                      {
                        <OrderStatusChip status={element?.status}/>
                      }
                    </TableCell>
                    {/* <TableCell align="left" className="font-gilroy text-[12px] text-heading" >{`${element.deliveryType === "Pickup" ? 'PP' : element.deliveryType === "Delivery" ? "DD" : "SS"}${element._id.slice(0, 6)}...`}</TableCell> */}
                    <TableCell align="left" className="font-gilroy text-[12px] text-heading" sx={{ minWidth: 150 }}>
                      {getOrderName(element?.ordererInfo[0] || element?.orderer || "")}.
                    </TableCell>
                    <TableCell align="left" className="font-gilroy text-[12px] text-heading" sx={{minWidth: 110}}>
                      {dayjs(element.time.pickupDate).format('D MMM YYYY ')}<br/>
                      <Typography variant="label1">{dayjs(element.time.pickupTime).format("h:mm a")}</Typography>
                    </TableCell>
                    <TableCell align="left" className="font-gilroy text-[12px] text-heading" sx={{minWidth: 150}}>
                      {element.shopInfo[0].name}
                    </TableCell>
                    <TableCell align="left" className="font-gilroy text-[12px] text-heading" sx={{minWidth: 200}}>
                      {getLocationAddress(orderDetail?.locationInfo[0])}
                    </TableCell>
                    <TableCell align="left">
                      <IconButton size="large" color="inherit" onClick={handleWithdrawPopoverOpen} className="p-2">
                        <Iconify icon={'eva:more-vertical-fill'} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                }
              </TableBody>
            </Table>

            <div className="flex flex-col p-[15px] pt-0 gap-[24px]">
              <div
                className="border rounded-[8px] p-[15px] sm:p-[24px] flex flex-col lg:flex-row justify-between gap-[32px]">
                <Grid container rowSpacing={2} columnSpacing={3}>
                  <Grid item lg={5} md={5} sm={12} xs={12}>
                    <div className="flex flex-col gap-[10px]">
                      <Typography variant="subtitle1" className="font-gilroyMedium">Price summary</Typography>
                      <div className="border rounded-[16px] p-[16px] flex flex-col gap-[20px]">
                        <div className="flex justify-between">
                          <Typography variant="subtitle3">Order subtotal</Typography>
                          <Typography variant="subtitle2">${element?.subTotal.toFixed(2)}</Typography>
                        </div>
                        <div className="flex justify-between">
                          <Typography variant="subtitle3">Delivery charge</Typography>
                          <Typography variant="subtitle2">${element?.fee?.deliveryFee}</Typography>
                        </div>
                        <div className="flex justify-between">
                          <Typography variant="subtitle3">Processing fee</Typography>
                          <Typography variant="subtitle2">${element?.fee?.processingFee}</Typography>
                        </div>
                        <div className="border-t border-b py-5 flex justify-between">
                          <Typography variant="subtitle3">Discount code</Typography>
                          <Typography variant="subtitle3">_</Typography>
                        </div>
                        <div className="flex justify-between">
                          <Typography variant="subtitle1">Total amount</Typography>
                          <Typography variant="subtitle1">${element?.total.toFixed(2)}</Typography>
                        </div>
                      </div>
                    </div>
                  </Grid>
                  <Grid item lg={7} md={7} sm={12} xs={12}>
                    <div className="flex flex-col gap-[10px]">
                      <Typography variant="subtitle1" className="font-gilroyMedium">Items ordered</Typography>
                      <div className="border rounded-[16px] p-[16px] flex flex-col gap-[5px]">
                        {element?.package?.map((row, index) => (
                          <div key={index} className={` border-dashed ${index !== element.package.length - 1 ? "border-b pb-[5px]" : ""}`}>
                            <div className={`flex justify-between items-center`}>
                              <div className="flex items-center gap-[10px]">
                                <img className="w-[40px] h-[40px] mix-blend-darken rounded" src={row.photo}/>
                                <div className="flex flex-col gap-[2px]">
                                  <Typography variant="subtitle2">{row.name}</Typography>
                                  <Typography variant="label1"><span
                                    className={"capitalize"}>{row?.variant}</span></Typography>
                                </div>
                              </div>
                              <div className="flex gap-[8px] items-center">
                                <Typography variant="text1">{row.quantity}x</Typography>
                                <CircleIcon className="text-[5px] text-normal"/>
                                <Typography variant="subtitle2" className="font-gilroyMedium">${row.defaultPrice}</Typography>
                              </div>
                            </div>
                            {row.modifiers && (
                              <div className={`flex flex-col gap-[5px] ${row.modifiers.length > 0 ? "pt-[5px]" : ""}`}>
                                {row.modifiers.map((modifier, idx) => {
                                  let modifierInfo = element?.modifierItemsInfo?.find(modifierItem => modifierItem._id === modifier);
                                  return (
                                    <div className="flex gap-[30px] justify-between">
                                      <div className="flex items-center gap-[10px]">
                                        <img className="ml-10 w-[30px] h-[30px] mix-blend-darken rounded"
                                             src={modifierInfo?.photo}/>
                                        <div className="flex flex-col gap-[2px]">
                                          <Typography className={"flex items-center gap-[8px]"} variant="label1">
                                            <span className={"capitalize"}>
                                              {modifierInfo?.name}
                                            </span>
                                          </Typography>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-[8px]">
                                        <Typography variant="text1">1x</Typography>
                                        <CircleIcon className="text-[5px] text-normal"/>
                                        <Typography variant="subtitle2"
                                                    className="font-gilroyMedium">${modifierInfo?.price}</Typography>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </div>
            </div>
            {/*<div className="p-[15px] sm:p-[30px] flex flex-col gap-[20px] w-full">
              <Table sx={{minWidth: 650}} aria-label="Dropoff Order Details Table"
                     className="bg-[#f6f6f6] !rounded-[8px]">
                <TableHead>
                  <TableRow>
                    <TableCell align="center"
                               className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-[#f6f6f6] border-b-[1px] border-[#ebebeb]">PHOTO</TableCell>
                    <TableCell align="center"
                               className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-[#f6f6f6] border-b-[1px] border-[#ebebeb]">ITEM
                      NAME</TableCell>
                    <TableCell align="center"
                               className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-[#f6f6f6] border-b-[1px] border-[#ebebeb]">ITEM
                      ID</TableCell>
                    <TableCell align="center"
                               className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-[#f6f6f6] border-b-[1px] border-[#ebebeb]">UNITS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {element && element.package.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{'&:last-child td, &:last-child th': {border: 0}}}
                    >
                      <TableCell align="center" className="font-gilroy text-[14px] text-heading flex justify-center">{
                        <img className="w-[40px] h-[40px] mix-blend-darken rounded" src={row.photo}/>}</TableCell>
                      <TableCell align="center"
                                 className="font-gilroy text-[14px] text-heading">{row.name}</TableCell>
                      <TableCell align="center"
                                 className="font-gilroy text-[14px] text-heading">{row.itemId}</TableCell>
                      <TableCell align="center"
                                 className="font-gilroy text-[14px] text-heading">{row.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex flex-col sm:flex-row justify-between gap-[24px] sm:gap-[48px] w-full">
                <div className="w-full"><Typography variant="subtitle2"><span className="font-medium">Note:</span> This
                  person may not have a QR code because they do not use technology, pickup name only is ok.</Typography>
                </div>
                <div className="w-full sm:text-end"><Typography variant="subtitle2">curbside / drive-thru
                  eligible <CheckCircleOutlineOutlinedIcon className="text-[14px]"/></Typography></div>
              </div>
            </div>*/}
          </StyledTableContainer>

          {/*<div className="flex justify-end mt-10">
            <DefaultButton value={'Scan pickup QR'} onClick={() => handlePickupQRScannedOpen(element._id)}/>
          </div>*/}
        </div>
      }

      <Popover
        open={Boolean(openWithdraw)}
        anchorEl={openWithdraw}
        onClose={handleWithdrawPopoverClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem disabled={element?.status === "Canceled"} onClick={openConfirmWithdrawOrderModal}>
          <Typography variant="subtitle2" className="text-primary">Withdraw order</Typography>
        </MenuItem>
      </Popover>

      {/* Pickup QR scanned */}
      <React.Fragment>
        <OrderQRModal
          isOpen={openPickupQRScanned}
          onClose={handlePickupQRScannedClose}
          action={handlePickupQRScannedClose}
          orderId={`${element?.deliveryType === "Pickup" ? 'PP' : element?.deliveryType === "Delivery" ? "DD" : "SS"}${element?._id}`}
          value={`https://pickuppointe.com/vendor/manage-orders/order-details/${element?._id}`}
        />
      </React.Fragment>

      {/* Withdraw order modal */}
      <React.Fragment>
        <ConfirmDelete
          confirmMsg={"Do you want to withdraw this order?"}
          description={"By confirming, your scheduled order will be canceled, and you will not receive the items further."}
          isOpen={openWithdrawOrderModal}
          onClose={closeWithdrawOrderModal}
          onConfirm={confirmWithdrawOrder}
          cancelText={"Cancel"}
          confirmText={"Withdraw order"}
        />
      </React.Fragment>
    </>
  )
}

export default OrderDetailsView;