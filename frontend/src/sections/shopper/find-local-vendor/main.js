import React, { useState, } from "react";
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';


// Icons
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';

// Assets
import { greenGardenImg, icStar, honeyBusinessImg, sourdoughImg, driedFruitImg, soapsImg, royalDeliverImg } from 'src/assets';

// Components
import Iconify from 'src/components/iconify';
import PickupMap from 'src/components/pickup-map';

// config
import { MAPBOX_API } from 'src/config-global';

// @mui
import {
  Select, FormControl, Grid, styled, MenuItem, Typography, InputAdornment, TextField,
} from '@mui/material';

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
  
// ------------------------------------------------------------------------------------------------------------------------------------------

export default function Main() {

    const [mapVisible, setMapVisible] = useState(false);

    const isDesktopOrLaptop = useMediaQuery({ query: '(min-width: 768px)' });
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    const toggleMap = () => {
        setMapVisible(!mapVisible);
    };

    const StyledMapContainer = styled('div')(({ theme }) => ({
        zIndex: 0,
        width: isMobile ? '100%' : '',
        height: isMobile ? 460 : '100%',
        overflow: 'hidden',
        position: 'relative',
        borderRadius: theme.shape.borderRadius, // Default borderRadius
        [theme.breakpoints.up('md')]: {
            borderRadius: '0 24px 24px 0', // Border radius for md and up
        },
        '& .mapboxgl-ctrl-logo, .mapboxgl-ctrl-bottom-right': {
            display: 'none',
        },
    }));

    return (
        <>
            <Grid container>
                <Grid item sm={12} lg={isDesktopOrLaptop && mapVisible ? 9 : 12} className="" sx={{padding: { xs: '16px', md: '48px' }}}>
                    <div className="flex flex-col gap-[24px]">
                        <div className="w-full flex flex-col sm:flex-row gap-[16px] justify-between items-center">
                            <div className="flex">
                                <Typography variant="h3">Vendors</Typography>
                            </div>
                            <div className="w-full flex flex-col sm:flex-row gap-[16px] sm:items-center justify-end">
                                <FormControl className="w-full sm:w-auto sm:min-w-[180px]">
                                    <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Sort by</label>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        size="small"
                                        defaultValue={1}
                                    >
                                        <MenuItem value={1} className="!text-[12px] sm:!text-[14px] !font-gilroy">Rating</MenuItem>
                                        <MenuItem value={2} className="!text-[12px] sm:!text-[14px] !font-gilroy">Distance</MenuItem>
                                        <MenuItem value={3} className="!text-[12px] sm:!text-[14px] !font-gilroy">Category</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl variant="standard" className="sm:min-w-[340px] flex">
                                    <div className="flex justify-between items-center">
                                        <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Search</label>
                                        <label onClick={toggleMap} className='font-normal text-normal leading-[20px] text-[12px] pb-[4px] underline cursor-pointer'><PlaceOutlinedIcon className="text-[14px] mr-1" />Use my current location</label>
                                    </div>
                                    <TextField className="w-full"
                                        placeholder="Search by product, vendor, or location..."
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Iconify icon="eva:search-outline" />
                                            </InputAdornment>
                                        ),
                                        }}
                                    />
                                </FormControl>
                            </div>
                            {isMobile && mapVisible && (
                                <StyledMapContainer>
                                    <PickupMap {...baseSettings} themes={THEMES} />
                                </StyledMapContainer>
                            )}
                        </div>
                        
                        <Grid container spacing={2}>
                            <Grid item xl={mapVisible ? 4 : 3} lg={4} md={6} sm={6} >
                                <Link to="vendor-profile">
                                    <div className="flex flex-col bg-[#FEFEFF] rounded-[16px] border-[#f9f9fa] shadow-[0_1px_4px_0_rgba(0,0,0,0.04)] hover:shadow-md transition duration-300 ease-in-out">
                                        <div className="flex justify-between bg-[#f8fbf5] py-[14px] px-[20px] rounded-t-[16px]">
                                            <div className="flex gap-[12px] items-center">
                                                <img src={greenGardenImg} className="w-[64px]"/>
                                                <div className="flex flex-col gap-[4px]">
                                                    <Typography variant="h6" className="capitalize">Green Garden</Typography>
                                                    <div className="flex gap-[5px]">
                                                        <img src={icStar} className="w-[18px]" />
                                                        <Typography variant="subtitle1">5.0</Typography>
                                                        <Typography variant="subtitle1" className="text-gray-400">(623)</Typography>
                                                    </div>
                                                </div>
                                            </div>   
                                        </div>
                                        <div className="flex flex-col gap-[16px] px-[24px] py-[24px]">
                                            <div className="flex flex-col gap-[6px]">
                                                <Typography variant="label">About</Typography>
                                                <Typography variant="subtitle2">Green Garden offers a wide selection of organic fruits and vegetables, ensuring the freshest produce straight from local farms to your table.</Typography>
                                            </div>
                                            <div className="flex flex-col gap-[6px]">
                                                <Typography variant="label">Location</Typography>
                                                <Typography variant="subtitle2">123 Green St, Chicago, IL 60601</Typography>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </Grid>
                            <Grid item xl={mapVisible ? 4 : 3} lg={4} md={6} sm={6} >
                                <Link to="vendor-profile">
                                    <div className="flex flex-col bg-[#FEFEFF] rounded-[16px] border-[#f9f9fa] shadow-[0_1px_4px_0_rgba(0,0,0,0.04)] hover:shadow-md transition duration-300 ease-in-out">
                                        <div className="flex justify-between bg-[#faf5f5] py-[14px] px-[20px] rounded-t-[16px]">
                                            <div className="flex gap-[12px] items-center">
                                                <img src={sourdoughImg} className="w-[64px]"/>
                                                <div className="flex flex-col gap-[4px]">
                                                    <Typography variant="h6" className="capitalize">Green Garden</Typography>
                                                    <div className="flex gap-[5px]">
                                                        <img src={icStar} className="w-[18px]" />
                                                        <Typography variant="subtitle1">5.0</Typography>
                                                        <Typography variant="subtitle1" className="text-gray-400">(623)</Typography>
                                                    </div>
                                                </div>
                                            </div>   
                                        </div>
                                        <div className="flex flex-col gap-[16px] px-[24px] py-[24px]">
                                            <div className="flex flex-col gap-[6px]">
                                                <Typography variant="label">About</Typography>
                                                <Typography variant="subtitle2">Freshly baked artisanal sourdough bread, crafted with care and the finest ingredients. Perfect for sandwiches, toasts, and more.</Typography>
                                            </div>
                                            <div className="flex flex-col gap-[6px]">
                                                <Typography variant="label">Location</Typography>
                                                <Typography variant="subtitle2">456 Dash Lane, Chicago, IL 60602</Typography>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </Grid>
                            <Grid item xl={mapVisible ? 4 : 3} lg={4} md={6} sm={6} >
                                <Link to="vendor-profile">
                                    <div className="flex flex-col bg-[#FEFEFF] rounded-[16px] border-[#f9f9fa] shadow-[0_1px_4px_0_rgba(0,0,0,0.04)] hover:shadow-md transition duration-300 ease-in-out">
                                        <div className="flex justify-between bg-[#fefdf5] py-[14px] px-[20px] rounded-t-[16px]">
                                            <div className="flex gap-[12px] items-center">
                                                <img src={honeyBusinessImg} className="w-[64px]"/>
                                                <div className="flex flex-col gap-[4px]">
                                                    <Typography variant="h6" className="capitalize">Green Garden</Typography>
                                                    <div className="flex gap-[5px]">
                                                        <img src={icStar} className="w-[18px]" />
                                                        <Typography variant="subtitle1">5.0</Typography>
                                                        <Typography variant="subtitle1" className="text-gray-400">(623)</Typography>
                                                    </div>
                                                </div>
                                            </div>   
                                        </div>
                                        <div className="flex flex-col gap-[16px] px-[24px] py-[24px]">
                                            <div className="flex flex-col gap-[6px]">
                                                <Typography variant="label">About</Typography>
                                                <Typography variant="subtitle2">Pure, locally-sourced honey from dedicated beekeepers. Ideal for sweetening your tea, baking, or enjoying by the spoonful.</Typography>
                                            </div>
                                            <div className="flex flex-col gap-[6px]">
                                                <Typography variant="label">Location</Typography>
                                                <Typography variant="subtitle2">789 Cart Ave, Chicago, IL 60603</Typography>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </Grid>
                            <Grid item xl={mapVisible ? 4 : 3} lg={4} md={6} sm={6} >
                                <Link to="vendor-profile">
                                    <div className="flex flex-col bg-[#FEFEFF] rounded-[16px] border-[#f9f9fa] shadow-[0_1px_4px_0_rgba(0,0,0,0.04)] hover:shadow-md transition duration-300 ease-in-out">
                                        <div className="flex justify-between bg-[#f8fbf5] py-[14px] px-[20px] rounded-t-[16px]">
                                            <div className="flex gap-[12px] items-center">
                                                <img src={greenGardenImg} className="w-[64px]"/>
                                                <div className="flex flex-col gap-[4px]">
                                                    <Typography variant="h6" className="capitalize">Green Garden</Typography>
                                                    <div className="flex gap-[5px]">
                                                        <img src={icStar} className="w-[18px]" />
                                                        <Typography variant="subtitle1">5.0</Typography>
                                                        <Typography variant="subtitle1" className="text-gray-400">(623)</Typography>
                                                    </div>
                                                </div>
                                            </div>   
                                        </div>
                                        <div className="flex flex-col gap-[16px] px-[24px] py-[24px]">
                                            <div className="flex flex-col gap-[6px]">
                                                <Typography variant="label">About</Typography>
                                                <Typography variant="subtitle2">Green Garden offers a wide selection of organic fruits and vegetables, ensuring the freshest produce straight from local farms to your table.</Typography>
                                            </div>
                                            <div className="flex flex-col gap-[6px]">
                                                <Typography variant="label">Location</Typography>
                                                <Typography variant="subtitle2">123 Green St, Chicago, IL 60601</Typography>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </Grid>
                            <Grid item xl={mapVisible ? 4 : 3} lg={4} md={6} sm={6} >
                                <Link to="vendor-profile">
                                    <div className="flex flex-col bg-[#FEFEFF] rounded-[16px] border-[#f9f9fa] shadow-[0_1px_4px_0_rgba(0,0,0,0.04)] hover:shadow-md transition duration-300 ease-in-out">
                                        <div className="flex justify-between bg-[#f4fcff] py-[14px] px-[20px] rounded-t-[16px]">
                                            <div className="flex gap-[12px] items-center">
                                                <img src={royalDeliverImg} className="w-[64px]"/>
                                                <div className="flex flex-col gap-[4px]">
                                                    <Typography variant="h6" className="capitalize">Green Garden</Typography>
                                                    <div className="flex gap-[5px]">
                                                        <img src={icStar} className="w-[18px]" />
                                                        <Typography variant="subtitle1">5.0</Typography>
                                                        <Typography variant="subtitle1" className="text-gray-400">(623)</Typography>
                                                    </div>
                                                </div>
                                            </div>   
                                        </div>
                                        <div className="flex flex-col gap-[16px] px-[24px] py-[24px]">
                                            <div className="flex flex-col gap-[6px]">
                                                <Typography variant="label">About</Typography>
                                                <Typography variant="subtitle2">Green Garden offers a wide selection of organic fruits and vegetables, ensuring the freshest produce straight from local farms to your table.</Typography>
                                            </div>
                                            <div className="flex flex-col gap-[6px]">
                                                <Typography variant="label">Location</Typography>
                                                <Typography variant="subtitle2">123 Green St, Chicago, IL 60601</Typography>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </Grid>
                            <Grid item xl={mapVisible ? 4 : 3} lg={4} md={6} sm={6} >
                                <Link to="vendor-profile">
                                    <div className="flex flex-col bg-[#FEFEFF] rounded-[16px] border-[#f9f9fa] shadow-[0_1px_4px_0_rgba(0,0,0,0.04)] hover:shadow-md transition duration-300 ease-in-out">
                                        <div className="flex justify-between bg-[#eef4f5] py-[14px] px-[20px] rounded-t-[16px]">
                                            <div className="flex gap-[12px] items-center">
                                                <img src={soapsImg} className="w-[64px]"/>
                                                <div className="flex flex-col gap-[4px]">
                                                    <Typography variant="h6" className="capitalize">Green Garden</Typography>
                                                    <div className="flex gap-[5px]">
                                                        <img src={icStar} className="w-[18px]" />
                                                        <Typography variant="subtitle1">5.0</Typography>
                                                        <Typography variant="subtitle1" className="text-gray-400">(623)</Typography>
                                                    </div>
                                                </div>
                                            </div>   
                                        </div>
                                        <div className="flex flex-col gap-[16px] px-[24px] py-[24px]">
                                            <div className="flex flex-col gap-[6px]">
                                                <Typography variant="label">About</Typography>
                                                <Typography variant="subtitle2">Green Garden offers a wide selection of organic fruits and vegetables, ensuring the freshest produce straight from local farms to your table.</Typography>
                                            </div>
                                            <div className="flex flex-col gap-[6px]">
                                                <Typography variant="label">Location</Typography>
                                                <Typography variant="subtitle2">123 Green St, Chicago, IL 60601</Typography>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </Grid>
                            <Grid item xl={mapVisible ? 4 : 3} lg={4} md={6} sm={6} >
                                <Link to="vendor-profile">
                                    <div className="flex flex-col bg-[#FEFEFF] rounded-[16px] border-[#f9f9fa] shadow-[0_1px_4px_0_rgba(0,0,0,0.04)] hover:shadow-md transition duration-300 ease-in-out">
                                        <div className="flex justify-between bg-[#fef7f8] py-[14px] px-[20px] rounded-t-[16px]">
                                            <div className="flex gap-[12px] items-center">
                                                <img src={driedFruitImg} className="w-[64px]"/>
                                                <div className="flex flex-col gap-[4px]">
                                                    <Typography variant="h6" className="capitalize">Green Garden</Typography>
                                                    <div className="flex gap-[5px]">
                                                        <img src={icStar} className="w-[18px]" />
                                                        <Typography variant="subtitle1">5.0</Typography>
                                                        <Typography variant="subtitle1" className="text-gray-400">(623)</Typography>
                                                    </div>
                                                </div>
                                            </div>   
                                        </div>
                                        <div className="flex flex-col gap-[16px] px-[24px] py-[24px]">
                                            <div className="flex flex-col gap-[6px]">
                                                <Typography variant="label">About</Typography>
                                                <Typography variant="subtitle2">Green Garden offers a wide selection of organic fruits and vegetables, ensuring the freshest produce straight from local farms to your table.</Typography>
                                            </div>
                                            <div className="flex flex-col gap-[6px]">
                                                <Typography variant="label">Location</Typography>
                                                <Typography variant="subtitle2">123 Green St, Chicago, IL 60601</Typography>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </Grid>
                            <Grid item xl={mapVisible ? 4 : 3} lg={4} md={6} sm={6} >
                                <Link to="vendor-profile">
                                    <div className="flex flex-col bg-[#FEFEFF] rounded-[16px] border-[#f9f9fa] shadow-[0_1px_4px_0_rgba(0,0,0,0.04)] hover:shadow-md transition duration-300 ease-in-out">
                                        <div className="flex justify-between bg-[#f4fcff] py-[14px] px-[20px] rounded-t-[16px]">
                                            <div className="flex gap-[12px] items-center">
                                                <img src={royalDeliverImg} className="w-[64px]"/>
                                                <div className="flex flex-col gap-[4px]">
                                                    <Typography variant="h6" className="capitalize">Green Garden</Typography>
                                                    <div className="flex gap-[5px]">
                                                        <img src={icStar} className="w-[18px]" />
                                                        <Typography variant="subtitle1">5.0</Typography>
                                                        <Typography variant="subtitle1" className="text-gray-400">(623)</Typography>
                                                    </div>
                                                </div>
                                            </div>   
                                        </div>
                                        <div className="flex flex-col gap-[16px] px-[24px] py-[24px]">
                                            <div className="flex flex-col gap-[6px]">
                                                <Typography variant="label">About</Typography>
                                                <Typography variant="subtitle2">Green Garden offers a wide selection of organic fruits and vegetables, ensuring the freshest produce straight from local farms to your table.</Typography>
                                            </div>
                                            <div className="flex flex-col gap-[6px]">
                                                <Typography variant="label">Location</Typography>
                                                <Typography variant="subtitle2">123 Green St, Chicago, IL 60601</Typography>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </Grid>
                        </Grid>
                    </div>
                </Grid>

                {isDesktopOrLaptop && mapVisible && (
                    <Grid item sm={12} lg={3} className="">
                        <StyledMapContainer>
                            <PickupMap {...baseSettings} themes={THEMES} />
                        </StyledMapContainer>
                    </Grid>
                )}
            </Grid>
        </>
    );
}