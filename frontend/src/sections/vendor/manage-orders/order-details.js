import React, {useState, useCallback, useEffect, useMemo} from "react";
import {useParams, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import dayjs from "dayjs";
// @mui
import {
  Table, Paper, TableHead, TableRow, TableBody, TableCell, Typography, Chip, Grid, IconButton
} from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CircleIcon from '@mui/icons-material/Circle';
import QrCodeRoundedIcon from '@mui/icons-material/QrCodeRounded';
// Components
import {getLocationAddress} from "src/components/choose-location-select";
import ButtonLoader from "src/components/button-loader/ButtonLoader";
import {getOrderById} from "src/reducers/vendor/orderSlice";
// Utils
import {StyledTableContainer} from "src/utils/table-helpers";
// Reducers
import OrderQRModal from "src/components/modal/order-qr/index.js";
import {memoizedOrderName} from "src/utils/utilityFunctions.js";

// --------------------------------------------------------------------------------------------------

const OrderDetailsView = () => {
  const navigate = useNavigate();

  const orderStore = useSelector((state) => state.order);
  const {isLoading, orderDetail} = orderStore;
  const {id} = useParams();
  const [element, setElement] = useState(null);


  const dispatch = useDispatch();
  const goBackToList = () => history.back();

  useEffect(() => {
    dispatch(getOrderById(id));
  }, [id])

  useEffect(() => {
    if (Object.keys(orderDetail).length > 0) {
      setElement(orderDetail)
    }
  }, [orderDetail])

  // Pickup QR scanned Modal
  const [openPickupQRScanned, setOpenPickupQRScanned] = React.useState(false);
  const handlePickupQRScannedOpen = (id) => setOpenPickupQRScanned(true);
  const handlePickupQRScannedClose = () => setOpenPickupQRScanned(false);

  const getOrderName = useMemo(() => (ordererInfo) => memoizedOrderName(ordererInfo), []);

  return (
    <>
      {isLoading ? <div className="h-full flex justify-center"><ButtonLoader/></div> :
        <div className="flex flex-col gap-[24px]">
          <div className="flex gap-[10px] items-center">
            <IconButton onClick={() => navigate("/vendor/manage-orders")}>
              <KeyboardBackspaceIcon className="text-[24px] text-heading"/>
            </IconButton>
            {element &&
              <div className="flex items-center gap-[5px] rounded-sm">
                <Typography variant="h6" className="text-[16px] sm:text-[18px]">
                  {element.deliveryType === "Pickup" ? "Pickup " : "Delivery "} 
                  <span className="font-gilroyMedium underline">{`${element.deliveryType === "Pickup" ? 'PP' : element.deliveryType === "Delivery" ? "DD" : "SS"}${element._id}`}</span>
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
                  <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white uppercase">Status</TableCell>
                  <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white uppercase">Customer</TableCell>
                  <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white uppercase">{element?.deliveryType === "Pickup" ? "Pickup" : "Delivery"} Date/Time</TableCell>
                  <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white uppercase">Shop</TableCell>
                  <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white uppercase">Location</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  element &&
                  <TableRow sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                    <TableCell align="left" className="font-gilroy text-[12px] text-heading">
                      {
                        <Chip
                          label={element.status}
                          sx={{
                            color: element.status === "Pending" ? '#DD7E26' : element.status === "Completed" ? "#4CAF50" : "#D32F2F",
                            backgroundColor: element.status === "Pending" ? 'rgba(241, 161, 68, 0.24)' : element.status === "Completed" ? 'rgba(76, 175, 80, 0.24)' : 'rgba(211, 47, 47, 0.24)',
                            borderRadius: '6px',
                            fontFamily: 'Gilroy',
                            fontSize: '12px',
                            height: '25px'
                          }}
                        />
                      }
                    </TableCell>
                    <TableCell align="left" className="font-gilroy text-[12px] text-heading" sx={{minWidth: 100}}>
                      {getOrderName(element?.ordererInfo[0] || element?.orderer || "")}.
                    </TableCell>
                    <TableCell align="left" className="font-gilroy text-[12px] text-heading" sx={{minWidth: 110}}>
                      {dayjs(element.time.pickupDate).format("DD MMM YYYY")}<br/>
                      <Typography variant="label1">{dayjs(element.time.pickupTime).format("h:mm a")}</Typography>
                    </TableCell>
                    <TableCell align="left" className="font-gilroy text-[12px] text-heading" sx={{minWidth: 150}}>{element.shopInfo[0]?.name}</TableCell>
                    <TableCell align="left" className="font-gilroy text-[12px] text-heading" sx={{minWidth: 200}}>
                      {element.deliveryType === "Pickup" ? getLocationAddress(element.locationInfo[0]) : element.orderLocation}
                    </TableCell>
                  </TableRow>
                }
              </TableBody>
            </Table>

            <div className="flex flex-col px-[18px] gap-[24px]">
              <div className="border rounded-[8px] p-[15px] sm:p-[24px] flex flex-col lg:flex-row justify-between gap-[32px]">
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
                          <Typography variant="subtitle1" className="font-gilroyMedium">${element?.total.toFixed(2)}</Typography>
                        </div>
                      </div>
                    </div>
                  </Grid>
                  <Grid item lg={7} md={7} sm={12} xs={12}>
                    <div className="flex flex-col gap-[10px]">
                      <Typography variant="subtitle1" className="font-gilroyMedium">Items ordered</Typography>
                      <div className="border rounded-[16px] p-[16px] flex flex-col gap-[8px]">
                        {element && element.package.map((row, index) => (
                          <div key={index} className={`flex flex-col border-dashed ${index !== element.package.length - 1 ? "border-b pb-[8px]" : ""}`}>
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
                                    <div className="flex gap-[16px] justify-between items-center">
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
                                        <Typography variant="subtitle2">${modifierInfo?.price}</Typography>
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

              <div className="flex flex-col sm:flex-row justify-between gap-[24px] sm:gap-[48px] w-full mb-5">
                <div className="w-full">
                  <Typography variant="subtitle2">
                    <span className="font-gilroyMedium">Note:</span> This person may not have a QR code because they do not use technology, pickup name only is ok.
                  </Typography>
                </div>
                {/* <div className="w-full sm:text-end"><Typography variant="subtitle2">curbside / drive-thru
                  eligible <CheckCircleOutlineOutlinedIcon className="text-[14px] text-success"/></Typography></div> */}
              </div>
            </div>
          </StyledTableContainer>
        </div>
      }

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
    </>
  )
}

export default OrderDetailsView;