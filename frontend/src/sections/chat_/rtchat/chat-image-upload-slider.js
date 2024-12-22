import React from 'react';
// @mui
import { Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ChatAttachSlider = ({ files = [], onRemove }) => {
    return (
        <Box className="flex overflow-x-auto p-2 scrollbar-thin">
            {files.map((file, index) => (
                <Box key={index} className="relative bg-red flex-shrink-0 w-20 h-20 mr-2 border border-gray-500 rounded">
                    <img
                        loading="lazy"
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-full object-cover rounded"
                    />
                    <IconButton
                        onClick={() => onRemove(index)}
                        className="absolute top-0 right-0 bg-white rounded-full shadow-md opacity-0 hover:opacity-100 hover:bg-white transition-opacity duration-300"
                    >
                        <CloseIcon sx={{ color: 'red' }} fontSize="small" />
                    </IconButton>
                </Box>
            ))}
        </Box>
    );
};

export default ChatAttachSlider;
