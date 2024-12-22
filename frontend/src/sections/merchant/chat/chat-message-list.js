import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
// components
import Scrollbar from 'src/components/scrollbar';
import Lightbox, { useLightBox } from 'src/components/lightbox';
//
import { useMessagesScroll } from './hooks';
import ChatMessageItem from './chat-message-item';
import {Menu, MenuItem} from "@mui/material";

// ----------------------------------------------------------------------

export default function ChatMessageList({ messages = [], participants }) {
  const { messagesEndRef } = useMessagesScroll(messages);

  const slides = messages
    .filter((message) => message.contentType === 'image')
    .map((message) => ({ src: message.body }));

  // const lightbox = useLightBox(slides);
  const lightbox = useLightBox();
  
  const handleContextMenu = (event) => {
    event.preventDefault();
    setAnchorEl({ x: event.clientX, y: event.clientY });
  };
  
  const handleMenuItemClick = (option) => {
    console.log(`${option} clicked`);
    setAnchorEl(null);
  };
  
  return (
    <>
      <Scrollbar ref={messagesEndRef} sx={{ px: 3, py: 5, height: 1 }}>
        <Box>
          {messages.map((message) => (
            <ChatMessageItem
              key={message.id}
              message={message}
              participants={participants}
              onOpenLightbox={() => lightbox.onOpen(message.body)}
              onContextMenu={handleContextMenu}
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
      <Menu
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorReference="anchorPosition"
        anchorPosition={anchorEl ? {top: anchorEl.y, left: anchorEl.x,} : undefined}>
        <MenuItem onClick={() => handleMenuItemClick('Option 1')}>Option 1</MenuItem>
      </Menu>
    </>
  );
}

ChatMessageList.propTypes = {
  messages: PropTypes.array,
  participants: PropTypes.array,
};
