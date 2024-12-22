import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link } from 'react-router-dom';
// Icons
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import QrCode2Icon from '@mui/icons-material/QrCode2';
// Assets
import { bananaImg, kiwiImg, orangeImg, qrCodeImg, icDownload } from 'src/assets';
import { INVENTORY_CATEGORY_OPTIONS } from "src/_mock/assets";
// Components
import Pagination from 'src/components/pagination/';
import DefaultButton from "src/components/button/default-button";
import Iconify from 'src/components/iconify';
import TabPanel from "src/components/tab";
import DropdownMenu from "src/components/dropdown-menu";
import { tabProps } from "src/utils/tab-helpers";
import { StyledTableContainer } from "src/utils/table-helpers";
// @mui
import {
  Card, Table, Stack, Paper, Avatar, Select, FormControl, Button, Popover, TableContainer, TableHead, Box, Grid, Divider, styled, alpha,
  Checkbox, TableRow, Menu, MenuItem, TableBody, TableCell, Container, Typography, IconButton, TablePagination, OutlinedInput, InputAdornment,
  Tabs, Tab, useMediaQuery, useTheme, Fade, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Chip,
} from '@mui/material';

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 320,
  height: 40,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    width: 464,
    // boxShadow: theme.customShadows.z8,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
  [theme.breakpoints.down('sm')]: {
    width: '80%',
    '&.Mui-focused': {
      width: '100%',
    },
  },
}));
// ----------------------------------------------------------------------

function createData(photo, name, attribute, category, id, units, rack) {
  return { photo, name, attribute, category, id, units, rack };
}

const rows = [
  createData(<div className="flex items-center justify-center"><img src={bananaImg} className="w-[40px]" /></div>, 'Banana', 'Non GMO, +2', 'Fruits', '#7263','223', 'Rack 03, Shelf 04'),
  createData(<div className="flex items-center justify-center"><img src={kiwiImg} className="w-[40px]" /></div>, 'Kiwi', 'Non GMO, +3', 'Fruits', '#7262','123', 'Rack 03, Shelf 03'),
  createData(<div className="flex items-center justify-center"><img src={orangeImg} className="w-[40px]" /></div>, 'Orange', 'Non GMO, +1', 'Fruits', '#7261','104', 'Rack 03, Shelf 02'),
];

// Loose items in stock Table

function createDropOffsData(status, date, dropoff, receiving, type, id, units, rack, qr) {
  return { status, date, dropoff, receiving, type, id, units, rack, qr };
}

const dropOffsRows = [
  createDropOffsData(<Chip label="Pending" sx={{color: '#DD7E26', backgroundColor: 'rgba(241, 161, 68, 0.24)', borderRadius: '6px', fontFamily: 'Gilroy', fontSize: '12px', height: '25px'}} />, 'May 13, 2019', 'Jay Kaytens', '-', 'Order','DD726873', '15', <span>Rack: 03<br/>Shelf: 04</span>, <QrCode2Icon /> ),
  createDropOffsData(<Chip label="Completed" sx={{color: '#3ACC48', backgroundColor: 'rgba(58, 204, 72, 0.16)', borderRadius: '6px', fontFamily: 'Gilroy', fontSize: '12px', height: '25px'}} />, 'May 12, 2019', 'Steven Muller', 'Jack Smith', 'Loose','DD345109', '10', <span>Rack: 03<br/>Shelf: 04</span>, <QrCode2Icon /> ),
  createDropOffsData(<Chip label="Completed" sx={{color: '#3ACC48', backgroundColor: 'rgba(58, 204, 72, 0.16)', borderRadius: '6px', fontFamily: 'Gilroy', fontSize: '12px', height: '25px'}} />, 'May 10, 2019', 'Ashley Johnson', 'John Smith', 'Loose','DD343922', '10', <span>Rack: 03<br/>Shelf: 04</span>, <QrCode2Icon /> ),
];

// --------------------------------------------------------------------------------------------------

