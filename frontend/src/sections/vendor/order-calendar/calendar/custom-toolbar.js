import React from "react";

// @mui
import {Typography, IconButton, Tabs, Tab} from '@mui/material';

import { tabProps } from "src/utils/tab-helpers";
// Icons
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CircleIcon from '@mui/icons-material/Circle';
import SortIcon from '@mui/icons-material/Sort';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';

const CustomToolbar = (toolbar) => {
  const goToBack = () => {
    toolbar.onNavigate('PREV');
  };

  const goToNext = () => {
    toolbar.onNavigate('NEXT');
  };

  const goToToday = () => {
    toolbar.onNavigate('TODAY');
  };

  // Tabs
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="">
      <div className='flex flex-col sm:flex-row py-[16px] justify-between'>
        <div className='flex gap-[16px] items-center justify-between sm:justify-start'>
          <Typography variant="h5" className="capitalize">Orders</Typography>
          <div className='flex justify-center items-center'>
            <IconButton className='text-center' onClick={goToBack}>
              <ArrowBackIosIcon className="text-[14px]" />
            </IconButton>
            <Typography variant='subtitle1' onClick={goToToday} className="cursor-pointer mx-1">{toolbar.label}</Typography>
            <IconButton className='text-center' onClick={goToNext}>
              <ArrowForwardIosIcon className="text-[14px]" />
            </IconButton>
          </div>
        </div>

        <div className='flex flex-col sm:flex-row sm:gap-[24px] sm:items-center mt-2 sm:mt-0'>
          <div className='flex items-center gap-[5px]'>
            <CircleIcon className='text-[7px] text-success' />
            <Typography variant='label'>ordering opened</Typography>
          </div>
          <div className='flex items-center gap-[5px]'>
            <CircleIcon className='text-[7px] text-warning' />
            <Typography variant='label'>ordering is about to close</Typography>
          </div>
          <div className='flex items-center gap-[5px]'>
            <CircleIcon className='text-[7px] text-danger' />
            <Typography variant='label'>ordering closed</Typography>
          </div>
        </div>

        <div className="flex justify-end">
          <Tabs value={value} onChange={handleChange} aria-label="Location details" className="flex items-center">
            <Tab label={<SortIcon className="text-[18px] !px-0" />} {...tabProps(0)} className="min-w-[20px] min-h-[25px]" sx={{width: '20px', height: '25px'}} />
            <Tab label={<CalendarTodayOutlinedIcon className="text-[18px]" />} {...tabProps(1)} className="min-w-[20px] min-h-[25px]" sx={{width: '20px', height: '25px'}} />
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CustomToolbar;
