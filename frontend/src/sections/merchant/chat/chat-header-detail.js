import React, { useState, } from 'react';
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

export default function ChatHeaderDetail({ participants }) {
  const group = participants.length > 1;

  const singleParticipant = participants[0];

  const renderGroup = (
    <AvatarGroup
      max={3}
      sx={{
        [`& .${avatarGroupClasses.avatar}`]: {
          width: 32,
          height: 32,
        },
      }}
    >
      {participants.map((participant) => (
        <Avatar key={participant.id} alt={participant.name} src={participant.avatarUrl} />
      ))}
    </AvatarGroup>
  );

  const renderSingle = (
    <Stack flexGrow={1} direction="row" alignItems="center" spacing={2}>
      {/* <Badge
        variant={singleParticipant.status}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Avatar src={singleParticipant.avatarUrl} alt={singleParticipant.name} />
      </Badge> */}

      <StyledBadge
        status={singleParticipant.status}  // Pass status to StyledBadge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
      >
        <Avatar src={singleParticipant.avatarUrl} alt={singleParticipant.name} />
      </StyledBadge>

      <ListItemText
        primary={singleParticipant.name}
        primaryTypographyProps={{
          style: { fontFamily: 'Gilroy' },
        }}
        secondary={
          singleParticipant.status === 'offline'
            ? fToNow(singleParticipant.lastActivity)
            : singleParticipant.status
        }
        secondaryTypographyProps={{
          component: 'span',
          style: { fontFamily: 'Gilroy' },
          ...(singleParticipant.status !== 'offline' && {
            textTransform: 'capitalize',
          }),
        }}
      />
    </Stack>
  );

  // Orders Download Menu
  const [openMoreMenu, setOpenMoreMenu] = useState(null);

  const handleMoreMenuOpen = (event) => {
    setOpenMoreMenu(event.currentTarget);
  };

  const handleMoreMenuClose = () => {
    setOpenMoreMenu(null);
  };

  return (
    <>
      {group ? renderGroup : renderSingle}

      <Stack flexGrow={1} />

      {/* <IconButton>
        <Iconify icon="solar:phone-bold" />
      </IconButton>
      <IconButton>
        <Iconify icon="solar:videocamera-record-bold" />
      </IconButton> */}
      <IconButton onClick={handleMoreMenuOpen}>
        <Iconify icon="eva:more-horizontal-fill" />
      </IconButton>

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
