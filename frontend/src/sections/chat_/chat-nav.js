import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Stack, Drawer, IconButton, TextField, InputAdornment, ClickAwayListener, Box, Tabs, Tab,
  Badge,
  Typography, 
} from '@mui/material';

// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import TabPanel from "src/components/tab";
//
import { useCollapseNav } from './hooks';
import ChatNavItem from './chat-nav-item';
import ChatNavAccount from './chat-nav-account';
import { ChatNavItemSkeleton } from './chat-skeleton';
import ChatNavSearchResults from './chat-nav-search-results';

import { useDispatch, useSelector } from 'react-redux';
import { searchUsers } from 'src/reducers/userSlice';
import { accessCreate, deleteChat } from 'src/api/message/chat';
import { fetchChats, setActiveChat, setNotifications } from 'src/reducers/chatSlice';
import { getChatName, getChatPhoto, timeSince } from 'src/utils/chat';
import ChatItem from './rtchat/chat-contact-item';
import io from "socket.io-client";
import { BASE_URL } from 'src/config-global';

// ----------------------------------------------------------------------

const NAV_WIDTH = 320;

const NAV_COLLAPSE_WIDTH = 96;
let socket;

export default function ChatNav({ loading, contacts, conversations, selectedConversationId }) {
  // const conversations = useSelector((state) => state.chats?.chats || []);
  const { chats, activeChat } = useSelector((state) => state.chats)
  let user;
  user = useSelector((state) => state.auth?.user);
  if (!user) {
    user = useSelector(state => state.merchant.auth);
  }

  const { notifications } = useSelector((state) => state.chats);

  const userType = useSelector((state) => state.auth?.type);
  const token = useSelector((state) => state.auth?.token);
  const userState = useSelector((state) => state.user);
  const { searchedUsers, status } = userState;

  

  const theme = useTheme();

  const dispatch = useDispatch();

  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  var aDay = 24 * 60 * 60 * 1000;

  const {
    collapseDesktop,
    onCloseDesktop,
    onCollapseDesktop,
    //
    openMobile,
    onOpenMobile,
    onCloseMobile,
  } = useCollapseNav();

  const [searchContacts, setSearchContacts] = useState({
    query: '',
    results: [],
  });

  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const menuRef = useRef(null);

  const handleContextMenu = (event, chatId) => {
    event.preventDefault();
    setCurrentChatId(chatId);
    setMenuPosition({ x: event.clientX, y: event.clientY });
    setShowMenu(true);
  };

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setShowMenu(false);
    }
  };

  const handleMenuClick = async (chatId) => {
    setShowMenu(false);
    const deletedChat = await deleteChat({token, chatId})
    dispatch(fetchChats({token, userId: user._id, userType}));
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
    socket.emit("chat.setup", user)
  }, [user])

  useEffect(() => {
    socket.on("chat.chat_deleted", async () => {
      dispatch(fetchChats({token, userId: user._id, userType}));
      dispatch(setActiveChat(null));
    })
  })

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    dispatch(fetchChats({token, userId: user._id, userType}));
  }, [dispatch])

  useEffect(() => {
    if (status == 'fulfilled') {
      setSearchContacts((prevState) => ({
        ...prevState,
        results: [...searchedUsers],
      }));
    }
  }, [status])

  useEffect(() => {
    if (!mdUp) {
      onCloseDesktop();
    }
  }, [onCloseDesktop, mdUp]);

  const handleToggleNav = useCallback(() => {
    if (mdUp) {
      onCollapseDesktop();
    } else {
      onCloseMobile();
    }
  }, [mdUp, onCloseMobile, onCollapseDesktop]);

  const handleClickCompose = useCallback(() => {
    if (!mdUp) {
      onCloseMobile();
    }
    router.push(paths.vendor.chat);
  }, [mdUp, onCloseMobile, router]);

  // const handleSearchContacts = useCallback(
  //   (inputValue) => {
  //     setSearchContacts((prevState) => ({
  //       ...prevState,
  //       query: inputValue,
  //     }));

  //     if (inputValue) {
  //       const results = contacts.filter((contact) =>
  //         contact.name.toLowerCase().includes(inputValue)
  //       );

  //       setSearchContacts((prevState) => ({
  //         ...prevState,
  //         results,
  //       }));
  //     }
  //   },
  //   [contacts]
  // );
  const handleSearchContacts = (inputValue) => {
    setSearchContacts((prevState) => ({
      ...prevState,
      query: inputValue,
    }));
    dispatch(searchUsers({filterString: inputValue, userType, userId: user._id}));
  }

  const handleContacts = (e) => {
    dispatch(setActiveChat(e))
    dispatch(setNotifications(notifications.filter((notification) => notification.chatId._id !== e._id)))
    onCloseMobile();
  }

  const handleClickAwaySearch = useCallback(() => {
    setSearchContacts({
      query: '',
      results: [],
    });
  }, []);

  const handleClickResult = useCallback(
    async (result) => {
      handleClickAwaySearch();
      await accessCreate({token: token, body: { userId: user._id, opponentId: result._id, userType: userType }});
      dispatch(fetchChats({token, userId: user._id, userType}));
      // router.push(`${paths.vendor.chat}?id=${result.id}`);
    },
    [handleClickAwaySearch]
  );

  // Tabs
  const [value, setValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  function tabProps(index) {
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    };
  }



  const renderToggleBtn = (
    <IconButton
      onClick={onOpenMobile}
      sx={{
        left: 0,
        top: 84,
        zIndex: 9,
        width: 32,
        height: 32,
        position: 'absolute',
        borderRadius: `0 12px 12px 0`,
        bgcolor: theme.palette.primary.main,
        boxShadow: theme.customShadows.primary,
        color: theme.palette.primary.contrastText,
        '&:hover': {
          bgcolor: theme.palette.primary.darker,
        },
      }}
    >
      <Iconify width={16} icon="solar:users-group-rounded-bold" />
    </IconButton>
  );

  const renderSkeleton = (
    <>
      {[...Array(12)].map((_, index) => (
        <ChatNavItemSkeleton key={index} />
      ))}
    </>
  );

  const renderList = (
    <>
      {/* {conversations.allIds.map((conversationId) => (
        <ChatNavItem
          key={conversationId}
          collapse={collapseDesktop}
          conversation={conversations.byId[conversationId]}
          selected={conversationId === selectedConversationId}
          onCloseMobile={onCloseMobile}
        />
      ))} */}
        {
          chats?.length > 0 ? chats?.map((e) => {
            return (
              // <div 
              //   onContextMenu={() => handleContextMenu(event, e._id)}
              //   onClick={() => handleContacts(e)}
              //   key={e._id} 
              //   className={`flex items-center relative justify-between sm:gap-x-1 md:gap-x-1 mt-5 ${activeChat._id === e._id ? "bg-[#fafafa]" : "bg-[#fff]"} cursor-pointer  py-4 px-2`}
              // >
              //   {showMenu && currentChatId === e._id && (
              //     <div
              //       ref={menuRef}
              //       style={{
              //         position: 'absolute',
              //         top: 0,
              //         right: 10,
              //         backgroundColor: 'white',
              //         border: '1px solid #ccc',
              //         boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)',
              //         zIndex: 1000,
              //       }}
              //     >
              //       <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              //         <li
              //           onClick={() => handleMenuClick(e._id)}
              //           style={{ padding: '8px', cursor: 'pointer' }}
              //         >
              //           Delete
              //         </li>
              //       </ul>
              //     </div>
              //   )}
              //   <div className='flex items-center gap-x-3 sm:gap-x-1 md:gap-x-3'>
              //     <img className='w-12 h-12  sm:w-12 sm:h-12 rounded-[30px] shadow-lg object-cover' src={getChatPhoto(e, user)} alt="" />
              //     <div>
              //       <h5 className='text-[13.6px] sm:text-[16px] text-[#2b2e33] font-bold'>{getChatName(e, user)}</h5>
              //       <p className='text-[13.6px] sm:text-[13.5px] font-medium text-[#56585c] '>  {e.latestMessage?.message.length > 30
              //         ? e.latestMessage?.message.slice(0, 30) + "..."
              //         : e.latestMessage?.message
              //       }</p>
              //     </div>
              //   </div>
              //   <div className='flex flex-col items-end gap-y-[8px]'>
              //     {
              //       notifications.reduce((acc, element) => {
              //         return element.chatId._id == e._id ? acc + 1 : acc
              //       }, 0) > 0 && 
              //       <Badge badgeContent={notifications.reduce((acc, element) => {
              //         return element.chatId._id == e._id ? acc + 1 : acc
              //       }, 0)} color="primary" className="!font-gilroy">
              //       </Badge>
              //     }
              //     <p className='text-[12.4px] sm:text-[12px]  font-normal text-[#b0b2b3] tracking-wide'>{timeSince(new Date(Date.parse(e.updatedAt) - aDay))}</p>
              //   </div>
              // </div>
              <ChatItem
                key={e._id}
                chat={e}
                activeChat={activeChat}
                handleActionClick={handleMenuClick}
                handleContacts={handleContacts}
                showMenu={showMenu}
                currentChatId={currentChatId}
                notifications={notifications}
                user={user}
                collapse={collapseDesktop}
              />
            )
          }) : (
            <div className='flex h-full items-center justify-center'>
              <Typography variant='subtitle1'>No messages yet</Typography>
            </div>
          )
        }
    </>
  );

  const renderListResults = (
    <ChatNavSearchResults
      query={searchContacts.query}
      results={searchContacts.results}
      onClickResult={handleClickResult}
    />
  );

  const renderSearchInput = (
    <ClickAwayListener onClickAway={handleClickAwaySearch}>
      <TextField
        fullWidth
        value={searchContacts.query}
        onChange={(event) => handleSearchContacts(event.target.value)}
        placeholder="Search contacts..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
        sx={{ mt: 2.5 }}
      />
    </ClickAwayListener>
  );

  const renderContent = (
    <>
      <Stack direction="row" alignItems="center" justifyContent="center" sx={{ p: 2.5, pb: 0 }}>
        {!collapseDesktop && (
          <>
            {/* <ChatNavAccount /> */}

            <Tabs value={value} onChange={handleTabChange} aria-label="Input Preference">
              <Tab label="Active Messages" {...tabProps(0)} className="!font-gilroy !text-[14px] !normal-case px-[5px] !border-b-0" />
              <Tab label="Archived" {...tabProps(1)} className="!font-gilroy !text-[14px] !normal-case px-[5px] ml-[12px] !border-b-0" 
                sx={{
                  minWidth: 'auto',
                  color: '#181818',
                  '&.Mui-selected': {
                    // color: '#181818',
                    // fontWeight: '600',
                  },
                }} 
              />
            </Tabs>

            <Box sx={{ flexGrow: 1 }} />
          </>
        )}

        <IconButton onClick={handleToggleNav}>
          <Iconify
            icon={collapseDesktop ? 'eva:arrow-ios-forward-fill' : 'eva:arrow-ios-back-fill'}
          />
        </IconButton>

        {/* {!collapseDesktop && (
          <IconButton onClick={handleClickCompose}>
            <Iconify width={24} icon="solar:user-plus-bold" />
          </IconButton>
        )} */}
      </Stack>

      <Box sx={{ p: 2.5, pt: 0 }}>{!collapseDesktop && renderSearchInput}</Box>

      <Scrollbar sx={{ pb: 1 }}>
        {searchContacts.query && renderListResults}

        {loading && renderSkeleton}

        {/* {!searchContacts.query && !!conversations.allIds.length && renderList} */}
        {!searchContacts.query && renderList}
      </Scrollbar>
    </>
  );

  return (
    <>
      {!mdUp && renderToggleBtn}

      {mdUp ? (
        <Stack
          sx={{
            height: 1,
            flexShrink: 0,
            width: NAV_WIDTH,
            borderRight: `solid 1px ${theme.palette.divider}`,
            transition: theme.transitions.create(['width'], {
              duration: theme.transitions.duration.shorter,
            }),
            ...(collapseDesktop && {
              width: NAV_COLLAPSE_WIDTH,
            }),
          }}
        >
          {renderContent}
        </Stack>
      ) : (
        <Drawer
          open={openMobile}
          onClose={onCloseMobile}
          slotProps={{
            backdrop: { invisible: true },
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </>
  );
}

ChatNav.propTypes = {
  contacts: PropTypes.array,
  conversations: PropTypes.object,
  loading: PropTypes.bool,
  selectedConversationId: PropTypes.string,
};
