import React, { useState, useRef, useEffect } from "react";
import { Box, Button, FormControl, Select, MenuItem, Tabs, Tab } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AddIcon from '@mui/icons-material/Add';
// Components
import TabPanel from "src/components/tab";
import OrderSection from "./order-section";
import LightTooltip from "src/components/LightTooltip";
import { tabProps } from "src/utils/tab-helpers";

const Main = () => {
  // Redirect previous page
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Navigate to the previous route
  };

  // Choose Location Select
  const [location, setLocation] = useState('1');

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  // Tabs
  const [value, setValue] = useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Radio Tab
  const [radioValue, setRadioValue] = useState('team');

  const handleRadioTabChange = (event) => {
    setRadioValue(event.target.value);
  };

  // Create a custom drop-off Select
  const [dropoffType, setDropoffType] = useState('dropoff_orders');

  const handleDropoffSelect = (event) => {
    const newDropoffType = event.target.value;
    setDropoffType(newDropoffType);
    // Update dropoff type for each order section
    setOrderSections((prevSections) =>
      prevSections.map((section) => ({
        ...section,
        dropoff: newDropoffType,
      }))
    );
  };

  const [orderSections, setOrderSections] = useState([
    { number: 1, dropoff: dropoffType }
  ]);
  const [orderSectionNum, setOrderSectionNum] = useState(2);
  const orderSectionTargetRef = useRef(null);

  const handleAddOrderSection = () => {
    setOrderSections((prevSections) => [
      ...prevSections,
      { number: orderSectionNum, dropoff: dropoffType }
    ]);
    setOrderSectionNum((prevNum) => prevNum + 1);
  };

  const handleRemoveOrderSection = (numberToRemove) => {
    setOrderSections((prevSections) => prevSections.filter((section) => section.number !== numberToRemove));
  };

  return (
    <>
      <div className="flex flex-col gap-[32px] sm:gap-[48px]">
        <h2 className="text-heading text-[24px] sm:text-[32px] font-normal font-medium">Add New Drop-Off</h2>
        <div className="sm:flex justify-between">
          <h6 className="text-heading text-[16px] sm:text-[18px] font-medium capitalize mb-2 sm:mb-0">Choose active location</h6>
          <FormControl className="w-full sm:w-[464px]">
            <Select
              labelId="demo-simple-select-label"
              size="small"
              value={location}
              defaultValue={location}
              onChange={handleLocationChange}
            >
              <MenuItem value={1} className="!text-[12px] sm:!text-[14px] font-gilroy">Store #32322 - 7384 Hayward Way #034 Laguna, CA 93453</MenuItem>
              <MenuItem value={2} className="!text-[12px] sm:!text-[14px] font-gilroy">Store #32322 - 7384 Hayward Way #034 Laguna, CA 93453</MenuItem>
              <MenuItem value={3} className="!text-[12px] sm:!text-[14px] font-gilroy">Store #32322 - 7384 Hayward Way #034 Laguna, CA 93453</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div id="tabs" className="flex flex-col gap-[48px]">
          <div id="tab-label" className="sm:flex justify-between items-center">
            <h6 className="text-heading text-[16px] sm:text-[18px] font-medium capitalize mb-2 sm:mb-0">Input preference</h6>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange} aria-label="Input Preference">
                <Tab label="Import from schedule" {...tabProps(0)} className="!font-gilroy !text-[14px] !text-heading !normal-case" />
                <Tab label="Manual entry" {...tabProps(1)} className="!font-gilroy !text-[14px] !text-heading !normal-case" />
              </Tabs>
            </Box>
          </div>

          <div id="tab-panel">
            <TabPanel value={value} index={0}>
              <div className="flex flex-col gap-[48px]">
                <div className="sm:flex justify-between">
                  <h6 className="text-heading text-[16px] sm:text-[18px] font-medium capitalize mb-2 sm:mb-0">Select an Order/Batch to Drop-off</h6>
                  <FormControl className="w-full  sm:w-[464px]">
                    <Select labelId="demo-simple-select-label" size="small" defaultValue={0}>
                      <MenuItem value={0} disabled classname="!hidden !text-[12px] sm:!text-[14px]" hidden>Select order</MenuItem>
                      <MenuItem value={1} className="!text-[12px] sm:!text-[14px]">Wednesday June 2, 2024 - 1 order, 1 item</MenuItem>
                      <MenuItem value={2} className="!text-[12px] sm:!text-[14px]">Wednesday June 3, 2024 - 1 order, 1 item</MenuItem>
                      <MenuItem value={3} className="!text-[12px] sm:!text-[14px]">Wednesday June 4, 2024 - 1 order, 1 item</MenuItem>
                    </Select>
                  </FormControl>
                </div>

                <div className="flex flex-col gap-[48px]" ref={orderSectionTargetRef}>
                  {orderSections.map((section) => (
                    <OrderSection
                      key={section.number}
                      number={section.number}
                      removeSection={handleRemoveOrderSection}
                      dropoff={section.dropoff}
                    />
                  ))}

                  <div className="flex">
                    <Button
                      sx={{
                        width: '250px',
                        height: '44px',
                        fontFamily: 'Gilroy',
                        fontSize: '14px',
                        color: '#181818',
                        borderRadius: '8px',
                        backgroundColor: '#F5F5F5',
                        textTransform: 'unset',
                      }}
                      onClick={handleAddOrderSection}
                    >
                      <AddIcon className="mr-2" sx={{ color: '#181818', fontSize: '18px' }} />
                      {dropoffType === 'dropoff_loose_items' ? 'Add new item to this batch' : 'Add new order to this batch'}
                    </Button>
                  </div>
                </div>
              </div>
            </TabPanel>

            <TabPanel value={value} index={1}>
              <div className="flex flex-col gap-[48px]">
                <div className="sm:flex justify-between">
                  <h6 className="text-heading text-[16px] sm:text-[18px] font-medium capitalize mb-2 sm:mb-0">
                    Create a custom Drop-off
                    <LightTooltip title="When conducting drop-offs, batch orders must be separated from loose items. Loose items will be labeled accordingly and used to fulfill new orders. Customized orders are reserved for specific customers and set aside accordingly.">
                      <InfoOutlinedIcon sx={{ fontSize: 20, marginLeft: '5px' }} />
                    </LightTooltip>
                  </h6>

                  <FormControl className="w-full sm:w-[464px]">
                    <Select size="small" value={dropoffType} onChange={handleDropoffSelect}>
                      <MenuItem value="dropoff_orders" className="!text-[12px] sm:!text-[14px] font-gilroy">Drop-off Orders</MenuItem>
                      <MenuItem value="dropoff_loose_items" className="!text-[12px] sm:!text-[14px] font-gilroy">Drop-off Loose Items</MenuItem>
                    </Select>
                  </FormControl>
                </div>

                <div className="flex flex-col gap-[48px]" ref={orderSectionTargetRef}>
                  {orderSections.map((section) => (
                    <OrderSection
                      key={section.number}
                      number={section.number}
                      removeSection={handleRemoveOrderSection}
                      dropoff={section.dropoff}
                    />
                  ))}

                  <div className="flex">
                    <Button
                      sx={{
                        width: '250px',
                        height: '44px',
                        fontFamily: 'Gilroy',
                        fontSize: '14px',
                        color: '#181818',
                        borderRadius: '8px',
                        backgroundColor: '#F5F5F5',
                        textTransform: 'unset',
                      }}
                      onClick={handleAddOrderSection}
                    >
                      <AddIcon className="mr-2" sx={{ color: '#181818', fontSize: '18px' }} />
                      {dropoffType === 'dropoff_loose_items' ? 'Add new item to this batch' : 'Add new order to this batch'}
                    </Button>
                  </div>
                </div>
              </div>
            </TabPanel>
          </div>
        </div>
        <div className="flex justify-end gap-[14px]">
          <Button
            sx={{
              padding: '8px 40px',
              height: '44px',
              fontFamily: 'Gilroy',
              fontSize: '14px',
              color: '#181818',
              borderRadius: '8px',
              backgroundColor: '#F5F5F5',
              textTransform: 'unset',
            }}
            onClick={handleBack}
          >
            Back
          </Button>
          <Button
            className="!py-2 !leading-[17px]"
            sx={{
              padding: {
                sm: '8px',
              },
              height: '44px',
              fontFamily: 'Gilroy',
              fontSize: '14px',
              color: '#ffffff',
              borderRadius: '8px',
              backgroundColor: '#F14445',
              textTransform: 'unset',
              '&:hover': {
                backgroundColor: '#E13031',
              },
            }}
          >
            {dropoffType === 'dropoff_loose_items' ? 'Batch items and prepare for drop-off' : 'Batch orders and prepare for drop-off'}
          </Button>
        </div>
      </div>
    </>
  );
};

export default Main;