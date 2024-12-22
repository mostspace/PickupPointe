import React from "react";
import { Link } from 'react-router-dom';
// Icons
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import CircleIcon from '@mui/icons-material/Circle';
// Assets
import { bananaImg, kiwiImg, orangeImg, qrCodeImg } from 'src/assets';
// @mui
import {
  Table, Paper, TableContainer, TableHead, styled, TableRow, TableBody, TableCell, Typography, Dialog, DialogContent, DialogContentText, DialogTitle, Chip,
} from '@mui/material';
import { StyledTableContainer } from "src/utils/table-helpers";

// Auto-pay Tab
function createAutopayData(id, autopay_frequency, pickup_name, location, units, price, qr) {
    return { id, autopay_frequency, pickup_name, location, units, price, qr };
}
const autoPay = [
    createAutopayData('PP726873', 'Tuesday, Every other, Week', 'Arlene McCoy', <span>134 S. Mooney Blvd, Visalia<br/>CA 93291</span>, '40kg', '$180', <QrCode2Icon /> ),
];
// Sub Auto-pay Tab
function createSubAutopayData(status, id, pickup_date, received_date, storage_date, qr) {
    return { status, id, pickup_date, received_date, storage_date, qr };
}
const subAutopay = [
    createSubAutopayData(<Chip label="Awaiting drop-off" sx={{color: '#DD7E26', backgroundColor: 'rgba(241, 161, 68, 0.24)', borderRadius: '6px', fontFamily: 'Gilroy', fontSize: '12px', height: '25px'}} />, 'PP726873', 'Tue, May 21', '-', '-', <QrCode2Icon /> ),
    createSubAutopayData(<Chip label="Ready for pick-up" sx={{color: '#3ACC48', backgroundColor: 'rgba(58, 204, 72, 0.16)', borderRadius: '6px', fontFamily: 'Gilroy', fontSize: '12px', height: '25px'}} />, 'PP345109', 'Tue, May 14', '-', 'Mon, May 21', <QrCode2Icon /> ),
    createSubAutopayData(<Chip label="Pick-up received" sx={{color: '#8A8A8A', backgroundColor: 'rgba(0, 0, 0, 0.08)', borderRadius: '6px', fontFamily: 'Gilroy', fontSize: '12px', height: '25px'}} />, 'PP726854', 'Tue, May 7', 'Mon, May 13', '-', <QrCode2Icon /> ),
];

// --------------------------------------------------------------------------------------------------

