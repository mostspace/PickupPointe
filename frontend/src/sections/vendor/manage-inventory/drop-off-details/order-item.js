import React from "react";
import { Grid, Button } from "@mui/material";
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import RemoveIcon from '@mui/icons-material/Remove';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

export default function OrderItem(props) {
    const { number, removeItem } = props;

    const handleRemoveClick = () => {
        removeItem(number);
    };

    return (
        <div className="flex flex-col p-4 gap-4 border border-t">
            <div className="flex justify-between items-center">
                <h6 className="text-heading text-2xl font-medium capitalize">Item {number}</h6>
                <Button
                    style={{
                        width: '24px',
                        minWidth: 'unset',
                        height: '24px',
                        padding: 0,
                        fontSize: '10px',
                        color: '#181818',
                        borderRadius: '50%',
                        backgroundColor: '#f6f6f6',
                        textTransform: 'unset',
                    }}
                    onClick={handleRemoveClick}
                >
                    <RemoveIcon sx={{ color: '#181818', fontSize: '18px' }} />
                </Button>
            </div>
            <Grid container spacing={2}>
                <Grid item md={9} sm={12} xs={12}>
                    <FormControl className="w-full">
                        <label htmlFor={`drop-off-select-${number}`} className='font-normal text-normal leading-5 text-sm pb-1'>Select items in this drop-off</label>
                        <Select
                            id={`drop-off-select-${number}`}
                            size="small"
                            defaultValue={0}
                            className="w-full"
                        >
                            <MenuItem value={0} disabled className="hidden text-sm sm:!text-14px" hidden>Select drop-off item</MenuItem>
                            <MenuItem value={1} className="text-sm sm:!text-14px">Drop-off Item 1</MenuItem>
                            <MenuItem value={2} className="text-sm sm:!text-14px">Drop-off Item 2</MenuItem>
                            <MenuItem value={3} className="text-sm sm:!text-14px">Drop-off Item 3</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                    <FormControl variant="standard" className='w-full'>
                        <label htmlFor={`units-textfield-${number}`} className='font-normal text-normal leading-5 text-sm pb-1'>Units</label>
                        <TextField
                            id={`units-textfield-${number}`}
                            size="small"
                            variant='outlined'
                            required
                            fullWidth
                            placeholder='Enter units number'
                        />
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item md={6} sm={12} xs={12}>
                    <FormControl className="w-full">
                        <label htmlFor={`shelf-select-${number}`} className='font-normal text-normal leading-5 text-sm pb-1'>Select the shelf for this drop-off</label>
                        <Select
                            id={`shelf-select-${number}`}
                            size="small"
                            defaultValue={0}
                            className="w-full"
                        >
                            <MenuItem value={0} disabled className="hidden text-sm sm:!text-14px" hidden>Select shelf</MenuItem>
                            <MenuItem value={1} className="text-sm sm:!text-14px">Shelf 1</MenuItem>
                            <MenuItem value={2} className="text-sm sm:!text-14px">Shelf 2</MenuItem>
                            <MenuItem value={3} className="text-sm sm:!text-14px">Shelf 3</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                    <FormControl className="w-full">
                        <label htmlFor={`rack-select-${number}`} className='font-normal text-normal leading-5 text-sm pb-1'>Select items in this drop-off</label>
                        <Select
                            id={`rack-select-${number}`}
                            size="small"
                            defaultValue={0}
                            className="w-full"
                        >
                            <MenuItem value={0} disabled className="text-sm sm:!text-14px" hidden>Select rack</MenuItem>
                            <MenuItem value={1} className="text-sm sm:!text-14px">Rack 1</MenuItem>
                            <MenuItem value={2} className="text-sm sm:!text-14px">Rack 2</MenuItem>
                            <MenuItem value={3} className="text-sm sm:!text-14px">Rack 3</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item md={6} sm={12} xs={12}>
                    <FormControl variant="standard" className='w-full'>
                        <label htmlFor={`timeframe-textfield-${number}`} className='font-normal text-normal leading-5 text-sm pb-1'>Est. drop off time-frame</label>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
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
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                    <FormControl variant="standard" className='w-full'>
                        <label htmlFor={`person-textfield-${number}`} className='font-normal text-normal leading-5 text-sm pb-1'>Who will make the drop-off?</label>
                        <TextField
                            id={`person-textfield-${number}`}
                            size="small"
                            variant='outlined'
                            required
                            fullWidth
                            placeholder='Select person'
                        />
                    </FormControl>
                </Grid>
            </Grid>
        </div>
    );
}
