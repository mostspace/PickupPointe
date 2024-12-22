import React, {useEffect, useState} from "react";
import {
  Autocomplete,
  Button, Dialog, DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import ChooseLocation from "src/components/choose-location-select";
import AddIcon from "@mui/icons-material/Add";
import {useDispatch, useSelector} from "react-redux";
import {fetchShops} from "src/reducers/shopSlice.js";
import {useFormContext} from "react-hook-form";
import {getAllLocations, getLocationByShop} from "src/reducers/locationSlice.js";

const AssignModal = ({isOpen, onClose, addNewLocation}) => {
  const dispatch = useDispatch();
  const {shops} = useSelector(state => state.shops);
  const {locations} = useSelector(state => state.locations);

  const [selectedShop, setSelectedShop] = useState({});
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [originalData, setOriginalData] = useState(null)

  const {setValue, watch} = useFormContext();

  useEffect(() => {
    dispatch(fetchShops());
    dispatch(getAllLocations())
  }, []);

  useEffect(() => {
    if (originalData === null) {
      setOriginalData(watch("locations"));
      setSelectedOptions(watch("locations"));
    }
  }, [watch("locations")]);

  useEffect(() => {
    setValue("locations", selectedOptions.map(item => {
      return {
        ...item,
        locationId: item?.location?._id || item._id,
        location: item?.location || item
      }
    }));
  }, [selectedOptions]);

  useEffect(() => {
    if (locations.length > 0) {
      if (selectedShop && selectedShop._id) {
        setSelectedOptions(locations.map(location => {
          return {
            amountAtThis: 0,
            maxQty: 0,
            per: "day",
            location: location,
            locationId: location._id,
          }
        }));
      } else if (selectedShop === null) {
        setSelectedOptions(originalData);
      }
    }
  }, [locations]);

  const onShopChange = (e, value) => {
    setSelectedShop(value);
    if (value && value._id) {
      dispatch(getLocationByShop(value._id));
    } else {
      dispatch(getAllLocations());
    }
  }

  const onSelectionChange = (options) => {
    setSelectedOptions(options.map(item => {
      return {
        ...item,
        location: typeof item.locationId === "object" ? item.locationId : item.location,
        locationId: typeof item.locationId === "object" ? item.locationId._id : item.locationId,
      }
    }));
  }

  return (
    <Dialog
      className="w-full !font-gilroy"
      open={isOpen}
      onClose={onClose}
      scroll="paper"
      sx={{
        width: "100% !important",
      }}
    >
      <DialogTitle id="" className='pt-[32px] sm:!pt-[64px] pb-[40px]'>
        <h1 className='text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center font-gilroy'>Assign location to item</h1>
      </DialogTitle>
      <DialogContent dividers={scroll === 'paper'}>
        <DialogContentText tabIndex={-1}>
          <div className='w-full flex flex-col gap-[24px] sm:px-[100px] pb-[100px]'>
            <div className="w-full flex flex-col gap-[5px]">
              <Typography variant='h5' className='capitalize'>Shops</Typography>
              <Autocomplete
                disablePortal
                options={shops || []}
                getOptionLabel={(option) => option.name || ''}
                value={selectedShop}
                onChange={onShopChange}
                popupIcon={<KeyboardArrowDownOutlinedIcon />}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Select a shop"
                    className="line-clamp-1"
                  />
                )}
              />
            </div>
            <div className="w-full flex flex-col gap-[5px]">
              <Typography variant='h5' className='capitalize'>Location</Typography>
              <ChooseLocation
                selectedOptions={selectedOptions}
                onSelectionChange={(e, value) => onSelectionChange(value)}
                onAddLocation={addNewLocation}
              />

              {/* <ChooseLocation
                  name="locations"
                  selectedOptions={selectedOptions}
                  onSelectionChange={handleLocationSelectionChange}
              /> */}
            </div>
            <Stack direction="row">
              <Button className="text-heading font-gilroy normal-case text-[14px]" onClick={addNewLocation}>
                <AddIcon className="mr-2" sx={{ color: '#181818', fontSize: '18px' }} /> Add new location
              </Button>
            </Stack>
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions className="!px-[22px] !pb-[32px] sm:!pb-[64px] sm:!px-[80px] !gap-[14px]">
        <Button
          onClick={onClose}
          sx={{
            width: '100%',
            height: '44px',
            fontFamily: 'Gilroy',
            fontSize: '14px',
            color: '#181818',
            borderRadius: '8px',
            backgroundColor: '#F5F5F5',
            textTransform: 'unset',
          }}
        >
          Cancel
        </Button>
        <Button className='w-full'
                sx={{
                  width: '100%',
                  height: '44px',
                  fontFamily: 'Gilroy',
                  fontSize: '14px',
                  color: '#ffffff',
                  borderRadius: '8px',
                  backgroundColor: '#F14445',
                  textTransform: 'unset',
                  '&:hover': {
                    backgroundColor: '#E13031',
                  }
                }}
                onClick={onClose}
        >
          Assign
        </Button>
      </DialogActions>
    </Dialog>
  )
};

export default AssignModal;