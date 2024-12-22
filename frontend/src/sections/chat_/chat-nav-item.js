import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import AvatarGroup from '@mui/material/AvatarGroup';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import { styled } from '@mui/material/styles';

// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { useResponsive } from 'src/hooks/use-responsive';
// api
import { clickConversation } from 'src/api/chat';
//
import { useGetNavItem } from './hooks';

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

export default function ChatNavItem({ selected, collapse, conversation, onCloseMobile }) {
  const { user } = useMockedUser();

  const mdUp = useResponsive('up', 'md');

  const router = useRouter();

  const { group, displayName, displayText, participants, lastActivity, hasOnlineInGroup } =
    useGetNavItem({
      conversation,
      currentUserId: user.id,
    });

  const singleParticipant = participants[0];

  const { name, avatarUrl, status } = singleParticipant;

  const handleClickConversation = useCallback(async () => {
    try {
      if (!mdUp) {
        onCloseMobile();
      }

      await clickConversation(conversation.id);

      router.push(`${paths.vendor.chat}?id=${conversation.id}`);
    } catch (error) {
      console.error(error);
    }
  }, [conversation.id, mdUp, onCloseMobile, router]);

  const renderGroup = (
    // <Badge
    //   variant={hasOnlineInGroup ? 'online' : 'invisible'}
    //   anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    // >
    //   <AvatarGroup variant="compact" sx={{ width: 48, height: 48 }}>
    //     {participants.slice(0, 2).map((participant) => (
    //       <Avatar key={participant.id} alt={participant.name} src={participant.avatarUrl} />
    //     ))}
    //   </AvatarGroup>
    // </Badge>

    <StyledBadge
      status={status}  // Pass status to StyledBadge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      variant="dot"
    >
      <AvatarGroup variant="compact" sx={{ width: 48, height: 48 }}>
        {participants.slice(0, 2).map((participant) => (
          <Avatar key={participant.id} alt={participant.name} src={participant.avatarUrl} />
        ))}
      </AvatarGroup>
    </StyledBadge>
  );

  const renderSingle = (
    // <Badge key={status} variant={status} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} overlap="circular">
    //   <Avatar alt={name} src={avatarUrl} sx={{ width: 48, height: 48 }} />
    // </Badge>

    <StyledBadge
      status={status}  // Pass status to StyledBadge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      variant="dot"
    >
      <Avatar alt={name} src={avatarUrl} sx={{ width: 48, height: 48 }} />
    </StyledBadge>
  );

  return (
    <ListItemButton
      disableGutters
      onClick={handleClickConversation}
      sx={{
        py: 1.5,
        px: 2.5,
        ...(selected && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <Badge
        color="primary"
        overlap="circular"
        badgeContent={collapse ? conversation.unreadCount : 0}
      >
        {group ? renderGroup : renderSingle}
      </Badge>

      {!collapse && (
        <>
          <ListItemText
            sx={{ ml: 2 }}
            primary={displayName}
            primaryTypographyProps={{
              noWrap: true,
              variant: 'subtitle2',
            }}
            secondary={displayText}
            secondaryTypographyProps={{
              noWrap: true,
              component: 'span',
              variant: conversation.unreadCount ? 'subtitle2' : 'subtitle3',
              color: conversation.unreadCount ? 'text.primary' : 'text.secondary',
            }}
          />

          <Stack alignItems="flex-end" sx={{ ml: 2, height: 44 }}>
            <Typography
              noWrap
              variant="body2"
              component="span"
              sx={{
                mb: 1.5,
                fontSize: 12,
                color: 'text.disabled',
                fontFamily: 'Gilroy',
              }}
            >
              {formatDistanceToNowStrict(new Date(lastActivity), {
                addSuffix: false,
              })}
            </Typography>

            {!!conversation.unreadCount && (
              // <Box
              //   sx={{
              //     width: 8,
              //     height: 8,
              //     bgcolor: 'info.main',
              //     borderRadius: '50%',
              //   }}
              // />
              <Badge
                color="primary"
                overlap="circular"
                badgeContent={conversation.unreadCount}
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
  conversation: PropTypes.object,
  onCloseMobile: PropTypes.func,
  selected: PropTypes.bool,
};
