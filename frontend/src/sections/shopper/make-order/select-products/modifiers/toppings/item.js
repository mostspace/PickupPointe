import React from "react";
import { FormControlLabel, Checkbox, Typography } from "@mui/material";

const Item = ({ img, name, price, isSelected, onClick }) => {
    return (
        <div
            className={`modifier-item w-full border rounded-[8px] p-[8px] cursor-pointer ${isSelected ? 'border-red-500' : 'border-gray-300'}`}
            onClick={onClick}
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-[12px]">
                    <img src={img} className="w-[64px] rounded-[5px]" alt={name}/>
                    <Typography variant="subtitle2">{name}</Typography>
                </div>
                <div className="flex items-center gap-[5px]">
                    <Typography variant="subtitle2">{price}</Typography>
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
            </div>
        </div>
    );
};

export default Item;
