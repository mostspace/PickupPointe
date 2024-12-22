import React, { useState, useRef } from "react";
import { Box, Button, } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { Tabs, Tab, } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AddIcon from '@mui/icons-material/Add';
// Components
import TabPanel from "src/components/tab";
import OrderSection from "./order-section";
import LightTooltip from "src/components/LightTooltip";
import { tabProps } from "src/utils/tab-helpers";

// --------------------------------------------------------------------------------------------------

const Main = () => {

  // Redirect previous page
  const navigate = useNavigate();

  const handleBack = () => {
    // Navigate one step back in history using the current location
    navigate(-1); // Navigate to the previous route
  };

  // Choose Location Select
  const [location, setLocation] = React.useState('1');

  const handleLocationChange = (event) => {
      setLocation(event.target.value);
  };
  
  // Tabs
  const [value, setValue] = React.useState(1);

  const handleChange = (event, newValue) => {
      setValue(newValue);
  };

  // Radio Tab
  const [radioValue, setRadioValue] = useState('team');

  const handleRadioTabChange = (event) => {
      setRadioValue(event.target.value);
  };

  // ====================== Handle Order Section ===========================

  const handleRemoveOrderSection = (numberToRemove) => {
    // Filter the orderSectionNumbers array to remove the specified number
    const updatedOrderSectionNumbers = orderSectionNumbers.filter((number) => number !== numberToRemove);

    // Update the orderSectionNumbers state
    setOrderSectionNumbers(updatedOrderSectionNumbers);

    // Filter the appendOrderComponents array to remove the corresponding section
    setAppendOrderComponents((prevComponents) => (
      prevComponents.filter((component) => {
        const componentNumber = parseInt(component.props.number, 10);
        return componentNumber !== numberToRemove;
      })
    ));
  };

  const [appendOrderComponents, setAppendOrderComponents] = useState([
    // Initial section
    <OrderSection key={0} number={1} removeSection={handleRemoveOrderSection} /> 
  ]);
  const [orderSectionNumbers, setOrderSectionNumbers] = useState([1]); // New array to store order numbers
  const [orderSectionNum, setOrderSectionNum] = React.useState(2);
  const orderSectionTargetRef = useRef(null);
      
  const handleAddOrderSection = () => {
    setOrderSectionNum(prevOrderSectionNum => prevOrderSectionNum + 1); 
    // Create a new component to append
    const newOrderComponent = <OrderSection key={orderSectionNum} number={orderSectionNum} removeSection={handleRemoveOrderSection} />; 
    // Update the state by adding the new component
    setAppendOrderComponents([...appendOrderComponents, newOrderComponent]);  
    // Update the orderSectionNumbers array
    setOrderSectionNumbers([...orderSectionNumbers, orderSectionNum]);
  };

// -------------------------------------------------------------------------------------------------------------

  return (
    <>
      <div className="flex flex-col gap-[32px] sm:gap-[48px]">
        <h2 className="text-heading text-[24px] sm:text-[32px] font-normal font-medium">Drop-Off Details</h2>

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
              <MenuItem value={1} className="!text-[12px] sm:!text-[14px]">Store #32322 - 7384 Hayward Way #034 Laguna, CA 93453</MenuItem>
              <MenuItem value={2} className="!text-[12px] sm:!text-[14px]">Store #32322 - 7384 Hayward Way #034 Laguna, CA 93453</MenuItem>
              <MenuItem value={3} className="!text-[12px] sm:!text-[14px]">Store #32322 - 7384 Hayward Way #034 Laguna, CA 93453</MenuItem>
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
                      <Select
                      labelId="demo-simple-select-label"
                      size="small"
                      defaultValue={0}
                      >
                      <MenuItem value={0} disabled classname="!hidden !text-[12px] sm:!text-[14px]" hidden>Select order</MenuItem>
                      <MenuItem value={1} className="!text-[12px] sm:!text-[14px]">Wednesday June 2, 2024 - 1 order, 1 item</MenuItem>
                      <MenuItem value={2} className="!text-[12px] sm:!text-[14px]">Wednesday June 3, 2024 - 1 order, 1 item</MenuItem>
                      <MenuItem value={3} className="!text-[12px] sm:!text-[14px]">Wednesday June 4, 2024 - 1 order, 1 item</MenuItem>
                      </Select>
                  </FormControl>
                </div>

                <div className="flex flex-col gap-[48px]" ref={orderSectionTargetRef} >
                  
                  {appendOrderComponents.map((component, index) => (
                    <React.Fragment key={index}>{component}</React.Fragment>
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
                      <AddIcon className="mr-2" sx={{color: '#181818', fontSize: '18px'}}/> 
                      Add new order to this batch
                    </Button>
                  </div>  
                </div>
              </div>
            </TabPanel>

            <TabPanel value={value} index={1}>
              <div className="flex flex-col gap-[48px]">
                <div className="sm:flex justify-between">
                  <h6 className="text-heading text-[16px] sm:text-[18px] font-medium capitalize mb-2 sm:mb-0">Create a custom Drop-off 
                    <LightTooltip title="When conducting drop-offs, batch orders must be separated from loose items. Loose items will be labeled accordingly and used to fulfill new orders. Customized orders are reserved for specific customers and set aside accordingly." >
                      <InfoOutlinedIcon sx={{fontSize: 20, marginLeft: '5px'}} />
                    </LightTooltip> 
                  </h6>

                  <FormControl className="w-full sm:w-[464px]">
                    <Select
                      labelId="demo-simple-select-label"
                      size="small"
                      defaultValue={1}
                    >
                      <MenuItem value={1} className="!text-[12px] sm:!text-[14px]">Drop-off orders</MenuItem>
                      <MenuItem value={2} className="!text-[12px] sm:!text-[14px]">Drop-off loose items</MenuItem>
                    </Select>
                  </FormControl>
                </div>

                <div id="orderSection" className="flex flex-col gap-[48px]" ref={orderSectionTargetRef} >
                  
                  {appendOrderComponents.map((component, index) => (
                    <React.Fragment key={index}>{component}</React.Fragment>
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
                      <AddIcon className="mr-2" sx={{color: '#181818', fontSize: '18px'}}/> 
                      Add new order to this batch
                    </Button>
                  </div>  

                </div>

              </div>
            </TabPanel>
          </div>
        </div>

        <div className="flex justify-end gap-[14px]">
          <Button onClick={handleBack}
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
          >
            Back
          </Button>
          <Button className="!py-2 !leading-[17px]"
            sx={{
                padding: {
                sm: '8px'
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
                }
            }}
          > 
            Batch orders and prepare for drop-off
          </Button>
        </div>
      </div>
    </>
  )
}

export default Main;