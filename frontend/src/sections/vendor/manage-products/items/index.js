import React, { useEffect, useRef, useState, } from "react";
import { Link, useNavigate, } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
// @mui
import {
  Table, Paper, Popover, TableRow, MenuItem, TableBody, TableCell, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography,
  TableFooter,
} from '@mui/material';
// Components
import DefaultButton from "src/components/button/default-button";
import Iconify from 'src/components/iconify';
import Scrollbar from "src/components/scrollbar";
import { StyledTableContainer, StyledPagination, CustomTableCell } from "src/utils/table-helpers";
import IOSSwitch from "src/components/ios-switch";
// Assets
import { UploadImg, icTrash, } from 'src/assets';
// Reducers
import { removeItem, selectItemsInfo, updateItem } from "src/reducers/itemSlice";
// APIs
import { getItems } from "src/api/vendor/items";

// --------------------------------------------------------------------------------------------------

const Items = ({ categories, searchKey, locations }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status } = useSelector(selectItemsInfo);
  const [items, setItems] = useState([]);
  const [userPayload, setUserPayload] = useState({
    pageSize: 10,
    page: 1,
    totalPage: 0,
  })

  const [stockChecked, setStockChecked] = useState({});

  const selectedRowRef = useRef(null);

  // Popper Menu
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event, row) => {
    setOpen(event.currentTarget);
    selectedRowRef.current = row;
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  // Delete Pickup Location Modal
  const [openDeleteItem, setOpenDeleteItem] = React.useState(false);

  const handleDeleteItemOpen = () => {
    handleCloseMenu();
    setOpenDeleteItem(true);
  };
 
  const handleDeleteItemClose = () => {
    setOpenDeleteItem(false);
  };

  const init = async (categories, locations, searchKey) => {
    try {
      const res = await getItems({
        categories,
        searchKey,
        locations,
        pageSize: userPayload.pageSize,
        page: userPayload.page
      })
      const { items, totalResults } = res
      
      const initialStatus = {};
      items.forEach(item => {
        initialStatus[item._id] = item.isInStock;
      });
      setStockChecked(initialStatus);

      setItems(items)
      setUserPayload({
        ...userPayload,
        totalPage: Math.ceil(totalResults / userPayload.pageSize)
      })
    } catch (error) {
      toast('Failed to get list items', {
        type: 'error',
        className: 'toast-custom',
      })
    }
  }

  const onChangePage = (_event, value) => {
    setUserPayload({
      ...userPayload,
      page: value
    })
  }

  useEffect(() => {
    init(categories, locations, searchKey);
  }, [categories, locations, searchKey, userPayload.page, userPayload.pageSize]);

  const handleDelete = () => {
    const selectedRow = selectedRowRef.current;

    if (selectedRow) {
      dispatch(removeItem(selectedRow._id))
        .then(() => {
          init();
          toast("Deleted successfully", {
            theme: "light",
            style: {
              backgroundColor: "white",
              color: "primary",
              fontFamily: 'Gilroy',
              fontSize: '14px'
            },
          });
        })
        .catch(() => { 
          toast("Failed to delete", {
            style: {
              backgroundColor: "red",
              color: "white",
              fontFamily: 'Gilroy',
              fontSize: '14px'
            },
          });
        });
    }
  
    handleDeleteItemClose();
  };

  const handleStockChange = async (event, itemId) => {
    setStockChecked((prev) => ({
      ...prev,
      [itemId]: event.target.checked
    }));
    const data = new FormData();
    data.append("isInStock", event.target.checked);
    try {
      const result = await dispatch(updateItem({ id: itemId, data }));
      init();
      if(event.target.checked) {
        toast("Item marked in stock", {
          type: 'success',
          className: 'toast-custom'
        });
      } else {
        toast("Item marked out of stock", {
          type: 'success',
          className: 'toast-custom'
        });
      }
    } catch (error) {
      toast(error, {
        type: 'error',
        className: 'toast-custom'
      });
    }
  }

  return (
    <>
      <div className="w-full flex flex-col gap-[48px]">
        <StyledTableContainer component={Paper} className="overflow-x-auto">
          <Table sx={{ minWidth: 650 }}>
            <TableRow>
              {[
                // { label: "Photo", align: "left" },
                { label: "Item", align: "left" },
                { label: "Price", align: "left" },
                { label: "Categories", align: "left" },
                { label: "Modifiers", align: "left" },
                { label: "In Stock (Yes/No)", align: "left" },
                { label: "", align: "left" }
              ].map((column) => (
                <TableCell
                  key={column.label}
                  align={column.align}
                  className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white uppercase"
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
            <TableBody>
              {items?.map(({ _id, photo, name, defaultPrice, categories, modifiers, isInStock }, index) => (
                <TableRow key={_id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <CustomTableCell className="min-w-[250px]">
                    <div className="flex items-center gap-[15px]">
                      <img src={photo || UploadImg} alt={name || 'Item image'} className="w-12 h-auto rounded"/>
                      <Typography variant="subtitle2">{name}</Typography>
                    </div>
                  </CustomTableCell>
                  <CustomTableCell>${defaultPrice}</CustomTableCell>
                  <CustomTableCell className="min-w-[150px]">{categories.map(elem => elem.category).join(", ")}</CustomTableCell>
                  <CustomTableCell className="min-w-[150px]">{modifiers.map(elem => elem.name).join(', ')}</CustomTableCell>
                  <CustomTableCell align="left">
                    <IOSSwitch checked={stockChecked[_id]} onChange={() => handleStockChange(event, _id)} />
                  </CustomTableCell>
                  <CustomTableCell align="left" className="pl-0">
                    <IconButton size="large" color="inherit" onClick={(e) => handleOpenMenu(e, { _id, name })}>
                      <Iconify icon={'eva:more-vertical-fill'} />
                    </IconButton>
                  </CustomTableCell>
                </TableRow>
              ))}
              {items.length === 0 && <TableRow><TableCell colSpan={6} style={{ textAlign: 'center' }} className="font-gilroy">No items created yet</TableCell></TableRow>}
              <TableRow>
                <TableCell align='right' colSpan={6}>
                  <div className='flex justify-start lg:justify-end'>
                    <StyledPagination count={userPayload.totalPage} onChange={onChangePage} showFirstButton showLastButton />
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
            {/* <TableFooter>
              <StyledPagination count={userPayload.totalPage} onChange={onChangePage} showFirstButton showLastButton />
            </TableFooter> */}
          </Table>
        </StyledTableContainer >

        <div className="flex justify-end">
          <Link to='add-new-product'>
            <DefaultButton value={'Add new item'} />
          </Link>
        </div>
      </div>

      {/* Item action popover */}
      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
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
        <MenuItem className="!font-gilroy" onClick={() => navigate(`/vendor/manage-products/product-details/${selectedRowRef.current._id}`)}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} /> Edit
        </MenuItem>
        <MenuItem className='text-primary' onClick={handleDeleteItemOpen}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} /> Delete
        </MenuItem>
      </Popover>

      {/* Item Delete Modal */}
      <React.Fragment>
        <Dialog className="w-full"
            open={openDeleteItem}
            onClose={handleDeleteItemClose}
            sx={{
              width: "100% !important",
            }}
        >
          <DialogTitle className='pt-[32px] sm:!pt-[64px] flex flex-col gap-[6px] items-center'>
            <img src={icTrash} className='w-[40%]'/>
          </DialogTitle>
          <DialogContent dividers={scroll === 'paper'}>
            <DialogContentText>
              <div className='flex flex-col gap-[14px] font-gilroy sm:px-[60px] py-[16px]'>
                <Typography variant="h3" className="text-center">Are you sure you want to delete this item?</Typography>
                <Typography variant="subtitle1" className="text-normal text-center">You won’t be able to recover it afterwards.</Typography>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions className="!px-[22px] !pb-[32px] sm:!pb-[64px] sm:!px-[80px] !gap-[14px]">
            <DefaultButton value="Cancel" className="w-full bg-[#F5F5F5] text-heading hover:bg-[#fef0f0]" onClick={handleDeleteItemClose} />
            <DefaultButton value="Delete" className="w-full" onClick={handleDelete} />
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </>
  );
}

export default Items;