import React from 'react';
import { Box, Tooltip, Typography } from '@mui/material';

// Icons
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import { icScooter } from 'src/assets';
import moment from "moment";

const CustomDateCell = (
  {
    children, value, statusText, serviceTime, onDoubleClick, serviceInfo, isDisabled, isPassed, hasEvent, locationInfo, ...props

  }
) => {
  const handleDoubleClick = () => {
    onDoubleClick();
  };

  // Customize the cell based on the date value or other props
  const isToday = value.toDateString() === new Date().toDateString(); // Check if the date is today


  const calculateStatus = (fromTime, endTime) => {
    const currentDate = moment();
    const targetDate = moment(value, "YYYY-MM-DD");
    if (currentDate.isBefore(targetDate, "day")) return "opened";
    if (currentDate.isAfter(targetDate, "day")) return "closed";

    const endMoment = moment(endTime, "h:mm A");
    const diffInMinutes = endMoment.diff(currentDate, "minutes");
    if (diffInMinutes > 0 && diffInMinutes <= 60) return "close-soon";
    if (diffInMinutes < 0) return "closed";
    return "opened";
  }


  return (
    <React.Fragment>
      <Tooltip title={<div className='font-gilroy'>Date: {value.toDateString()}</div>}>
        <Box className={`date-cell-box flex flex-col justify-between pb-1 ${isDisabled || isPassed ? "out-ranged-calendar" : ""} ${!hasEvent && statusText !== "" ? "blocked-calendar" : ""}`}
             onDoubleClick={handleDoubleClick}
             {...props}
             sx={{
               backgroundColor: 'transparent',
               borderRight: '1px solid #ddd',
               borderBottom: isToday ? '3px solid #F14445' : '1px solid #ddd',
               height: '100%',
               width: '100%',
               minHeight: 155.3,
               minWidth: 118.6,
               zIndex: '10',
               '&:hover': {backgroundColor: 'transparent',},
               display: 'inline',
               padding: '25px 4px',
             }}
        >
          <div className='flex flex-col'>
            {children}
            {/*{!hasEvent && (
              <Typography variant={`subtitle${hasEvent ? "1" : "3"}`} sx={{marginTop: 'auto'}}>
                {statusText || "No Orders Scheduled"}
              </Typography>
            )}*/}
            {!hasEvent && (statusText ?
              (<Typography variant="subtitle3" sx={{marginTop: 'auto'}}>{statusText}</Typography>) :
              (<Typography variant="subtitle2" sx={{marginTop: 'auto'}}>No Orders Scheduled</Typography>))
            }
          </div>

          <div className='gap-[5px] justify-end items-center mt-[3px]'>
            {!isDisabled && serviceTime.isPickup && locationInfo.pickup.isUse && (
              <div className="service-time justify-start flex items-center gap-[5px]">
                <PlaceOutlinedIcon className='text-[#a3a3a3] text-[14px]' style={{marginLeft: 2}}/>
                <Typography variant='label' className='text-[9px] justify-end flex'>
                  {`${serviceTime.pickup.from} - ${serviceTime.pickup.to}`}
                </Typography>
                <span className={`status-dot ordering-${calculateStatus(serviceTime.pickup.from, serviceTime.pickup.to)}`}></span>
              </div>
            )}
            {!isDisabled && serviceTime.isDelivery && locationInfo.delivery.isUse && (
              <div className="service-time justify-start flex items-center gap-[5px]">
                <img src={icScooter} className='w-[16px]'/>
                <Typography variant='label' className='text-[9px]'>
                  {`${serviceTime.delivery.from} - ${serviceTime.delivery.to}`}
                </Typography>
                <span className={`status-dot ordering-${calculateStatus(serviceTime.delivery.from, serviceTime.delivery.to)}`}></span>
              </div>
            )}
          </div>
        </Box>
      </Tooltip>

    </React.Fragment>
  );
};

export default CustomDateCell;
