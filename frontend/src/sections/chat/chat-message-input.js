import PropTypes from 'prop-types';
import {sub} from 'date-fns';
import React, {useRef, useState, useCallback, useMemo, useEffect} from 'react';
// @mui
import Stack from '@mui/material/Stack';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
// routes
import {paths} from 'src/routes/paths';
// hooks
import {useMockedUser} from 'src/hooks/use-mocked-user';
// utils
import uuidv4 from 'src/utils/uuidv4';
// components
import Iconify from 'src/components/iconify';
import {useSocket} from "src/contexts/socketContext.js";
import {debounce} from 'lodash';
import {useSelector} from "react-redux";
import ChatAttachSlider from "../chat_/rtchat/chat-image-upload-slider.js";
import axiosInstance from "../../utils/axios.js";
import {BASE_URL} from "../../config-global.js";
import {getCurrentUser} from "../../reducers/userSlice.js";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import DNDFileSelector from "../chat_/rtchat/chat-dnd-file-selector.js";
import DefaultButton from "../../components/button/default-button.js";
import {toast} from "react-toastify";
// ----------------------------------------------------------------------

export default function ChatMessageInput() {
	const fileRef = useRef(null);
	const socket = useSocket();
	
	const {selectedContact} = useSelector(state => state.chats);
	const {opponentInfo, user: userInfo, _id} = selectedContact;
	
	const [message, setMessage] = useState('');
	const [isUserTyping, setIsUserTyping] = useState(false);
	const [isTyping, setIsTyping] = useState(false);
	
	const [loading, setLoading] = useState(false);
	const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
	const [selectedFiles, setSelectedFiles] = useState([]);
	const [fileLocation, setFileLocation] = useState("");
	
	const handleRemove = (indexToRemove) => {
		setSelectedFiles((previousValue) => previousValue.filter((_, index) => index !== indexToRemove))
	}
	
	const handleFilesChange = (files) => {
		setSelectedFiles(files);
	};
	
	useEffect(() => {
		socket.on("chat.typing", ({user, status}) => {
			if (user === opponentInfo._id) {
				setIsUserTyping(status);
			}
		});
		return () => {
			socket.off("chat.typing");
		}
	}, []);
	
	const handleChangeMessage = useCallback((event) => {
		setMessage(event.target.value);
		setIsTyping(true);
		debounceEmitTypingStatus();
	}, []);
	
	const debounceEmitTypingStatus = useMemo(() => debounce(() => {
		setIsTyping(false);
	}, 500), []);
	
	useEffect(() => {
		socket.emit("chat.typing", isTyping);
	}, [isTyping]);
	
	const sendMessage = () => {
		if (selectedContact.isBlocked.length) {
			const message = selectedContact.isBlocked.includes(selectedContact.user._id)
				? "You have blocked this user. To send a message, please unblock this user first."
				: selectedContact.isBlocked.includes(selectedContact.opponentInfo._id)
					? `You have been blocked by ${selectedContact.opponentInfo.name}. You can't send messages to this user.`
					: ""
			toast(message, {type: 'error', className: 'toast-custom'});
			return;
		}
		if (message) {
			socket.emit("chat.message", {message, fileLocation});
		} else if (fileLocation) {
			socket.emit("chat.message", {message: "[Image]", fileLocation});
		}
		setMessage('');
		setFileLocation("");
		setSelectedFiles([]);
	}
	const handleSendMessage = useCallback(
		async (event) => {
			try {
				if (event.key === 'Enter') {
					sendMessage()
				}
			} catch (error) {
				console.error(error);
			}
		},
		[message]
	);
	
	const handleUploadFile = async()=>{
		setLoading(true)
		try {
			let data = new FormData();
			data.append('photo', selectedFiles[0]);
			const response = await axiosInstance.post(`${BASE_URL}/api/v1/messages/upload-image`, data);
			setFileLocation(response.data.location);
			setIsUploadModalOpen(false);
		} catch (error) {
		} finally {
			setLoading(false);
		}
	}
	
	return (
		<>
			{isUserTyping && (<span className={"text-gray-400"}>{opponentInfo.name} is typing...</span>)}
			<InputBase
				className='font-gilroy'
				value={message}
				onKeyUp={handleSendMessage}
				onChange={handleChangeMessage}
				placeholder="Text message"
				endAdornment={
					<Stack direction="row" sx={{flexShrink: 0}}>
						<IconButton onClick={setIsUploadModalOpen}>
							<Iconify icon="solar:gallery-add-bold"/>
						</IconButton>
						<IconButton onClick={sendMessage}>
							<Iconify icon="mdi:send"/>
						</IconButton>
					</Stack>
				}
				sx={{
					px: 1,
					height: 56,
					flexShrink: 0,
					borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
				}}
			/>
			
			<ChatAttachSlider files={selectedFiles} onRemove={handleRemove} />
			<input type="file" ref={fileRef} style={{display: 'none'}}/>
			
			<React.Fragment>
				<Dialog
					className="w-full"
					open={isUploadModalOpen}
					onClose={() => setIsUploadModalOpen(false)}
					scroll="paper"
					sx={{
						width: "100% !important",
					}}
				>
					<DialogTitle id="" className="pt-[32px] sm:!pt-[64px]">
						<h1 className="text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center font-gilroy">
							Upload the images
						</h1>
					</DialogTitle>
					<DialogContent dividers={scroll === "paper"}>
						<DialogContentText id="scroll-dialog-description" tabIndex={-1}>
							<div className="flex flex-col gap-[24px] font-gilroy sm:px-[60px] py-[16px] justify-center items-center">
								{/* <ImageUpload  onFileSelect={handleFileSelect}/> */}
								<DNDFileSelector onFilesChange={handleFilesChange} />
							</div>
						</DialogContentText>
					</DialogContent>
					<DialogActions className="!px-[22px] !pb-[32px] sm:!pb-[64px] sm:!px-[80px] !gap-[14px]">
						<DefaultButton value="Cancel" className="w-full bg-[#F5F5F5] text-heading hover:bg-[#fef0f0]" onClick={() => setIsUploadModalOpen(false)} />
						<DefaultButton value="Upload" className="w-full" onClick={handleUploadFile} loading={loading} />
						
						{/*<Button
							className="w-full"
							sx={{
								width: "100%",
								height: "44px",
								fontFamily: "Gilroy",
								fontSize: "14px",
								color: "#ffffff",
								borderRadius: "8px",
								backgroundColor: "#F14445",
								textTransform: "unset",
								"&:hover": {
									backgroundColor: "#E13031",
								},
							}}
							onClick={()=>{
								// handleUploadAvatar()
								handleChangeProfilePictureClose()
							}}
						>
							{loading? 'loading': "Upload"}
						</Button>*/}
					</DialogActions>
				</Dialog>
			</React.Fragment>
		</>
	);
}

ChatMessageInput.propTypes = {
	disabled: PropTypes.bool,
	onAddRecipients: PropTypes.func,
	recipients: PropTypes.array,
	selectedConversationId: PropTypes.string,
};
