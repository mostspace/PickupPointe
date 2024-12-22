import React from "react";
import { Link } from 'react-router-dom';
// @mui
import {
  Table, Button, TableContainer, TableHead, Box, styled, TableRow, TableBody, TableCell, Typography, IconButton, 
} from '@mui/material';
// Icons
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
// Assets
import { pickData } from 'src/_mock/assets';

// ----------------------------------------------------------------------

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  overflowX: 'auto', // Enable vertical scrolling
  scrollBehavior: 'smooth',
  scrollbarWidth: 'thin',
}));

const OrderTable = ({ order }) => {
  return (
    <div className="w-full bg-[#f6f6f6] rounded-[12px] p-[16px]">
      <Typography variant="h5" className="pl-[16px] pb-[8px]">Order {order.header.number}</Typography>
      <StyledTableContainer className="overflow-x-auto">
        <Table sx={{ minWidth: 650 }} aria-label="Dropoff Order Details Table" className="">
          <TableHead>
            <TableRow>
              <TableCell align="center" className="border-b-[1px] border-[#ebebeb] p-0">
                <div className="flex flex-col items-start p-[16px]">
                  <Typography variant="label" className="uppercase">ID</Typography>
                </div>
              </TableCell>
              <TableCell align="center" className="border-b-[1px] border-[#ebebeb] p-0">
                <div className="flex flex-col items-start p-[16px]">
                  <Typography variant="label" className="uppercase">item name</Typography>
                </div>
              </TableCell>
              <TableCell align="center" className="border-b-[1px] border-[#ebebeb] p-0">
                <div className="flex flex-col items-start p-[16px]">
                  <Typography variant="label" className="uppercase">stock</Typography>
                </div>
              </TableCell>
              <TableCell align="center" className="border-b-[1px] border-[#ebebeb] p-0">
                <div className="flex flex-col items-start p-[16px]">
                  <Typography variant="label" className="uppercase">units</Typography>
                </div>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.content.map((row, index) => (
              <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                <TableCell align="left" className="font-gilroy text-[12px] text-heading">{row.number}</TableCell>
                <TableCell align="left" className="font-gilroy text-[12px] text-heading">{row.name}</TableCell>
                <TableCell align="left" className="font-gilroy text-[12px] text-heading">{row.stock}</TableCell>
                <TableCell align="left" className="font-gilroy text-[12px] text-heading">{row.units}</TableCell>
              </TableRow>
            ))}
            <Box/>
            <TableRow className="border-t">
              <TableCell align="left"><Typography variant="text1">Total units:</Typography></TableCell>
              <TableCell align="left"></TableCell>
              <TableCell align="left"></TableCell>
              <TableCell align="left"><Typography variant="text1">{order.header.price}</Typography></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </StyledTableContainer>
    </div>
  )
}

// --------------------------------------------------------------------------------------------------

const PickListView = () => {

  return (
    <div className="w-full flex justify-center relative">
      <Link to="/vendor/manage-orders">
        <IconButton className='absolute right-0 bg-secondary'><CloseOutlinedIcon sx={{color: "#181818", fontSize:"20px"}} /></IconButton>
      </Link>
      <div className="w-full flex flex-col items-center gap-[40px] max-w-[688px]">
        <div className="w-full flex flex-col gap-[16px]">
          <Typography variant="h2" className="text-center">Picklist</Typography>
          <div className="flex flex-col sm:flex-row gap-[16px] justify-between">
            <Typography variant="subtitle1">Creation date: May, 30, 2024</Typography>
            <Typography variant="subtitle1">Total orders in report: 3</Typography>
          </div>
        </div>
        <div className="w-full flex flex-col gap-[16px]">
          {pickData.map((order, index) => (
            <OrderTable key={index} order={order} />
          ))}
        </div>
        <div className="flex gap-[16px] items-center">
          <Link to="/vendor/manage-orders">
            <Button
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
              Cancel
            </Button>
          </Link>
          <Button
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
            Export
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PickListView;