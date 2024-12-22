import React from "react";
import { FormControlLabel, Checkbox, Typography } from "@mui/material";

const Item = ({ img, name, isSelected, onClick }) => {
    return (
        <div
            className={`modifier-item w-full border rounded-[12px] px-1 py-[12px] cursor-pointer ${isSelected ? 'border-red-500' : 'border-gray-300'}`}
            onClick={onClick}
        >
            <div className="flex items-center gap-[10px]">
                <div className="flex items-center gap-[5px]">
                    <FormControlLabel
                        className='text-[#666] m-0'
                        size="small"
                        control={
                            <Checkbox
                                checked={isSelected}
                                sx={{
                                    color: '#A3A3A3',
                                    '&.Mui-checked': {
                                        color: '#F14445',
                                    },
                                }}
                            />
                        }
                    />
                </div>
                <div className="flex items-center gap-[12px]">
                    <img src={img} className="w-[40px] h-[40px] rounded-[3px]" alt={name} loading="lazy"/>
                    <Typography variant="subtitle2">{name}</Typography>
                </div>
            </div>
        </div>
    );
};

export default Item;