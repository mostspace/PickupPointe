import React, { useEffect, useState, useCallback } from 'react';
// @mui
import {Box, Paper, Stack, Typography} from '@mui/material';
// routes
import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
// api
import { useGetContacts, useGetConversation, useGetConversations } from 'src/api/chat';
// components
//
import ChatNav from 'src/sections/chat/chat-nav';
import ChatMessageList from 'src/sections/chat/chat-message-list';
import ChatMessageInput from 'src/sections/chat/chat-message-input';
import ChatHeaderDetail from 'src/sections/chat/chat-header-detail';
import ChatHeaderCompose from 'src/sections/chat/chat-header-compose';
import {useSelector} from "react-redux";
import {ReactComponent as SVGChatHistory} from 'src/assets/icons/chat_empty_placeholder.svg';

// ----------------------------------------------------------------------

export default function ChatView() {
  const router = useRouter();
  const { user } = useMockedUser();
  const searchParams = useSearchParams();
  const selectedConversationId = searchParams.get('id') || '';
  const [recipients, setRecipients] = useState([]);
  const { contacts } = useGetContacts();
  const { conversation, conversationError } = useGetConversation(`${selectedConversationId}`);
  const participants = conversation
    ? conversation.participants.filter((participant) => participant.id !== user.id)
    : [];

  useEffect(() => {
    if (conversationError || !selectedConversationId) {
      // router.push(paths.merchant.chat);
    }
  }, [conversationError, router, selectedConversationId]);

  const handleAddRecipients = useCallback((selected) => {
    setRecipients(selected);
  }, []);

  const details = !!conversation;

  const {selectedContact, isChatLogLoading} = useSelector(state => state.chats);
  
  
  const renderHead = (
    <Stack
      direction="row"
      alignItems="center"
      flexShrink={0}
      sx={{ pr: 1, pl: 2.5, py: 1, minHeight: 72 }}
    >
      {selectedConversationId ? (
        <>{details && <ChatHeaderDetail participants={participants} />}</>
      ) : (
        <ChatHeaderCompose contacts={contacts} onAddRecipients={handleAddRecipients} />
      )}
    </Stack>
  );

  const renderMessages = (
    <Stack sx={{width: 1, height: 1, overflow: 'hidden'}}>
      {
        Object.keys(selectedContact).length === 0 || isChatLogLoading? (
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
            <ChatMessageList/>
            <ChatMessageInput
              recipients={recipients}
              onAddRecipients={handleAddRecipients}
              selectedConversationId={selectedConversationId}
              disabled={!recipients.length && !selectedConversationId}
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
        <Stack direction="row" sx={{width: 1, height: 1, overflow: 'hidden', borderTop: (theme) => `solid 1px ${theme.palette.divider}`}}>
          {renderMessages}
        </Stack>
      </Stack>
    </Stack>
  );
}
