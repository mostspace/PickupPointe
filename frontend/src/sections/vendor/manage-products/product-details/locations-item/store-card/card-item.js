import React, { useState, useEffect } from "react";
import { Typography, Checkbox, } from "@mui/material";
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// Components
import LightTooltip from "src/components/LightTooltip";

import  {
  RHFTextField, RHFAutocomplete,
} from 'src/components/hook-form';

import Chip from '@mui/material/Chip';
import { _tags, _days, } from 'src/_mock/assets';

// --------------------------------------------------------------------------------------------------

const CardItem = () => {
  const [localDeliveryAvailable, setLocalDeliveryAvailable] = useState('deliver');
  const [showDeliverySection, setShowDeliverySection] = useState(true);
  const [showPickupSection, setShowPickupSection] = useState(false);

  const handleRadioTabChange = (event) => {
    const value = event.target.value;
    setLocalDeliveryAvailable(value);

    // Reset delivery options checkboxes when changing delivery availability type
    setShowDeliveryOption({
      post: false,
      courier: false,
    });

    if (value === 'pickup_and_deliver') {
      setShowPickupSection(true);
      setShowDeliverySection(true);
    } else if (value === 'deliver') {
      setShowPickupSection(false);
      setShowDeliverySection(true);
    } else if (value === 'pickup') {
      setShowPickupSection(true);
      setShowDeliverySection(false);
    }
  };

  // Radio Different Location True
  const [differentLocationValue, setDifferentLocationValue] = useState('yes');

  const handleDifferentLocationRadioTabChange = (event) => {
    setDifferentLocationValue(event.target.value);
  };

  // Handle Delivery Option
  const [showDeliveryOption, setShowDeliveryOption] = useState({
    post: false,
    courier: false,
  });

  const handleDeliveryOption = (event) => {
    const { value, checked } = event.target;

    setShowDeliveryOption(prevOptions => ({
      ...prevOptions,
      [value]: checked,
    }));

    const isCourierChecked = value === 'courier' ? checked : showDeliveryOption.courier;
    const isPostChecked = value === 'post' ? checked : showDeliveryOption.post;
    const isPickupAndDeliverSelected = localDeliveryAvailable === 'pickup_and_deliver';
    const isDeliverSelected = localDeliveryAvailable === 'deliver';

    // Update setShowDeliverySection based on conditions
    if (isCourierChecked && isPostChecked) {
      setShowDeliverySection(true);
    } else if (!isCourierChecked && isPostChecked) {
      setShowDeliverySection(false);
    } else if (isCourierChecked && !isPostChecked && (isPickupAndDeliverSelected || isDeliverSelected)) {
      setShowDeliverySection(true);
    } else {
      setShowDeliverySection(isPickupAndDeliverSelected || isDeliverSelected);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-[25px]">
        <Typography variant="h5" className="capitalize">Location settings</Typography>

        <div className="flex flex-col gap-[14px]">
          <Typography variant="subtitle1" className="">Delivery details</Typography>

          <div className="flex flex-col sm:flex-row justify-between gap-[24px]">
            <div className="w-full flex flex-col gap-[14px]">
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
                <Typography variant="label">When you make courier deliveries for this item, will they be delivered from a different location than this location? If so, please indicate below and we will use a separate delivery originating address to calculate the distance radius.
                Note: You can make an originating delivery address private so your customers are unable to see the address of where the delivery is originating by setting the dial to ON in the location details section.</Typography>
                <Typography variant="subtitle2">Yes</Typography>
              </div>
              

            </div>
          </div>

          {/* <div className="w-full flex justify-between gap-[24px]">
            <FormControl className="w-full">
              <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Can this product be delivered?</label>
              <RadioGroup InputProps={{ readOnly: true }}
                row
                value={localDeliveryAvailable}
                onChange={handleRadioTabChange}
                aria-label="delivery-options"
                name="delivery-options"
              >
                <FormControlLabel
                  value="pickup"
                  control={<Radio sx={{ '&.Mui-checked': { color: '#F14445' } }} size="small" />}
                  label={<span className="text-[14px]">Pickup only</span>}
                />
                <FormControlLabel
                  value="deliver"
                  control={<Radio sx={{ '&.Mui-checked': { color: '#F14445' } }} size="small" />}
                  label={<span className="text-[14px]">Delivery only</span>}
                />
                <FormControlLabel
                  value="pickup_and_deliver"
                  control={<Radio sx={{ '&.Mui-checked': { color: '#F14445', fontSize: '12px' } }} size="small"/>}
                  label={<span className="text-[14px]">Pickup and delivery available</span>}
                />
              </RadioGroup>
              {(localDeliveryAvailable === 'pickup_and_deliver' || localDeliveryAvailable === 'deliver') && (
                <div className="w-full">
                  <FormControl className="mt-1">
                    <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Delivery method</label>
                    <div className="w-full">
                      <FormControlLabel control={<Checkbox size="small" checked={showDeliveryOption.courier} onChange={handleDeliveryOption} value='courier' />} label={<span className="text-[14px]">Door-to-door courier delivery</span>} />
                      <FormControlLabel control={<Checkbox size="small" checked={showDeliveryOption.post} onChange={handleDeliveryOption} value='post' />} label={<span className="text-[14px]">Post mail delivery</span>} />
                    </div>
                  </FormControl>
                  { showDeliveryOption.courier && 
                    <div className="flex flex-col gap-[14px] mt-4">
                      <FormControl className="w-full">
                        <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Set your maximum courier delivery distance radius in miles</label>
                        <RHFTextField name="newLabel.content" placeholder='Enter miles amount' className="mt-2 w-full sm:mt-0 sm:w-[50%]" type="number" value="12" InputProps={{ readOnly: true }} autoWidth />
                      </FormControl>
                      <FormControl className="mt-2">
                        <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>When you make courier deliveries for this item, will they be delivered from a different location than this location? If so, please indicate below and we will use a separate delivery originating address to calculate the distance radius.</label>
                        <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Note: You can make an originating delivery address private so your customers are unable to see the address of where the delivery is originating by setting the dial to ON in the location details section.</label>
                        <RadioGroup InputProps={{ readOnly: true }}
                          row
                          value={differentLocationValue}
                          onChange={handleDifferentLocationRadioTabChange}
                          aria-label="tabs"
                          name="tabs"
                        >
                          <FormControlLabel
                            value="yes"
                            control={<Radio sx={{ '&.Mui-checked': { color: '#F14445', fontSize: '12px' } }} size="small"/>}
                            label={<span className="text-[14px]">Yes</span>}
                          />
                          <FormControlLabel
                            value="no"
                            control={<Radio sx={{ '&.Mui-checked': { color: '#F14445' } }} size="small" />}
                            label={<span className="text-[14px]">No</span>}
                          />
                        </RadioGroup>
                        {differentLocationValue === 'yes' && (
                          <div className="w-full">
                            <FormControl className="w-full mt-1 sm:w-auto">
                              <Select InputProps={{ readOnly: true }}
                                labelId="demo-simple-select-label"
                                size="small"
                                defaultValue={1}
                                autoWidth
                              >
                                <MenuItem value={1} className="!text-[12px] sm:!text-[14px] !font-gilroy">Store #32322 - 7384 Hayward Way #034 Laguna, CA 93453</MenuItem>
                                <MenuItem value={2} className="!text-[12px] sm:!text-[14px] !font-gilroy">Store #32323 - 7384 Hayward Way #034 Laguna, CA 93453</MenuItem>
                                <MenuItem value={3} className="!text-[12px] sm:!text-[14px] !font-gilroy">Store #32324 - 7384 Hayward Way #034 Laguna, CA 93453</MenuItem>
                              </Select>
                            </FormControl>
                          </div>
                        )}
                      </FormControl>
                    </div>
                  }
                </div>
              )}
            </FormControl>
          </div> */}
        </div>

        {/* <div className="flex flex-col sm:flex-row justify-between gap-[32px]">
          <div className="w-full flex flex-col gap-[20px]">
            {showPickupSection && (
              <>
                <FormControl className="w-full flex flex-col gap-[12px]">
                  <label className='font-normal text-normal leading-[20px] text-[12px]'>Default pickup days for this item</label>
                  <RHFAutocomplete
                    name="pickup_days"
                    placeholder="+ Days"
                    multiple
                    freeSolo
                    options={_days.map((option) => option)}
                    getOptionLabel={(option) => option}
                    values={_days['Mon', 'Tue']}
                    renderOption={(props, option) => (
                      <li {...props} key={option}>
                        {option}
                      </li>
                    )}
                    renderTags={(selected, getTagProps) =>
                      selected.map((option, index) => (
                        <Chip
                          {...getTagProps({ index })}
                          key={option}
                          label={option}
                          size="small"
                          color="tags"
                          variant="soft"
                          className="text-heading font-gilroy"
                        />
                      ))
                    }
                  />
                </FormControl>
                <FormControl className="w-full">
                  <div className="w-full flex flex-col sm:flex-row justify-between gap-[14px]">
                    <div className="w-full flex flex-col gap-[5px]">
                    <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Pick-up time-frame from</label>
                    <div className="flex items-center">
                        <FormControl className="w-[60%]">
                        <Select
                            labelId="demo-simple-select-label"
                            size="small"
                            defaultValue={0}
                            className="!rounded-r-[0px]"
                            >
                            {Array.from({ length: 13 }, (_, i) => i).map((i) => (
                                <MenuItem key={i} value={i} className="!text-[12px] sm:!text-[14px] !font-gilroy">
                                {i}
                                </MenuItem>
                            ))}
                        </Select>
                        </FormControl>
                        <FormControl className="w-[40%]">
                        <Select
                            labelId="demo-simple-select-label"
                            size="small"
                            defaultValue={1}
                            className="!rounded-l-[0px] -ml-[1px]"
                            >
                            <MenuItem value={1} className="!text-[12px] sm:!text-[14px] !font-gilroy">AM</MenuItem>
                            <MenuItem value={2} className="!text-[12px] sm:!text-[14px] !font-gilroy">PM</MenuItem>
                        </Select>
                        </FormControl>
                    </div>
                    </div>
                    <div className="w-full flex flex-col gap-[5px]">
                    <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>To</label>
                    <div className="flex items-center">
                        <FormControl className="w-[60%]">
                        <Select
                            labelId="demo-simple-select-label"
                            size="small"
                            defaultValue={0}
                            className="!rounded-r-[0px]"
                            >
                            {Array.from({ length: 13 }, (_, i) => i).map((i) => (
                                <MenuItem key={i} value={i} className="!text-[12px] sm:!text-[14px] !font-gilroy">
                                {i}
                                </MenuItem>
                            ))}
                        </Select>
                        </FormControl>
                        <FormControl className="w-[40%]">
                        <Select
                            labelId="demo-simple-select-label"
                            size="small"
                            defaultValue={1}
                            className="!rounded-l-[0px] -ml-[1px]"
                            >
                            <MenuItem value={1} className="!text-[12px] sm:!text-[14px] !font-gilroy">AM</MenuItem>
                            <MenuItem value={2} className="!text-[12px] sm:!text-[14px] !font-gilroy">PM</MenuItem>
                        </Select>
                        </FormControl>
                    </div>
                    </div>
                  </div>
                </FormControl>
              </>
            )}  
          </div>
          <div className="w-full flex flex-col gap-[20px]">
            {showDeliverySection  && (
              <>
                <FormControl className="w-full flex flex-col gap-[12px]">
                  <label className='font-normal text-normal leading-[20px] text-[12px]'>Default delivery days for this item</label>
                  <RHFAutocomplete
                    name="delivery_days"
                    placeholder="+ Days"
                    multiple
                    freeSolo
                    options={_days.map((option) => option)}
                    getOptionLabel={(option) => option}
                    renderOption={(props, option) => (
                      <li {...props} key={option}>
                        {option}
                      </li>
                    )}
                    renderTags={(selected, getTagProps) =>
                      selected.map((option, index) => (
                        <Chip
                          {...getTagProps({ index })}
                          key={option}
                          label={option}
                          size="small"
                          color="tags"
                          variant="soft"
                          className="text-heading font-gilroy"
                        />
                      ))
                    }
                  />
                </FormControl>

                <FormControl className="w-full">
                  <div className="w-full flex flex-col sm:flex-row justify-between gap-[14px]">
                    <div className="w-full flex flex-col gap-[5px]">
                    <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Delivery time-frame from</label>
                    <div className="flex items-center">
                        <FormControl className="w-[60%]">
                        <Select
                            labelId="demo-simple-select-label"
                            size="small"
                            defaultValue={0}
                            className="!rounded-r-[0px]"
                            >
                            {Array.from({ length: 13 }, (_, i) => i).map((i) => (
                                <MenuItem key={i} value={i} className="!text-[12px] sm:!text-[14px] !font-gilroy">
                                {i}
                                </MenuItem>
                            ))}
                        </Select>
                        </FormControl>
                        <FormControl className="w-[40%]">
                        <Select
                            labelId="demo-simple-select-label"
                            size="small"
                            defaultValue={1}
                            className="!rounded-l-[0px] -ml-[1px]"
                            >
                            <MenuItem value={1} className="!text-[12px] sm:!text-[14px] !font-gilroy">AM</MenuItem>
                            <MenuItem value={2} className="!text-[12px] sm:!text-[14px] !font-gilroy">PM</MenuItem>
                        </Select>
                        </FormControl>
                    </div>
                    </div>
                    <div className="w-full flex flex-col gap-[5px]">
                    <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>To</label>
                    <div className="flex items-center">
                        <FormControl className="w-[60%]">
                        <Select
                            labelId="demo-simple-select-label"
                            size="small"
                            defaultValue={0}
                            className="!rounded-r-[0px]"
                            >
                            {Array.from({ length: 13 }, (_, i) => i).map((i) => (
                                <MenuItem key={i} value={i} className="!text-[12px] sm:!text-[14px] !font-gilroy">
                                {i}
                                </MenuItem>
                            ))}
                        </Select>
                        </FormControl>
                        <FormControl className="w-[40%]">
                        <Select
                            labelId="demo-simple-select-label"
                            size="small"
                            defaultValue={1}
                            className="!rounded-l-[0px] -ml-[1px]"
                            >
                            <MenuItem value={1} className="!text-[12px] sm:!text-[14px] !font-gilroy">AM</MenuItem>
                            <MenuItem value={2} className="!text-[12px] sm:!text-[14px] !font-gilroy">PM</MenuItem>
                        </Select>
                        </FormControl>
                    </div>
                    </div>
                  </div>
                </FormControl>
              </>
            )}
          </div>
        </div> */}
      </div>
    </>
  );
}

export default CardItem;