import React, { useState } from "react";
// @mui
import { TableRow, Typography, IconButton, Popover, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
// Icons
import MoreVertIcon from "@mui/icons-material/MoreVert";
// Components
import IOSSwitch from 'src/components/ios-switch';
import Iconify from 'src/components/iconify';
import DefaultButton from 'src/components/button/default-button';
import { CustomTableCell } from "src/utils/table-helpers";
import {getLocationAddress} from 'src/components/choose-location-select';
// Assets
import { icTrash } from 'src/assets';
// --------------------------------------------------------------------------------------------------

export function DiscountItem({
    discount,
    index,
    updateActiveStatus,
    handleRemoveDiscount,
    id,
    isActive,
}) {

    const [openDiscountsMenu, setOpenDiscountsMenu] = useState(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [isSwitchActive, setIsSwitchActive] = useState(isActive);

    const handleDiscountMenuOpen = (event) =>  setOpenDiscountsMenu(event.currentTarget);
    const handleDiscountMenuClose = () => setOpenDiscountsMenu(null);

    const handleRemoveDiscountClick = () => {
        handleDiscountMenuClose();
        setOpenConfirmDialog(true);
    };

    const handleCancelRemoveDiscount = () => {
        handleDiscountMenuClose();
        setOpenConfirmDialog(false);
    };

    const handleSwitchToggle = async () => {
        const previousState = isSwitchActive;
        setIsSwitchActive(!isSwitchActive);

        try {
            await updateActiveStatus(id, !isSwitchActive);
        } catch (error) {
            setIsSwitchActive(previousState);
            alert("Failed to update the discount status. Please try again.");
        }
    };

    return (
        <TableRow key={id}>
            <CustomTableCell>{discount.discountCode}</CustomTableCell>
            <CustomTableCell className="pl-9">{discount.discountAmount}</CustomTableCell>
            <CustomTableCell>{discount.method}</CustomTableCell>
            <CustomTableCell className="min-w-[250px]">{discount?.title}</CustomTableCell>
            <CustomTableCell className="min-w-[300px]">{discount?.description}</CustomTableCell>
            <CustomTableCell className="min-w-[200px]">{discount.shop?.name}</CustomTableCell>
            <CustomTableCell className="min-w-[270px]">
                <div className="flex flex-col gap-1">
                    {discount.locations?.map((location, index) => (
                        <Typography variant="text1" key={index}>{getLocationAddress(location)}</Typography>
                    ))}
                </div>
            </CustomTableCell>
            <CustomTableCell>
                <IOSSwitch checked={isSwitchActive} onChange={handleSwitchToggle} />
            </CustomTableCell>
            <CustomTableCell>
                <IconButton
                    className="bg-[#F5F5F5] p-[5px] w-[32px] h-[32px]"
                    onClick={handleDiscountMenuOpen}
                >
                    <MoreVertIcon sx={{ color: "#181818", fontSize: "18px" }} />
                </IconButton>

                {/* Handle Discounts Menu */}
                <Popover
                    open={Boolean(openDiscountsMenu)}
                    anchorEl={openDiscountsMenu}
                    onClose={handleDiscountMenuClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    PaperProps={{
                        sx: {
                            p: 0.6,
                            width: 160,
                            "& .MuiMenuItem-root": {
                                px: 1,
                                typography: "body2",
                                borderRadius: 0.75,
                                fontFamily: "Gilroy",
                            },
                        },
                    }}
                >
                    <MenuItem onClick={handleRemoveDiscountClick} className="text-primary">
                        <Iconify icon="eva:trash-2-outline" sx={{ mr: 1 }} /> Delete discount
                    </MenuItem>
                </Popover>

                {/* Remove Discount Confirmation Modal */}
                <React.Fragment>
                    <Dialog className="w-full"
                    open={openConfirmDialog}
                    onClose={handleCancelRemoveDiscount}
                    sx={{
                        width: "100% !important",
                    }}
                    >
                    <DialogTitle className='pt-[32px] sm:!pt-[64px] flex flex-col gap-[6px] items-center'>
                        <img src={icTrash} className='w-[40%]' loading="lazy"/>
                    </DialogTitle>
                    <DialogContent dividers={scroll === 'paper'}>
                        <DialogContentText>
                        <div className='flex flex-col gap-[14px] font-gilroy sm:px-[60px] py-[16px]'>
                            <Typography variant="h3" className="text-center">Are you sure you want to delete this discount?</Typography>
                            <Typography variant="subtitle1" className="text-normal text-center">You won’t be able to recover it afterwards.</Typography>
                        </div>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions className="!px-[22px] !pb-[32px] sm:!pb-[64px] sm:!px-[80px] !gap-[14px]">
                        <DefaultButton value="Cancel" className="w-full bg-[#F5F5F5] text-heading hover:bg-[#fef0f0]" onClick={handleCancelRemoveDiscount} />
                        <DefaultButton value="Delete" className="w-full" onClick={() => {
                            handleRemoveDiscount(id,index)
                            setOpenConfirmDialog(false);
                        }}/>
                    </DialogActions>
                    </Dialog>
                </React.Fragment>
            </CustomTableCell>
        </TableRow>
    );
}