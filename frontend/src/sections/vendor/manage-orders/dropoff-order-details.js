import React from "react";
import { Link } from 'react-router-dom';
// Icons
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import QrCode2Icon from '@mui/icons-material/QrCode2';
// Assets
import { bananaImg, kiwiImg } from 'src/assets';
// Components
import DefaultButton from "src/components/button/default-button";
import { StyledTableContainer } from "src/utils/table-helpers";
// @mui
import {
  Table, Paper, TableHead, TableRow, TableBody, TableCell, Chip,
} from '@mui/material';

// --------------------------------------------------------------------------------------------------

// Awaiting Drop-Off Tab
function createDropOffsData(status, pickup_date, contact, location, units, qr) {
  return { status, pickup_date, contact, location, units, qr };
}
const awaitingDropOff = [
  createDropOffsData(<Chip label="Pending" sx={{color: '#DD7E26', backgroundColor: 'rgba(241, 161, 68, 0.24)', borderRadius: '6px', fontFamily: 'Gilroy', fontSize: '12px', height: '25px'}} />, 'May 13, 2019', 'lorabrown@gmail.com', 'Pickup Pointe Store #32322', '15', <QrCode2Icon /> ),
];

// Awaiting Pickup Tab
function createData(photo, name, attribute, id, units) {
    return { photo, name, attribute, id, units };
}

const awaitingPickup = [
    createData(<div className="flex items-center justify-center"><img src={bananaImg} className="w-[40px] mix-blend-darken"/></div>, 'Banana', 'Non GMO, +2', '#7263','10'),
    createData(<div className="flex items-center justify-center"><img src={kiwiImg} className="w-[40px] mix-blend-darken"/></div>, 'Kiwi', 'Non GMO, +3', '#7262','5'),
];

// --------------------------------------------------------------------------------------------------

const DropoffOrderDetailsView = () => {

  return (
    <>
      <div className="flex flex-col gap-[24px]">
        <div className="flex flex-col gap-[3px]">
            <Link to="/vendor/manage-orders" className="text-heading text-[14px]">
                <ArrowBackIosIcon className="text-[14px] mb-[2px]" /> Back
            </Link>
            <h6 className="text-heading text-[16px] sm:text-[18px] font-medium capitalize mb-2 sm:mb-0"> Order #DD726873</h6>
        </div>

        <StyledTableContainer component={Paper} className="overflow-x-auto">
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white" >STATUS</TableCell>
                        <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white">PICKUP DATE</TableCell>
                        <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white">CONTACT</TableCell>
                        <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white">LOCATION</TableCell>
                        <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white">UNITS</TableCell>
                        <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white">QR</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {awaitingDropOff.map((row) => (
                        <TableRow
                            key={row.pickup_date}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell align="left" className="font-gilroy text-[14px] text-heading">{row.status}</TableCell>
                            <TableCell align="left" className="font-gilroy text-[14px] text-heading">{row.pickup_date}</TableCell>
                            <TableCell align="left" className="font-gilroy text-[14px] text-heading">{row.contact}</TableCell>
                            <TableCell align="left" className="font-gilroy text-[14px] text-heading">{row.location}</TableCell>
                            <TableCell align="center" className="font-gilroy text-[14px] text-heading">{row.units}</TableCell>
                            <TableCell align="center" className="font-gilroy text-[14px] text-heading">{row.qr}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            
            <div className="p-[30px]">
                <Table sx={{ minWidth: 650 }} aria-label="Dropoff Order Details Table" className="bg-[#f6f6f6] !rounded-[8px]">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-[#f6f6f6] border-b-[1px] border-[#ebebeb]">PHOTO</TableCell>
                            <TableCell align="center" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-[#f6f6f6] border-b-[1px] border-[#ebebeb]">ITEM NAME</TableCell>
                            <TableCell align="center" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-[#f6f6f6] border-b-[1px] border-[#ebebeb]">ATTRIBUTES</TableCell>
                            <TableCell align="center" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-[#f6f6f6] border-b-[1px] border-[#ebebeb]">ITEM ID</TableCell>
                            <TableCell align="center" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-[#f6f6f6] border-b-[1px] border-[#ebebeb]">UNITS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {awaitingPickup.map((row) => (
                        <TableRow
                            key={row.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell align="center" className="font-gilroy text-[14px] text-heading">{row.photo}</TableCell>
                            <TableCell align="center" className="font-gilroy text-[14px] text-heading">{row.name}</TableCell>
                            <TableCell align="center" className="font-gilroy text-[14px] text-heading">{row.attribute}</TableCell>
                            <TableCell align="center" className="font-gilroy text-[14px] text-heading">{row.id}</TableCell>
                            <TableCell align="center" className="font-gilroy text-[14px] text-heading">{row.units}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </StyledTableContainer >

        <div className="flex justify-end mt-20">  
            <Link to="/vendor/location-details/add-drop-off">
                <DefaultButton value={'Drop-off confirmed'} />
            </Link>         
        </div>
      </div>
    </>
  )
}

export default DropoffOrderDetailsView;