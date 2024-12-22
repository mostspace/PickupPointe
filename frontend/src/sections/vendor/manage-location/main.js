import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// @mui
import {
  Popover, Box, Autocomplete, MenuItem, Typography, IconButton, Tabs, Tab, TextField, Divider, Grid,
} from "@mui/material";
// Icons
import AddCircleIcon from "@mui/icons-material/AddCircle";
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
// Components
import Pagination from "src/components/pagination/";
import TabPanel from "src/components/tab";
import LoadingProgress from "src/components/loading-screen/loading-progress";
import Iconify from "src/components/iconify/iconify.js";
import ConfirmDelete from "src/components/modal/confirm-delete";
// Hook form
import axiosInstance from "src/utils/axios";
import { BASE_URL } from "src/config-global";
import EditLocationModal from "src/components/modal/location";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import {useDispatch, useSelector} from "react-redux";
import {fetchShops} from "src/reducers/shopSlice.js";
// Utils
import { tabProps } from "src/utils/tab-helpers.js";

// ==================================================================================================================================

const LocationDetails = ({ formData }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { shops } = useSelector((state) => state.shops);

  // Pagination
  const itemsPerPage = 10;
  const [page, setPage] = React.useState(1);
  // Selected Location ID
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState({});

  // Handle Tab Change
  const [value, setValue] = React.useState(0);

  // Locations
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isOpenLocationModal, setIsOpenLocationModal] = useState(false);
  const [selectedShop, setSelectedShop] = useState("");

  // Total number of Locations
  const [totalNumberOfLocations, setTotalNumberOfLocations] = useState(0);

  // Delete Location Modal
  const [openDeleteLocationModal, setOpenDeleteLocationModal] = useState(false);
  const [openLocationsMenu, setOpenLocationsMenu] = useState(null);

  useEffect(() => {
    getLocations();
  }, []);

  useEffect(() => {
    dispatch(fetchShops());
  }, [dispatch]);

  const handlePageChange = (event, value) => {
    setPage(prev => value);
    getLocations(value);
  };

  const handleChange = (event, newValue) => setValue(newValue);

  // Fetch Locations
  const getLocations = async (currentPage = page, shop = selectedShop) => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      setIsLoading(true);
      console.log(selectedShop);
      const shopId = shop?._id || "all";
      const response = await axiosInstance.get(
        `${BASE_URL}/api/v1/location?pageSize=${itemsPerPage}&page=${currentPage}&shop=${shopId}`,
        config
      );
      setLocations(response.data.locations);
      setTotalNumberOfLocations(response.data.totalResults);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------------  Modal ------------------------------------

  const handleAddLocation = () => {
    setIsEditMode(false);
    setIsOpenLocationModal(true);
  };
  const openConfirmDeleteLocationModal = () => {
    handleLocaionsMenuClose();
    setOpenDeleteLocationModal(true);
  };
  const closeConfirmDeleteLocationModal = () => setOpenDeleteLocationModal(false);

  // ------------------------  Dropdown Menu ------------------------------------
  const handleEditLocation = () => {
    setIsEditMode(true);
    handleLocaionsMenuClose();
    setIsOpenLocationModal(true);
  };

  const handleDeleteLocation = async () => {
    closeConfirmDeleteLocationModal();
    try {
      const response = await axiosInstance.delete(
        `${BASE_URL}/api/v1/location/${selectedLocationId}`
      );
      toast("Location Deleted successfully", { type: "success", className: 'toast-custom' });
      getLocations(locations.length <= 1 ? 1 : (page === 1 ? 1 : page - 1))
      setPage(locations.length <= 1 ? 1 : (page === 1 ? 1 : page - 1))
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLocaionsMenuOpen = (event) => setOpenLocationsMenu(event.currentTarget);
  const handleLocaionsMenuClose = () => setOpenLocationsMenu(null);
  const handleLocationModalClose = () => {
    setIsOpenLocationModal(false);
    setSelectedLocation(null);
    setSelectedLocationId(null)
  }

  const handleVendorChange = (shop) => {
    setSelectedShop(shop);
    getLocations(1, shop  );
    setPage(1);
  }

  const updateLocationList = () => getLocations();

  return (
    <>
      <div id="tabs" className="w-full h-full flex flex-col gap-[24px] sm:gap-[48px]">
        <div className='w-full flex flex-col gap-[24px] sm:gap-[32px]'>
          <Grid container rowSpacing={1} alignItems="center">
            <Grid item xs={12} sm={4} lg={6}>
              <Typography variant="h6" className="capitalize">Choose shop</Typography>
            </Grid>
            <Grid item xs={12} sm={8} lg={6}>
              <Autocomplete
                disablePortal
                options={shops || []}
                getOptionLabel={(option) => option.name || ''}
                value={selectedShop}
                onChange={(event, newValue) => handleVendorChange(newValue)}
                popupIcon={<KeyboardArrowDownOutlinedIcon />}
                noOptionsText="No shops"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Choose a shop"
                    className="line-clamp-1"
                  />
                )}
              />
            </Grid>
          </Grid>
        </div>

        <div className="flex flex-col gap-[16px]">
          <div id="tab-label" className="flex justify-between items-center gap-[16px]">
            {/* <Typography variant="h5" className="capitalize">Location details</Typography> */}
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs value={value} onChange={handleChange} aria-label="Location details">
                {/* <Tab label="Pickup Pointe Location(s)" {...tabProps(0)} className="!font-gilroy !text-[14px] !text-disabled !normal-case px-2 ss:px-3" /> */}
                <Tab
                  label="My Location(s)"
                  {...tabProps(0)}
                  className="!font-gilroy !text-[14px] !text-heading !normal-case px-2 ss:px-3"
                />
              </Tabs>
            </Box>
            <IconButton onClick={handleAddLocation}>
              <AddCircleIcon className="cursor-pointer text-[#aeaeae] text-[26px] hover:text-normal" />
            </IconButton>
          </div>

          <div id="tab-panel" className='flex-1'>
            <TabPanel value={value} index={0}>
              <div className="flex flex-col gap-[24px]">
                {/* <div className="flex justify-between items-center gap-[24px]">
                  <Autocomplete
                    className="w-full sm:w-1/2"
                    disablePortal
                    options={shops || []}
                    getOptionLabel={(option) => option.name || ''}
                    value={selectedShop}
                    onChange={(event, newValue) => handleVendorChange(newValue)}
                    popupIcon={<KeyboardArrowDownOutlinedIcon />}
                    noOptionsText="No shops"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Choose a shop"
                        className="line-clamp-1"
                      />
                    )}
                  />
                  <IconButton onClick={handleAddLocation}>
                    <AddCircleIcon className="cursor-pointer text-[#aeaeae] text-[26px] hover:text-normal" />
                  </IconButton>
                </div> */}

                <div className="flex flex-col gap-[16px] font-gilroy">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center min-h-[35vh]">
                      <LoadingProgress sx={{ width: '50px' }} />
                    </div>
                  ) : (
                    locations && locations.length > 0 ? (
                      locations.map((location, index) => {
                        const {street, city, state, countryCode, zipCode} = location.address;
                        const locationAddress = `${street}, ${city}, ${state}, ${countryCode}, ${zipCode}`;
                        return (
                          <div
                            key={index}
                            className="flex px-[12px] py-[16px] justify-between items-center gap-12px self-stretch rounded-[12px] border border-[rgba(0, 0, 0, 0.08)] bg-white"
                          >
                            <div className="flex flex-col items-start gap-[2px]">
                              <p className="text-[16px] font-normal leading-[25px] text-heading">
                                {location.name}
                              </p>
                              <p className="text-[14px] font-normal leading-[22px] text-normal">
                                {locationAddress}
                              </p>
                            </div>
                            <IconButton
                              onClick={(e) => {
                                if (location && location._id) {
                                  setSelectedLocationId(location._id);
                                  setSelectedLocation(location);
                                  handleLocaionsMenuOpen(e);
                                }
                              }}
                            >
                              <MoreVertOutlinedIcon
                                sx={{ color: "#181818", fontSize: "22px" }}
                              />
                            </IconButton>
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex flex-col items-center justify-center min-h-[35vh]">
                        <Typography variant="subtitle3" className="text-center">No Location Added</Typography>
                      </div>
                    )
                  )}
                  {(locations && !isLoading) && (
                    <Box display="flex" justifyContent="space-between" alignItems="center" padding={0} className="mt-2">
                      <Typography variant="subtitle1">
                        Location(s): {totalNumberOfLocations}
                      </Typography>
                      <Pagination count={totalNumberOfLocations} page={page} handleChange={handlePageChange} itemsPerPage={itemsPerPage} />
                    </Box>
                  )}
                </div>
              </div>
            </TabPanel>
          </div>
        </div>
      </div>

      {/* Handle My Locations Menu */}
      <Popover
        open={Boolean(openLocationsMenu)}
        anchorEl={openLocationsMenu}
        onClose={handleLocaionsMenuClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem className="!font-gilroy" onClick={handleEditLocation}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} /> Edit
        </MenuItem>
        <MenuItem className='text-primary' onClick={openConfirmDeleteLocationModal}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} /> Delete
        </MenuItem>
      </Popover>

      {/* Add / Edit Location Modal */}
      <React.Fragment>
        <EditLocationModal
          isOpen={isOpenLocationModal}
          onClose={handleLocationModalClose}
          isEditMode={isEditMode}
          location={selectedLocation}
          onSaveSuccess={updateLocationList}
        />
      </React.Fragment>

      {/* Delete Location Modal */}
      <React.Fragment>
        <ConfirmDelete
          confirmMsg={"Are you sure you want to delete this location?"}
          description={"You won’t be able to recover it afterwards."}
          isOpen={openDeleteLocationModal}
          onClose={closeConfirmDeleteLocationModal}
          onConfirm={handleDeleteLocation}/>
      </React.Fragment>
    </>
  );
};

export default LocationDetails;