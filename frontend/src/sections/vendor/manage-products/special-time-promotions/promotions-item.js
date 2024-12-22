import React, {useState, useEffect} from "react";
import {useFormContext} from "react-hook-form";
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {TimePicker} from '@mui/x-date-pickers/TimePicker';
import {DateRangeCalendar} from '@mui/x-date-pickers-pro/DateRangeCalendar';
import dayjs from "dayjs";

// @mui
import {
    FormControl, TextField, FormControlLabel, Typography, Grid, IconButton, Button, RadioGroup, Radio, Collapse,
} from '@mui/material';

// Asset
import {icTrashBin} from "src/assets";
import {_days} from "src/_mock/assets";

// Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {discountType, frequencyType, scheduleType} from "src/constants";

// -------------------------------------------------------------------------------------------------

export default function PromotionsItem(props) {
    const {number, data} = props;

    const {watch, setValue} = useFormContext(); // Access watch and setValue from context

    const handleRemoveClick = () => {
        let currentData = watch("timePromotions");
        currentData.splice(number, 1);
        setValue(`timePromotions`, currentData);
        if (currentData.length === 0) {
            setValue("isUseTimePromotion", false);
        }
    };

    const handleTimePromotionFrom = (value) => {
        const date = new Date(value);

        setValue(`timePromotions[${number}].from`, {
            hour: date.getHours(),
            minute: date.getMinutes(),
        });
    }

    const handleTimePromotionTo = (value) => {
        const date = new Date(value);

        setValue(`timePromotions[${number}].to`, {
            hour: date.getHours(),
            minute: date.getMinutes(),
        });
    }

    // Toggle promotions item
    const [isPromotionsOpen, setIsPromotionsOpen] = useState(true);
    const togglePromotionsItem = () => {
        setIsPromotionsOpen((prevState) => !prevState);
    }

    // Condition of the schedule's time
    const [scheduleDateRange, setScheduleDateRange] = useState([
      dayjs(), dayjs()
    ]);
    const [selectedDay, setSelectedDay] = useState([]);

    const handleScheduleTime = (event) => {
        setValue(`timePromotions[${number}].scheduleType`, event.target.value);
        setSelectedDay([]);
        setValue(`timePromotions[${number}].scheduleDate`, []);
    }

    // Select multi-days on Schedule Time Week
    const daysInMonth = Array.from({length: 31}, (_, index) => index + 1);

    const isSelected = (day) => watch(`timePromotions[${number}].scheduleDate`).includes(day);

    const buttonStyle = (selected) => ({
        borderColor: selected ? '#F14445' : '#e5e7eb',
        backgroundColor: selected ? '#F14445' : "transparent",
        color: selected ? '#ffffff' : '#181818',
        textTransform: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        padding: '10px 12px',
        height: '40px',
        fontFamily: 'Gilroy',
        minWidth: '40px',
    });

    // Toggle day selection
    const toggleDay = (day) => {
        setValue(`timePromotions[${number}].scheduleDate`, selectedDay.includes(day) ? selectedDay.filter (c => c !== day) : [...selectedDay, day]);
        setSelectedDay((prevSelected) =>
            prevSelected.includes(day)
            ? prevSelected.filter((c) => c !== day) // Deselect if already selected
            : [...prevSelected, day] // Select if not already selected
        );
    };

    const toggleYear = (value) => {
        const fromDate = new Date(value[0]);
        const toDate = new Date(value[1]);
        const newValue = {
            from: {month: fromDate.getMonth() + 1, day: fromDate.getDate()},
            to: {month: toDate.getMonth() + 1, day: toDate.getDate()},
        }
        setValue(`timePromotions[${number}].scheduleDate`, newValue);
        setScheduleDateRange(value);
    }


    const initialize = () => {
        if (parseInt(watch("timePromotions")[number]?.scheduleType) === parseInt(scheduleType['year'])) {
            let scheduleFrom = new Date();
            scheduleFrom.setMonth(watch("timePromotions")[number]?.scheduleDate.from.month - 1);
            scheduleFrom.setDate(watch("timePromotions")[number]?.scheduleDate.from.day);

            let scheduleTo = new Date();
            scheduleTo.setMonth(watch("timePromotions")[number]?.scheduleDate.to.month - 1);
            scheduleTo.setDate(watch("timePromotions")[number]?.scheduleDate.to.day);
            setScheduleDateRange([dayjs(scheduleFrom), dayjs(scheduleTo)]);
        }
    }

    useEffect(() => {
        if (data) {
            initialize();
        }
    }, [data])


    return (
        <div
            className={`flex flex-col pt-[20px] ${isPromotionsOpen ? 'gap-[28px]' : 'gap-[20px]'} border rounded-[8px]`}>
            <div className="flex items-center justify-between w-full px-[24px]">
                <Typography variant="h6">Promotions {number + 1}</Typography>
                <IconButton className="bg-secondary" onClick={togglePromotionsItem}>
                    <ExpandMoreIcon
                        className={`text-heading text-[22px] transition duration-300 ease-in-out ${isPromotionsOpen ? 'rotate-180' : ''}`}/>
                </IconButton>
            </div>
            <Collapse in={isPromotionsOpen}>
                <Grid container spacing={3} className="px-[24px] pb-[28px]">
                    <Grid item xs={12} md={6}>
                        <div className="w-full flex flex-col gap-[16px]">
                            <Typography variant="subtitle2">Details</Typography>
                            <FormControl variant="standard" className='w-full'>
                                <Typography variant="label1">Promotions name</Typography>
                                <TextField
                                    size="small"
                                    variant='outlined'
                                    required
                                    fullWidth
                                    placeholder='Enter promotion name'
                                    value={watch(`timePromotions[${number}]`)?.name}
                                    onChange={e => setValue(`timePromotions[${number}].name`, e.target.value)}
                                />
                            </FormControl>
                            <FormControl variant="standard" className='w-full'>
                                <Typography variant="label1">Promotions description</Typography>
                                <TextField
                                  size="small"
                                  variant='outlined'
                                  multiline
                                  rows={4}
                                  required
                                  fullWidth
                                  placeholder='Enter promotion description.'
                                  value={watch(`timePromotions[${number}]`)?.description}
                                  onChange={e => setValue(`timePromotions[${number}].description`, e.target.value)}
                                />
                            </FormControl>
                            <FormControl>
                                <Typography variant="label1">Discount type</Typography>
                                <RadioGroup
                                    row
                                    value={watch(`timePromotions[${number}]`)?.type || discountType["percent-off"]}
                                    onChange={(e) => setValue(`timePromotions[${number}].type`, e.target.value)}
                                    aria-label="discount-type"
                                    name={`discount-type-${number}`}
                                >
                                    <FormControlLabel
                                        value={discountType["percent-off"]}
                                        control={<Radio sx={{'&.Mui-checked': {color: '#F14445'}}} size="small"/>}
                                        label={<span className="text-[14px]">% off</span>}
                                    />
                                    <FormControlLabel
                                        value={discountType["dollar-off"]}
                                        control={<Radio sx={{'&.Mui-checked': {color: '#F14445'}}} size="small"/>}
                                        label={<span className="text-[14px]">$ off</span>}
                                    />
                                    <FormControlLabel
                                        value={discountType["one-free"]}
                                        control={<Radio sx={{'&.Mui-checked': {color: '#F14445'}}} size="small"/>}
                                        label={<span className="text-[14px]">Buy one get one free</span>}
                                    />
                                </RadioGroup>
                            </FormControl>
                            <FormControl variant="standard" className='w-full'>
                                <Typography variant="label1">Discount percentage value</Typography>
                                <TextField
                                    size="small"
                                    variant='outlined'
                                    required
                                    fullWidth
                                    placeholder='Enter discount'
                                    value={watch(`timePromotions[${number}]`)?.value}
                                    onChange={e => setValue(`timePromotions[${number}].value`, e.target.value)}
                                />
                            </FormControl>
                            <Typography variant="subtitle2">Time Frame</Typography>
                            <div className='flex justify-between gap-[14px] items-end'>
                                <FormControl variant="standard" className='w-full'>
                                    <Typography variant="label1">From</Typography>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <TimePicker
                                            onChange={handleTimePromotionFrom}
                                            value={
                                                watch(`timePromotions[${number}]`)?.from ?
                                                    dayjs(`${watch(`timePromotions[${number}].from.hour`)}:${watch(`timePromotions[${number}].from.minute`)}`, "HH:mm") :
                                                    dayjs()
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    placeholder="08 : 00 AM"
                                                    id={`timeframe-textfield-${number}`}
                                                />
                                            )}
                                        />
                                    </LocalizationProvider>
                                </FormControl>
                                <FormControl variant="standard" className='w-full'>
                                    <Typography variant="label1">To</Typography>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <TimePicker
                                            onChange={handleTimePromotionTo}
                                            value={
                                                watch(`timePromotions[${number}]`)?.to ?
                                                    dayjs(`${watch(`timePromotions[${number}].to.hour`)}:${watch(`timePromotions[${number}].to.minute`)}`, "HH:mm") :
                                                    dayjs()
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    placeholder="08 : 00 AM"
                                                    id={`timeframe-textfield-${number}`}
                                                />
                                            )}
                                        />
                                    </LocalizationProvider>
                                </FormControl>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <div className="w-full flex flex-col gap-[16px]">
                            <Typography variant="subtitle2">Schedule</Typography>
                            <FormControl>
                                <Typography variant="label1">Frequency</Typography>
                                <RadioGroup
                                    row
                                    value={watch(`timePromotions[${number}]`)?.frequencyType || frequencyType['every']}
                                    onChange={(e) => setValue(`timePromotions[${number}].frequencyType`, e.target.value)}
                                    aria-label="frequency"
                                    name={`frequency-${number}`}
                                >
                                    <FormControlLabel
                                        value={frequencyType["every"]}
                                        control={<Radio sx={{'&.Mui-checked': {color: '#F14445'}}} size="small"/>}
                                        label={<span className="text-[14px]">Every</span>}
                                    />
                                    <FormControlLabel
                                        value={frequencyType["every-other"]}
                                        control={<Radio sx={{'&.Mui-checked': {color: '#F14445'}}} size="small"/>}
                                        label={<span className="text-[14px]">Every other</span>}
                                    />
                                </RadioGroup>
                            </FormControl>
                            <FormControl>
                                <Typography variant="label1">Time</Typography>
                                <RadioGroup
                                    row
                                    value={watch(`timePromotions[${number}]`)?.scheduleType || scheduleType["day"]}
                                    onChange={handleScheduleTime}
                                    aria-label="schedule-time"
                                    name={`schedule-time-${number}`}
                                >
                                    <FormControlLabel
                                        value={scheduleType["day"]}
                                        control={<Radio sx={{'&.Mui-checked': {color: '#F14445'}}} size="small"/>}
                                        label={<span className="text-[14px]">Day</span>}
                                    />
                                    <FormControlLabel
                                        value={scheduleType["week"]}
                                        control={<Radio sx={{'&.Mui-checked': {color: '#F14445'}}} size="small"/>}
                                        label={<span className="text-[14px]">Week</span>}
                                    />
                                    <FormControlLabel
                                        value={scheduleType["month"]}
                                        control={<Radio sx={{'&.Mui-checked': {color: '#F14445'}}} size="small"/>}
                                        label={<span className="text-[14px]">Month</span>}
                                    />
                                    <FormControlLabel
                                        value={scheduleType["year"]}
                                        control={<Radio sx={{'&.Mui-checked': {color: '#F14445'}}} size="small"/>}
                                        label={<span className="text-[14px]">Year</span>}
                                    />
                                </RadioGroup>
                            </FormControl>

                            {parseInt(watch(`timePromotions[${number}]`)?.scheduleType) === parseInt(scheduleType['week']) && (
                                <div className="w-full flex flex-col gap-[6px]">
                                    <Typography variant="label1">Choose Days</Typography>
                                    <div className="w-full flex flex-wrap gap-[8px]">
                                        {_days.map((day) => (
                                            <Button
                                                key={day}
                                                variant="outlined"
                                                style={buttonStyle(isSelected(day))}
                                                onClick={() => toggleDay(day)}
                                            >
                                                {day}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {parseInt(watch(`timePromotions[${number}]`)?.scheduleType) === parseInt(scheduleType['month']) && (
                                <div className="w-full flex flex-col gap-[6px]">
                                    <Typography variant="label1">Choose Days</Typography>
                                    <div className="w-full flex flex-wrap gap-[8px]">
                                        {daysInMonth.map((day) => (
                                            <Button
                                                key={day}
                                                variant="outlined"
                                                style={buttonStyle(isSelected(day))}
                                                onClick={() => toggleDay(day)}
                                            >
                                                {day}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {parseInt(watch(`timePromotions[${number}]`)?.scheduleType) === parseInt(scheduleType['year']) && (
                                <div className="w-full flex flex-col gap-[6px]">
                                    <Typography variant="label1">Choose Dates</Typography>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateRangeCalendar calendars={1}
                                                           value={scheduleDateRange}
                                                           onChange={(value) => toggleYear(value)}
                                        />
                                    </LocalizationProvider>
                                </div>
                            )}
                        </div>
                    </Grid>
                </Grid>
                <div className="border-t px-[24px] py-[6px]">
                    <Button
                        onClick={handleRemoveClick}
                        sx={{
                            height: '44px',
                            fontFamily: 'Gilroy',
                            fontSize: '14px',
                            color: '#181818',
                            borderRadius: '8px',
                            padding: '0 10px',
                            backgroundColor: 'transparent',
                            textTransform: 'unset',
                            '&:hover': {
                                backgroundColor: '#f5f5f5',
                            }
                        }}
                        startIcon={<img src={icTrashBin} className='mr-2 brightness-0'/>}
                    >
                        Delete Promotion
                    </Button>
                </div>
            </Collapse>
        </div>
    );
}
