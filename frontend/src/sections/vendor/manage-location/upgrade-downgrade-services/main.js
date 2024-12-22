import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link, useNavigate } from 'react-router-dom';

// Icons
import EditLocationOutlinedIcon from '@mui/icons-material/EditLocationOutlined';
import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CircleIcon from '@mui/icons-material/Circle';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

// Assets
import { successFormImg, icLocation } from 'src/assets';

// @mui
import {
  Card, Table, Stack, Paper, Avatar, Select, FormControl, Button, Popover, TableContainer, TableHead, Box, Grid, Drawer, styled, alpha, Divider, FormGroup, FormControlLabel,
  Checkbox, TableRow, Menu, MenuItem, TableBody, TableCell, Container, Typography, IconButton, TablePagination, OutlinedInput, InputAdornment,
  Tabs, Tab, useMediaQuery, useTheme, Fade, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Chip, TextareaAutosize,
} from '@mui/material';


// --------------------------------------------------------------------------------------------------

const Main = ({}) => {

    // Submission Success Modal
    const [openSuccessForm, setOpenSuccessForm] = React.useState(false);

    const handleClickConfirmSuccessOpen = () => {
        setOpenSuccessForm(true);
    };

    const handleSuccessFormClose = () => {
        setOpenSuccessForm(false);
    };

    // Request Feature Or Service Modal
    const [openRequestNewFeatureForm, setOpenRequestNewFeatureForm] = React.useState(false);

    const handleRequestNewFeatureOpen = () => {
        handleSuccessFormClose();
        setOpenRequestNewFeatureForm(true);
    };

    const handleRequestNewFeatureClose = () => {
        setOpenRequestNewFeatureForm(false);
    };

    // Terminate Confirmation Modal
    const [openTerminateConfirmation, setOpenTerminateConfirmation] = React.useState(false);

    const handleTerminateConfirmationOpen = () => {
        handleRequestNewFeatureClose();
        setOpenTerminateConfirmation(true);
    };

    const handleTerminateConfirmationClose = () => {
        setOpenTerminateConfirmation(false);
    };

    return (
        <>
            <div className="flex flex-col gap-[16px]">
                <div className="flex flex-col gap-[3px]">
                    <Link to="/vendor/location-details" className="text-heading text-[14px]">
                        <ArrowBackIosIcon className="text-[14px] mb-[2px]" /> Back
                    </Link>
                    <h6 className="text-heading text-[16px] sm:text-[18px] font-medium capitalize mb-2 sm:mb-0">Pickup Pointe Store #32322</h6>
                </div>

                <div className="flex flex-col gap-[48px]">
                    <div className="flex justify-between px-[12px] py-[16px] self-stretch rounded-[12px] border border-[rgba(0, 0, 0, 0.08)] bg-white">
                        <div className="flex flex-col justify-between gap-[14px] xs:gap-0">
                            <div className="flex items-start sm:items-center gap-[3px] ss:gap-[8px]">
                                <Typography variant="subtitle1">Pickup Pointe Store #32322</Typography>
                                <CircleIcon className="text-[5px] text-normal hidden ss:block" />
                                <Typography variant="subtitle1" className="text-success">active</Typography>
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-[3px]">
                                <Typography variant="subtitle3">#034</Typography>
                                <CircleIcon className="text-[5px] text-normal hidden sm:block" />
                                <Typography variant="subtitle3">7384 Hayward Way, Laguna CA, 93453</Typography>
                            </div>
                        </div>
                        <IconButton className="w-[40px] h-[40px]"><MoreHorizIcon sx={{color: "#181818", fontSize:"22px"}} className="cursor-pointer" /></IconButton>
                    </div>

                    <div className="flex flex-col gap-[14px]">
                        <Typography variant="h5" className="capitalize">Rack Space</Typography>
                        <div className="flex flex-col sm:flex-row justify-between gap-[14px]">
                            <FormControl variant="standard" className='w-full sm:w-[20%]'>
                                <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Amount</label>
                                <TextField
                                    size="small"
                                    variant='outlined'
                                    required
                                    fullWidth
                                    placeholder='Enter amount'
                                />
                            </FormControl>
                            <div className="w-full flex flex-col gap-[12px]">
                                <FormControl variant="standard" className='w-full'>
                                    <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Racks or shelves</label>
                                    <TextField
                                        size="small"
                                        variant='outlined'
                                        required
                                        fullWidth
                                        placeholder='Enter rack or shelves'
                                    />
                                </FormControl>
                                <ul className='ml-[18px]'>
                                    <li className='list-disc pb-1'><Typography variant='subtitle2'>241 in. x 121 in. of useable shelf space per rack</Typography></li>
                                    <li className='list-disc pb-1'><Typography variant='subtitle2'>48.2 in. x 24.2 in. of useable shelf space per shelf</Typography></li>
                                    <li className='list-disc pb-1'><Typography variant='subtitle2'>Unlimited drop-offs and pickups</Typography></li>
                                    <li className='list-disc pb-1'><Typography variant='subtitle2'>Dedicated front-desk attendant</Typography></li>
                                    <li className='list-disc pb-1'><Typography variant='subtitle2'>Hours of operation: 7AM- 9PM PST, 7 days a week</Typography></li>
                                    <li className='list-disc pb-1'><Typography variant='subtitle2'>Curbside pickup available</Typography></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col gap-[6px]'>
                        <div className='flex justify-between items-start sm:items-center'>
                            <Typography variant='h5' className='capitalize'>subscription cost</Typography>
                            <Typography variant='h5' className=''>$300/month</Typography>
                        </div>
                        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center'>
                            <Typography variant='subtitle2' className='text-normal'>You can adjust your space allocation at any time. </Typography>
                            <Link to="/vendor/customer-loyalty">
                                <Button className="flex items-center mt-3 sm:mt-0"
                                    sx={{
                                    width: 'inherit',
                                    padding: '5px 5px',
                                    fontFamily: 'Gilroy',
                                    fontSize: '14px',
                                    color: '#181818',
                                    borderRadius: '8px',
                                    backgroundColor: 'transparent',
                                    textTransform: 'unset',
                                    }}
                                >
                                    Payment method <ArrowForwardIosIcon className="text-heading text-[14px] ml-1" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button 
                            sx={{
                                height: '44px',
                                fontFamily: 'Gilroy',
                                fontSize: '14px',
                                color: '#ffffff',
                                padding: '8px 40px',
                                borderRadius: '8px',
                                backgroundColor: '#F14445',
                                textTransform: 'unset',
                                '&:hover': {
                                    backgroundColor: '#E13031',
                                }
                            }}
                            onClick={handleClickConfirmSuccessOpen}
                        > 
                            Submit for approval
                        </Button>
                    </div>
                </div>
            </div>

            {/* Submission Success Modal */}
            <React.Fragment>
                <Dialog
                open={openSuccessForm}
                onClose={handleSuccessFormClose}
                >
                    <div className='flex flex-col gap-[40px] px-[25px] py-[40px] sm:px-[88px] sm:px-[64px]'>
                        <div className='flex flex-col gap-[40px] items-center'>
                            <img src={successFormImg} className='w-[45%]'/>
                            <div className="flex flex-col gap-[6px]">
                                <h1 className='text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center'>Thank you for your submission!</h1>
                                <p className='text-normal font-light leading-[25px] text-[16px] text-center'>We will contact you soon.</p>
                            </div>
                        </div>
                        
                        <div className="flex justify-center items-center">
                            <Button
                                sx={{
                                    padding: '8px 40px',
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
                                onClick={handleRequestNewFeatureOpen}
                            > 
                                Continue
                            </Button>
                        </div>
                    </div>
                </Dialog>
            </React.Fragment>

            {/* Request New Feature or Service Modal */}
            <React.Fragment>
                <Dialog
                    open={openRequestNewFeatureForm}
                    onClose={handleRequestNewFeatureClose}
                >
                    <div className='flex flex-col gap-[40px] px-[25px] py-[40px] sm:px-[88px] sm:px-[64px]'>
                        <div className='flex flex-col gap-[6px] items-center'>
                            <h1 className='text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center'>Request a new feature or service</h1>
                            <p className='text-normal font-light leading-[25px] text-[16px] text-center'>Provide as much detail as possible to help us understand your needs and enhance your experience with Pickup Pointe.</p>
                        </div>
                        <div className='flex flex-col gap-[14px]'>
                            <FormControl variant="standard" className=''>
                                <label className='font-normal text-normal leading-[20px] text-[14px] pb-[4px]'>Your ideas of a feature</label>
                                <TextareaAutosize maxRows="10" minRows='8' className="border rounded-[8px] p-[16px] text-[14px] focus-visible:border-primary focus-visible:outline-none" placeholder="Feel free to describe your ideas" />
                            </FormControl>
                        </div>
                        <div className="flex justify-between items-center gap-[14px]">
                            <Button className="w-full"
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
                                onClick={handleRequestNewFeatureClose}
                            >
                                Cancel
                            </Button>
                            <Button className="w-full"
                                sx={{
                                    padding: '8px 40px',
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
                                onClick={handleTerminateConfirmationOpen}
                            > 
                                Continue
                            </Button>
                        </div>
                    </div>
                </Dialog>
            </React.Fragment>

            {/* Terminate Confirmation Modal */}
            <React.Fragment>
                <Dialog
                    open={openTerminateConfirmation}
                    onClose={handleTerminateConfirmationClose}
                >
                    <div className='flex flex-col gap-[40px] px-[25px] py-[40px] sm:px-[88px] sm:px-[64px]'>
                        <div className='flex flex-col gap-[6px] items-center'>
                            <img src={icLocation} className='w-[30%]'/>
                            <h1 className='text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center mt-3'>Terminate Pickup Pointe<br />store #32322 location service</h1>
                        </div>
                        <div className='w-full flex flex-col gap-[14px]'>
                            <FormControlLabel className='w-full flex items-start mr-0 px-[30px]'
                                control={<Checkbox size="small"
                                    sx={{
                                        color: '#181818',
                                        fontSize: '14px',
                                        padding: 0,
                                        marginRight: '5px',
                                        marginTop: '3px',
                                        '&.Mui-checked': {
                                            color: '#F14445',
                                        },
                                    }}
                                />}
                                label={<Typography variant="subtitle2">I understand that I will have to come and pick up inventory within the next 5 business days to avoid extra storage charges.</Typography>}
                            />
                        </div>
                        <div className="flex justify-between items-center gap-[14px]">
                            <Button className="w-full"
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
                                onClick={handleTerminateConfirmationClose}
                            >
                                Cancel
                            </Button>
                            <Button className="w-full"
                                sx={{
                                    padding: '8px 40px',
                                    height: '44px',
                                    fontFamily: 'Gilroy',
                                    lineHeight: '1.2',
                                    fontSize: '14px',
                                    color: '#ffffff',
                                    borderRadius: '8px',
                                    backgroundColor: '#F14445',
                                    textTransform: 'unset',
                                    '&:hover': {
                                        backgroundColor: '#E13031',
                                    }
                                }}
                                onClick={handleTerminateConfirmationClose}
                            > 
                                Terminate location
                            </Button>
                        </div>
                    </div>
                </Dialog>
            </React.Fragment>
        </>
    )
}

export default Main;