import React from "react";
import {Link} from 'react-router-dom';
// @mui
import {Box, Grid, styled, Typography, Button} from '@mui/material';
// Components
import PickupMap from 'src/components/pickup-map';
// Icons
import {ArrowForwardIos} from "@mui/icons-material";
import CircleIcon from '@mui/icons-material/Circle';
// config
import {MAPBOX_API} from 'src/config-global';

// ----------------------------------------------------------------------

const shapeStyles = {
  bgcolor: 'primary.main',
  width: 28,
  height: 28,
  borderRadius: '50%',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '16px',
  fontFamily: 'Gilroy',
};

// Map
const THEMES = {
  streets: 'mapbox://styles/mapbox/streets-v11',
  outdoors: 'mapbox://styles/mapbox/outdoors-v11',
  light: 'mapbox://styles/mapbox/light-v10',
  dark: 'mapbox://styles/mapbox/dark-v10',
  satellite: 'mapbox://styles/mapbox/satellite-v9',
  satelliteStreets: 'mapbox://styles/mapbox/satellite-streets-v11',
};

const baseSettings = {
  mapboxAccessToken: MAPBOX_API,
  minZoom: 1,
};

const StyledMapContainer = styled('div')(({theme}) => ({
  zIndex: 0,
  width: '100%',
  height: 145,
  overflow: 'hidden',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  '& .mapboxgl-ctrl-logo, .mapboxgl-ctrl-bottom-right': {
    display: 'none',
  },
}));

// --------------------------------------------------------------------------------------------------

