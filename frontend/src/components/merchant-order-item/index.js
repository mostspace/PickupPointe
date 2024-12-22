import React, {useEffect, useState} from "react";
import {Box, Chip, IconButton, MenuItem, Popover, Typography} from "@mui/material";
import SwapVertIcon from '@mui/icons-material/SwapVert';
import {useNavigate} from "react-router-dom";
import CircleIcon from "@mui/icons-material/Circle";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {useSelector} from "react-redux";
import {useSocket} from "src/contexts/socketContext.js";
import {icSwap} from "../../assets/index.js";

const MerchantOrderItem = ({ data = {}, showPopOver = false, locationId = null }) => {
	const {item, quantity, selectedItems, variant, replaced} = data;
	const navigate = useNavigate();
	const socket = useSocket();

	const {orderDetail} = useSelector((state) => state.merchant.orders);

	const id = item?._id;
	const [anchorEl, setAnchorEl] = useState(null);
	const [isOutOfStock, setIsOutOfStock] = useState(false);
	const open = Boolean(anchorEl);

	useEffect(() => {
		const key = `${locationId}.${item._id}`;

		socket.emit("order.get_current_stock", key)
		socket.on(`order.current_stock.${key}`, count => {
			setIsOutOfStock(count === 0)
		});
		return () => {
			socket.off(`order.current_stock.${key}`)
		}
	}, [locationId, item._id]);
	const handleMakeOutOfStock = () => {
		navigate("out-of-stock", {state: {data: data, locationId: orderDetail.pickupLocation}});
		setAnchorEl(null);
	};

	const handleAdjustOrder = () => {
		navigate("adjust-order", {state: {data: data, locationId: orderDetail.locationId}});
		setAnchorEl(null);
	};

	const handleAdditionalCharge = () => {
		navigate("add-additional-charge", {state: {data: data, locationId: orderDetail.locationId}});
		setAnchorEl(null);
	};

	return (
		<Box
			className="flex items-start justify-between gap-[16px] sm:gap-[32px] p-[10px] rounded-[12px]"
			sx={{boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.04)", border: "1px solid #00000010"}}
		>
			<div className="w-full flex flex-col gap-[10px]">
				<div className="w-full flex justify-between items-start xx:items-center gap-[12px]">
					<img src={item.photo} className="object-cover w-[64px] h-[64px] rounded-[5px]" alt={item.name} />
					<div className="w-full flex flex-col xx:flex-row gap-[5px] xx:justify-between xx:items-center">
						<div className="w-full flex flex-col justify-between xs:gap-[5px]">
							<div className="flex gap-[5px] items-center">
								<Typography variant="h6" className="text-[14px] ss:text-[18px] leading-[18px] font-gilroyMedium">
									{item.name}
								</Typography>
							</div>
							<div className="flex gap-[5px] items-center">
								<Typography variant="subtitle3">
									<span className="capitalize">{variant}</span>
								</Typography>
							</div>
						</div>
						
						<div className="flex gap-[5px] items-center">
							<Typography variant="subtitle1" className="text-[12px] ss:text-[14px]">
								{quantity}x
							</Typography>
							<CircleIcon className="text-[3px] text-heading"/>
							<Typography
								variant="h6"
								className="text-[14px] ss:text-[18px] font-gilroyMedium">
								${item.defaultPrice}
							</Typography>
						</div>
					</div>
				</div>
				
				{selectedItems?.length > 0 && (
					<div className="flex flex-col gap-[12px] pl-[40px]">
						{selectedItems.map((item, index) => (
							<div key={`selectedItem${index}`} className="flex gap-[8px] items-center justify-between">
								<div className="flex gap-[8px] items-center">
									<img src={item.photo} className="w-[36px] h-[36px] rounded-[5px]" alt={item.name}/>
									<div className="justify-center">
										<Typography variant="subtitle2">{item.name}</Typography>
									</div>
								</div>
								<div className="flex gap-[5px] items-center justify-center">
									<Typography variant="subtitle2">1x</Typography>
									<CircleIcon className="text-[3px] text-heading"/>
									<Typography
										variant="subtitle1"
										className="text-[12px] ss:text-[14px] font-gilroyMedium">
										${item.price}
									</Typography>
								</div>
							</div>
						))}
					</div>
				)}

				{replaced && (
					<div className="flex pl-[40px] mt-1">
						<Chip
							label={
								<div className={"flex gap-[8px] items-center"}>
									<img src={icSwap} className="w-[20px]" style={{
										filter: 'invert(45%) sepia(130%) saturate(580%) hue-rotate(10deg) brightness(120%) contrast(90%)'
									}} />
									Replaced: "{replaced.name}"
								</div>
							}
							sx={{
								color: '#DD7E26',
								backgroundColor: 'rgba(241, 161, 68, 0.24)',
								borderRadius: '6px',
								fontFamily: 'Gilroy',
								fontSize: '14px',
								height: '25px',
								margin: 0,
								padding: 0
							}}
						/>
					</div>
				)}
			</div>

			{showPopOver && (
				<React.Fragment>
					<IconButton
						className="mt-[12px]"
						aria-describedby={id}
						variant="contained"
						onClick={(e) => setAnchorEl(e.currentTarget)}
					>
						<MoreVertIcon className="text-heading text-[22px]"/>
					</IconButton>
					<Popover
						id={`popover_${id}`}
						open={open}
						anchorEl={anchorEl}
						onClose={() => setAnchorEl(null)}
						anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
						transformOrigin={{vertical: "top", horizontal: "right"}}
						PaperProps={{
							sx: {
								p: 1,
								width: 210,
								"& .MuiMenuItem-root": {
									px: 1,
									typography: "body2",
									borderRadius: 0.75,
									fontFamily: "Gilroy",
								}
							}
						}}
					>
						<MenuItem onClick={handleMakeOutOfStock}>
							Mark Item As Out Of Stock
						</MenuItem>
						<MenuItem onClick={handleAdjustOrder}>
							Adjust Order
						</MenuItem>
						{/*<MenuItem onClick={handleAdditionalCharge}>
							Add An Additional Charge
						</MenuItem>*/}
					</Popover>
				</React.Fragment>
			)}
		</Box>
	)
};

export default MerchantOrderItem;