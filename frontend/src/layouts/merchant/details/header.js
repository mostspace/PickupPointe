import React from "react";
import {useNavigate} from "react-router-dom";
// Icons
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
// @mui
import {Container, IconButton, Typography} from '@mui/material';
import {useSelector} from "react-redux";
import MerchantSocketHandler from "../socket.js";

const Header = ({title, actionButton}) => {
	const navigate = useNavigate();

	const handleBack = () => {
		navigate(-1);
	};

	return (
		<>
			<MerchantSocketHandler/>
			<div className="flex justify-center items-start">
				<Container
					className={`relative rounded-[16px]`}
					sx={{
						padding: {xs: '16px', md: '16px 32px'},
						background: '#fff',
						width: {xs: '100%', md: '100%'},
						maxWidth: {xs: '100%', md: '960px'},
					}}
				>
					<div className="w-full flex justify-between items-start ss:items-center">
						<div className="flex flex-wrap items-center gap-[10px]">
							<IconButton onClick={handleBack}>
								<KeyboardBackspaceIcon className="text-heading"/>
							</IconButton>
							<div className="flex flex-col items-start gap-[2px]">
								<Typography variant="h6" className="font-gilroyMedium">{title}</Typography>
							</div>
						</div>
						{actionButton && (
							actionButton
						)}
					</div>
				</Container>
			</div>
		</>
	);
};

export default Header;