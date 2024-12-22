import React from 'react'

// @mui
import {
    FormControl, Button, IconButton, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';

// Components
import CheckboxList from 'src/components/checkbox-list';

// Icons
import AddIcon from '@mui/icons-material/Add';

// Assets
import { Magnifer, successFormImg } from "src/assets";

// Example usage
const checkboxDataFromBackend = [
    { id: 1, label: 'Pickup Pointe Store #32322', subLabel: '7384 Hayward Way, Laguna CA, 93453' },
    { id: 2, label: 'Pickup Pointe Store #32323', subLabel: '1234 Elm Street, Springfield, IL, 62701' },
    // Add more data as needed
];

const PickupPointeLocation = () => {

    // Request New Pickup Pointe Location Modal
    const [openRequestPickupLocation, setOpenRequestPickupLocation] = React.useState(false);

    const handleRequestPickupLocationOpen = () => {
        setOpenRequestPickupLocation(true);
    };

    const handleRequestPickupLocationClose = () => {
        setOpenRequestPickupLocation(false);
    };

    // Request New Pickup Pointe Location Success Modal
    const [openSuccessForm, setOpenSuccessForm] = React.useState(false);

    const handleClickConfirmSuccessOpen = () => {
        handleRequestPickupLocationClose();
        setOpenSuccessForm(true);
    };

    const handleSuccessFormClose = () => {
        setOpenSuccessForm(false);
    };
    
    return (
        <>
            <div className='w-full flex justify-center'>
                <div className='flex flex-col sm:max-w-[624px] gap-[14px]'>
                    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center'>
                        <h5 className='text-[20px] font-normal text-heading leading-[30px] pb-5 sm:pb-0'>Pickup pointe location</h5>
                        <Button 
                            sx={{
                                width: 'auto',
                                padding: '5px 5px',
                                fontFamily: 'Gilroy',
                                fontSize: '14px',
                                color: '#181818',
                                borderRadius: '8px',
                                backgroundColor: 'transparent',
                                textTransform: 'unset',
                            }}
                            onClick={handleRequestPickupLocationOpen}
                        >
                            Request new Pickup Pointe location
                            <AddIcon className="ml-2" sx={{color: '#181818', fontSize: '18px'}}/>
                        </Button>
                    </div>
                    <div className='grid gap-[14px]'>
                        <FormControl variant="standard" className=''>
                            <label className='font-normal text-normal leading-[20px] text-[14px] pb-[6px]'>Location zip code</label>
                            <div className='flex justify-between items-center gap-[16px]'>
                                <TextField
                                    size="small"
                                    variant={'outlined'}
                                    required
                                    fullWidth
                                    placeholder='Enter location name'
                                />
                                <Button
                                    sx={{
                                        minWidth: '40px',
                                        width: '40px',
                                        height: '40px',
                                        color: '#ffffff',
                                        borderRadius: '8px',
                                        backgroundColor: '#F14445',
                                        textTransform: 'unset',
                                        '&:hover': {
                                            backgroundColor: '#E13031',
                                        }
                                    }}
                                    startIcon={<img src={Magnifer} className="w-[20px] h-[20px] m-0 p-0" />}
                                > 
                                </Button>
                            </div>
                        </FormControl>
                    </div>

                    <div className='flex flex-col gap-[14px] mt-[16px]'>
                        <div><label className='font-normal text-normal leading-[20px] text-[14px]'>By this zip code 2 locations are available. Select one or more that work for your dropoffs </label></div>
                        <CheckboxList checkboxData={checkboxDataFromBackend} />
                    </div>
                </div>
            </div>

            {/* Request a new pickup point location Modal */}
            <React.Fragment>
                <Dialog className="w-full"
                    open={openRequestPickupLocation}
                    onClose={handleRequestPickupLocationClose}
                    scroll="paper"
                    sx={{
                        width: "100% !important",
                    }}
                >
                <DialogTitle id="" className='pt-[32px] sm:!pt-[64px] flex flex-col gap-[6px] items-center sm:px-[88px]'>
                    <h1 className='text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center'>Request a new Pickup Point location</h1>
                </DialogTitle>
                <DialogContent dividers={scroll === 'paper'}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        tabIndex={-1}
                    >
                    <div className='flex flex-col gap-[14px] font-gilroy sm:px-[150px] py-[16px]'>
                        <FormControl variant="standard" className=''>
                            <label className='font-normal text-normal leading-[20px] text-[14px] pb-[4px]'>Email address</label>
                            <TextField
                                type='email'
                                size="small"
                                variant='outlined'
                                required
                                fullWidth
                                placeholder='Enter your full name'
                            />
                        </FormControl>
                        <FormControl variant="standard" className=''>
                            <label className='font-normal text-normal leading-[20px] text-[14px] pb-[4px]'>Email address</label>
                            <TextField
                                size="small"
                                variant='outlined'
                                required
                                fullWidth
                                placeholder='Enter your email address'
                            />
                        </FormControl>
                        <FormControl variant="standard" className=''>
                            <label className='font-normal text-normal leading-[20px] text-[14px] pb-[4px]'>State</label>
                            <TextField
                                size="small"
                                variant='outlined'
                                required
                                fullWidth
                                placeholder='Select state'
                            />
                        </FormControl>
                        <FormControl variant="standard" className=''>
                            <label className='font-normal text-normal leading-[20px] text-[14px] pb-[4px]'>City</label>
                            <TextField
                                size="small"
                                variant='outlined'
                                required
                                fullWidth
                                placeholder='Select city'
                            />
                        </FormControl>
                    </div>
                    </DialogContentText>
                </DialogContent>
                <DialogActions className="!px-[22px] !pb-[32px] sm:!pb-[64px] sm:!px-[170px] !gap-[14px]">
                    <Button 
                        sx={{
                            width: '100%',
                            height: '44px',
                            fontFamily: 'Gilroy',
                            fontSize: '14px',
                            color: '#181818',
                            borderRadius: '8px',
                            backgroundColor: '#F5F5F5',
                            textTransform: 'unset',
                        }}
                        onClick={handleRequestPickupLocationClose}
                    >
                        Back to details
                    </Button>
                    <Button className='w-full'
                        sx={{
                            width: '100%',
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
                        onClick={handleClickConfirmSuccessOpen}
                    > 
                        Save Changes
                    </Button>
                </DialogActions>
                </Dialog>
            </React.Fragment>

            {/* Request Location Success Modal */}
            <React.Fragment>
                <Dialog className="w-full"
                    open={openSuccessForm}
                    onClose={handleSuccessFormClose}
                    scroll="paper"
                    sx={{
                        width: "100% !important",
                    }}
                >
                <DialogTitle id="" className='pt-[32px] sm:!pt-[64px] flex flex-col gap-[6px] items-center sm:px-[88px]'>
                    <div className='flex flex-col gap-[6px] items-center'>
                        <img src={successFormImg} className='w-[30%]' loading="lazy"/>
                        <h1 className='text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center'>Thank you for your submission!</h1>
                    </div>
                </DialogTitle>
                <DialogContent dividers={scroll === 'paper'}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        tabIndex={-1}
                    >
                        <p className='text-normal font-light leading-[25px] text-[16px] text-center sm:px-[150px] font-gilroy'>Should we open a new location in this city, all vendors on our waitlist will be given priority access to shelf space.</p>
                    </DialogContentText>
                </DialogContent>
                <DialogActions className="!px-[22px] !pb-[32px] sm:!pb-[64px] sm:!px-[170px] !gap-[14px] mt-10 sm:mt-20">
                    <Button 
                        sx={{
                            width: '100%',
                            height: '44px',
                            fontFamily: 'Gilroy',
                            fontSize: '14px',
                            color: '#181818',
                            borderRadius: '8px',
                            backgroundColor: '#F5F5F5',
                            textTransform: 'unset',
                        }}
                        onClick={handleSuccessFormClose}
                    >
                        Back
                    </Button>
                    <Button className='w-full'
                        sx={{
                            width: '100%',
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
                        onClick={handleSuccessFormClose}
                    > 
                        Continue
                    </Button>
                </DialogActions>
                </Dialog>
            </React.Fragment>
        </>
    )
}

export default PickupPointeLocation;