const Main = ({}) => {

  // Choose Select
  const [category, setCategory] = React.useState('1');

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };
  
  const [isDisabled, setIsDisabled] = useState(false); // Example state variable


  // Popper Menu
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  // Drop-off Popper Menu
  const [openDropoffEditMenu, setOpenDropoffEditMenu] = useState(null);

  const handleEditDropoffOpen = (event) => {
    setOpenDropoffEditMenu(event.currentTarget);
  };

  const handleEditDropoffClose = () => {
    setOpenDropoffEditMenu(null);
  };

  // Tabs
  const [value, setValue] = React.useState(1);

  const handleTabChange = (event, newValue) => {
      setValue(newValue);
  };

  // Category Dropdown Menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const categoryDropdownMenuOpen = Boolean(anchorEl);
  const handleCategoryMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCategoryMenuClose = () => {
    setAnchorEl(null);
  };

  // Add New Pickup Location Modal
  const [openOverrideInventory, setOpenOverrideInventory] = React.useState(false);

  const handleOverrideInventoryOpen = () => {
    setOpenOverrideInventory(true);
    handleCloseMenu();
  };

  const handleOverrideInventoryClose = () => {
    setOpenOverrideInventory(false);
  };

  // Override Inventory Amount
  const [productValue, setProductValue] = useState('#7263 - Banana - Non-GMO');
  
  const handleInventoryChange = (event) => {
    setProductValue(event.target.value);
  }

  // Category Sortby
  const [sortBy, setSortBy] = useState('Fruits');

  const handleSortBy = useCallback((newValue) => {
      setSortBy(newValue);
  }, []);

  // Pickup QR scanned Modal
  const [openPickupQRScanned, setOpenPickupQRScanned] = React.useState(false);

  const handlePickupQRScannedOpen = () => {
    setOpenPickupQRScanned(true);
  };

  const handlePickupQRScannedClose = () => {
    setOpenPickupQRScanned(false);
  };

  return (
    <>
      <div className="flex flex-col gap-[32px] sm:gap-[48px]">
        <div className="sm:flex justify-between">
          <h6 className="text-heading text-[16px] sm:text-[18px] font-medium capitalize mb-2 sm:mb-0">Choose active location</h6>
          <FormControl className="w-full sm:w-[464px]">
            <Select
              labelId="demo-simple-select-label"
              size="small"
              defaultValue={1}
              >
              <MenuItem value={1} className="!text-[12px] sm:!text-[14px] !font-gilroy">Store #32322 - 7384 Hayward Way #034 Laguna, CA 93453</MenuItem>
              <MenuItem value={2} className="!text-[12px] sm:!text-[14px] !font-gilroy">Store #32323 - 7384 Hayward Way #034 Laguna, CA 93453</MenuItem>
              <MenuItem value={3} className="!text-[12px] sm:!text-[14px] !font-gilroy">Store #32324 - 7384 Hayward Way #034 Laguna, CA 93453</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div className="sm:flex justify-between">
          <h6 className="text-heading text-[16px] sm:text-[18px] font-medium capitalize mb-2 sm:mb-0">Location inventory</h6>
          <StyledSearch
            placeholder="Search item#, item name or keyword..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
              </InputAdornment>
            }
            disabled={isDisabled}
          />
        </div>

        <div id="tabs" className="flex flex-col gap-[24px]">
          <div id="tab-label" className="sm:flex justify-between items-center gap-[16px]">
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className="mb-5 sm:mb-0" >
              <Tabs value={value} onChange={handleTabChange} aria-label="Input Preference">
                  <Tab label="Drop-offs" {...tabProps(0)} className="!font-gilroy !text-[14px] !normal-case" />
                  <Tab label="Loose items in stock" {...tabProps(1)} className="!font-gilroy !text-[14px] !normal-case" />
              </Tabs>
            </Box>
            <DropdownMenu title="Category:" sort={sortBy} onSort={handleSortBy} sortOptions={INVENTORY_CATEGORY_OPTIONS} />
          </div>

          <div id="tab-panel">
            <TabPanel value={value} index={0}>
              <StyledTableContainer component={Paper} className="overflow-x-auto">
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white" align="left">STATUS</TableCell>
                      <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white">DATE</TableCell>
                      <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white">DROP-OFF</TableCell>
                      <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white">RECEIVING</TableCell>
                      <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white">TYPE</TableCell>
                      <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white">ID</TableCell>
                      <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white">UNITS</TableCell>
                      <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white">RACKS</TableCell>
                      <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white">QR</TableCell>
                      <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white uppercase">
                        <IconButton><img src={icDownload} /></IconButton>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dropOffsRows.map((row) => (
                      <TableRow
                        key={row.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell align="left" className="font-gilroy text-[14px] text-heading">{row.status}</TableCell>
                        <TableCell align="left" className="font-gilroy text-[14px] text-heading" sx={{minWidth: 100}}>{row.date}</TableCell>
                        <TableCell align="left" className="font-gilroy text-[14px] text-heading">{row.dropoff}</TableCell>
                        <TableCell align="left" className="font-gilroy text-[14px] text-heading">{row.receiving}</TableCell>
                        <TableCell align="left" className="font-gilroy text-[14px] text-heading">{row.type}</TableCell>
                        <TableCell align="left" className="font-gilroy text-[14px] text-heading">{row.id}</TableCell>
                        <TableCell align="center" className="font-gilroy text-[14px] text-heading">{row.units}</TableCell>
                        <TableCell align="left" className="font-gilroy text-[14px] text-heading" sx={{minWidth: 100}}>{row.rack}</TableCell>
                        <TableCell align="center" className="font-gilroy text-[14px] text-heading" onClick={handlePickupQRScannedOpen}>{row.qr}</TableCell>
                        <TableCell align="left">
                          <div className="flex">
                            <IconButton size="large" color="inherit" onClick={handleEditDropoffOpen}>
                              <Iconify icon={'eva:more-vertical-fill'} />
                            </IconButton>
                            <IconButton size="large" color="inherit" >
                              <ArrowForwardIosIcon sx={{fontSize: '16px'}} />
                            </IconButton>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </StyledTableContainer >
            </TabPanel>

            <TabPanel value={value} index={1}>
              <StyledTableContainer component={Paper} className="overflow-x-auto">
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white">PHOTO</TableCell>
                      <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white">ITEM NAME</TableCell>
                      <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white">ATTRIBUTES</TableCell>
                      <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white">CATEGORY</TableCell>
                      <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white">ITEM ID</TableCell>
                      <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white">UNITS</TableCell>
                      <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white">RACK & SHELF</TableCell>
                      <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white uppercase">
                          <IconButton><img src={icDownload} /></IconButton>
                        </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow
                        key={row.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell align="left" className="font-gilroy text-[14px] text-heading">{row.photo}</TableCell>
                        <TableCell align="center" className="font-gilroy text-[14px] text-heading">{row.name}</TableCell>
                        <TableCell align="left" className="font-gilroy text-[14px] text-heading">{row.attribute}</TableCell>
                        <TableCell align="center" className="font-gilroy text-[14px] text-heading">{row.category}</TableCell>
                        <TableCell align="center" className="font-gilroy text-[14px] text-heading">{row.id}</TableCell>
                        <TableCell align="center" className="font-gilroy text-[14px] text-heading">{row.units}</TableCell>
                        <TableCell align="left" className="font-gilroy text-[14px] text-heading">{row.rack}</TableCell>
                        <TableCell align="left">
                          <div className="flex">
                            <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                              <Iconify icon={'eva:more-vertical-fill'} />
                            </IconButton>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </StyledTableContainer >
            </TabPanel>
          </div>
        </div>

        <div className="flex justify-center">
          <Pagination />
        </div>

        <div className="flex justify-end">   
          <Link to='/vendor/location-details/add-drop-off'>
            <DefaultButton value={'Add new drop-off'} />
          </Link>        
        </div>

        {/* Loose items in stock Popover */}
        <Popover
          open={Boolean(open)}
          anchorEl={open}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: {
              p: 1,
              width: 210,
              '& .MuiMenuItem-root': {
                px: 1,
                typography: 'body2',
                borderRadius: 0.75,
                fontFamily: 'Gilroy'
              },
            },
          }}
        >
          <MenuItem onClick={handleOverrideInventoryOpen}>
            Override inventory amount
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main', fontFamily: 'Gilroy'}}>
            Request to toss in trash
          </MenuItem>
        </Popover>

         {/* Drop-offs Popover */}
         <Popover
          open={Boolean(openDropoffEditMenu)}
          anchorEl={openDropoffEditMenu}
          onClose={handleEditDropoffClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: {
              p: 1,
              width: 210,
              '& .MuiMenuItem-root': {
                px: 1,
                typography: 'body2',
                borderRadius: 0.75,
                fontFamily: 'Gilroy'
              },
            },
          }}
        >
          <Link to="drop-off-details">
            <MenuItem onClick={handleEditDropoffClose}>
              Edit drop-off
            </MenuItem>
          </Link>
          <Divider />
          <MenuItem onClick={handleEditDropoffClose} sx={{ color: 'error.main'}}>
            Cancel drop-off
          </MenuItem>
        </Popover>

        {/* Override Inventory Modal */}
        <React.Fragment>
          <Dialog className="w-full !font-gilroy"
              open={openOverrideInventory}
              onClose={handleOverrideInventoryClose}
              scroll="paper"
              sx={{
                width: "100% !important",
              }}
          >
            <DialogTitle id="" className='pt-[32px] sm:!pt-[64px]'>
              <h1 className='text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center font-gilroy'>Override inventory amount</h1>
            </DialogTitle>
            <DialogContent dividers={scroll === 'paper'}>
              <DialogContentText
                id="scroll-dialog-description"
                tabIndex={-1}
              >
                <div className='flex flex-col gap-[14px] font-gilroy sm:px-[60px] py-[16px]'>
                  <FormControl variant="standard" className=''>
                      <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Product</label>
                      <TextField
                        size="small"
                        variant='outlined'
                        required
                        fullWidth
                        onChange={handleInventoryChange}
                        value={productValue}
                        disabled
                      />
                  </FormControl>
                  <FormControl variant="standard" className=''>
                      <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Inventory amount</label>
                      <TextField
                        type="number"
                        size="small"
                        variant='outlined'
                        required
                        fullWidth
                        placeholder='Set inventory amount'
                      />
                  </FormControl>
                  <FormControl variant="standard" className=''>
                      <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Internal note</label>
                      <TextField
                        type="number"
                        size="small"
                        variant='outlined'
                        required
                        fullWidth
                        placeholder='Leave internal note'
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
                onClick={handleOverrideInventoryClose}
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
                onClick={handleOverrideInventoryClose}
              > 
                Save Changes
              </Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>

        {/* Pickup QR scanned */}
        <React.Fragment>
          <Dialog className="w-full"
              open={openPickupQRScanned}
              onClose={handlePickupQRScannedClose}
              sx={{
              width: "100% !important",
              }}
          >
            <DialogTitle id="" className='pt-[32px] sm:!pt-[64px] flex flex-col gap-[6px] items-center'>
                <h1 className='text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center font-gilroy'>Order #DD726873 QR code</h1>
            </DialogTitle>
            <DialogContent dividers={scroll === 'paper'} className="px-[85px]">
                <DialogContentText
                id="scroll-dialog-description"
                tabIndex={-1}
                >
                <div className='flex sm:px-[92px] sm:py-[43px] justify-center bg-dark rounded-[12px] my-[32px]'>
                  <img src={qrCodeImg} className='w-auto'/>
                </div>
                </DialogContentText>
            </DialogContent>
            <DialogActions className="!px-[22px] !pb-[32px] sm:!pb-[64px] sm:!px-[80px] !gap-[14px]">
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
              onClick={handlePickupQRScannedClose}
            > 
              Confirm received
            </Button>
          </DialogActions>
          </Dialog>
        </React.Fragment>
      </div>
    </>
  )
}

export default Main;