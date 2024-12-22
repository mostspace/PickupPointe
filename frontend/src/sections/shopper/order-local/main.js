import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
// @mui
import {
    Badge, Select, FormControl, Button, Grid, styled, MenuItem, Typography, InputAdornment, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField,
    Radio, RadioGroup, FormControlLabel, Box,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
// config
import { MAPBOX_API } from 'src/config-global';
// Icons
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
// Assets
import { icLocation, icTuning, searchNotFound, } from 'src/assets';
// Components
import Iconify from 'src/components/iconify';
import PickupMap from 'src/components/pickup-map';
import ShopItem from 'src/components/shop-item';
import LocationSlider from "src/components/location-slider";
import FoodCategories from "src/components/food-categories";
import LoadingProgress from "src/components/loading-screen/loading-progress";
// Reducers
import { getShopListProfile } from "src/reducers/marketSlice";
import { getShopCategories } from "src/api/shopper/settings";

// ------------------------------------------------------------------------------------------------------------------------------------------

const THEMES = {
    streets: 'mapbox://styles/mapbox/streets-v11',
    outdoors: 'mapbox://styles/mapbox/outdoors-v11',
    light: 'mapbox://styles/mapbox/light-v10',
    dark: 'mapbox://styles/mapbox/dark-v10',
    satellite: 'mapbox://styles/mapbox/satellite-v9',
    satelliteStreets: 'mapbox://styles/mapbox/satellite-streets-v11',
};
  
const baseSettings = {
    mapboxAccessToken: MAPBOX_API,
    minZoom: 1,
};

// List of categories
const searchCategories = [
    'Mom & Pops Eateries',
    'Farm Fresh & Organic',
    'Homemade',
    'Artisan Products',
    'Beauty and Skincare',
    'Unique Finds',
    'Food Trucks',
    'Pop up Events',
];

// ------------------------------------------------------------------------------------------------------------------------------------------

export default function Main() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const marketState = useSelector((state) => state.market);
    const shopList = marketState.shopList;
    const isLoading = marketState.status;
    const [shops, setShops] = useState([]);
    const [filteredShops, setFilteredShops] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [mapVisible, setMapVisible] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState(['Mom & Pops Eateries']);
    const [selectedLocation, setSelectedLocation] = useState("anywhere");
    const [timeRange, setTimeRange] = useState({ from: null, to: null });
    const [filteredCount, setFilteredCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [deliveryType, setDeliveryType] = useState('Pickup & Delivery');
    const [orderType, setOrderType] = useState('both');
    const [mile, setMile] = useState(5);
    const [latitude, setLatitude] = useState(36.3302);
    const [longitude, setLongitude] = useState(-119.2921);

    const isDesktopOrLaptop = useMediaQuery({ query: '(min-width: 1200px)' });
    const isMobile = useMediaQuery({ query: '(max-width: 1200px)' });
    
    const initialize = async () => {
        const latitude = localStorage.getItem('latitude');
        const longitude = localStorage.getItem('longitude');

        const params = {
            pickupOrDelivery: "both",
            page: 1,
            startTime: null,
            endTime: null,
            location: "anywhere",
            mile: 171,
            longitude: longitude,
            latitude: latitude
        }
        dispatch(getShopListProfile({params: params}));
        
        const categories = await getShopCategories();
        console.log("shopcategories", categories)
        setCategories(categories);
    }

    useEffect(() => {
        initialize();
    }, [])

    useEffect(() => {
        setShops(shopList.shops)
        setFilteredShops(shopList.shops)
    }, [shopList])

    useEffect(() => {
        setFilteredShops(shops.filter(product => product.delivery === deliveryType)) 
    }, [deliveryType])

    useEffect(() => {
        let filteredShops = shops;
    
        if (searchTerm) {
            filteredShops = filteredShops.filter(shop => 
                shop.name && shop.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
    
        if (selectedCategory || selectedCategory === 0) {
            console.log(selectedCategory, categories)
            const selectedCategoryId = categories?.[selectedCategory]._id;
            filteredShops = filteredShops.filter(shop => 
                shop.categories.some(category => category._id === selectedCategoryId)
            );
        }
    
        setFilteredShops(filteredShops);
    }, [searchTerm, selectedCategory]);

    // useEffect(() => {
    //     const categories = [...new Map(shops?.flatMap(shop => shop.categories).map(element => [element._id, element])).values()];
    //     setCategories(categories);
    //     console.log("categories", categories)
    // }, [shops])

    const toggleMap = () => {
        setMapVisible(!mapVisible);
    };

    const handleOrderTypeChange = (event) => {
        setOrderType(event.target.value);
    };

    const StyledMapContainer = styled('div')(({ theme }) => ({
        zIndex: 0,
        width: '100%',
        height: isMobile ? 460 : '100%',
        overflow: 'hidden',
        position: 'relative',
        borderRadius: theme.shape.borderRadius, // Default borderRadius
        [theme.breakpoints.up('lg')]: {
            borderRadius: '0 24px 24px 0', // Border radius for md and up
        },
        '& .mapboxgl-ctrl-logo, .mapboxgl-ctrl-bottom-right': {
            display: 'none',
        },
    }));

    // Function to filter products
    const filterProducts = () => {
        let filtered = shopList.shops;

        // if (selectedCategories.length > 0) {
        //     filtered = filtered.filter(product => selectedCategories.includes(product.category));
        // }
        // if (selectedLocation) {
        //     filtered = filtered.filter(product => product.location === selectedLocation);
        // }
        if (searchTerm) {
            filtered = filtered.filter(product => product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        // if (deliveryType && deliveryType !== "Pickup and delivery") {
        //     filtered = filtered.filter(product => product.delivery === deliveryType);
        // }
        return filtered;
    };

    // Add Pickup Location Modal
    const [openFilter, setOpenFilter] = React.useState(false);

    const handleFilterOpen = () => {
        setOpenFilter(true);
    };

    const handleFilterClose = () => {
        setOpenFilter(false);
    };

    const handleFilterSubmit = () => {
        const latitude = localStorage.getItem('latitude');
        const longitude = localStorage.getItem('longitude');
        const params = {
            pickupOrDelivery: orderType,
            page: 1,
            startTime: dayjs(timeRange.from),
            endTime: dayjs(timeRange.to),
            location: selectedLocation,
            mile: mile,
            longitude: longitude,
            latitude: latitude
        }
        console.log("params", params)
        dispatch(getShopListProfile({params: params}));
        handleFilterClose();
    };

    // Filtering
    const updateFilteredCount = useCallback(() => {
        const count = filterProducts()?.length;
        setFilteredCount(count);
    }, [selectedCategories, selectedLocation, timeRange, searchTerm, deliveryType]); // Add other dependencies if needed

    // Call updateFilteredCount whenever filters change
    useEffect(() => {
        updateFilteredCount();
    }, [selectedCategories, selectedLocation, timeRange, searchTerm, deliveryType]);
    
    // Toggle category selection
    const toggleCategory = (category) => {
        setSelectedCategories((prevSelected) =>
        prevSelected.includes(category)
            ? prevSelected.filter((c) => c !== category) // Deselect if already selected
            : [...prevSelected, category] // Select if not already selected
        );
    };

    // Toggle location selection
    const toggleLocation = (location) => {
        setSelectedLocation(location);
    };

    // Function to check if a category is selected
    const isSelected = (category) => selectedCategories.includes(category);

    // Function to check if a location is selected
    const isLocationSelected = (location) => selectedLocation === location;

    // Clear all selections
    const clearAllSelections = () => {
        setSelectedCategories(['Mom & Pops Eateries']);
        setSelectedLocation("anywhere");
        setTimeRange({ from: null, to: null });
        setOrderType('both')
        setMile(5)
    };

    // Styling function for category and location buttons
    const buttonStyle = (selected) => ({
        borderColor: selected ? '#F14445' : '#dce0e4', // Primary color if selected
        color: selected ? '#181818' : '#A3A3A3', // Primary color if selected
        textTransform: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        padding: '12px 16px',
        height: '45px',
        fontFamily: 'gilroy', // Ensure 'gilroy' is defined in your Tailwind config
    });

    // Location Access Modal
    const [openLocationAccess, setOpenLocationAccess] = React.useState(false);
    const handleLocationAccessOpen = () => setOpenLocationAccess(true);
    const handleLocationAccessClose = () => setOpenLocationAccess(false);

    const handleLocationAllow = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                localStorage.setItem('latitude', latitude);
                localStorage.setItem('longitude', longitude);
                setLatitude(latitude);
                setLongitude(longitude);
                initialize();
              },
              (error) => {
                console.error(`Error occurred: ${error.message}`);
                localStorage.setItem('latitude', 36.3302);
                localStorage.setItem('longitude', -119.2921);
                initialize();
              },
              {
                enableHighAccuracy: true, 
                timeout: 5000, 
                maximumAge: 0,
              }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
        handleLocationAccessClose();
    }

    useEffect(() => {
        if (mapVisible) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    localStorage.setItem('latitude', latitude);
                    localStorage.setItem('longitude', longitude);
                    setLatitude(latitude);
                    setLongitude(longitude);
                    initialize();
                  },
                  (error) => {
                    console.error(`Error occurred: ${error.message}`);
                    localStorage.setItem('latitude', 36.3302);
                    localStorage.setItem('longitude', -119.2921);
                    initialize();
                  },
                  {
                    enableHighAccuracy: true, 
                    timeout: 5000, 
                    maximumAge: 0,
                  }
                );
            } else {
                console.error("Geolocation is not supported by this browser.");
            }
        }
    }, [mapVisible])

    // useEffect to open modal on initial page load
    useEffect(() => {
        // Check local storage to see if the user has already visited
        const hasVisited = localStorage.getItem('hasVisited');
        
        if (!hasVisited) {
            handleLocationAccessOpen();  // Open the modal if user is new
            localStorage.setItem('hasVisited', true);  // Set a flag to indicate that the user has visited
        }
    }, []);  // Empty dependency array ensures this runs only on mount

    return (
        <>
            <Grid container>
                {/* <Grid item sm={12} lg={isDesktopOrLaptop && mapVisible ? 9 : 12} className="relative" sx={{padding: { xs: '16px', md: '48px' }}}> */}
                <Grid item sm={12} lg={12} className="relative" sx={{padding: { xs: '16px', md: '48px' }}}>
                    <div className="w-full h-full flex flex-col gap-[24px]">
                        <div className="w-full flex flex-col sm:flex-row gap-[16px] sm:justify-between sm:items-center">
                            <div className="w-full sm:w-fit">
                                <Typography variant="h3" className="font-gilroyMedium">Mom & Pops Eateries</Typography>
                            </div>
                            <div className="w-full sm:w-fit flex gap-[16px] items-end">
                                <Badge badgeContent={filteredCount} color="primary" className="cursor-pointer !font-gilroy">
                                    <Button onClick={handleFilterOpen}
                                        variant="outlined" 
                                        startIcon={<img src={icTuning} />}
                                        sx={{
                                            minWidth: '52px',
                                            height: '41px',
                                            padding: '0',
                                            borderColor: '#dce0e4',
                                        }}
                                    ></Button>
                                </Badge>
                                {/* <div className="flex items-end gap-[16px]">
                                    <FormControl className="w-full sm:w-auto sm:min-w-[180px]">
                                        <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Delivery</label>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            size="small"
                                            value={deliveryType}
                                            onChange={(e) => setDeliveryType(e.target.value)}
                                        >
                                            <MenuItem value={'Pickup & Delivery'} className="!text-[12px] sm:!text-[14px] !font-gilroy">Pickup and delivery</MenuItem>
                                            <MenuItem value={'Pickup'} className="!text-[12px] sm:!text-[14px] !font-gilroy">Pickup only</MenuItem>
                                            <MenuItem value={'Delivery'} className="!text-[12px] sm:!text-[14px] !font-gilroy">Delivery only</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div> */}
                                <div className="w-full sm:w-[300px] flex flex-col">
                                    <div className="flex justify-between items-center">
                                        <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Search</label>
                                        <label onClick={handleLocationAccessOpen} className='font-normal text-normal leading-[20px] text-[12px] pb-[4px] underline cursor-pointer'><PlaceOutlinedIcon className="text-[14px] mr-1" />Use my current location</label>
                                    </div>
                                    <TextField 
                                        variant="outlined"
                                        fullWidth
                                        placeholder="Search by shop name..."
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Iconify icon="eva:search-outline" className="text-[#A3A3A3]" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        onChange={(e) => setSearchTerm(e.target.value)} // Update search term
                                    />
                                </div>
                            </div>
                            {/* {isMobile && mapVisible && (
                                <StyledMapContainer>
                                    <PickupMap {...baseSettings} latitude={latitude} longitude={longitude} themes={THEMES} />
                                </StyledMapContainer>
                            )} */}
                        </div>
                        <div className="w-full mb-3">
                            <FoodCategories categories={categories} setSelectedCategory={setSelectedCategory} />
                        </div>
                        
                        <Grid container rowSpacing={2} columnSpacing={1}>
                            {isLoading !== "fulfilled" && isLoading !== "rejected" ?
                                <Box className="w-full flex justify-center items-center relative min-h-[35vh]">
                                    <LoadingProgress sx={{width: '70px'}} />
                                </Box>
                            :
                            filteredShops?.map((product, index) => (
                                // <Grid item xl={mapVisible ? 3 : 2.4} lg={mapVisible ? 4 : 3} md={4} sm={6} xs={12} key={index}
                                <Grid item xl={2.4} lg={3} md={4} sm={6} xs={12} key={index}
                                    sx={{
                                        width: "100%",
                                        animation: `fadeIn ease-in-out forwards ${index * 0.2}s`,
                                        opacity: 0,
                                    }}
                                    onClick={() => navigate(`/find-local-vendors/vendor-profile/${product._id}`)}
                                    //   onClick={() => navigate(`${product.category === 'Mom & Pops Eateries' ? `/shopper/find-local-vendors/vendor-profile/${product.shopId}` : `/shopper/find-local-vendors/vendor-profile/${product.shopId}/category` }`)}
                                >
                                    <ShopItem 
                                        shopImage={product.photo}
                                        shopLogo={product.logo}
                                        shopName={product.name}
                                        remainingTime={product.remainTime}
                                        savingRate={product.savePercent}
                                        categories={product.categories}
                                        rating={product.averageRate}
                                        delivery={product.delivery}
                                        distance={product.distance}
                                    />
                                </Grid>
                            ))}
                            
                            {(!(isLoading !== "fulfilled" && isLoading !== "rejected") && filteredShops?.length === 0) && (
                                <div className="w-full h-full flex justify-center items-center min-h-[60vh]">
                                    <div className="flex flex-col justify-center items-center gap-[24px]">
                                        <img src={searchNotFound} className="w-[214px]" loading="lazy"/>
                                        <div className="flex flex-col text-center gap-[5px]">
                                            <Typography variant="subtitle1">We couldn’t find local options in your area.</Typography>
                                            <Typography variant="subtitle3">Please check your filters and ensure you “use my current location” to refine your search.</Typography>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Grid>
                    </div>
                </Grid>

                {/* {isDesktopOrLaptop && mapVisible && (
                    <Grid item xs={12} lg={3} className="">
                        <StyledMapContainer>
                            <PickupMap {...baseSettings} themes={THEMES} longitude={longitude} latitude={latitude} />
                        </StyledMapContainer>
                    </Grid>
                )} */}
            </Grid>

            {/* Filtering shops modal */}
            <React.Fragment>
                <Dialog
                    className="w-full !font-gilroy"
                    open={openFilter}
                    onClose={handleFilterClose}
                    scroll="paper"
                    sx={{
                        width: '100% !important',
                    }}
                >
                    <DialogTitle id="" className="pt-[32px]">
                        <div className="flex justify-between items-center gap-[24px] font-gilroy sm:px-[88px] py-[16px]">
                            <Typography variant="h2">Filters</Typography>
                            <Typography
                                variant="subtitle2"
                                className="text-primary underline cursor-pointer"
                                onClick={clearAllSelections}
                            >
                                Clear All
                            </Typography>
                        </div>
                    </DialogTitle>
                    <DialogContent sx={{scrollbarWidth: 'thin'}}>
                        <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
                            <div className="flex flex-col gap-[40px] font-gilroy sm:px-[88px] py-[16px]">
                                {/* Filter by Category */}
                                <div className="w-full flex flex-col gap-[14px]">
                                    <Typography variant="h5">Filter by category</Typography>
                                    <div className="flex flex-wrap gap-[12px]">
                                        {searchCategories.map((category, index) => (
                                            <Button
                                                key={index}
                                                variant="outlined"
                                                style={buttonStyle(isSelected(category))}
                                                onClick={() => toggleCategory(category)}
                                                disabled={index !== 0}
                                            >
                                                {category}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                {/* Time-frame */}
                                <div className="w-full flex flex-col gap-[14px]">
                                    <Typography variant="h5">Order Time-frame</Typography>
                                    <FormControl>
                                        <RadioGroup
                                            row
                                            aria-label="order-type"
                                            // onChange={(e) => setOrderTypeChange("orderType", e.target.value)}
                                            onChange={handleOrderTypeChange}
                                            value={orderType}
                                        >
                                            <FormControlLabel
                                                value="pickup"
                                                control={<Radio sx={{ '&.Mui-checked': { color: '#F14445' } }} size="small" />}
                                                label={<span className="text-[14px]">Pickup</span>}
                                            />
                                            <FormControlLabel
                                                value="delivery"
                                                control={<Radio sx={{ '&.Mui-checked': { color: '#F14445' } }} size="small" />}
                                                label={<span className="text-[14px]">Delivery</span>}
                                            />
                                            <FormControlLabel
                                                value="both"
                                                control={<Radio sx={{ '&.Mui-checked': { color: '#F14445' } }} size="small" />}
                                                label={<span className="text-[14px]">All</span>}
                                            />
                                        </RadioGroup>
                                    </FormControl>
                                    <div className="flex justify-between gap-[14px]">
                                        <FormControl variant="standard" className="w-full">
                                            <Typography variant="label1">From</Typography>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <TimePicker
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            placeholder="08 : 00 AM"
                                                            id={`timeframe-textfield-from`}
                                                        />
                                                    )}
                                                    value={timeRange.from}
                                                    onChange={(newValue) =>{
                                                        setTimeRange((prev) => ({ ...prev, from: newValue }))
                                                        console.log("newValue", newValue, dayjs(newValue).format("HH:mm"))
                                                    }
                                                        
                                                    }
                                                />
                                            </LocalizationProvider>
                                        </FormControl>
                                        <FormControl variant="standard" className="w-full">
                                            <Typography variant="label1">To</Typography>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <TimePicker
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            placeholder="08 : 00 AM"
                                                            id={`timeframe-textfield-to`}
                                                        />
                                                    )}
                                                    value={timeRange.to}
                                                    onChange={(newValue) =>
                                                    setTimeRange((prev) => ({ ...prev, to: newValue }))
                                                    }
                                                />
                                            </LocalizationProvider>
                                        </FormControl>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="w-full flex flex-col gap-[14px]">
                                    <Typography variant="h5">Location</Typography>
                                    <div className="flex justify-between gap-[12px]">
                                        <Button
                                            variant="outlined"
                                            className="w-full"
                                            style={buttonStyle(isLocationSelected('local'))}
                                            onClick={() => toggleLocation('local')}
                                        >
                                            Only local
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            className="w-full"
                                            style={buttonStyle(isLocationSelected('anywhere'))}
                                            onClick={() => toggleLocation('anywhere')}
                                        >
                                            Anywhere
                                        </Button>
                                    </div>
                                    <div className="flex flex-col gap-0">
                                        <Typography variant="label">Location within miles</Typography>
                                        <LocationSlider isDisabled={selectedLocation === "anywhere"} value={mile} onChange={(event) => setMile(event.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions className="!px-[22px] !pb-[32px] sm:!pb-[64px] sm:!px-[110px] !gap-[14px]">
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
                            onClick={handleFilterClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="w-full"
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
                            },
                            }}
                            onClick={handleFilterSubmit}
                        >
                            See results
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>

            {/* Allow location modal */}
            <React.Fragment>
                <Dialog
                open={openLocationAccess}
                onClose={handleLocationAccessClose}
                >
                    <div className='flex flex-col gap-[40px] px-[25px] py-[40px] sm:px-[150px]'>
                        <div className='flex flex-col gap-[6px] items-center'>
                            <img src={icLocation} className='w-[50%]'/>
                            <h1 className='text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center mt-3'>Please allow location access for accurate results</h1>
                        </div>
                        <div className='w-full flex flex-col gap-[14px]'>
                            <Typography variant="subtitle1" className="text-[#666]">This will allow us to tailor your experience with local deals, relevant recommendations, and precise delivery options.</Typography>
                        </div>
                        <div className="flex justify-between items-center gap-[24px]">
                            <Button className="w-full"
                                sx={{
                                    padding: '8px 20px',
                                    height: '44px',
                                    fontFamily: 'Gilroy',
                                    lineHeight: '1.2',
                                    fontSize: '14px',
                                    color: '#181818',
                                    borderRadius: '8px',
                                    backgroundColor: '#F5F5F5',
                                    textTransform: 'unset',
                                }}
                                onClick={handleLocationAccessClose}
                            >
                                Skip for now
                            </Button>
                            <Button className="w-full"
                                sx={{
                                    padding: '8px 20px',
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
                                onClick={handleLocationAllow}
                            > 
                                Allow access
                            </Button>
                        </div>
                    </div>
                </Dialog>
            </React.Fragment>
        </>
    );
}