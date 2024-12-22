import React, { useState, } from 'react';
import PropTypes from 'prop-types';
// @mui
import {Badge, Stack, Popover, styled, MenuItem, Divider, Typography, IconButton, Chip} from '@mui/material';
// components
import Iconify from 'src/components/iconify';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmDelete from "src/components/modal/confirm-delete/index.js";
import {useSocket} from "src/contexts/socketContext.js";


const statusColors = {
  online: '#44b700',
  offline: '#d3d3d3',
  away: '#ff9800',
  busy: '#f44336',
};

const StyledBadge = styled(Badge, {
  shouldForwardProp: (prop) => prop !== 'status',
})(({ theme, status }) => ({
  '& .MuiBadge-dot': {
    backgroundColor: statusColors[status] || '#d3d3d3',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  },
}));

// ----------------------------------------------------------------------

export default function ChatHeaderDetail({chatId}) {
  const socket = useSocket();
  const {selectedContact} = useSelector(state => state.chats);
  
  const [openMoreMenu, setOpenMoreMenu] = useState(null);
  const [actionInfo, setActionInfo] = useState({
    isOpen: false,
    confirmMsg: "",
    confirmText: "",
    description: "",
    action: () => {}
  })
  
  const handleMoreMenuOpen = (event) => {
    setOpenMoreMenu(event.currentTarget);
  };
  const handleMoreMenuClose = () => {
    setOpenMoreMenu(null);
  };
  
  const deleteChat = () => {
    socket.emit("chat.delete_chat", {chatId: selectedContact._id});
    setActionInfo(prevState => ({...prevState, isOpen: false}));
  }
  
  const blockChat = (block) => {
    socket.emit("chat.block_chat", {chatId: selectedContact._id, isBlock: block});
    setActionInfo(prevState => ({...prevState, isOpen: false}));
  }
  
  const muteNotification = (mute) => {
    socket.emit("chat.mute_chat", {chatId: selectedContact._id, isMute: mute});

    setActionInfo(prevState => ({...prevState, isOpen: false}));
  }
  
  const archiveChat = (archive) => {
    socket.emit("chat.archive_chat", {chatId: selectedContact._id, isArchive: archive});
    setActionInfo(prevState => ({...prevState, isOpen: false}));
  }
  
  const handleMenuClick = (type) => {
    let confirmMsg, description, action, confirmText;
    alert(type)
    switch (type) {
      case "delete":
        confirmMsg = "Are you sure you want to delete this chat?";
        description = "You won't be able to recover this chat!";
        confirmText = "Delete";
        action = deleteChat;
        break;
      case "block":
      case "unblock":
        confirmMsg = `Are you sure you want to ${type === "block" ? "" : "un"}block this chat?`;
        description = `You can ${type === "block" ? "un" : ""}block this chat anytime!`;
        confirmText = `${type === "block" ? "Block" : "Unblock"}`;
        action = () => blockChat(type === "block");
        break;
      case "mute":
      case "unmute":
        confirmMsg = `Are you sure you want to ${type === "mute" ? "" : "un"}mute notifications from this user?`;
        description = `You can ${type === "mute" ? "un" : ""}mute notification any time!`;
        confirmText = `${type === "mute" ? "Mute" : "Unmute"}`;
        action = () => muteNotification(type === "mute");
        break;
      case "archive":
      case "unarchive":
        confirmMsg = `Are you sure you want to ${type === "archive" ? "" : "un"}archive this chat?`;
        description = `You can ${type === "archive" ? "un" : ""}archive this chat any time.`;
        confirmText = `${type === "archive" ? "Archive" : "Unarchive"}`;
        action = () => archiveChat(type === "archive");
        break;
    }
    setOpenMoreMenu(false);
    setActionInfo({
      isOpen: true,
      confirmMsg: confirmMsg,
      confirmText: confirmText,
      description: description,
      action: action
    })
  };
  return (
    <>
      <Stack className='flex' sx={{ borderBottom: (theme) => `solid 1px ${theme.palette.divider}` }}>
        <div className="flex justify-between">
          <Typography variant="h6" className='font-semibold ml-3 my-auto flex'>
            {selectedContact.opponentInfo?.name}
            {selectedContact.isMuted?.includes(selectedContact.user._id) && (
              <span className={"my-auto text-gray-400 ml-3"}>
                <Iconify icon={"mdi:mute"}/>
              </span>
            )}
          </Typography>
          {selectedContact.isBlocked && selectedContact.isBlocked.length !== 0 && (<Chip variant="outlined" color="error" size="small" className={"my-auto"} label={
              selectedContact.isBlocked.includes(selectedContact.user._id)
                ? "You have blocked this user" : selectedContact.isBlocked.includes(selectedContact.opponentInfo._id)
                ? `You have been blocked by ${selectedContact.opponentInfo.name}` : ""
            }/>
          )}
          <IconButton onClick={handleMoreMenuOpen}>
            <Iconify icon="eva:more-horizontal-fill" />
          </IconButton>
        </div>
      </Stack>
      {/* Handle Pickup Locations Menu */}
      <Popover
        open={Boolean(openMoreMenu)}
        anchorEl={openMoreMenu}
        onClose={handleMoreMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 180,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
              fontFamily: 'Gilroy'
            },
          },
        }}
      >     
        <MenuItem onClick={() => handleMenuClick("order")}>
          View customer orders
        </MenuItem>
        <MenuItem onClick={() => handleMenuClick(selectedContact.isArchived?.includes(selectedContact.user._id) ? "unarchive" : "archive")}>
          {selectedContact.isArchived?.includes(selectedContact.user._id) ? "Unarchive chat" : "Archive chat"}
        </MenuItem>
        <MenuItem onClick={() => handleMenuClick(selectedContact.isMuted?.includes(selectedContact.user._id) ? "unmute" : "mute")}>
          {selectedContact.isMuted?.includes(selectedContact.user._id) ? "Unmute" : "Mute"}
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleMenuClick("delete")} className='text-primary'>
          Delete
        </MenuItem>
        <MenuItem onClick={() => handleMenuClick(selectedContact.isBlocked?.includes(selectedContact.user._id) ? "unblock" : "block")} className='text-primary'>
          {selectedContact.isBlocked?.includes(selectedContact.user._id) ? "Unblock" : "Block"}
        </MenuItem>
      </Popover>
      <ConfirmDelete
        confirmMsg={actionInfo.confirmMsg}
        description={actionInfo.description}
        isOpen={actionInfo.isOpen}
        confirmText={actionInfo.confirmText}
        onClose={() => setActionInfo(prevState => ({...prevState, isOpen: false}))}
        onConfirm={actionInfo.action}/>
    </>
  );
}

ChatHeaderDetail.propTypes = {
  participants: PropTypes.array,
};
