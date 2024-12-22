import PropTypes from 'prop-types';
import {useCallback, useEffect, useState} from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import { styled } from '@mui/material/styles';

// routes
import { paths } from 'src/routes/paths';

// hooks
import { useResponsive } from 'src/hooks/use-responsive';
import {useDispatch} from "react-redux";
import {useSocket} from "src/contexts/socketContext.js";
import {formatChatTimestamp} from "src/utils/date.js";

// ----------------------------------------------------------------------

// Define status colors
const statusColors = {
  online: '#44b700',  // Green
  offline: '#d3d3d3', // Gray
  away: '#ff9800',   // Orange
  busy: '#f44336',   // Red
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

export default function ChatNavItem({ selected, collapse, onCloseMobile, chatContact, onClick:OnItemClick, selectedChatId }) {
  const {opponentInfo, user: userInfo, lastMessage: dbLastMessage, updatedAt, _id:chatId} = chatContact;
  const dispatch = useDispatch();
  const socket = useSocket();
  const mdUp = useResponsive('up', 'md');
  
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [lastMessage, setLastMessage] = useState(dbLastMessage);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(updatedAt);
  const [unreadMessage, setUnreadMessage] = useState(userInfo.unreadMessages);
  
  useEffect(() => {
    socket.on("chat.typing", ({user, status}) => {
      if (user === opponentInfo._id) {
        setIsUserTyping(status);
      }
    });
    
    socket.on("chat.new_message", (data) => {
      if (chatId === data.chatId) {
        setLastMessage(data.lastMessage)
        setLastUpdatedAt(data.lastUpdatedAt);
        if (data.senderId !== userInfo._id && !selected) {
          setUnreadMessage(prevState => prevState + 1);
        }
      }
    });
    
    socket.on("chat.delete_message", ({message}) => {
      if (message === lastMessage) {
        setLastMessage("[Delete message]");
      }
    });
    
    return () => {
      socket.off("chat.typing");
      socket.off("chat.new_message");
      socket.off("chat.delete_message");
    }
  }, [selected]);
  
  const onContactClick = useCallback(async () => {
    try {
      if (!mdUp) onCloseMobile();
      OnItemClick();
      setUnreadMessage(0);
    } catch (error) {
      console.error(error);
    }
  }, [mdUp, onCloseMobile]);
  
  const renderSingle = (
    // <StyledBadge
    //   overlap="circular"
    //   anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    //   variant="dot"
    // >
      <Avatar alt={opponentInfo.name} src={opponentInfo.avatar} sx={{ width: 48, height: 48 }} />
    // </StyledBadge>
  );
  
  return (
    <ListItemButton disableGutters onClick={onContactClick} sx={{py: 1.5, px: 2.5, ...(selected && {bgcolor: 'action.selected'})}}>
      <Badge color="primary" overlap="circular" badgeContent={collapse ? unreadMessage : 0}>
        {renderSingle}
      </Badge>
      
      {!collapse && (
        <>
          <ListItemText
            sx={{ ml: 2 }}
            primary={
              <>
                <span>{opponentInfo.name}</span>
                <span className={"text-gray-400"}>{isUserTyping ? " is typing..." : ""}</span>
              </>
            }
            primaryTypographyProps={{noWrap: true, variant: 'subtitle2'}}
            secondary={lastMessage}
            secondaryTypographyProps={{
              noWrap: true,
              component: 'span',
              variant: unreadMessage ? 'subtitle2' : 'subtitle3',
              color: unreadMessage ? 'text.primary' : 'text.secondary',
            }}
          />
          
          <Stack alignItems="flex-end" sx={{ ml: 2, height: 44 }}>
            <Typography
              noWrap
              variant="body2"
              component="span"
              sx={{mb: 1.5, fontSize: 12, color: 'text.disabled', fontFamily: 'Gilroy'}}>
              {formatChatTimestamp(new Date(lastUpdatedAt))}
            </Typography>
            
            {!!unreadMessage && (
              <Badge
                color="primary"
                overlap="circular"
                badgeContent={unreadMessage}
              />
            )}
          </Stack>
        </>
      )}
    </ListItemButton>
  );
}

ChatNavItem.propTypes = {
  collapse: PropTypes.bool,
  chatContact: PropTypes.object,
  onCloseMobile: PropTypes.func,
  OnItemClick: PropTypes.func,
  selected: PropTypes.bool,
};
