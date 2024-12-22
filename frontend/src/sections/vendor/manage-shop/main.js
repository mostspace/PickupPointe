import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
// @mui
import {
  IconButton, Typography, FormControlLabel, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button,
} from "@mui/material";
// Components
import StyledMenu from "src/components/menu";
import IOSSwitch from "src/components/ios-switch";
import Pagination from "src/components/pagination/";
import LoadingProgress from "src/components/loading-screen/loading-progress";
// Hook form
import { FormProvider } from "react-hook-form";
// Icons
import { AddCircle, MoreVert } from "@mui/icons-material";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { deleteShop, getShops, updateShop } from "src/api/vendor/shops";

const Main = () => {
  const navigate = useNavigate();

  const [isLive, setIsLive] = useState(false);
  const [shopId, setShopId] = useState("");
  const [shops, setShops] = useState([]);
  const [page, setPage] = React.useState(1);
  const itemsPerPage = 10;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    initState();
  }, [])

  const initState = async () => {
    setIsLoading(true);
    try {
      const shopList = await getShops();
      setShops(shopList.shops);
    } catch (error) {
      toast("Failed to obtain shop details", {type: "error", className: 'toast-custom'})
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (event, value) => {
    setPage(value);
  };

  const handleShopActive = async (newValue, index, shopId) => {
    const newShops = [...shops]
    newShops[index].isActive = newValue
    const formData = new FormData();
    formData.append("isActive", newValue);
    await updateShop(shopId, formData);
    setShops(newShops)

    // Handle change status toast
    if (newValue) {
      toast(newShops[index].name + " shop activated", { type: "success", className: 'toast-custom' });
    } else {
      toast(newShops[index].name + " shop deactivated", { type: "success", className: 'toast-custom' });
    }
  }

  // Shop popover
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handlePopoverClick = (event, shopId) => {
    setShopId(shopId);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  // Deactive Shop Modal
  const [openDeactiveShopModal, setOpenDeactiveShopModal] = React.useState(false);

  const handleDeactiveShopModalOpen = (isLive, id) => {
    setIsLive(isLive);
    setShopId(id);
    handleClose();
    setOpenDeactiveShopModal(true);
  };
 
  const handleShopActivation = async () => {
    const formData = new FormData();
    formData.append("isLive", !isLive);
    await updateShop(shopId, formData);
    handleDeactiveShopModalClose();
  }
 
  const handleDeactiveShopModalClose = () => {
    setOpenDeactiveShopModal(false);
  };

  // Delete Shop Modal
  const [openDeleteShopModal, setOpenDeleteShopModal] = React.useState(false);
  const handleDeleteShopModalOpen = (id) => {
    handleClose();
    setOpenDeleteShopModal(true);
  };
  const handleDeleteShopModalClose = () => setOpenDeleteShopModal(false);
  const handleDeleteShop = async () => {
    await deleteShop(shopId);
    toast("Shop deleted", { type: "success", className: 'toast-custom' });
    initState();
    handleDeleteShopModalClose();
  }

  const displayedShops = shops.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <>
      <FormProvider >
        <div id="tabs" className="w-full h-full flex flex-col gap-[48px]">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-[24px] sm:gap-0">
            <Typography variant="h5" className="capitalize">
              View Shop
            </Typography>
          </div>

          <div className="w-full h-full flex flex-col gap-[32px]">
            <div className="flex justify-between items-end">
              <Typography variant="h6" className="">
                My Shop(s): {shops.length}
              </Typography>
              <IconButton onClick={() => navigate("add-new-shop")}>
                <AddCircle className="text-[#aeaeae] text-[26px] hover:text-normal"/>
              </IconButton>
            </div>
            <div className="w-full h-full flex flex-col gap-[16px]">
              {isLoading ? (
                <div className="w-full h-full flex justify-center items-center relative">
                  <LoadingProgress sx={{ width: '50px', marginTop: '-150px' }} />
                </div>
              ) : (
                displayedShops && displayedShops.length > 0 ? (
                  displayedShops.map((shop, index) => {
                    return (
                      <div key={shop._id} className="flex flex-col gap-[12px] xs:flex-row px-[16px] py-[16px] justify-between xs:items-center rounded-[12px] border transition duration-300 ease-in-out hover:shadow-sm">
                        <div className="flex flex-col items-start gap-[2px] flex-[4]">
                          <p className="text-[16px] font-normal leading-[25px] text-heading">
                            {shop.name}
                          </p>
                          <p className="text-[14px] font-normal leading-[22px] text-normal">
                            {shop.locations[0] && shop.locations[0].address.city}
                          </p>
                        </div>
                        <div className="flex flex-col items-start gap-[2px] flex-[2]">
                          <p className="text-[16px] text-center font-normal leading-[25px] text-heading">
                            {shop.locations.length} Locations
                          </p>
                        </div>
                        <div className="flex flex-[2] items-center justify-between">
                          <FormControlLabel
                            className="ml-0 w-[110px]"
                            control={<IOSSwitch sx={{ mr: 1 }} defaultChecked={shop.isActive} onChange={(e) => handleShopActive(e.target.checked, index, shop._id)} />}
                            label={<Typography variant="subtitle1">{shop.isActive ? 'Active ' : 'Inactive'}</Typography>}
                            labelPlacement="end"
                          />
                          <div className="flex items-center gap-[5px]">
                            <IconButton onClick={(event) => handlePopoverClick(event, shop._id)}>
                              <MoreVert className="text-[20px] text-heading" />
                            </IconButton>
                            <StyledMenu
                              anchorEl={anchorEl}
                              open={open}
                              onClose={handleClose}
                              className="min-w-[133px]"
                            >
                              <MenuItem onClick={() => navigate(`${shopId}/edit-shop-details`, { state: shops.find(item => item._id === shopId) })} className="!font-gilroy !text-[14px] !text-heading !font-normal !leading-[22px]">
                                Edit shop
                              </MenuItem>
                              <MenuItem onClick={() => handleDeleteShopModalOpen(shop._id)} className="!font-gilroy !text-[14px] !text-primary !font-normal !leading-[22px]">
                                Delete shop
                              </MenuItem>
                            </StyledMenu>
                            <IconButton onClick={() => navigate(`/vendor/manage-shop/${shop._id}`, { state: { shop } })}>
                              <ArrowForwardIosIcon className="text-heading text-[16px]" />
                            </IconButton>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center min-h-[35vh]">
                    <Typography variant="subtitle3" className="text-center">No Shop Added</Typography>
                  </div>
                )
              )}

              {(displayedShops && !isLoading) && (
                <div className="flex justify-center mt-[32px]">
                  <Pagination count={shops.length} page={page} handleChange={handleChange} itemsPerPage={itemsPerPage} />
                </div>
              )}
            </div>
          </div>
        </div>
      </FormProvider>

      {/* Deactive Shop Modal */}
      <React.Fragment>
        <Dialog className="w-full"
          open={openDeactiveShopModal}
          onClose={handleDeactiveShopModalClose}
          sx={{
            width: "100% !important",
          }}
        >
          <DialogTitle id="" className='pt-[32px] sm:!pt-[64px] flex flex-col gap-[6px] items-center'>
            <h1 className='text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center font-gilroy'>{!isLive ? "Activate shop" : "Deactivate shop"}</h1>
          </DialogTitle>
          <DialogContent dividers={scroll === 'paper'}>
            <DialogContentText
              id="scroll-dialog-description"
              tabIndex={-1}
            >
              <div className='flex flex-col gap-[14px] font-gilroy sm:px-[60px] py-[16px]'>
                <p className='text-normal font-light leading-[25px] text-[16px] text-center'>Are you sure? By deactivating this shop, any live listings will be delisted from the Pickup Pointe marketplace.</p>
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
              onClick={handleDeactiveShopModalClose}
            >
              Cancel
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
              onClick={handleShopActivation}
            > 
              {!isLive ? "Activate" : "Deactivate"}
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>

      {/* Delete Shop Modal */}
      <React.Fragment>
        <Dialog className="w-full"
          open={openDeleteShopModal}
          onClose={handleDeleteShopModalClose}
          sx={{
            width: "100% !important",
          }}
        >
          <DialogTitle id="" className='pt-[32px] sm:!pt-[64px] flex flex-col gap-[6px] items-center'>
            <h1 className='text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center font-gilroy'>Delete shop</h1>
          </DialogTitle>
          <DialogContent dividers={scroll === 'paper'}>
            <DialogContentText
              id="scroll-dialog-description"
              tabIndex={-1}
            >
              <div className='flex flex-col gap-[14px] font-gilroy sm:px-[60px] py-[16px]'>
                <p className='text-normal font-light leading-[25px] text-[16px] text-center'>Are you sure? By deleting this shop, any live listings will be delisted from the Pickup Pointe marketplace, all locations will be unassigned, and all shop data will be deleted.</p>
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
              onClick={handleDeleteShopModalClose}
            >
              Cancel
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
              onClick={handleDeleteShop}
            > 
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </>
  );
};

export default Main;