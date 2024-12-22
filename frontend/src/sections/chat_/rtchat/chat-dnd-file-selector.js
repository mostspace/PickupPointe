import { Box, Typography, List, ListItem, ListItemText, IconButton } from "@mui/material";
import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Close";
import { ReactComponent as SVGUpload } from "src/assets/icons/ic_file_upload.svg";

const DNDFileSelector = ({
    maxFileSize = 25 * 1024 * 1024, 
    acceptedFileTypes = ["image/jpeg", "image/png"],
    onFilesChange = () => {} 
}) => {
    const [files, setFiles] = useState([]);

    const handleDrop = (event) => {
        event.preventDefault();
        const newFiles = Array.from(event.dataTransfer.files);
        validateAndAddFiles(newFiles);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleClick = () => {
        document.getElementById("fileInput").click();
    };

    const handleChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        validateAndAddFiles(selectedFiles);
    };

    const validateAndAddFiles = (newFiles) => {
        const validFiles = newFiles.filter((file) => {
            if (!acceptedFileTypes.includes(file.type)) {
                alert(`${file.name} is not an accepted file type.`);
                return false;
            }
            if (file.size > maxFileSize) {
                alert(`${file.name} exceeds the 5MB file size limit.`);
                return false;
            }
            return true;
        });
        const updatedFiles = [...files, ...validFiles];
        setFiles(updatedFiles);
        onFilesChange(updatedFiles);
    };

    const handleRemoveFile = (indexToRemove) => {
        const updatedFiles = files.filter((_, index) => index !== indexToRemove);
        setFiles(updatedFiles);
        onFilesChange(updatedFiles);
    };

    return (
        <Box className="w-full flex flex-col items-center">
            <Box
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="w-full flex flex-col items-center border-2 border-dashed border-blue-500 rounded-lg p-6 text-center mb-4"
            >
                <Box component={SVGUpload} />
                <div className="flex flex-col xs:flex-row gap-[5px] mt-3">
                    <Typography variant="subtitle1">
                        Drag and Drop file here or
                    </Typography>
                    <Typography
                        onClick={handleClick}
                        variant="subtitle1"
                        className="underline cursor-pointer hover:text-primary"
                    >
                        Choose file
                    </Typography>
                </div>

                <input
                    id="fileInput"
                    type="file"
                    multiple
                    onChange={handleChange}
                    style={{ display: 'none' }}
                />
            </Box>
            <Box
                className="w-full flex justify-between"
            >
                <Typography variant="caption" className="text-gray-400 font-gilroy">
                    Supported formats: PNG, JPEG
                </Typography>
                <Typography variant="caption" className="text-gray-400 font-gilroy">
                    Maximum size: 25MB
                </Typography>
            </Box>
            {files.length > 0 && <List className="w-full bg-white shadow-md rounded-lg mt-3">
                {files.map((file, index) => (
                    <ListItem
                        key={index}
                        className="border-b last:border-0 flex items-center space-x-4"
                    >
                        <img
                            loading="lazy"
                            src={URL.createObjectURL(file)}
                            alt="file preview"
                            className="w-10 h-10 object-cover rounded"
                        />
                        <ListItemText
                            primary={file.name}
                            secondary={`${(file.size / 1024).toFixed(2)} KB`}
                            primaryTypographyProps={{ className: "text-gray-800 font-gilroy line-clamp-1" }}
                            secondaryTypographyProps={{ className: "text-gray-500 font-gilroy" }}
                        />
                        <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleRemoveFile(index)}
                        >
                            <DeleteIcon className="text-black-500" />
                        </IconButton>
                    </ListItem>
                ))}
            </List>}
        </Box>
    );
};

export default DNDFileSelector;
