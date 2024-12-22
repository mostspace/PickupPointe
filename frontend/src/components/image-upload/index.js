import React, { useState } from 'react';
import { Avatar, Button } from '@mui/material';
// Assets
import { UploadImg } from 'src/assets';

const ImageUpload = ({img, onFileSelect}) => {

  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(img);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      if (file) {
        onFileSelect(file); // Pass the selected file to the parent component
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className='w-full flex flex-col items-center gap-[24px]'>
      <Avatar src={preview} alt="Preview" sx={{ width: "104px", height: "104px" }} />
      <Button
        variant="contained"
        component="label"
        sx={{
          width: 'auto',
          height: '44px',
          fontFamily: 'Gilroy',
          fontSize: '14px',
          color: '#ffffff',
          borderRadius: '8px',
          backgroundColor: '#F14445',
          boxShadow: 'unset',
          textTransform: 'unset',
          '&:hover': {
              backgroundColor: '#E13031',
          }
        }}
      >
        Upload Photo
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          hidden
        />
      </Button>
    </div>
  );
};

export default ImageUpload;
