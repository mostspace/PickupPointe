import React, {useEffect, useState} from "react";

// @mui
import {
  Select,
  FormControl,
  Popover,
  Box,
  MenuItem,
  Typography,
  IconButton,
  InputAdornment,
  Divider,
  FormControlLabel,
  Collapse
} from '@mui/material';

// Icons
import CircleIcon from '@mui/icons-material/Circle';
import Iconify from 'src/components/iconify';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// Components
import {RHFTextField} from 'src/components/hook-form';
import {useFormContext} from 'react-hook-form';


import LightTooltip from "src/components/LightTooltip";
import IOSSwitch from "src/components/ios-switch";

// Assets
import './expandable.css';
import {getLocationAddress} from "src/components/choose-location-select";
import EditLocationModal from "src/components/modal/location";

const PickupLocationCard = ({item, expanded, handleExpandClick}) => {
  const location = item.location;
  const {setValue, watch} = useFormContext();

  const locations = watch('locations');
  const indexLocation = locations.findIndex((elem) => location?._id === elem?.location?._id);
  const [pickupLocationPrice, setPickupLocationPrice] = useState();
  const [pickupLocationTaxRate, setPickupLocationTaxRate] = useState(location?.taxRate);
  const [pickupLocationQty, setPickupLocationQty] = useState();
  const [pickupLocationCurrentQty, setPickupLocationCurrentQty] = useState(0);
  const [openLocationCardMoreMenu, setOpenLocationCardMoreMenu] = useState(null);
  const [openEditPickupLocation, setOpenEditPickupLocation] = React.useState(false);

  useEffect(() => {
    setPickupLocationPrice(locations[indexLocation]?.amountAtThis || "")
    setPickupLocationQty(locations[indexLocation]?.maxQty || "")
    setPickupLocationCurrentQty(locations[indexLocation]?.currentQuantity || "")
  }, [locations]);

  const handleCurrentLocationValue = (event) => {
    const value = event.target.value;
    setPickupLocationCurrentQty(value);

    const updatedLocations = [...locations];
    updatedLocations[indexLocation] = {
      ...updatedLocations[indexLocation],
      currentQuantity: value
    };
    setValue('locations', updatedLocations);
  }

  const handlePickupPriceDecimalValue = (event) => {
    const value = event.target.value;
    setPickupLocationPrice(value);

    const updatedLocations = [...locations];
    updatedLocations[indexLocation] = {
      ...updatedLocations[indexLocation],
      amountAtThis: value
    };
    setValue('locations', updatedLocations);
  };

  const handlePickupPriceBlur = () => {
    // const formattedValue = parseFloat(pickupLocationPrice).toFixed(2);
    // setPickupLocationPrice(formattedValue);
  };

  /*const handlePickupTaxRateDecimalValue = (event) => {
    const value = event.target.value;
    setPickupLocationTaxRate(value);
    locations[indexLocation] = {
      ...item,
      taxRate: value
    }
    setValue('locations', locations);
  };

  const handlePickupTaxRateBlur = () => {
    const formattedValue = parseFloat(pickupLocationPrice).toFixed(2);
    setPickupLocationTaxRate(formattedValue);
  };*/

  const handlePickupQty = (event) => {
    const value = event.target.value;
    setPickupLocationQty(value);
    const updatedLocations = [...locations];
    updatedLocations[indexLocation] = {
      ...updatedLocations[indexLocation],
      maxQty: value
    };
    setValue('locations', updatedLocations);
  }

  const handleUnassignLocation = () => {
    const newLocations = locations.filter((location) => location?.location?._id !== location?._id);
    setValue('locations', newLocations);
    setOpenLocationCardMoreMenu(null);
  }

  // Location Card More Icon Popper Menu
  const handleLocationCardMoreMenuOpen = (event) => {
    setOpenLocationCardMoreMenu(event.currentTarget);
  };
  const handleLocationCardMoreMenuClose = () => {
    setOpenLocationCardMoreMenu(null);
  };

  // Edit Location Modal
  const handleEditPickupLocationOpen = () => {
    handleLocationCardMoreMenuClose();
    setOpenEditPickupLocation(true);
  };
  const handleEditPickupLocationClose = (newLocation) => {
    if (newLocation) {
      const updatedLocations = [...locations];
      updatedLocations[indexLocation] = {
        ...updatedLocations[indexLocation],
        location: newLocation
      };
      setValue('locations', updatedLocations);
    }
    setOpenEditPickupLocation(false);
  };

  return (
    <>
      <div className="w-full h-full flex flex-col bg-white border p-[20px] rounded-[12px]">
        <div className="w-full h-full flex flex-col sm:flex-row justify-between gap-[16px] items-start">
          <div className="w-full h-full flex flex-col gap-[24px]">
            <div className="flex flex-col gap-[5px]">
              <div className="flex items-center gap-[8px]">
                <Typography variant="subtitle1" className="">{location?.name}</Typography>
                <CircleIcon className="text-[5px] text-heading"/>
                {location?.isActive ? <Typography variant="subtitle1" className='text-success'>Active</Typography> :
                  <Typography variant="subtitle1" className='text-primary'>Inactive</Typography>}
              </div>
              <div className="flex items-center gap-[8px]">
                <Typography variant="subtitle2" className="line-clamp-1">{getLocationAddress(item)}</Typography>
              </div>
            </div>
            <div className="w-full flex flex-wrap gap-[12px] sm:gap-[24px]">
              <div className="flex flex-col gap-[12px]">
                <div className="flex flex-col gap-[3px]">
                  <Typography variant="label1">Location phone number</Typography>
                  <Typography variant="subtitle2" className="leading-[35px]">{location?.contact?.phoneNumber}</Typography>
                </div>
                <div className="flex flex-col gap-[3px]">
                  <Typography variant="label1">Location manager</Typography>
                  <Typography variant="subtitle2" className="leading-[35px]">{location?.contact?.firstName} {location?.contact?.lastName}</Typography>
                </div>
              </div>
              <div className="flex flex-col gap-[12px]">
                <div className="flex flex-col gap-[3px]">
                  <Typography variant="label1">Store hours</Typography>
                  <Typography variant="subtitle2" className="leading-[35px]">Mon-Sun, 7AM-9PM PST</Typography>
                </div>
                <div className="flex flex-col gap-[3px]">
                  <Typography variant="label1">Support email</Typography>
                  <Typography variant="subtitle2" className="leading-[35px]">{location?.contact?.supportEmail || 'No email'}</Typography>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-full flex flex-col gap-[10px]">
            <div className="w-full flex justify-between items-end gap-[12px]">
              <FormControl variant="standard" className='w-full'>
                <Typography variant="label1">Price at location</Typography>
                <RHFTextField
                  name="price"
                  placeholder="0.00"
                  type="number"
                  value={pickupLocationPrice}
                  onChange={handlePickupPriceDecimalValue}
                  onBlur={handlePickupPriceBlur}
                  InputLabelProps={{shrink: true}}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box component="span" sx={{color: 'text.disabled'}}>
                          $
                        </Box>
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
              <FormControl variant="standard" className='w-full'>
                <Typography variant="label1">Tax rate at location</Typography>
                <RHFTextField
                  name="price"
                  placeholder="0.00"
                  type="number"
                  value={pickupLocationTaxRate}
                  /*onChange={handlePickupTaxRateDecimalValue}
                  onBlur={handlePickupTaxRateBlur}*/
                  InputLabelProps={{shrink: true}}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box component="span" sx={{color: 'text.disabled'}}>
                          %
                        </Box>
                      </InputAdornment>
                    ),
                    readOnly: true
                  }}
                />
              </FormControl>
            </div>
            <div className="w-full flex justify-between items-end gap-[12px]">
              <FormControl variant="standard" className='w-full'>
                <div className="flex gap-[5px] items-center">
                  <Typography variant="label1">Enter max qty</Typography>
                  <LightTooltip
                    title="Set a limit of how many units of this item can be sold before the scheduled pickup day, if the limit is met, we will remove the listing for the pickup time(s) you have set.">
                    <InfoOutlinedIcon sx={{fontSize: '16px', marginBottom: '3px',}}/>
                  </LightTooltip>
                </div>
                <RHFTextField className="w-full" name="" placeholder="Enter max qty" type="number" value={pickupLocationQty} onChange={handlePickupQty}/>
              </FormControl>
              <FormControl className="w-full">
                <Typography variant="label1">Per</Typography>
                <Select
                  labelId="demo-simple-select-label"
                  size="small"
                  defaultValue={1}
                >
                  <MenuItem value={1} className="!text-[12px] sm:!text-[14px] !font-gilroy">Day</MenuItem>
                  <MenuItem value={2} className="!text-[12px] sm:!text-[14px] !font-gilroy">Week</MenuItem>
                  <MenuItem value={3} className="!text-[12px] sm:!text-[14px] !font-gilroy">Month</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="w-full flex justify-between items-end gap-[12px]">
              <FormControl variant="standard" className='w-full'>
                <Typography variant="label1">Enter current quantity</Typography>
                <RHFTextField className="w-full" name="currentQuantity" placeholder="Enter current qty" type="number" value={pickupLocationCurrentQty} onChange={handleCurrentLocationValue}/>
              </FormControl>
              <div className="w-full flex justify-between items-end">
                <div className="flex flex-col items-start justify-center">
                  <Typography variant="label1">In stock</Typography>
                  <FormControlLabel className='w-fit m-0' control={<IOSSwitch sx={{m: 1}} defaultChecked/>} />
                </div>
                <div className="flex gap-[12px] items-center justify-end">
                  <IconButton size="large" color="inherit" onClick={handleLocationCardMoreMenuOpen} className="p-2">
                    <Iconify icon={'eva:more-vertical-fill'}/>
                  </IconButton>
                  <IconButton onClick={handleExpandClick}>
                    <ExpandMoreIcon className={`text-[26px] text-heading transition duration-300 ease-in-out ${expanded ? 'rotate-180' : ''}`}/>
                  </IconButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Collapse in={expanded}>
          <div className={`flex flex-col gap-[24px] mt-[24px]`}>
            <Typography variant="h5" className="capitalize">Location settings</Typography>

            <div className="flex flex-col gap-[14px]">
              <div className="flex flex-col sm:flex-row justify-between gap-[24px]">
                <div className="w-full flex flex-col gap-[14px]">
                  <Typography variant="subtitle1" className="">Delivery details</Typography>
                  <div className="flex flex-col gap-[3px]">
                    <Typography variant="label">Location fulfillment type</Typography>
                    <Typography variant="subtitle2">Pickup and delivery available</Typography>
                  </div>

                  <div className="flex flex-col gap-[3px]">
                    <Typography variant="label">Delivery method</Typography>
                    <Typography variant="subtitle2">Door-to-door courier delivery</Typography>
                  </div>

                  <div className="flex flex-col gap-[3px]">
                    <Typography variant="label">Set your maximum courier delivery distance radius in miles</Typography>
                    <Typography variant="subtitle2">12</Typography>
                  </div>

                  <div className="flex w-full justify-between gap-[14px]">
                    <div className="w-full flex flex-col gap-[3px]">
                      <Typography variant="label">Default pickup days for this item</Typography>
                      <Typography variant="subtitle2">Mon, Tue, Wed</Typography>
                    </div>

                    <div className="w-full flex flex-col gap-[3px]">
                      <Typography variant="label">Default delivery days for this item</Typography>
                      <Typography variant="subtitle2">Mon, Tue, Wed</Typography>
                    </div>
                  </div>

                  <div className="flex w-full justify-between gap-[14px]">
                    <div className="w-full flex flex-col gap-[3px]">
                      <Typography variant="label">Pick-up time-frame</Typography>
                      <Typography variant="subtitle2">9AM to 3PM</Typography>
                    </div>

                    <div className="w-full flex flex-col gap-[3px]">
                      <Typography variant="label">Delivery time-frame</Typography>
                      <Typography variant="subtitle2">9AM to 3PM</Typography>
                    </div>
                  </div>
                </div>

                <div className="w-full flex flex-col gap-[14px]">
                  <div className="flex flex-col gap-[3px]">
                    <Typography variant="label">When you make courier deliveries for this item, will they be delivered
                      from a different location than this location? If so, please indicate below and we will use a
                      separate delivery originating address to calculate the distance radius.
                      Note: You can make an originating delivery address private so your customers are unable to see the
                      address of where the delivery is originating by setting the dial to ON in the location details
                      section.</Typography>
                    <Typography variant="subtitle2">Yes</Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Collapse>
      </div>

      {/* Edit Location Modal */}
      <React.Fragment>
        <EditLocationModal
          isOpen={openEditPickupLocation}
          onClose={handleEditPickupLocationClose}
          isEditMode={true}
          location={item}
          onSaveSuccess={handleEditPickupLocationClose}
        />
      </React.Fragment>

      {/* Handle Location Card More Popper Menu */}
      <Popover
        open={Boolean(openLocationCardMoreMenu)}
        anchorEl={openLocationCardMoreMenu}
        onClose={handleLocationCardMoreMenuClose}
        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
        transformOrigin={{vertical: 'top', horizontal: 'right'}}
        PaperProps={{
          sx: {
            p: 1,
            width: 150,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
              fontFamily: 'Gilroy'
            },
          },
        }}
      >
        <MenuItem onClick={handleEditPickupLocationOpen}>
          Edit location
        </MenuItem>
        <Divider/>
        <MenuItem onClick={handleUnassignLocation} sx={{color: 'error.main', fontFamily: 'Gilroy'}}>
          Unassign location
        </MenuItem>
      </Popover>
    </>
  );
}

export default PickupLocationCard;