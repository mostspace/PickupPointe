import React from 'react';
import Badge from '@mui/material/Badge';
import { Avatar, ListItemButton, ListItemText, Stack, Typography } from '@mui/material';
import { formatDistanceToNowStrict } from 'date-fns';
import { getChatName, getChatPhoto } from 'src/utils/chat';
import useContextMenu from 'src/hooks/use-context-menu';

const ChatItem = ({ chat, activeChat, handleContacts, handleActionClick, notifications, user, collapse }) => {
  const { showMenu, menuRef, handleContextMenu, handleMenuClick } = useContextMenu();


  const notificationCount = notifications.reduce((acc, element) => (element.chatId._id === chat._id ? acc + 1 : acc), 0);

  return (
    <>
        <ListItemButton
            key={chat._id}
            disableGutters
            sx={{
                py: 1.5,
                px: 2.5,
                ...(activeChat?._id == chat._id && {
                    bgcolor: 'action.selected',
                }),
            }}
            onClick={() => handleContacts(chat)}
            onContextMenu={(e) => handleContextMenu(e, chat._id)}
        >
            <Badge
                color="primary"
                overlap="circular"
                badgeContent={collapse ? notificationCount : 0}
            >
                <Avatar src={getChatPhoto(chat, user)} sx={{ width: 48, height: 48 }} />
            </Badge>
            {!collapse && (
                <>
                    <ListItemText
                        sx={{ ml: 2 }}
                        primary={getChatName(chat, user)}
                        primaryTypographyProps={{
                            noWrap: true,
                            variant: 'subtitle2',
                        }}
                        secondary={chat.latestMessage?.message.length > 30
                            ? `${chat.latestMessage?.message.slice(0, 30)}...`
                        : chat.latestMessage?.message}
                        secondaryTypographyProps={{
                            noWrap: true,
                            component: 'span',
                            variant: notificationCount ? 'subtitle2' : 'subtitle3',
                            color: notificationCount ? 'text.primary' : 'text.secondary',
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
                            {formatDistanceToNowStrict(new Date(chat.updatedAt), {
                                addSuffix: false,
                            })}
                        </Typography>

                        {!!notificationCount && (
                            <Badge
                                color="primary"
                                overlap="circular"
                                badgeContent={notificationCount}
                            />
                        )}
                    </Stack>
                </>
            )}
            {/* {showMenu && (
                <div
                    ref={menuRef}
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 10,
                        backgroundColor: 'white',
                        border: '1px solid #ccc',
                        boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)',
                        zIndex: 1000,
                    }}
                >
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        <li
                            onClick={() => handleActionClick(chat._id)}
                            style={{ padding: '8px', cursor: 'pointer' }}
                        >
                            Delete
                        </li>
                    </ul>
                </div>
            )} */}
        </ListItemButton>
        
    </>
  );
};

export default ChatItem;
