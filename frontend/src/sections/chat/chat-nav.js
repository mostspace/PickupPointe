import React, {useEffect, useState, useCallback} from 'react';
import PropTypes from 'prop-types';
// @mui
import { useTheme } from '@mui/material/styles';
import {Stack, Drawer, IconButton, TextField, InputAdornment, ClickAwayListener, Box, Tabs, Tab} from '@mui/material';

// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// routes
import { paths } from 'src/routes/paths';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
//
import { useCollapseNav } from './hooks';
import ChatNavItem from 'src/sections/chat/chat-nav-item';
import { ChatNavItemSkeleton } from './chat-skeleton';
import ChatNavSearchResults from './chat-nav-search-results';
import {useDispatch, useSelector} from "react-redux";
import {fetchChatLog, fetchContacts, getSearchedContact, setCurrentContact} from "src/reducers/chatSlice.js";
import {useSocket} from "src/contexts/socketContext.js";
import {debounce} from "lodash";

// ----------------------------------------------------------------------

const NAV_WIDTH = 320;
const NAV_COLLAPSE_WIDTH = 96;

export default function ChatNav({ conversations }) {
  const theme = useTheme();
  const mdUp = useResponsive('up', 'md');
  const socket = useSocket();
  
  const {
    collapseDesktop,
    onCloseDesktop,
    onCollapseDesktop,
    openMobile,
    onOpenMobile,
    onCloseMobile,
  } = useCollapseNav();
  
  const [contactKeyword, setContactKeyword] = useState("");
  const [searchContacts, setSearchContacts] = useState({
    query: '',
    results: [],
  });
  
  useEffect(() => {
    if (!mdUp) onCloseDesktop();
  }, [onCloseDesktop, mdUp]);
  
  const handleToggleNav = useCallback(() => {
    if (mdUp) onCollapseDesktop();
    else onCloseMobile();
  }, [mdUp, onCloseMobile, onCollapseDesktop]);
  
  const handleClickCompose = useCallback(() => {
    if (!mdUp) onCloseMobile();
    
    // router.push(paths.vendor.chat);
  }, [mdUp, onCloseMobile]);
  
  
  const handleClickAwaySearch = useCallback(() => {
    setSearchContacts({
      query: '',
      results: [],
    });
  }, []);
  
  const handleClickResult = useCallback(
    (_id, role) => {
      handleClickAwaySearch();
      socket.emit("chat.add_new", {_id, role});
    },
    [handleClickAwaySearch]
  );
  
  // Tabs
  const [tab, setTab] = React.useState(0);
  
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    dispatch(fetchContacts(newValue === 0 ? "active" : "archived"));
  };
  
  function tabProps(index) {
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    };
  }
  
  ////////////////////////////////////////////////////
  const dispatch = useDispatch();
  const {chatContacts, isLoading, searchedContact, selectedContact} = useSelector(state => state.chats);
  const [selectedChatId, setSelectedChatId] = useState("");
  const [chatContactList, setChatContactList] = useState([]);
  
  useEffect(() => {
    dispatch(fetchContacts("active"));
  }, []);
  
  useEffect(() => {
    setChatContactList(chatContacts);
  }, [chatContacts]);
  
  useEffect(() => {
    const searchContact = debounce(() => {
      if (contactKeyword) {
        dispatch(getSearchedContact(contactKeyword))
      }
    }, 300);
    searchContact();
    return () => {
      searchContact.cancel();
    };
  }, [contactKeyword]);
  
  useEffect(() => {
    socket.on("chat.refresh_contacts", ({contacts}) => {
      setChatContactList(contacts)
      dispatch(setCurrentContact(contacts.find(contact => contact._id === selectedContact._id) || {}));
      setSearchContacts([]);
      setContactKeyword("");
    });
    
    socket.on("chat.delete_chat", () => {
      dispatch(setCurrentContact({}));
    });
    
    return () => {
      socket.off("chat.refresh_contacts");
      socket.off("chat.delete_chat");
    }
  }, [selectedContact]);
  
  const onNavItemClick = (_id, chatContact) => {
    setSelectedChatId(_id);
    dispatch(fetchChatLog(_id));
    socket.emit("chat.set_chat_id", {chatId: _id, opponentId: chatContact.opponentInfo._id})
    dispatch(setCurrentContact(chatContact));
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
      {chatContactList.map((chatContact) => (
        <ChatNavItem
          key={chatContact._id}
          collapse={collapseDesktop}
          onClick={() => onNavItemClick(chatContact._id, chatContact)}
          chatContact={chatContact}
          selected={chatContact._id === selectedChatId}
          selectedChatId={selectedChatId}
          onCloseMobile={onCloseMobile}
        />
      ))}
    </>
  );
  
  const renderListResults = (
    <ChatNavSearchResults
      query={contactKeyword}
      results={searchedContact}
      onClickResult={handleClickResult}
    />
  );
  
  const renderSearchInput = (
    <ClickAwayListener onClickAway={handleClickAwaySearch}>
      <TextField
        fullWidth
        value={contactKeyword}
        onChange={(event) => setContactKeyword(event.target.value)}
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
            <Tabs value={tab} onChange={handleTabChange} aria-label="Input Preference">
              <Tab label="Active Messages" {...tabProps(0)} className="!font-gilroy !text-[14px] !normal-case px-[5px] !border-b-0" />
              <Tab label="Archived" {...tabProps(1)} className="!font-gilroy !text-[14px] !normal-case px-[5px] ml-[12px] !border-b-0"
                   sx={{minWidth: 'auto', color: '#181818'}}/>
            </Tabs>
            <Box sx={{ flexGrow: 1 }} />
          </>
        )}
        
        <IconButton onClick={handleToggleNav}>
          <Iconify
            icon={collapseDesktop ? 'eva:arrow-ios-forward-fill' : 'eva:arrow-ios-back-fill'}
          />
        </IconButton>
      </Stack>
      <Box sx={{ p: 2.5, pt: 0 }}>{!collapseDesktop && renderSearchInput}</Box>
      <Scrollbar sx={{ pb: 1 }}>
        {contactKeyword && renderListResults}
        {isLoading && renderSkeleton}
        {!searchContacts.query && !!chatContactList.length && renderList}
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
            ...(collapseDesktop && {width: NAV_COLLAPSE_WIDTH})}}>
          {renderContent}
        </Stack>
      ) : (
        <Drawer
          open={openMobile}
          onClose={onCloseMobile}
          slotProps={{backdrop: { invisible: true }}}
          PaperProps={{sx: { width: NAV_WIDTH }}}>
          {renderContent}
        </Drawer>
      )}
    </>
  );
}

ChatNav.propTypes = {
  loading: PropTypes.bool,
  selectedConversationId: PropTypes.string,
};
