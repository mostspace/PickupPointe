import {Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  FormControl, FormControlLabel, TextField, Typography
} from "@mui/material";
import { Controller, FormProvider, useForm } from "react-hook-form";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import DefaultButton from "src/components/button/default-button.js";
import { TextConstants } from "src/constants/textConstants.js";
import React, {useEffect, useState} from "react";
import moment from "moment";

dayjs.extend(customParseFormat);

const ServiceAvailabilityModal = ({ isOpen, onClose, onSave, date, data, isWeek, locationInfo }) => {
  const form = useForm();
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = form;

  const [timeFrame, setTimeFrame] = useState({
    pickup: true,
    delivery: true,
    pickupFrom: null,
    pickupTo: null,
    deliveryFrom: null,
    deliveryTo: null,
  });

  useEffect(() => {
    let currentDate = dayjs("YYYY-MM-DD");
    if (data) {
      reset({
        pickupAvailable: locationInfo?.pickup?.isUse && (data ? data?.pickupTime?.isAvailable || false : true),
        deliveryAvailable: locationInfo?.delivery?.isUse && (data ? data?.deliveryTime?.isAvailable || false : true),
        pickupFrom: dayjs(data?.pickupTime?.from, "HH:mm") || null,
        pickupTo: dayjs(data?.pickupTime?.to, "HH:mm") || null,
        deliveryFrom: dayjs(data?.deliveryTime?.from, "HH:mm") || null,
        deliveryTo: dayjs(data?.deliveryTime?.to, "HH:mm") || null,
      });
      setTimeFrame({
        pickup: locationInfo?.pickup?.isUse && (data ? data?.pickupTime?.isAvailable || false : true),
        delivery: locationInfo?.delivery?.isUse && (data ? data?.deliveryTime?.isAvailable || false : true),
        pickupFrom: dayjs(data?.pickupTime?.from, "HH:mm") || null,
        pickupTo: dayjs(data?.pickupTime?.to, "HH:mm") || null,
        deliveryFrom: dayjs(data?.deliveryTime?.from, "HH:mm") || null,
        deliveryTo: dayjs(data?.deliveryTime?.to, "HH:mm") || null,
      });
    } else {
      let currentWeekday
      if (isWeek) {
        let day = date.substr(0, 3);
        currentWeekday = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
      } else {
        currentWeekday = dayjs(date, "YYYY-MM-DD").format("ddd");
      }
      const isPickDay = !!locationInfo?.pickup?.days.find(day => currentWeekday === day);
      const isDeliveryDay = !!locationInfo?.delivery?.days.find(day => currentWeekday === day);
      reset({
        pickupAvailable: isPickDay && locationInfo?.pickup?.isUse && isPickDay,
        deliveryAvailable: locationInfo?.delivery?.isUse && isDeliveryDay,
        pickupFrom: dayjs(locationInfo?.pickup?.from) || null,
        pickupTo: dayjs(locationInfo?.pickup?.to) || null,
        deliveryFrom: dayjs(locationInfo?.delivery?.from) || null,
        deliveryTo: dayjs(locationInfo?.delivery?.to) || null,
      });
      setTimeFrame({
        pickup: locationInfo?.pickup?.isUse && isPickDay,
        delivery: locationInfo?.delivery?.isUse && isDeliveryDay,
        pickupFrom: dayjs(locationInfo?.pickup?.from) || null,
        pickupTo: dayjs(locationInfo?.pickup?.to) || null,
        deliveryFrom: dayjs(locationInfo?.delivery?.from) || null,
        deliveryTo: dayjs(locationInfo?.delivery?.to) || null,
      });
    }
  }, [data, reset, locationInfo, date]);

  const handleTimeFrame = (event) => {
    const { value, checked } = event.target;
    setTimeFrame((prevState) => ({
      ...prevState,
      [value]: checked,
    }));
  };

  const onSubmit = async (data) => {
    const isValid = await form.trigger();
    if (isValid) {
      onSave(data);
    }
  };

  const onBlockOutClick = () => {
    setTimeFrame(prevState => ({
      ...prevState,
      pickup: false,
      delivery: false,
    }));
    reset({pickupAvailable: false, deliveryAvailable: false})
  }

  return (
    <div>
      <Dialog
        className="w-full !font-gilroy"
        open={isOpen}
        onClose={onClose}
        scroll="paper"
        sx={{
          width: "100% !important",
        }}
      >
        <DialogTitle className="pt-[32px] sm:!pt-[64px]">
          <div className="text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center font-gilroy">
            {isWeek ?
              `Pickup eligibility for every ${date}` :
              `Pickup eligibility for ${dayjs(date).format("ddd D, MMM")}`}
          </div>
        </DialogTitle>
        <DialogContent>
          <FormProvider {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-[14px] font-gilroy sm:px-[60px] py-[16px]"
            >
              <DialogContentText tabIndex={-1}>
                <div className="w-full">
                  <div className="flex flex-col gap-[14px]">
                    <FormControl className="mt-1">
                      <Typography variant="h5" className="capitalize">
                        Pickup Time Frame
                      </Typography>
                      <div className="w-full">
                        <Controller
                          name="pickupAvailable"
                          control={control}
                          defaultValue={true}
                          render={({field}) => (
                            <FormControlLabel
                              control={
                                <Checkbox
                                  disabled={!locationInfo?.pickup?.isUse}
                                  {...field}
                                  size="small"
                                  checked={timeFrame.pickup}
                                  value="pickup"
                                  onChange={(e) => {
                                    handleTimeFrame(e);
                                    field.onChange(e.target.checked);
                                  }}
                                />
                              }
                              label={<span className="text-[14px]">Pickup Available</span>}
                            />
                          )}
                        />
                      </div>
                    </FormControl>
                  </div>
                  {locationInfo?.pickup?.isUse && timeFrame.pickup && (
                    <div className="w-full flex justify-between gap-[14px]">
                      <div className="w-full flex flex-col gap-[5px]">
                        <Typography variant="label">From</Typography>
                        <div className="flex items-center">
                          <FormControl className="w-full" error={Boolean(errors.pickupFrom)}>
                            <Controller
                              name="pickupFrom"
                              control={control}
                              defaultValue={timeFrame.pickupFrom || dayjs(locationInfo0?.pickup?.from)}
                              rules={{required: "Time is required"}}
                              render={({field}) => (
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                  <TimePicker
                                    {...field}
                                    onChange={(newValue) => {
                                      setTimeFrame((prev) => ({...prev, pickupFrom: newValue}));
                                      field.onChange(newValue);
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        placeholder="08:00 AM"
                                        error={Boolean(errors.pickupFrom)}
                                        helperText={errors.pickupFrom?.message}/>
                                    )}
                                  />
                                </LocalizationProvider>
                              )}
                            />
                          </FormControl>
                        </div>
                        {errors.pickupFrom && (
                          <Typography variant="caption" color="error">{errors.pickupFrom.message}</Typography>)}
                      </div>

                      <div className="w-full flex flex-col gap-[5px]">
                        <Typography variant="label">To</Typography>
                        <div className="flex items-center">
                          <FormControl className="w-full" error={Boolean(errors.pickupTo)}>
                            <Controller
                              name="pickupTo"
                              control={control}
                              defaultValue={timeFrame.pickupTo || dayjs(locationInfo0?.pickup?.to)}
                              rules={{required: "Time is required"}}
                              render={({field}) => (
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                  <TimePicker
                                    {...field}
                                    onChange={(newValue) => {
                                      setTimeFrame((prev) => ({...prev, pickupTo: newValue}));
                                      field.onChange(newValue);
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        placeholder="08:00 AM"
                                        error={Boolean(errors.pickupTo)}
                                        helperText={errors.pickupTo?.message}/>
                                    )}
                                  />
                                </LocalizationProvider>
                              )}
                            />
                          </FormControl>
                        </div>
                        {errors.pickupTo && (
                          <Typography variant="caption" color="error">{errors.pickupTo.message}</Typography>)}
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col gap-[14px] mt-5">
                    <FormControl className="mt-1">
                      <Typography variant="h5" className="capitalize">
                        Delivery Time Frame
                      </Typography>
                      <div className="w-full">
                        <Controller
                          name="deliveryAvailable"
                          control={control}
                          defaultValue={true}
                          render={({field}) => (
                            <FormControlLabel
                              control={
                                <Checkbox
                                  {...field}
                                  disabled={!locationInfo?.delivery?.isUse}
                                  size="small"
                                  checked={timeFrame.delivery}
                                  value="delivery"
                                  onChange={(e) => {
                                    handleTimeFrame(e);
                                    field.onChange(e.target.checked);
                                  }}
                                />
                              }
                              label={<span className="text-[14px]">Delivery Available</span>}
                            />
                          )}
                        />
                      </div>
                    </FormControl>
                  </div>
                  {locationInfo?.delivery?.isUse && timeFrame.delivery && (
                    <div className="w-full flex justify-between gap-[14px]">
                      <div className="w-full flex flex-col gap-[5px]">
                        <Typography variant="label">From</Typography>
                        <div className="flex items-center">
                          <FormControl className="w-full" error={Boolean(errors.deliveryFrom)}>
                            <Controller
                              name="deliveryFrom"
                              control={control}
                              defaultValue={timeFrame.deliveryFrom || dayjs(locationInfo0?.delivery?.from)}
                              rules={{required: "Time is required"}}
                              render={({field}) => (
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                  <TimePicker
                                    {...field}
                                    onChange={(newValue) => {
                                      setTimeFrame((prev) => ({...prev, deliveryFrom: newValue}));
                                      field.onChange(newValue);
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        placeholder="08:00 AM"
                                        error={Boolean(errors.deliveryFrom)}
                                        helperText={errors.deliveryFrom?.message}/>
                                    )}
                                  />
                                </LocalizationProvider>
                              )}
                            />
                          </FormControl>
                        </div>
                        {errors.deliveryFrom && (
                          <Typography variant="caption" color="error">{errors.deliveryFrom.message}</Typography>)}
                      </div>
                      <div className="w-full flex flex-col gap-[5px]">
                        <Typography variant="label">From</Typography>
                        <div className="flex items-center">
                          <FormControl className="w-full" error={Boolean(errors.deliveryTo)}>
                            <Controller
                              name="deliveryTo"
                              control={control}
                              defaultValue={timeFrame.deliveryTo || dayjs(locationInfo0?.delivery?.to)}
                              rules={{required: "Time is required"}}
                              render={({field}) => (
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                  <TimePicker
                                    {...field}
                                    onChange={(newValue) => {
                                      setTimeFrame((prev) => ({...prev, deliveryTo: newValue}));
                                      field.onChange(newValue);
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        placeholder="08:00 AM"
                                        error={Boolean(errors.deliveryTo)}
                                        helperText={errors.deliveryTo?.message}/>
                                    )}
                                  />
                                </LocalizationProvider>
                              )}
                            />
                          </FormControl>
                        </div>
                        {errors.deliveryTo && (
                          <Typography variant="caption" color="error">{errors.deliveryTo.message}</Typography>)}
                      </div>
                    </div>
                  )}
                </div>
                <div className="w-full flex justify-between mt-5">
                  <Button
                    variant="outlined"
                    className="w-full"
                    value="Save"
                    onClick={onBlockOutClick}
                    disabled={!timeFrame.pickup && !timeFrame.delivery}
                    sx={{
                      width: 'auto',
                      height: '44px',
                      fontFamily: 'Gilroy',
                      fontSize: '14px',
                      padding: '8px 40px',
                    }}>
                    Block out day
                </Button>
                </div>
              </DialogContentText>
            </form>
          </FormProvider>

        </DialogContent>
        <DialogActions className="!px-[22px] !pb-[32px] sm:!pb-[64px] sm:!px-[80px] !gap-[14px]">
          <DefaultButton
            value={TextConstants.Cancel}
            className="w-full bg-[#F5F5F5] text-heading hover:bg-[#fef0f0]"
            onClick={onClose}
          />
          <DefaultButton
            className="w-full"
            value="Save"
            onClick={handleSubmit(onSubmit)}
          />
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ServiceAvailabilityModal;
