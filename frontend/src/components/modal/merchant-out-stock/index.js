import React from "react";
import { useNavigate } from "react-router-dom";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography} from "@mui/material";
import DefaultButton from "src/components/button/default-button.js";

const MerchantOutStockConfirmModal = (
	{ open, onClose, onConfirm, cancelText, okText, title, content }
) => {

	return (
		<Dialog
			className="w-full"
			open={open}
			onClose={onClose}
		  scroll="paper"
		  sx={{
			  width: "100% !important",
		  }}
		>
			<DialogTitle id="" className='pt-[32px] sm:!pt-[64px] sm:px-[82px]'>
				<div className="flex flex-col gap-[12px]">
					{/*<Typography variant="label" className="uppercase">Steve H. said:</Typography>*/}
					<Typography variant="h2">
						{title}
					</Typography>
				</div>
			</DialogTitle>
			<DialogContent >
				<DialogContentText tabIndex={-1}>
					<div className='flex flex-col gap-[14px] font-gilroy sm:px-[60px] pb-[12px]'>
						<Typography variant="subtitle2">
							{content}
						</Typography>
					</div>
				</DialogContentText>
			</DialogContent>
			<DialogActions className="!px-[22px] !py-[32px] sm:!pb-[64px] sm:!px-[80px] !gap-[14px] ">
				<DefaultButton value={cancelText} onClick={onClose} className="w-full bg-[#F5F5F5] text-heading hover:bg-[#fef0f0]" />
				<DefaultButton value={okText} onClick={onConfirm} className="w-full" />
			</DialogActions>
		</Dialog>
	)
};

export default MerchantOutStockConfirmModal;