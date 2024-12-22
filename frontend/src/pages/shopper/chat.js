import React from 'react'

import { Helmet } from 'react-helmet-async';
// Sections
import { ChatView } from 'src/sections/chat/view';

const Chat = () => {
  return (
    <>
      <Helmet>
        <title>Shopper Chat</title>
      </Helmet>

      <ChatView />
    </>
  )
}

export default Chat