const AutopayOrderDetailsView = () => {

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
            <div className="flex flex-col gap-[16px]">
                <div className="flex flex-col gap-[3px]">
                    <Link to="/vendor/manage-orders" className="text-heading text-[14px]">
                        <ArrowBackIosIcon className="text-[14px] mb-[2px]" /> Back
                    </Link>
                    <h6 className="text-heading text-[16px] sm:text-[18px] font-medium capitalize mb-2 sm:mb-0">Order #PP726873</h6>
                </div>

                <div className="flex flex-col gap-[40px]">
                    <StyledTableContainer component={Paper} className="overflow-x-auto">
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white">ID</TableCell>
                                    <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white" >AUTO-PAY FREQUENCY</TableCell>
                                    <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white">PICKUP NAME</TableCell>
                                    <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white">LOCATION</TableCell>
                                    <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white">UNITS</TableCell>
                                    <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white">PRICE</TableCell>
                                    <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white">QR</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {autoPay.map((row) => (
                                <TableRow
                                    key={row.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align="left" className="font-gilroy text-[14px] text-heading">{row.id}</TableCell>
                                    <TableCell align="left" className="font-gilroy text-[14px] text-heading">{row.autopay_frequency}</TableCell>
                                    <TableCell align="left" className="font-gilroy text-[14px] text-heading">{row.pickup_name}</TableCell>
                                    <TableCell align="left" className="font-gilroy text-[14px] text-heading">{row.location}</TableCell>
                                    <TableCell align="center" className="font-gilroy text-[14px] text-heading">{row.units}</TableCell>
                                    <TableCell align="center" className="font-gilroy text-[14px] text-heading">{row.price}</TableCell>
                                    <TableCell align="center" className="font-gilroy text-[14px] text-heading" onClick={handlePickupQRScannedOpen}>{row.qr}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <div className="p-[10px] sm:p-[30px] bg-[]">
                            <div className="bg-[#f6f6f6] rounded-[8px] p-[15px] sm:p-[24px] flex flex-col lg:flex-row justify-between gap-[32px]">
                                <div className="w-full">
                                    <Typography variant="subtitle2" className="pb-2">Price summary</Typography>
                                    <div className="border rounded-[16px] p-[16px] flex flex-col gap-[14px]">
                                        <div className="flex justify-between">
                                            <Typography variant="label">Products price</Typography>
                                            <Typography variant="subtitle2">$140</Typography>
                                        </div>
                                        <div className="flex justify-between">
                                            <Typography variant="label">Delivery charges</Typography>
                                            <Typography variant="subtitle2">$35</Typography>
                                        </div>
                                        <div className="flex justify-between">
                                            <Typography variant="label">Processing fees</Typography>
                                            <Typography variant="subtitle2">$5</Typography>
                                        </div>
                                        <div className="flex justify-between">
                                            <Typography variant="label">PP fee</Typography>
                                            <Typography variant="subtitle2">$5</Typography>
                                        </div>
                                        <div className="border-t border-b py-3">
                                            <Typography variant="label">Discount code</Typography>
                                        </div>
                                        <div className="flex justify-between">
                                            <Typography variant="label">Total amount</Typography>
                                            <Typography variant="subtitle2">$185</Typography>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full">
                                    <Typography variant="subtitle2" className="pb-2">Products Ordered</Typography>
                                    <div className="border rounded-[16px] p-[16px] flex flex-col gap-[14px]">
                                        <div className="border-b py-1 flex justify-between items-center">
                                            <img src={bananaImg} className="mix-blend-darken w-[36px]"/>
                                            <div className="flex gap-[8px] items-center">
                                                <Typography variant="text1">Cavendish Banana</Typography> 
                                                <CircleIcon className="text-[5px] text-normal" />
                                                <Typography variant="text1">10 kg</Typography>
                                            </div>
                                            <Typography variant="subtitle2">$25</Typography>
                                        </div>
                                        <div className="border-b py-1 flex justify-between items-center">
                                            <img src={kiwiImg} className="mix-blend-darken w-[36px]"/>
                                            <div className="flex gap-[8px] items-center">
                                                <Typography variant="text1">Fuzzy kiwifruit</Typography> 
                                                <CircleIcon className="text-[5px] text-normal" />
                                                <Typography variant="text1">20 kg</Typography>
                                            </div>
                                            <Typography variant="subtitle2">$80</Typography>
                                        </div>
                                        <div className="py-1 flex justify-between items-center">
                                            <img src={orangeImg} className="mix-blend-darken w-[36px]"/>
                                            <div className="flex gap-[8px] items-center">
                                                <Typography variant="text1">Valencia Orange</Typography> 
                                                <CircleIcon className="text-[5px] text-normal" />
                                                <Typography variant="text1">10 kg</Typography>
                                            </div>
                                            <Typography variant="subtitle2">$35</Typography>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </StyledTableContainer >

                    <div className="flex flex-col gap-[16px]">
                        <h6 className="text-heading text-[16px] sm:text-[18px] font-medium capitalize mb-2 sm:mb-0">Order history</h6>
                        <StyledTableContainer component={Paper} className="overflow-x-auto">
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white" >STATUS</TableCell>
                                        <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white">ID</TableCell>
                                        <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white">PICKUP DATE</TableCell>
                                        <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white">RECEIVED DATE</TableCell>
                                        <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white">STORAGE DATE</TableCell>
                                        <TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white">QR</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {subAutopay.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                        <TableCell align="left" className="font-gilroy text-[14px] text-heading">{row.status}</TableCell>
                                        <TableCell align="left" className="font-gilroy text-[14px] text-heading">{row.id}</TableCell>
                                        <TableCell align="left" className="font-gilroy text-[14px] text-heading">{row.pickup_date}</TableCell>
                                        <TableCell align="left" className="font-gilroy text-[14px] text-heading">{row.received_date}</TableCell>
                                        <TableCell align="center" className="font-gilroy text-[14px] text-heading">{row.storage_date}</TableCell>
                                        <TableCell align="center" className="font-gilroy text-[14px] text-heading" onClick={handlePickupQRScannedOpen}>{row.qr}</TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </StyledTableContainer >
                    </div>
                </div>
            </div>

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
                {/* <DialogActions className="!px-[22px] !pb-[32px] sm:!pb-[64px] sm:!px-[80px] !gap-[14px]">
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
                    onClick={handlePickupQRScannedClose}
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
                    onClick={handlePickupQRScannedClose}
                    > 
                    Delete
                    </Button>
                </DialogActions> */}
                </Dialog>
            </React.Fragment>
        </>
    )
}

export default AutopayOrderDetailsView;