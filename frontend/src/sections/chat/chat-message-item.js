import PropTypes from 'prop-types';
// @mui
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// components
import Iconify from 'src/components/iconify';
//
import {useSelector} from "react-redux";
import {formatChatTimestamp} from "src/utils/date.js";
import {useSocket} from "src/contexts/socketContext.js";
import {Box} from "@mui/material";
import ConfirmDelete from "../../components/modal/confirm-delete/index.js";
import React, {useState} from "react";

// ----------------------------------------------------------------------

export default function ChatMessageItem({ message:messageObj, onOpenLightbox }) {
  const socket = useSocket();
  const {selectedContact} = useSelector(state => state.chats);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const {opponentInfo, user: userInfo, _id} = selectedContact;
  const { message, createdAt, sender, attachFile } = messageObj;
  const me = sender.user === userInfo._id;
  
  const deleteMessage = () => {
    socket.emit("chat.delete_message", {chatId: _id, messageId: messageObj._id});
    setIsDeleteModalOpen(false);
  };
  
  const renderInfo = (
    <Typography noWrap variant="caption" sx={{mb: 1, fontFamily: 'Gilroy', color: 'text.disabled', ...(!me && {mr: 'auto'})}}>
      {!me && `${opponentInfo.name},`} &nbsp;
      {formatChatTimestamp(new Date(createdAt), true)}
    </Typography>
  );
  
  const renderBody = (
    <Stack
      sx={{
        p: 1.5,
        minWidth: 48,
        maxWidth: 360,
        borderRadius: 1,
        typography: 'body2',
        left:0,
        fontFamily: 'Gilroy',
        bgcolor: 'background.neutral',
        ...(me && {color: 'grey.800', bgcolor: 'primary.lighter'}),
        ...(attachFile && {p: 0, bgcolor: 'transparent'}),
      }}
    >
      {attachFile ? (
        <Box
          component="img"
          alt="attachment"
          src={attachFile}
          onClick={() => onOpenLightbox(body)}
          sx={{
            minHeight: 220,
            borderRadius: 1.5,
            fontFamily: 'Gilroy',
            cursor: 'pointer',
            '&:hover': {opacity: 0.9},
          }}
        />
      ) : (
        <span dangerouslySetInnerHTML={{__html: message.replace(/\n/g, "<br/>")}}/>
      )}
    </Stack>
  );
  
  const renderActions = (
    <Stack
      direction="row"
      className="message-actions"
      sx={{
        pt: 0.5,
        opacity: 0,
        top: '100%',
        left: 0,
        position: 'absolute',
        fontFamily: 'Gilroy',
        transition: (theme) => theme.transitions.create(['opacity'], {duration: theme.transitions.duration.shorter}),
        ...(me && {left: 'unset', right: 0}),
      }}
    >
      <IconButton size="small" color="error" onClick={() => setIsDeleteModalOpen(true)}>
        <Iconify icon="solar:trash-bin-trash-bold" width={16} />
      </IconButton>
    </Stack>
  );
  
  return (
    <Stack direction="row" justifyContent={me ? 'flex-end' : 'unset'} sx={{ mb: 3 }}>
      {!me && <Avatar alt={opponentInfo.name} src={opponentInfo.avatar} sx={{ width: 32, height: 32, mr: 2 }} />}
      
      <Stack alignItems={`flex-${me ? "end" : "start"}`}>
        {renderInfo}
        <Stack
          direction="row"
          alignItems="left"
          sx={{position: 'relative', '&:hover': {'& .message-actions': {opacity: 1}}}}
        >
          {renderBody}
          {me && renderActions}
        </Stack>
      </Stack>
      <ConfirmDelete
        confirmMsg={"Are you sure you want to delete this message?"}
        description={"You won’t be able to recover it afterwards."}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={deleteMessage}/>
    </Stack>
  );
}

ChatMessageItem.propTypes = {
  message: PropTypes.object,
  onOpenLightbox: PropTypes.func,
  participants: PropTypes.array,
};