const Main = ({order}) => {

  return (
    <div className="border rounded-[24px] p-[15px] sm:p-[32px]">
      <div className="flex flex-col gap-[24px]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[12px] sm:gap-[24px]">
          <div className="flex flex-col gap-[3px]">
            <Typography variant="h6">Order{" "}
              <span className="underline font-gilroyMedium"> #{`${order.deliveryType === "Pickup" ? 'PP' : order.deliveryType === "Delivery" ? "DD" : "SS"}${order.id}`}</span>
            </Typography>
            {/* <Typography variant="text1">Ready for pickup in {order.ready_time}</Typography> */}
          </div>
          {/* <div className="flex items-center gap-[8px]">
                        <Box component="span" sx={{ ...shapeStyles, }}>
                            {order.stage.length}
                        </Box>
                        <Typography variant="subtitle2">{order.status}</Typography>
                    </div> */}
          <div className="ml-auto">
            <Link to="order-details" state={{order}}>
              <Button className="text-heading font-gilroy normal-case text-[14px]">
                See details <ArrowForwardIos className="text-heading text-[14px] ml-1"/>
              </Button>
            </Link>
          </div>
        </div>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={7}>
            <div className="w-full flex flex-col gap-[16px]">
              <div className="border rounded-[12px] px-[16px] sm:px-[24px] py-[16px]">
                <div className="flex gap-[12px] items-center">
                  <div
                    className="w-[56px] h-[56px] rounded-full border overflow-hidden p-[8px] flex justify-center items-center">
                    <img src={order.store_logo} className="object-cover" loading="lazy" style={{transform: "scale(1.3)"}}/>
                  </div>
                  <div className="flex flex-col gap-[3px]">
                    <Typography variant="subtitle1" className="font-gilroyMedium">{order.store_name}</Typography>
                    <Typography variant="text1">{order.store_tag}</Typography>
                  </div>
                </div>
              </div>

              <div className="border rounded-[12px] px-[16px] sm:px-[24px] py-[16px]">
                <div className="flex flex-col gap-[8px]">
                  {order?.products?.map((row, index) => (
                    <div key={index} className={`flex flex-col border-dashed ${index !== order.products.length - 1 ? "border-b pb-[8px]" : ""}`}>
                      <div className={`flex justify-between items-center`}>
                        <div className="flex items-center gap-[10px]">
                          <img className="w-[40px] h-[40px] mix-blend-darken rounded" src={row.img}/>
                          <div className="flex flex-col gap-[2px]">
                            <Typography variant="subtitle2">{row.name}</Typography>
                            <Typography variant="label1"><span
                              className={"capitalize"}>{row?.variant}</span></Typography>
                          </div>
                        </div>
                        <div className="flex gap-[8px] items-center">
                          <Typography variant="text1">{row.quantity}x</Typography>
                          <CircleIcon className="text-[5px] text-normal"/>
                          <Typography variant="subtitle2" className="font-gilroyMedium">${row.price}</Typography>
                        </div>
                      </div>
                      {row.modifiers && (
                        <div className={`flex flex-col gap-[5px] ${row.modifiers.length > 0 ? "pt-[5px]" : ""}`}>
                          {row.modifiers.map((modifier, idx) => {
                            let modifierInfo = order?.modifierItemsInfo?.find(modifierItem => modifierItem._id === modifier);
                            return (
                              <div key={idx} className="flex gap-[16px] justify-between">
                                <div className="flex items-center gap-[10px]">
                                  <img className="ml-[30px] w-[30px] h-[30px] mix-blend-darken rounded" src={modifierInfo?.photo}/>
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
                  {/*{order.products.map((product, index) => (
                    <div key={index}
                         className="border-b pb-[12px] last:border-b-0 last:pb-0">
                      <div className="w-full flex gap-[12px] items-start justify-between ">
                        <div className="w-[67px] h-[48px] rounded-[8px] overflow-hidden mt-[7px]">
                          <img src={product.img} className="w-full h-full object-cover" loading="lazy"/>
                        </div>
                        <div className="w-full flex flex-col gap-[8px]">
                          <div className="w-full flex items-center justify-between">
                            <Typography variant="subtitle1">
                              {product.name}
                            </Typography>
                            <Typography variant="subtitle1" className="flex items-center">
                              {product.quantity} x
                              <CircleIcon className="text-[3px] mx-[5px]"/>{" "}
                              ${product?.price?.toFixed(2)}
                            </Typography>
                          </div>
                          <Typography variant="label">
                            {product?.tags?.map((tag) => (
                              <>{tag}<CircleIcon className="text-[3px] mx-[3px]"/></>
                            ))}
                          </Typography>
                        </div>
                      </div>
                      {product?.package?.selectedItems && product?.package?.selectedItems.map((modifier, idx) => {
                        let modifierInfo = order?.modifierItemsInfo?.find(modifierItem => modifierItem._id === modifier);
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
                  ))}*/}
                </div>
              </div>

            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={5}>
            <div className="flex flex-col gap-[16px]">
              {/*<div className="relative rounded-[8px] overflow-hidden">
                                 Overlay for dark background and blur
                                {!order.delivery_status && (
                                    <div className="absolute inset-0 bg-black bg-opacity-55 backdrop-blur-sm z-10">
                                        <div className="w-full h-full flex flex-col gap-[3px] justify-center items-center">
                                             <Typography variant="subtitle2" className="text-white">Delivery has not started yet</Typography>
                                            <Typography variant="subtitle2" className="text-white">{order.dropoff_location}</Typography>
                                        </div>
                                    </div>
                                )}
                                
                                 Map Container
                                <StyledMapContainer className="relative z-0">
                                    <PickupMap {...baseSettings} themes={THEMES} />
                                </StyledMapContainer>
                            </div>*/}

              <div className="border px-[16px] py-[24px] rounded-[12px]">
                <div className="flex flex-col gap-[16px]">
                  <div className="flex justify-between items-center">
                    <Typography variant="subtitle3">Order subtotal</Typography>
                    <Typography variant="subtitle1">${order.products_price}</Typography>
                  </div>
                  <div className="flex justify-between items-center">
                    <Typography variant="subtitle3">Platform fee</Typography>
                    <Typography variant="subtitle1">${order.processing_fees}</Typography>
                  </div>
                  <div className="flex justify-between items-center">
                    <Typography variant="subtitle3">Delivery charge</Typography>
                    <Typography variant="subtitle1">${order.delivery_charges}</Typography>
                  </div>
                  <div className="flex justify-between items-center py-[16px] border-y">
                    <Typography variant="subtitle3">Discounts</Typography>
                    <Typography variant="subtitle1">{order.discount_code}</Typography>
                  </div>
                  <div className="flex justify-between items-center">
                    <Typography variant="subtitle1">Total amount</Typography>
                    <Typography variant="subtitle1" className="font-gilroyMedium">${order.total_amount}</Typography>
                  </div>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

export default Main;