import React, { useEffect, useState, } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// @mui
import {
  Badge, ListItemText, Stack, Paper, Avatar, Select, FormControl, Button, Popover, TableContainer, TableHead, Box, Grid, Drawer, styled, alpha,
  Checkbox, TableRow, Menu, MenuItem, TableBody, TableCell, Divider, Typography, IconButton, TablePagination, OutlinedInput, InputAdornment,
  Tabs, Tab, useMediaQuery, useTheme, Fade, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Chip,
} from '@mui/material';

import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';
// utils
import { fToNow } from 'src/utils/format-time';
// components
import Iconify from 'src/components/iconify';
import { deleteChat } from 'src/api/message/chat';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChats, setActiveChat } from 'src/reducers/chatSlice';
import io from "socket.io-client";
import { BASE_URL } from 'src/config-global';


// ----------------------------------------------------------------------

// Define status colors
const statusColors = {
  online: '#44b700',  // Green
  offline: '#d3d3d3', // Gray
  away: '#ff9800',   // Orange
  busy: '#f44336',   // Red
};

// StyledBadge with dynamic color based on status
const StyledBadge = styled(Badge, {
  shouldForwardProp: (prop) => prop !== 'status',
})(({ theme, status }) => ({
  '& .MuiBadge-dot': {
    backgroundColor: statusColors[status] || '#d3d3d3', // Default to gray if status is unknown
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  },
}));

// ----------------------------------------------------------------------
let socket, selectedChatCompare;

export default function ChatHeaderDetail({chatId}) {
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth?.token);
  
  // Orders Download Menu
  const [openMoreMenu, setOpenMoreMenu] = useState(null);

  const handleMoreMenuOpen = (event) => {
    setOpenMoreMenu(event.currentTarget);
  };

  const handleMoreMenuClose = () => {
    setOpenMoreMenu(null);
  };

  const handleMenuClick = async () => {
    setOpenMoreMenu(null);
    const deletedChat = await deleteChat({token, chatId})
    console.log("deletedChat", deletedChat);
    socket.emit("chat.delete_chat", deletedChat.deletedChat);
    dispatch(setActiveChat(null));
  };

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
    socket.on("chat.chat_deleted", async () => {
      console.log("chat deleted")
      dispatch(fetchChats({token, userId: user._id, userType}));
    })
  })

  return (
    <>

      <Stack className='flex items-end'>

        <IconButton onClick={handleMoreMenuOpen}>
          <Iconify icon="eva:more-horizontal-fill" />
        </IconButton>

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
        <MenuItem onClick={handleMoreMenuClose}>
          View customer orders
        </MenuItem>
        <MenuItem onClick={handleMoreMenuClose}>
          Archive chat
        </MenuItem>
        <MenuItem onClick={handleMoreMenuClose}>
          Mute
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClick} className='text-primary'>
          Delete
        </MenuItem>
        <MenuItem onClick={handleMoreMenuClose} className='text-primary'>
          Block
        </MenuItem>
      </Popover>
    </>
  );
}

ChatHeaderDetail.propTypes = {
  participants: PropTypes.array,
};
