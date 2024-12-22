import React, { useState, useCallback } from 'react'
import { Link } from 'react-router-dom';

// @mui
import {
    FormControl, Button, Box, IconButton, InputAdornment, Stepper, Step, StepLabel, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField,
} from '@mui/material';

// Components
import PrimaryButton from "src/components/button/primary-button";
import PickupLocations from 'src/sections/auth/vendor/pickup-locations';
import AnticipatedRackSpaceUsage from 'src/sections/auth/vendor/anticipated-rack-space-usage';
import ContactDetails from 'src/sections/auth/vendor/contact-details';
import PaymentDetails from 'src/sections/auth/vendor/payment-details';

// Icons
import Iconify from 'src/components/iconify';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

// Assets
import { successFormImg, } from "src/assets";

// ------------------------------------------------------------------------------------------------------------------------------------------

// Stepper
const steps = ['Pickup locations', 'Anticipated rack space usage', 'Contact details', 'Payment details' ];

// ------------------------------------------------------------------------------------------------------------------------------------------

const PickupLocationRegister = () => {
    // Stepper
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());
  
    const isStepOptional = (step) => {
      return step === 1;
    };
  
    const isStepSkipped = (step) => {
      return skipped.has(step);
    };
  
    const handleNext = () => {

        if (activeStep === steps.length - 1) {
            handleClickOpen();
        }
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }
    
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };
  
    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
  
    const handleSkip = () => {
      if (!isStepOptional(activeStep)) {
        throw new Error("You can't skip a step that isn't optional.");
      }
  
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped((prevSkipped) => {
        const newSkipped = new Set(prevSkipped.values());
        newSkipped.add(activeStep);
        return newSkipped;
      });
    };
  
    const handleReset = () => {
      setActiveStep(0);
    };

    // Radio Tab
    const [value, setValue] = useState('business');

    const handleTabChange = (event) => {
        setValue(event.target.value);
    };

    // Modal
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [openSuccessForm, setOpenSuccessForm] = React.useState(false);

    const handleClickConfirmSuccessOpen = () => {
        handleClose();
        setOpenSuccessForm(true);
    };

    const handleSuccessFormClose = () => {
        setOpenSuccessForm(false);
    };

    const handlConfirmCodeChange = (event) => {
        setConfirmCode(event.target.value);
    };

    // Password Field
    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const [pwdValues, setValues] = useState({
        password: '',
        showPassword: false,
    });

    const handlePwdChange = (prop) => (event) => {
        setValues({ ...pwdValues, [prop]: event.target.value });
    };

    const handleShowPassword = useCallback(() => {
        setValues({ ...pwdValues, showPassword: !pwdValues.showPassword });
    }, [pwdValues]);

    const handleMouseDownPassword = useCallback((event) => {
        event.preventDefault();
    }, []);
    
    // Confirm
    const [confirmValues, setConfirmValues] = useState({
        password: '',
        showPassword: false,
    });

    const handleConfirmPwdChange = (prop) => (event) => {
        setConfirmValues({ ...confirmValues, [prop]: event.target.value });
    };
    const handleShowConfirmPassword = useCallback(() => {
        setConfirmValues({ ...confirmValues, showPassword: !confirmValues.showPassword });
    }, [confirmValues]);

    const handleMouseDownConfirmPassword = useCallback((event) => {
        event.preventDefault();
    }, []);

    // Checking if all fields is filled out
    const [email, setEmail] = useState('');
    const [confirmCode, setConfirmCode] = useState('');
    
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };
    
    const isFormValid = () => {
        return email && pwdValues.password && confirmValues.password;
    };

    const isSuccessFormValid = () => {
        return confirmCode;
    };

    return (
        <section id='vendorRegister' className='bg-[#F6F6F6] min-h-[100vh] flex justify-center items-center sm:py-[32px] sm:px-[64px]'>
            <div className="max-w-[1312px] w-full h-full bg-white rounded-[24px] py-[48px] px-[20px] sm:p-[48px] relative">
                <Link to="/register">
                    <IconButton className='absolute right-7 top-7 bg-secondary'><CloseOutlinedIcon sx={{color: "#181818", fontSize:"20px"}} /></IconButton>
                </Link>
                <div className='flex flex-col gap-[50px]'>
                    <div className='w-full gap-[40px] flex flex-col items-center'>
                        <h2 className='text-[32px] font-medium leading-[44px] text-heading text-center'>Become a merchant</h2>
                        <div className='w-full sm:max-w-[937px]'>
                            <Box sx={{ width: '100%' }}>
                                <Stepper activeStep={activeStep} className='mb-[40px]'>
                                    {steps.map((label, index) => {
                                        const stepProps = {};
                                        const labelProps = {};
                                        if (isStepSkipped(index)) {
                                            stepProps.completed = false;
                                        }
                                        return (
                                            <Step key={label} {...stepProps}>
                                                <StepLabel {...labelProps} className='!text-[16px]'>{label}</StepLabel>
                                            </Step>
                                        );
                                    })}
                                </Stepper>
                                {activeStep === steps.length ? ( 
                                    <h5 className='text-[20px] font-normal text-heading leading-[30px]'>Finish</h5>
                                 ) : (
                                    <React.Fragment>
                                        <div className='w-full'>
                                            {activeStep === 0 && (
                                                <PickupLocations />
                                            )}
                                            {activeStep === 1 && (
                                                <AnticipatedRackSpaceUsage />
                                            )}
                                            {activeStep === 2 && (
                                                <ContactDetails />
                                            )}
                                            {activeStep === 3 && (
                                                <PaymentDetails />
                                            )}
                                        </div>
                                    </React.Fragment>
                                )}
                            </Box>
                        </div>
                    </div>

                    <div className='flex gap-[14px] justify-center'>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ 
                                mr: 1,
                                padding: '8px 40px',
                                height: '44px',
                                fontFamily: 'Gilroy',
                                fontSize: '14px',
                                color: '#181818',
                                borderRadius: '8px',
                                backgroundColor: '#F5F5F5',
                                textTransform: 'unset'
                             }}
                            >
                                Back
                            </Button>
                            
                            <Box sx={{ flex: '1 1 auto' }} />

                            <Button onClick={activeStep ===steps.length - 1 ? handleClickOpen : handleNext}
                                sx={{ 
                                    mr: 1, 
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
                            >
                                {activeStep === steps.length - 1 ? 'Finish' : 'Continue'}
                            </Button>
                        </Box>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <React.Fragment>
                <Dialog className="w-full"
                    open={open}
                    onClose={handleClose}
                    scroll="paper"
                    sx={{
                        width: "100% !important",
                    }}
                >
                <DialogTitle id="" className='pt-[32px] sm:!pt-[64px] flex flex-col gap-[6px] items-center sm:px-[88px]'>
                    <h1 className='text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center'>Finish creating your free vendor account</h1>
                    <p className='text-normal font-light leading-[25px] text-[16px] text-center sm:px-16'>After creating your account, you will need to submit your profile for final approval before going live.</p>
                </DialogTitle>
                <DialogContent dividers={scroll === 'paper'}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        tabIndex={-1}
                    >
                    <div className='flex flex-col gap-[14px] font-gilroy sm:px-[60px] py-[16px]'>
                        <FormControl variant="standard" className=''>
                            <label className='font-normal text-normal leading-[20px] text-[14px] pb-[4px]'>Email address</label>
                            <TextField
                                size="small"
                                variant='outlined'
                                required
                                fullWidth
                                value={email}
                                onChange={handleEmailChange}
                                placeholder='ryan@mybusiness.com'
                            />
                        </FormControl>
                        <FormControl variant="outlined" className='relative'>
                            <label className='font-normal text-normal leading-[20px] text-[14px] pb-[4px]'>Password</label>
                            <TextField
                                size="small"
                                variant="outlined"
                                fullWidth
                                type={pwdValues.showPassword ? 'text' : 'password'}
                                value={pwdValues.password}
                                onChange={handlePwdChange('password')}
                                placeholder='Enter password'
                                InputProps={{
                                    endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                        onClick={handleShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                        >
                                        {pwdValues.showPassword ? (
                                            <Iconify icon="solar:eye-bold" width={24} />
                                        ) : (
                                            <Iconify icon="solar:eye-closed-bold" width={24} />
                                        )}
                                        </IconButton>
                                    </InputAdornment>
                                    ),
                                }}
                            />
                        </FormControl>
                        <FormControl variant="outlined" className='relative'>
                            <label className='font-normal text-normal leading-[20px] text-[14px] pb-[4px]'>Confirm Password</label>
                            <TextField
                                size="small"
                                variant="outlined"
                                fullWidth
                                type={confirmValues.showPassword ? 'text' : 'password'}
                                value={confirmValues.password}
                                onChange={handleConfirmPwdChange('password')}
                                placeholder='Confirm password'
                                InputProps={{
                                    endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleShowConfirmPassword}
                                            onMouseDown={handleMouseDownConfirmPassword}
                                            edge="end"
                                        >
                                        {confirmValues.showPassword ? (
                                            <Iconify icon="solar:eye-bold" width={24} />
                                        ) : (
                                            <Iconify icon="solar:eye-closed-bold" width={24} />
                                        )}
                                        </IconButton>
                                    </InputAdornment>
                                    ),
                                }}
                            />
                        </FormControl>
                    </div>
                    </DialogContentText>
                </DialogContent>
                <DialogActions className="!px-[22px] !pb-[32px] sm:!pb-[64px] sm:!px-[80px] !gap-[14px]">
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
                        onClick={handleClose}
                    >
                        Back to details
                    </Button>
                    <Button className='w-full' disabled={!isFormValid()}
                        sx={{
                            width: '100%',
                            height: '44px',
                            fontFamily: 'Gilroy',
                            fontSize: '14px',
                            color: isFormValid() ? '#ffffff' : '#181818',  // Change text color if needed
                            borderRadius: '8px',
                            backgroundColor: isFormValid() ? '#F14445' : '#F5F5F5',  // Change background color
                            textTransform: 'unset',
                            '&:hover': {
                                backgroundColor: isFormValid() ? '#E13031' : '#F5F5F5',  // Change hover background color
                            }
                        }}
                        onClick={handleClickConfirmSuccessOpen}
                    >
                        Create free account
                    </Button>
                </DialogActions>
                </Dialog>
            </React.Fragment>

            <React.Fragment>
                <Dialog
                    open={openSuccessForm}
                    onClose={handleSuccessFormClose}
                >
                    <div className='flex flex-col gap-[40px] px-[25px] py-[40px] sm:px-[88px] sm:px-[64px]'>
                        <div className='flex flex-col gap-[6px] items-center'>
                            <img src={successFormImg} className='w-[30%]' loading="lazy"/>
                            <h1 className='text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center'>Congratulations! Your account was created successfully.</h1>
                            <p className='text-normal font-light leading-[25px] text-[16px] text-center'>We have sent you a confirmation code to your email address</p>
                        </div>
                        <div className='flex flex-col gap-[14px]'>
                            <FormControl variant="standard" className=''>
                                <label className='font-normal text-normal leading-[20px] text-[14px] pb-[4px]'>Confirmation code</label>
                                <TextField
                                    size="small"
                                    variant='outlined'
                                    required
                                    fullWidth
                                    value={confirmCode}
                                    onChange={handlConfirmCodeChange}
                                    placeholder='Paste confirmation code here'
                                />
                            </FormControl>
                            <p className='text-[14px] font-normal leading-[23px] text-[#666] mt-[16px]'>Didn't receive the code? Check your spam or resend a new code.</p>
                        </div>
                        <div className="flex justify-between items-center gap-[14px]">
                            <Link to="" className="w-full">
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
                                    Resend code
                                </Button>
                            </Link>
                            <Link to="/vendor" className="w-full">
                                <Button disabled={!isSuccessFormValid()}
                                    sx={{
                                        width: '100%',
                                        height: '44px',
                                        fontFamily: 'Gilroy',
                                        fontSize: '14px',
                                        color: isSuccessFormValid() ? '#ffffff' : '#181818',  // Change text color if needed
                                        borderRadius: '8px',
                                        backgroundColor: isSuccessFormValid() ? '#F14445' : '#F5F5F5',  // Change background color
                                        textTransform: 'unset',
                                        '&:hover': {
                                            backgroundColor: isSuccessFormValid() ? '#E13031' : '#F5F5F5',  // Change hover background color
                                        }
                                    }}
                                    onClick={handleSuccessFormClose}
                                >
                                    Confirm
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Dialog>
            </React.Fragment>
        </section>
    );
};

export default PickupLocationRegister;
