import React, { useEffect, useState, useCallback } from 'react';
// @mui
import {Box, Paper, Stack, Typography} from '@mui/material';
// routes
import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
// components
import { useSettingsContext } from 'src/components/settings';
//
import ChatNav from '../chat-nav';
import ChatMessageList from '../chat-message-list';
import ChatMessageInput from '../chat-message-input';
import ChatHeaderDetail from '../chat-header-detail';
import ChatHeaderCompose from '../chat-header-compose';
import {fetchContacts} from "src/reducers/chatSlice.js";
import {useDispatch, useSelector} from "react-redux";
import {ReactComponent as SVGChatHistory} from 'src/assets/icons/chat_empty_placeholder.svg';

// ----------------------------------------------------------------------

export default function ChatView() {
  const [recipients, setRecipients] = useState([]);
  
  const handleAddRecipients = useCallback((selected) => {
    setRecipients(selected);
  }, []);
  
  ////////////////////////////////////////////////////////
  const {selectedContact, isChatLogLoading} = useSelector(state => state.chats);
  
  const renderMessages = (
    <Stack sx={{width: 1, height: 1, overflow: 'hidden'}}>
      {
        Object.keys(selectedContact)?.length === 0 || isChatLogLoading? (
          <div className="h-full flex flex-col items-center justify-center gap-[10px]">
            <Box
              component={SVGChatHistory}
            />
            <Typography variant="subtitle1">
              Chat history will be displayed here
            </Typography>
          </div>
        ) : (
          <>
            <ChatHeaderDetail/>
            <ChatMessageList/>
            <ChatMessageInput
              recipients={recipients}
              onAddRecipients={handleAddRecipients}
            />
          </>
        )
      }
    </Stack>
  );
  
  return (
    <Stack component={Paper} direction="row" sx={{ height: '72vh', width: '100%' }} className='relative'>
      <ChatNav/>
      <Stack sx={{width: 1, height: 1, overflow: 'hidden'}}>
        {/*{renderHead}*/}
        <Stack direction="row" sx={{width: 1, height: 1, overflow: 'hidden'}}>
          {renderMessages}
        </Stack>
      </Stack>
    </Stack>
  );
}
