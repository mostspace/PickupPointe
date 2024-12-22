import React from 'react';

// @mui
import {Typography, IconButton} from '@mui/material';

// Icons
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
// import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
// import {icScooter} from "src/assets/index.js";


const CustomDayHeader = ({ label, isChecked : hasEvents, onSettingClick }) => {
  const dayNameMap = {
    Sun: 'SUN',
    Mon: 'MON',
    Tue: 'TUE',
    Wed: 'WED',
    Thu: 'THU',
    Fri: 'FRI',
    Sat: 'SAT',
  };

  const fullDayName = dayNameMap[label] || label;

  return (
    <>
      <div className="custom-day-header flex flex-col gap-[8px] justify-start py-[17px] px-[10px]" style={{minWidth: 118.6}}>
        <div className={`flex justify-between items-center gap-[8px] ${hasEvents ? 'text-heading': 'text-[#a3a3a3]'}`}>
          <Typography className="font-gilroy text-[14px] uppercase font-normal text-start">{fullDayName}</Typography>
          <IconButton onClick={() => onSettingClick(dayNameMap[label])}>
            <SettingsOutlinedIcon className='text-[16px] text-heading' />
          </IconButton>
        </div>
        {/*<div className='flex flex-col gap-[4px]'>
          <div className='flex gap-[5px] items-center mt-[3px]'>
            <img src={icScooter} className='w-[16px]'/>
            <PlaceOutlinedIcon className='text-[#a3a3a3] text-[14px]' />
          </div>
          <div className='flex'>
            <Typography variant='label' className='text-[10px]'>9:00 AM - 18:00 PM</Typography>
          </div>
        </div>*/}
      </div>
    </>
  );
};

export default CustomDayHeader;
