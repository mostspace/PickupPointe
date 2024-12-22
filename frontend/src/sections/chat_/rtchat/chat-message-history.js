import { Avatar, Box, Menu, MenuItem, Paper, Stack, Tooltip, Typography } from '@mui/material'
import { formatDistanceToNowStrict } from 'date-fns'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import ScrollableFeed from "react-scrollable-feed"
import { deleteMessage } from 'src/api/message/message'
import Scrollbar from 'src/components/scrollbar'
import useMessagesScroll from '../hooks/use-messages-scroll'
import { isSameSender, isSameSenderMargin, isSameUser, isLastMessage } from 'src/utils/chat'

function MessageHistory({ messages, emitSocket }) {
  const activeUser = useSelector((state) => state.auth.user);

  const [showMenu, setShowMenu] = useState(false);
  const [anchorPosition, setAnchorPosition] = useState(null);
  const [currentMessageId, setCurrentChatId] = useState(null);
  const menuRef = useRef(null);

  const { messagesEndRef } = useMessagesScroll(messages);

  const handleContextMenu = (event, messageId) => {
    console.log("clientx", event.clientX, event.clientY, event.pageX)
    event.preventDefault();
    setCurrentChatId(messageId);
    setShowMenu(true);

    setAnchorPosition({ top: event.clientY, left: event.clientX });
  };

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setShowMenu(false);
    }
  };

  const handleMenuClick = async (messageId) => {
    setShowMenu(false);
    console.log("deletedmessage", messageId);
    const data = await deleteMessage({token: "", messageId});
    emitSocket(data.data);
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      {/* <ScrollableFeed className='scrollbar-hide'>
        {messages &&
          messages.map((m, i) => (
            <div className='flex items-center relative gap-x-[6px]' key={m._id} onContextMenu={() => handleContextMenu(event, m._id)}>
              {showMenu && currentMessageId === m._id && (
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
                      onClick={() => handleMenuClick(m._id)}
                      style={{ padding: '8px', cursor: 'pointer' }}
                    >
                      Delete
                    </li>
                  </ul>
                </div>
              )}
              {(isSameSender(messages, m, i, activeUser._id) ||
                isLastMessage(messages, i, activeUser._id)) && (
                  <Tooltip label={m.sender?.firstName} placement="bottom-start">
                    <Avatar
                      style={{ width: "32px", height: "32px" }}
                      mt="43px"
                      mr={1}

                      cursor="pointer"
                      name={m.sender?.firstName}
                      src={m.sender?.avatar}
                    />
                  </Tooltip>

                )}
              <span className='tracking-wider text-[15px]  font-medium'
                style={{
                  backgroundColor: `${m.sender._id === activeUser._id ? "#268d61" : "#f0f0f0"
                    }`,
                  marginLeft: isSameSenderMargin(messages, m, i, activeUser._id),
                  marginTop: isSameUser(messages, m, i, activeUser._id) ? 3 : 10,
                  borderRadius: `${m.sender._id === activeUser._id ? "10px 10px 0px 10px" : "10px 10px 10px 0"}`,
                  padding: "10px 18px",
                  maxWidth: "460px",
                  color: `${m.sender._id === activeUser._id ? "#ffff" : "#848587"}`
                }}
              >
                {m.message}
              </span>
            </div>
          ))
        }
      </ScrollableFeed > */}
      <Scrollbar ref={messagesEndRef} sx={{ px: 3, py: 5, height: 1 }}>
        <Box>
          {messages &&
            messages.map((m, i) => (
              <div key={i}>
                <Stack
                  direction="row"
                  justifyContent={m.sender._id === activeUser._id ? 'flex-end' : 'unset'}
                  sx={{ mb: 5, position: 'relative' }}
                  onContextMenu={() => handleContextMenu(event, m._id)}
                >
                  {!(m.sender._id === activeUser._id) && <Avatar alt={`${m.sender.firstName} ${m.sender.lastName}`} src={m.sender.avatar} sx={{ width: 32, height: 32, mr: 2 }} />}
                  <Stack sx={
                    (m.sender._id === activeUser._id) ? {alignItems: 'flex-end'} : {alignItems: 'flex-start'}
                  }>
                    <Typography
                      noWrap
                      variant="caption"
                      sx={{
                        mb: 1,
                        fontFamily: 'Gilroy',
                        color: 'text.disabled',
                        ...(!(m.sender._id === activeUser._id) && {
                          mr: 'auto',
                        }),
                      }}
                    >
                      {!(m.sender._id === activeUser._id) && `${m.sender.firstName},`} &nbsp;
                      {formatDistanceToNowStrict(new Date(m.createdAt), {
                        addSuffix: true,
                      })}
                    </Typography>
                    <Stack
                      direction="row"
                      alignItems="center"
                      sx={{
                        position: 'relative',
                        '&:hover': {
                          '& .message-actions': {
                            opacity: 1,
                          },
                        },
                      }}
                    >
                      <Stack
                        sx={{
                          p: 1.5,
                          minWidth: 48,
                          maxWidth: 320,
                          borderRadius: 1,
                          typography: 'body2',
                          fontFamily: 'Gilroy',
                          bgcolor: 'background.neutral',
                          ...((m.sender._id === activeUser._id) && {
                            color: 'grey.800',
                            bgcolor: 'primary.lighter',
                            fontFamily: 'Gilroy',
                          }),
                        }}
                      >
                        {m.message}
                        {m.attachments.length > 0 && (
                          <Stack
                            sx={{
                              ...(m.message && {
                                mt: 2
                              }),
                            }}
                          >
                            <div className="attachments flex flex-col items-end gap-10" style={!(m.sender._id === activeUser._id) ? {alignItems: 'flex-start'} : {}}>
                                {m.attachments.map((attachment, index) => (
                                    <Attachment key={index} attachment={attachment} />
                                ))}
                            </div>
                          </Stack>
                        )}
                      </Stack>
                    </Stack>
                  </Stack>
                  {
                    showMenu && currentMessageId === m._id && m.sender._id === activeUser._id && (
                    <Menu
                        open={showMenu}
                        onClose={() => setShowMenu(false)}
                        anchorReference="anchorPosition"
                        anchorPosition={anchorPosition}
                        PaperComponent={({ children }) => (
                            <Paper
                                elevation={2}
                                sx={{
                                    borderRadius: '8px',
                                    padding: '8px',
                                }}
                            >
                                {children}
                            </Paper>
                        )}
                      >
                        <MenuItem
                            onClick={() => {
                                handleMenuClick(currentMessageId);
                                setShowMenu(false);
                            }}
                            sx={{
                                '&:hover': {
                                    backgroundColor: '#f5f5f5', 
                                },
                            }}
                        >
                            Delete
                        </MenuItem>
                      </Menu>
                    )
                  }
                </Stack>
              </div>
            ))
          }
        </Box>
      </Scrollbar>
    </>
  )
}

function Attachment({ attachment }) {
  return (
      <div className="w-48 h-48 bg-gray-100 rounded-lg overflow-hidden shadow-md">
          {attachment.fileType.startsWith("image/") ? (
              <img
                src={attachment.fileUrl}
                alt={attachment.fileName}
                className="w-full h-full object-cover"
              />
          ) : (
              <a 
                  href={attachment.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full h-full text-blue-500 underline"
              >
                  {attachment.fileName}
              </a>
          )}
      </div>
  );
}

export default MessageHistory