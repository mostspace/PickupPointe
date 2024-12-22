import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from 'react-router-dom';
// @mui
import {
  Button, Box, Grid, styled, Typography, IconButton,
} from '@mui/material';
// Components
import PickupMap from 'src/components/pickup-map';
// Icons
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import CircleIcon from '@mui/icons-material/Circle';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
// config
import {MAPBOX_API} from 'src/config-global';
import DefaultButton from "src/components/button/default-button";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import QrCodeRoundedIcon from "@mui/icons-material/QrCodeRounded";

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
  minZoom: 10,
};

const StyledMapContainer = styled('div')(({theme}) => ({
  zIndex: 0,
  width: '100%',
  height: 293,
  overflow: 'hidden',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  '& .mapboxgl-ctrl-logo, .mapboxgl-ctrl-bottom-right': {
    display: 'none',
  },
}));

// --------------------------------------------------------------------------------------------------

const ActiveOrderDetails = () => {
  const location = useLocation();
  const {order} = location.state || {};

  // Redirect previous page
  const navigate = useNavigate();
  const [geoLocation, setGeoLocation] = useState([null, null]);

  const handleBack = () => {
    navigate(-1); // Navigate to the previous route
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const address = order.dropoff_location.split(",");
        const postalCode = address[address.length - 1].trim().split(" ")[1];
        console.log(address);
        console.log(postalCode);
        fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${order.dropoff_location}.json?access_token=${MAPBOX_API}`)
          .then(response => response.json())
          .then(data => {
            if (data.features && data.features.length > 0) {
              const [lng, lat] = data.features[0].geometry.coordinates;
              setGeoLocation([lat, lng]);
            }
          })
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {
      setGeoLocation([null, null]);
    };
  }, [order]);

  return (
    <>
      <div className="flex flex-col gap-[20px]">
        <div className="flex gap-[10px] items-center">
          <IconButton onClick={handleBack}>
            <KeyboardBackspaceIcon className="text-[24px] text-heading"/>
          </IconButton>
          {order &&
            <div className="flex items-center gap-[5px] rounded-sm">
              <Typography variant="h6" className="text-[16px] sm:text-[18px]">
                Order{" "}
                <span className="font-gilroyMedium underline">
                  #{`${order.deliveryType === "Pickup" ? 'PP' : order.deliveryType === "Delivery" ? "DD" : "SS"}${order.id}`}
                </span>
              </Typography>
            </div>
          }
        </div>

        <div className="border rounded-[16px] p-[15px] sm:p-[24px]">
          <div className="flex flex-col gap-[24px]">
            <Typography variant="h6">Order Details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={7}>
                <div className="w-full flex flex-col gap-[16px]">
                  <div
                    className="border rounded-[12px] px-[16px] sm:px-[24px] py-[16px] flex flex-col w-full gap-[24px]">
                    <div className="flex gap-[12px] items-center">
                      <div
                        className="w-[56px] h-[56px] rounded-full border overflow-hidden p-[8px] flex justify-center items-center">
                        <img src={order.store_logo} className="object-cover" style={{transform: "scale(1.3)"}}/>
                      </div>
                      <div className="flex flex-col gap-[3px]">
                        <Typography variant="subtitle1" className="font-gilroyMedium">{order.store_name}</Typography>
                        <Typography variant="text1">{order.store_tag}</Typography>
                      </div>
                    </div>

                    <div className="flex flex-col gap-[24px]">
                      <div className="flex flex-col sm:flex-row justify-between gap-[40px]">
                        <div className="flex flex-col gap-[24px]">
                          <div className="flex flex-col gap-[3px]">
                            <Typography variant="label">Pick-up date</Typography>
                            <Typography variant="subtitle2">{order.pickup_date}</Typography>
                          </div>
                          <div className="flex flex-col gap-[3px]">
                            <Typography variant="label">Drop-off location</Typography>
                            <Typography
                              variant="subtitle2">{order.dropoff_location}</Typography>
                          </div>
                        </div>
                        <div className="flex flex-col gap-[24px]">
                          <div className="flex flex-col gap-[3px]">
                            <Typography variant="label">Pick-up time-frame</Typography>
                            <Typography
                              variant="subtitle2">{order.pickup_time_frame}</Typography>
                          </div>
                          <div className="flex flex-col gap-[3px]">
                            <Typography variant="label">Delivery</Typography>
                            <Typography variant="subtitle2">{order.delivery}</Typography>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-[12px]">
                        {/* <div className="flex flex-col gap-[3px]">
                            <Typography variant="label">Auto-pay</Typography>
                            <Typography variant="subtitle2">{order.auto_pay}</Typography>
                          </div> */}
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
                                <Typography variant="label1">
                                  <span className={"capitalize"}>{row?.variant}</span>
                                </Typography>
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
                              {row.modifiers && row.modifiers.map((modifier, idx) => {
                                let modifierInfo = order?.modifierItemsInfo?.find(modifierItem => modifierItem._id === modifier);
                                return (
                                  <div className="flex gap-[16px] justify-between">
                                    <div className="flex items-center gap-[10px]">
                                      <img className="ml-[30px] w-[30px] h-[30px] mix-blend-darken rounded"
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

                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={5}>
                <div className="flex flex-col gap-[16px]">
                  <div className="relative rounded-[8px] overflow-hidden">
                    {/* Overlay for dark background and blur */}
                    {/* {!order.delivery_status && (
                      <div
                        className="absolute inset-0 bg-black bg-opacity-55 backdrop-blur-sm z-10">
                        <div
                          className="w-full h-full flex flex-col gap-[3px] justify-center items-center">
                          <Typography variant="subtitle2" className="text-white">Delivery has not started yet</Typography>
                          <Typography variant="subtitle2" className="text-white">{order.dropoff_location}</Typography>
                        </div>
                      </div>
                    )} */}

                    {/* Map Container */}
                    <StyledMapContainer className="relative z-0">
                      <PickupMap {...baseSettings} themes={THEMES} latitude={geoLocation[0]} longitude={geoLocation[1]} />
                    </StyledMapContainer>
                  </div>

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
                        <Typography variant="subtitle3">Discount</Typography>
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

        {/* <div className="border rounded-[16px] p-[15px] sm:p-[24px] flex flex-col gap-[16px]">
                    <Typography variant="h6">Order stage</Typography>
                    {order.stage.map((stage, index) => (
                        <div className="border rounded-[12px] p-[12px]">
                            <div className="flex flex-col gap-[12px]">
                                <div className="flex gap-[8px] items-start">
                                    <Box component="span" sx={{ ...shapeStyles, }} className={`mt-[4px] ${index === (order.stage.length - 1) ? 'bg-primary': 'bg-secondary text-heading'}`}>
                                        {index+=1}
                                    </Box>
                                    <div className="flex flex-col">
                                        <Typography variant="subtitle1">{stage.name}</Typography>
                                        <Typography variant="label">{stage.date}</Typography>
                                    </div>
                                </div>
                                {stage.warning && (
                                    stage.warning.map((warning) => (
                                        <div className="ml-[36px] flex flex-col">
                                            <div className="flex items-start gap-[5px]">
                                                <WarningAmberOutlinedIcon className="text-[14px] text-primary mt-[5px]" />
                                                <div className="flex flex-col">
                                                    <Typography variant="subtitle2">{warning.title}</Typography>
                                                    <Typography variant="label">{warning.date}</Typography>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ))}
                </div> */}

        {/* <div className="flex justify-center sm:justify-end sm:mt-[24px]">
                    <DefaultButton value="Send message to restaurant" />
                </div> */}
      </div>
    </>
  )
}

export default ActiveOrderDetails;