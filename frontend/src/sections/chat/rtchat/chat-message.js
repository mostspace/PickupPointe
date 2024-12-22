import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { fetchMessages, sendMessage } from "src/api/message/message";
import { BASE_URL } from "src/config-global";
import { fetchChats, setNotifications } from "src/reducers/chatSlice";
import { getChatName, validateChat } from "src/utils/chat";
import MessageHistory from "./chat-message-history";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, InputBase, Stack, Typography } from "@mui/material";
import Iconify from "src/components/iconify";
import {ReactComponent as SVGChatHistory} from 'src/assets/icons/chat_empty_placeholder.svg';
import ChatAttachSlider from "./chat-image-upload-slider";
import DNDFileSelector from "./chat-dnd-file-selector";
import ChatHeaderDetail from "../chat-header-detail";

let socket, selectedChatCompare;

export const ChatMessage = () => {
    const dispatch = useDispatch();
    
    const { activeChat, notifications } = useSelector((state) => state.chats);
    const authState = useSelector((state) => state.auth);
    const token = authState.token;
    const activeUser = authState.user;

    const fileRef = useRef(null);

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openChangeProfilePicture, setOpenChangeProfilePicture] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleRemove = (indexToRemove) => {
        setSelectedFiles((previousValue) => previousValue.filter((_, index) => index !== indexToRemove))
    }

    const handleFilesChange = (files) => {
        setSelectedFiles(files);
    };

    const handleChangeProfilePictureOpen = () => {
        setOpenChangeProfilePicture(true);
    };
    
    const handleChangeProfilePictureClose = () => {
        setOpenChangeProfilePicture(false);
    };

    const deleteMessage = async (data) => {
        socket.emit("chat.delete_message", data);
        const newData = await fetchMessages({token: token, id: activeChat._id, senderModel: authState.type});
        setMessages(newData);
    }

    useEffect(() => {
        socket = io(BASE_URL);
        return () => {
            if (socket) {
                socket.disconnect();
                socket.close();
            }
        };
    }, [])

    useEffect(() => {
        socket.emit("chat.setup", activeUser)
        socket.on("chat.connected", () => {
          setSocketConnected(true)
        })
    }, [messages, activeUser])
    
    useEffect(() => {
        const fetchMessagesFunc = async () => {
            if (activeChat) {
                setLoading(true);
                const data = await fetchMessages({token: token, id: activeChat._id, senderModel: authState.type});
                setMessages(data);
                socket.emit("chat.join_room", activeChat._id)
                setLoading(false);
            }
            return;
        }
        fetchMessagesFunc();
        selectedChatCompare = activeChat;
    }, [activeChat]);
    
    useEffect(() => {
        socket.on("chat.message_received", (newMessageRecieved) => {
            console.log("chat.message_received", newMessageRecieved, notifications)
            if ((!selectedChatCompare || selectedChatCompare._id) !== newMessageRecieved.chatId._id) {
                if (!notifications.includes(newMessageRecieved)) {
                    dispatch(setNotifications([newMessageRecieved, ...notifications]))
                }
            } else {
                setMessages([...messages, newMessageRecieved]);
            }
            dispatch(fetchChats({token: authState.token, userId: activeUser._id, userType: authState.type}))
        });
        socket.on("chat.typing", () => setIsTyping(true));
        socket.on("chat.stop_typing", () => setIsTyping(false));
        socket.on("chat.message_deleted", async () => {
            const data = await fetchMessages({token: token, id: activeChat._id, senderModel: authState.type});
            setMessages(data);
        })
        return () => {
            socket.off("chat.typing");
            socket.off("chat.stop_typing");
            socket.off("chat.message_deleted");
        }
    }, [])

    const keyDownFunction = async (e) => {
        if (!validateChat(message)) return;
        try {
            if ((e.key === "Enter" || e.type === "click") && (message || selectedFiles.length)) {
                e.preventDefault();
                setMessage("");
                setSelectedFiles([]);
                socket.emit("chat.stop_typing", activeChat._id);
    
                const formData = new FormData();
                formData.append("chatId", activeChat._id);
                formData.append("message", message);
                formData.append("senderModel", authState.type);
                formData.append("senderId", activeUser._id);
                for (let file of selectedFiles) {
                    formData.append("files", file);
                }
                setLoading(true);
                const data = await sendMessage({token: token, body: formData });
                setLoading(false);
                socket.emit("chat.new_message", data);
                setMessages((prevMessages) => [...prevMessages, data]);
                dispatch(fetchChats({token: authState.token, userId: activeUser._id, userType: authState.type}));
            }
        } catch (error) {
            console.log("send message error", error)
        }
    }

    const handleAttach = useCallback(() => {
    //     if (fileRef.current) {
    //       fileRef.current.click();
    //     }
        handleChangeProfilePictureOpen(true);
    }, []);

    if (loading) {
        return (
            <div className='w-full flex items-center justify-center bg-[#fff]'>
                <lottie-player src="https://assets9.lottiefiles.com/packages/lf20_cud2yjlq.json" background="transparent" speed="1" style={{ width: "150px", height: "150px" }} loop autoplay></lottie-player>
            </div>
        )
    }
    return (
        // <>
        //     {
        //         activeChat ?
        //         <div className="w-full">
        //             <div className='flex justify-between items-center px-5 bg-[#ffff] w-[100%]'>
        //             <div className='flex items-center gap-x-[10px]'>
        //                 <div className='flex flex-col items-start justify-center'>
        //                 <h5 className='text-[17px] text-[#2b2e33] font-bold tracking-wide'>{getChatName(activeChat, activeUser)}</h5>
        //                 {/* <p className='text-[11px] text-[#aabac8]'>Last seen 5 min ago</p> */}
        //                 </div>
        //             </div>
                    
        //             </div>
        //             <div className='scrollbar-hide w-[100%] h-[70vh] md:h-[50vh] lg:h-[50vh] flex flex-col overflow-y-scroll p-4'>
        //                 <MessageHistory typing={isTyping} messages={messages} />
        //                 <div>
        //                     {
        //                     isTyping ?
        //                         <div >
        //                             <lottie-player src="https://assets8.lottiefiles.com/packages/lf20_xxgrirnx.json" background="transparent" speed="1" style={{ width: `${100}px`, height: `${100}px` }} loop autoplay></lottie-player>
        //                         </div> 
        //                         : ""
        //                     }
        //                 </div>
        //             </div>
        //             <div className='absolute left-[31%] bottom-[8%]'>
        //                 <div className='border-[1px] border-[#aabac8] px-6 py-3 w-[360px] sm:w-[400px] md:w-[350px] h-[50px] lg:w-[400px] rounded-t-[10px]'>

        //                     <form onKeyDown={(e) => keyDownFunction(e)} onSubmit={(e) => e.preventDefault()}>
        //                     <input onChange={(e) => {
        //                         setMessage(e.target.value)
        //                         if (!socketConnected) return
        //                         if (!typing) {
        //                             setTyping(true)
        //                             socket.emit('typing', activeChat._id)
        //                         }
        //                         let lastTime = new Date().getTime()
        //                         var time = 3000
        //                         setTimeout(() => {
        //                             var timeNow = new Date().getTime()
        //                             var timeDiff = timeNow - lastTime
        //                             if (timeDiff >= time && typing) {
        //                                 socket.emit("stop typing", activeChat._id)
        //                                 setTyping(false)
        //                             }
        //                         }, time)
        //                     }} className='focus:outline-0 w-[100%] bg-[#f8f9fa]' type="text" name="message" placeholder="Enter message" value={message} />
        //                     </form>

        //                 </div>
        //             </div>
        //         </div> :
        //         <div>
        //             <div className='relative'>
        //             <div className='absolute top-[40vh] left-[44%] flex flex-col items-center justify-center gap-y-3'>
        //                 <img className='w-[50px] h-[50px] rounded-[25px]' alt="User profile" src={activeUser.avatar} />
        //                 <h3 className='text-[#111b21] text-[20px] font-medium tracking-wider'>Welcome <span className='text-[#166e48] text-[19px] font-bold'> {`${activeUser.firstName} ${activeUser.lastName}`}</span></h3>
        //             </div>
        //             </div>
        //         </div>

        //     }
        // </>
        <Stack
            sx={{
                width: 1,
                height: 1,
                overflow: 'hidden',
            }}
        >
            {
                activeChat ?
                    <Stack
                        sx={{
                            width: 1,
                            height: 1,
                            overflow: 'hidden',
                        }}
                    >
                        <div className='flex justify-between items-center px-5 bg-[#ffff] w-[100%]'>
                            <div className='flex items-center gap-x-[10px]'>
                                <div className='flex flex-col items-start justify-center'>
                                    <Typography variant="subtitle1" className='text-[17px] text-[#2b2e33] font-bold tracking-wide font-gilroy'>{getChatName(activeChat, activeUser)}</Typography>
                                </div>
                            </div>
                            <ChatHeaderDetail chatId={activeChat._id} />
                        </div>
                        <Divider />
                        <MessageHistory typing={isTyping} messages={messages} emitSocket={deleteMessage} />
                        <div className="pl-2">
                            {
                            isTyping ?
                                <Typography variant="caption" className="font-gilroy">{`${getChatName(activeChat, activeUser)} is typing...`}</Typography>
                                : ""
                            }
                        </div>
                        <Divider />
                        <form className="w-full" onKeyDown={(e) => keyDownFunction(e)} onSubmit={(e) => e.preventDefault()}>
                            <InputBase
                                className='font-gilroy w-full'
                                placeholder="Text message"
                                multiline
                                value={message}
                                onChange={(e) => {
                                    setMessage(e.target.value)
                                    if (!socketConnected) return;
                                    if (!typing) {
                                        setTyping(true)
                                        socket.emit('chat.typing', activeChat._id)
                                    }
                                    let lastTime = new Date().getTime()
                                    var time = 3000
                                    setTimeout(() => {
                                        var timeNow = new Date().getTime()
                                        var timeDiff = timeNow - lastTime
                                        if (timeDiff >= time && !typing) {
                                            socket.emit("chat.stop_typing", activeChat._id)
                                            setTyping(false)
                                        }
                                    }, time)
                                }}
                                endAdornment={
                                    <Stack direction="row" sx={{ flexShrink: 0 }}>
                                      <IconButton onClick={handleAttach}>
                                        <Iconify icon="eva:image-fill" />
                                      </IconButton>
                                      <IconButton onClick={keyDownFunction}>
                                        <Iconify icon="mdi:send" className={(message || selectedFiles.length) && "text-success"} />
                                      </IconButton>
                                    </Stack>
                                }
                                sx={{
                                    px: 1,
                                    height: 56,
                                    flexShrink: 0,
                                    // borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
                                }}
                            />
                            <ChatAttachSlider files={selectedFiles} onRemove={handleRemove} />
                            <input type="file" ref={fileRef} style={{ display: 'none' }} />
                        </form>
                    </Stack> 
                    :
                    <div className="h-full flex flex-col items-center justify-center gap-[10px]">
                        <Box 
                            component={SVGChatHistory}
                        />
                        <Typography variant="subtitle1">
                            Chat history will be displayed here
                        </Typography>
                    </div>
            }
            <React.Fragment>
                <Dialog
                    className="w-full"
                    open={openChangeProfilePicture}
                    onClose={handleChangeProfilePictureClose}
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
                        <Button
                            sx={{
                                width: "100%",
                                height: "44px",
                                fontFamily: "Gilroy",
                                fontSize: "14px",
                                color: "#181818",
                                borderRadius: "8px",
                                backgroundColor: "#F5F5F5",
                                textTransform: "unset",
                            }}
                            onClick={handleChangeProfilePictureClose}
                        >
                            Cancel
                        </Button>
                        <Button
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
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        </Stack>
    )
}