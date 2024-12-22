import React, { useState, useRef, } from "react";
import { Avatar, FormControl, TextField, } from "@mui/material";

// Assets
import { UploadImg, icPen } from 'src/assets';

export default function Item(props) {
    const { number, removeItem, item, isPreview } = props;

    // Upload product image
    const [avatarImg, setAvatarImg] = useState(UploadImg); // Initial image
    const fileInputRef = useRef(null);

    const handleAvatarClick = () => {
        if (isPreview) return
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarImg(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col p-4 gap-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-[24px]">
                <div className="w-fit relative cursor-pointer" onClick={handleAvatarClick}>
                    <Avatar variant="rounded" alt="avatar" src={item.photo} sx={{ width: 72, height: 72, border: '1px solid #dce0e4' }} />
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept="image/jpeg,image/png"
                        onChange={handleFileChange}
                    />
                    <div className="absolute -right-2 -top-2 bg-[#F5F5F5] rounded-full p-[6px]">
                        <img src={icPen} />
                    </div>
                </div>
                <FormControl variant="standard" className='w-full'>
                    <label className='font-normal text-normal leading-5 text-sm pb-1'>Item name</label>
                    <TextField
                        size="small"
                        variant='outlined'
                        required
                        fullWidth
                        placeholder='Enter item name'
                        value={item.name}
                        disabled={isPreview}
                    />
                </FormControl>
                <FormControl variant="standard" className='w-full'>
                    <label className='font-normal text-normal leading-5 text-sm pb-1'>Price</label>
                    <TextField
                        size="small"
                        variant='outlined'
                        required
                        fullWidth
                        placeholder='Enter price'
                        value={item.price}
                        disabled={isPreview}
                    />
                </FormControl>
            </div>
        </div>
    );
}