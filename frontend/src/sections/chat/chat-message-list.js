import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
// components
import Scrollbar from 'src/components/scrollbar';
import Lightbox, { useLightBox } from 'src/components/lightbox';
//
import { useMessagesScroll } from './hooks';
import ChatMessageItem from './chat-message-item';
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {useSocket} from "src/contexts/socketContext.js";

// ----------------------------------------------------------------------

export default function ChatMessageList() {
  const socket = useSocket();
  const {chatLog, selectedContact} = useSelector(state => state.chats);
  const [messages, setMessages] = useState([])
  const { messagesEndRef } = useMessagesScroll(messages);
  
  const slides = messages
    .filter((message) => message.contentType === 'image')
    .map((message) => ({ src: message.body }));
  
  const lightbox = useLightBox();
  
  useEffect(() => {
    socket.on("chat.new_message", (data) => {
      if (data.chatId === selectedContact._id) {
        setMessages(prevState => {
          return prevState.concat(data.newMessage);
        })
      }
    });
    
    socket.on("chat.delete_message", ({messageId}) => {
      setMessages(prevState => {
        return prevState.filter(msg => msg._id !== messageId);
      })
    });
    return () => {
      socket.off("chat.new_message");
      socket.off("chat.delete_message");
    }
  }, [socket, selectedContact]);
  
  useEffect(() => {
    setMessages(chatLog);
  }, [chatLog]);
  
  return (
    <>
      
      <Scrollbar ref={messagesEndRef} sx={{px: 3, py: 5, height: 1}}>
        <Box>
          {messages.map((message) => (
            <ChatMessageItem
              key={message._id}
              message={message}
              onOpenLightbox={() => lightbox.onOpen(message.body)}
            />
          ))}
        </Box>
      </Scrollbar>
      
      <Lightbox
        index={lightbox.selected}
        slides={slides}
        open={lightbox.open}
        close={lightbox.onClose}
      />
    </>
  );
}

ChatMessageList.propTypes = {
  messages: PropTypes.array,
  participants: PropTypes.array,
};
