import React, { useEffect, useState } from "react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

// @mui
import {
  FormControl, FormControlLabel, Typography, useMediaQuery, useTheme, TextField,
  Modal,
  Dialog,
  DialogContent,
} from '@mui/material';

// Components
import IOSSwitch from "src/components/ios-switch";
import { getNotificationSettings, setNotificationSettings } from "src/api/shopper/settings";
import ButtonLoader from "src/components/button-loader/ButtonLoader";
import { setNotifications } from "src/reducers/chatSlice";
import { toast } from "react-toastify";

const Main = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const getNotifications = async () => {
      setIsLoading(true);
      const data = await getNotificationSettings();
      setNotification(data.notification);
      setIsLoading(false);
    }
    getNotifications();
  }, [])

  const onSubmit = async (payload) => {
    setIsLoading(true);
    try {
      await setNotificationSettings(payload);
      setIsLoading(false);
      toast("Success updating.", {
        type: 'success',
        className: "toast-custom"
      })
    } catch (error) {
      toast("Failed updating.", {
        type: 'error',
        className: "toast-custom"
      })
    }
    setIsLoading(false);
  }

  const handleChange = (event, type) => {
    console.log("notificationSettings", event, event.target.checked, type);
    switch (type) {
      case "ready":
        setNotification({
          ...notification,
          ready: event.target.checked
        })
        onSubmit({
          ...notification,
          ready: event.target.checked
        })
        break;
      case "delivery":
        setNotification({
          ...notification,
          delivery: event.target.checked
        })
        onSubmit({
          ...notification,
          delivery: event.target.checked
        })
        break;
      case "dropOff":
        setNotification({
          ...notification,
          dropOff: event.target.checked
        })
        onSubmit({
          ...notification,
          dropOff: event.target.checked
        })
        break;
      default:
        break;
    }
  }

  return (
    <>
          <div className="w-full flex flex-col gap-[48px]">
            <div className="flex flex-col gap-[48px]">
              <Typography variant="h5" className="capitalize">Notifications preferences</Typography>
              <div className="flex flex-col sm:flex-row gap-[20px] sm:gap-[72px] items-start">
                <div className="flex flex-col items-start gap-[20px]">
                  <FormControlLabel className="ml-0"
                    control={
                      <IOSSwitch
                        sx={{ mr: 2 }}
                        checked={notification?.ready}
                        onChange={(event) => handleChange(event, "ready")}
                      />
                    }
                    label={<Typography variant="subtitle1">Ready to pickup notifications</Typography>}
                    labelPlacement="end"
                  />
                  <FormControlLabel className="ml-0"
                    control={
                      <IOSSwitch 
                        sx={{ mr: 2 }} 
                        checked={notification?.delivery} 
                        onChange={(event) => handleChange(event, "delivery")}
                      />
                    }
                    label={<Typography variant="subtitle1">Delivery on the way notifications</Typography>}
                    labelPlacement="end"
                  />
                  <FormControlLabel className="ml-0"
                    control={
                      <IOSSwitch 
                        sx={{ mr: 2 }} 
                        checked={notification?.dropOff} 
                        onChange={(event) => handleChange(event, "dropOff")}
                      />
                    }
                    label={<Typography variant="subtitle1">Drop-off notifications</Typography>}
                    labelPlacement="end"
                  />
                </div>
              </div>
            </div>

            {/* <Dialog
              open={isLoading}
              sx={{
                '& .MuiPaper-root': {
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                  overflowY: 'unset'
                },
              }}
            >
                <ButtonLoader />
            </Dialog> */}

            {/* <div className="flex flex-col gap-[24px]">
              <Typography variant="h5" className="capitalize">Notification time-frame</Typography>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-[14px]">
                <FormControl variant="standard" className='w-full'>
                  <label className='font-normal text-normal leading-5 text-sm pb-1'>Notification time-frame from</label>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                      renderInput={(params) => (
                        <TextField
                        {...params}
                        placeholder="08 : 00 AM"
                        />
                      )}
                    />
                  </LocalizationProvider>
                </FormControl>
                <FormControl variant="standard" className='w-full'>
                  <label className='font-normal text-normal leading-5 text-sm pb-1'>To</label>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                      renderInput={(params) => (
                        <TextField
                        {...params}
                        placeholder="08 : 00 AM"
                        />
                      )}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
            </div> */}
          </div>
    </>
  );
};

export default Main;