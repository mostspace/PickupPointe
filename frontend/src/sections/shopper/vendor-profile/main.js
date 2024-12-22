import React, { useEffect, useState  } from "react";
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { useDispatch, useSelector } from "react-redux";
// Components
import DefaultButton from "src/components/button/default-button";
import ShopItem from "src/components/shop-item";
import TabPanel from "src/components/tab";
import LoadingProgress from "src/components/loading-screen/loading-progress";
import { getLocationAddress } from "src/components/choose-location-select";
// Icons
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
// @mui
import {
    Grid, IconButton, Typography, Box, Dialog, Tabs, Tab, Autocomplete, TextField,
    Collapse,
} from '@mui/material';
// Assets
import { icFacebook, icInstagram, icTwitter, icYoutube, icMapPointe, icDelivery, } from 'src/assets';
// Redux
import { getShopProfile, setSelectedLocationId } from "src/reducers/marketSlice";
// Utils
import { formattedNumber } from "src/utils/utilityFunctions";
import { tabProps } from "src/utils/tab-helpers";

// ------------------------------------------------------------------------------------------------------------------------------------------

export default function Main({children}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const handleBack = () => {
        navigate(-1);
    };

    const isMobile = useMediaQuery({ query: '(min-width: 600px)' });

    // Check if there is meaningful navigation history
    const shouldShowBackButton = !!window.history.state?.idx;
    
    const authState = useSelector((state) => state.auth);

    const marketState = useSelector((state) => state.market);
    const vendorProfile = marketState.shop;
    const isLoading = marketState.status;

    const shopId = useParams().id;
    const [selectedLocation, setSelectedLocation] = useState({});

    useEffect(() => {
        const latitude = localStorage.getItem('latitude');
        const longitude = localStorage.getItem('longitude');

        dispatch(getShopProfile({shopId: shopId, longitude: longitude, latitude: latitude}));
    }, [dispatch, shopId])

    useEffect(() => {
        const firstLocation = vendorProfile.locations?.reduce((closest, current) => {
            return current.distance < (closest?.distance ?? Infinity) ? current : closest;
        }, null);

        setSelectedOptions({
          _id: firstLocation?._id || null, 
          label: firstLocation ? getLocationAddress(firstLocation) : "",
        })
    }, [vendorProfile]);

    // Handle Tab Change
    const [tabValue, setTabValue] = React.useState(0);
    const handleTabChange = (event, newValue) => setTabValue(newValue);    

    // Manage product detail expansion
    const [isExpanded, setIsExpanded] = useState(isMobile);
    const handleMoreProductDetail = () => setIsExpanded(!isExpanded);

    // Join and Save Modal
    const [openJoinAndSave, setOpenJoinAndSave] = useState(false);
    const handleJoinAndSaveOpen = () => {
        const modalShown = localStorage.getItem('modalShown');
        // If modal has not been shown, open it
        if (!modalShown && !authState.user) {
            setOpenJoinAndSave(true);
        } else {
            navigate(`/find-local-vendors/vendor-profile/${shopId}/make-order`, {state: {shop: vendorProfile, locationId: selectedOptions._id}});
        }
    };

    const handleJoinAndSaveClose = () => setOpenJoinAndSave(false);
    const handleContinueAsGuest = () => {
        localStorage.setItem('modalShown', 'true');
        navigate(`/find-local-vendors/vendor-profile/${shopId}/make-order`, {state: {shop: vendorProfile, locationId: selectedOptions._id}});
        setOpenJoinAndSave(false);
    };

    // Choose location
    const [selectedOptions, setSelectedOptions] = useState(() => {
        const closestLocation = vendorProfile.locations?.reduce((closest, current) => {
            return current.distance < (closest?.distance ?? Infinity) ? current : closest;
        }, null);
    
        return {
            _id: closestLocation?._id || null, 
            label: closestLocation ? getLocationAddress(closestLocation) : "",
        };
    });

    const handleSelectionChange = (event, newValue) => setSelectedOptions(newValue);

    useEffect(() => {
        dispatch(setSelectedLocationId(selectedOptions._id));
        const location = vendorProfile.locations?.find(location => location._id == selectedOptions._id)
        setSelectedLocation(location)
    }, [selectedOptions])

    return (
        <>
            {isLoading !== "fulfilled" ? <Box className="w-full h-full flex justify-center items-center relative"><LoadingProgress sx={{width: '70px', marginTop: '-100px'}} /></Box> :
                <div className="w-full flex flex-col gap-[32px] relative">
                    <div className={`flex items-center ${shouldShowBackButton ? 'justify-between' : 'justify-end'}`}>
                        {shouldShowBackButton && (
                            <IconButton onClick={handleBack}>
                                <KeyboardBackspaceIcon className="text-[28px] text-heading" />
                            </IconButton>
                        )}
                        <DefaultButton value="Make order" onClick={handleJoinAndSaveOpen} />
                    </div>

                    <Grid container rowSpacing={{ xs: 1, sm: 2, md: 8 }} columnSpacing={{ xs: 1, sm: 2, md: 8 }} justifyContent={"space-between"}>
                        <Grid item md={4} sm={12} xs={12}>
                            <div className="flex flex-col gap-[32px]">
                                <div className="flex flex-col gap-[24px]">
                                    {vendorProfile && (
                                        <ShopItem 
                                            shopImage={vendorProfile.photo}
                                            shopLogo={vendorProfile.logo}
                                            shopName={vendorProfile.name}
                                            remainingTime={selectedLocation?.remainingTime}
                                            savingRate={vendorProfile.savePercent}
                                            categories={vendorProfile.categories}
                                            rating={vendorProfile.averageRate}
                                            delivery={selectedLocation?.deliveryType}
                                            distance={selectedLocation?.distance}
                                        />
                                    )}

                                    <div className="flex flex-col gap-[6px]">
                                        <div id="tabs" className="flex flex-col gap-[16px]">
                                            <div id="tab-label" className="flex sm:items-center justify-between gap-[24px] sm:gap-0">
                                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                                    <Tabs value={tabValue} onChange={handleTabChange}>
                                                        <Tab label="Delivery" {...tabProps(0)} className="!font-gilroy !text-[14px] !text-disabled !normal-case px-2 ss:px-3" />
                                                        <Tab label="Pickup" {...tabProps(1)} className="!font-gilroy !text-[14px] !text-heading !normal-case px-2 ss:px-3" />
                                                    </Tabs>
                                                </Box>

                                                <IconButton onClick={handleMoreProductDetail} className="p-1">
                                                    <KeyboardArrowUpOutlinedIcon className={`text-[28px] text-heading ${isExpanded ? 'rotate-180' : ''}`} />
                                                </IconButton>
                                            </div>

                                            <div id="tab-panel">
                                                <TabPanel value={tabValue} index={0}>
                                                    <div className='flex flex-wrap gap-[12px] items-center'>
                                                        <div className='flex items-center gap-[6px]'>
                                                            <img src={icMapPointe} className='w-[16px]' alt="Map Pointer Icon" />
                                                            <Typography variant='text1'>Distance: {formattedNumber(selectedLocation?.distance)} miles</Typography>
                                                        </div>
                                                        <div className='flex items-center gap-[6px]'>
                                                            <img src={icDelivery} className='w-[16px]' alt="Delivery Icon" />
                                                            <Typography variant='text1'>Delivery time: {selectedLocation?.deliveryTime ?? 0} {selectedLocation?.deliveryTime === "Exceeded distance" ? "" : "min"}</Typography>
                                                        </div>
                                                    </div>
                                                </TabPanel>

                                                <TabPanel value={tabValue} index={1}>
                                                    <div className='flex flex-wrap gap-[12px] items-center'>
                                                        <div className='flex items-center gap-[6px]'>
                                                            <img src={icMapPointe} className='w-[16px]' alt="Map Pointer Icon" />
                                                            <Typography variant='text1'>Distance: {formattedNumber(selectedLocation?.distance)} miles</Typography>
                                                        </div>
                                                        <div className='flex items-center gap-[6px]'>
                                                            <img src={icDelivery} className='w-[16px]' alt="Delivery Icon" />
                                                            <Typography variant='text1'>Pickup time: {selectedLocation?.pickupTime ?? 0} {selectedLocation?.pickupTime === "Exceeded distance" ? "" : "min"}</Typography>
                                                        </div>
                                                    </div>
                                                </TabPanel>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col gap-[24px] sm:gap-[32px]">
                                    <div className="flex flex-col gap-[6px]">
                                        <Typography variant="subtitle3" className="text-gray-400">Order location</Typography>
                                        <Autocomplete
                                            disablePortal
                                            disableClearable
                                            options={vendorProfile.locations?.map(location => ({"_id": location._id, "label": getLocationAddress(location)}))}
                                            value={selectedOptions?.label}
                                            onChange={handleSelectionChange}
                                            popupIcon={<KeyboardArrowDownOutlinedIcon />}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    placeholder='Choose Location'
                                                    className="line-clamp-1"
                                                />
                                            )}
                                        />
                                    </div>
                                    <Collapse in={isExpanded}>
                                        <div className="flex flex-col gap-[24px] sm:gap-[32px] pb-[32px]">
                                            <div className="flex flex-col gap-[6px]">
                                                <Typography variant="subtitle3" className="text-gray-400">About Us</Typography>
                                                {vendorProfile.aboutUs ? (
                                                    <Typography variant="subtitle2">{vendorProfile.aboutUs}</Typography>
                                                ) : (
                                                    <Typography variant="subtitle3">No data</Typography>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-[6px]">
                                                <Typography variant="subtitle3" className="text-gray-400">Location</Typography>
                                                {vendorProfile.locations ? (
                                                    vendorProfile.locations.map((location) => <Typography variant="subtitle2">{getLocationAddress(location)}</Typography>)
                                                ) : (
                                                    <Typography variant="subtitle3">No location</Typography>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-[6px]">
                                                <Typography variant="subtitle3" className="text-gray-400">Links</Typography>
                                                {vendorProfile.website ? (
                                                    <Link to={`/${vendorProfile.website}`}>
                                                        <Typography variant="subtitle2" className="underline">
                                                            {vendorProfile.website}
                                                        </Typography>
                                                    </Link>
                                                ) : (
                                                    <Typography variant="subtitle3">No website</Typography>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-[6px]">
                                                <Typography variant="subtitle3" className="text-gray-400">Follow Us</Typography>
                                                <div className="flex gap-[12px] items-center">
                                                    <Link><IconButton className="p-0"><img src={icFacebook} className="w-[24px]" alt="Facebook" /></IconButton></Link>
                                                    <Link><IconButton className="p-0"><img src={icInstagram} className="w-[24px]" alt="Instagram" /></IconButton></Link>
                                                    <Link><IconButton className="p-0"><img src={icTwitter} className="w-[24px]" alt="Twitter" /></IconButton></Link>
                                                    <Link><IconButton className="p-0"><img src={icYoutube} className="w-[24px]" alt="YouTube" /></IconButton></Link>
                                                </div>
                                            </div>
                                        </div>
                                    </Collapse>
                                </div>
                            </div>
                        </Grid>
                        <Grid item md={8} sm={12} xs={12}>
                            {children}
                        </Grid>
                    </Grid>
                </div>
            }

            {/* Join & Save Modal */}
            <React.Fragment>
                <Dialog
                    open={openJoinAndSave}
                    onClose={handleJoinAndSaveClose}
                >
                    <div className='flex flex-col gap-[32px] px-[25px] py-[40px] sm:px-[75px]'>
                        <div className='flex flex-col gap-[6px] items-center'>
                            <Typography variant="h4">Join and Save</Typography>
                        </div>
                        <div className='w-full flex flex-col gap-[14px]'>
                            <Typography variant="subtitle1" className="text-[#666] text-center">Create an account to track your orders,<br/> save your details, and enjoy exclusive offers.</Typography>
                        </div>
                        <div className="flex justify-between items-center gap-[24px]">
                            <DefaultButton 
                                onClick={handleContinueAsGuest}
                                value={'Continue as guest'} 
                                className="w-full bg-[#F5F5F5] text-heading hover:bg-[#fef0f0]"
                            />
                            <DefaultButton value="Sign Up" onClick={() => navigate('/register')} className="w-full" />
                        </div>
                        <Typography variant="subtitle2" className="text-center">Already have an accout? <Link to="/login" className="underline hover:text-primary hover:font-semibold"> Login here</Link></Typography>
                    </div>
                </Dialog>
            </React.Fragment>
        </>
    )
}