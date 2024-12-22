import React from "react";
import { FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';

const Item = ({ size, name, price, isSelected, onClick, value, onChange }) => {
    return (
        <div
            className={`modifier-item w-full border rounded-[8px] p-[8px] cursor-pointer ${isSelected ? 'border-red-500' : 'border-gray-300'}`}
            onClick={onClick}
        >
            <div className="flex justify-between items-center">
                <div className="flex items-end gap-[5px]">
                    <Typography variant="subtitle2">{size}</Typography>
                    <CircleIcon className="w-[3px] mt-[2px]" />
                    <Typography variant="label">{name}</Typography>
                </div>
                <div className="flex items-center gap-[5px]">
                    <Typography variant="subtitle2">{price}</Typography>
                    <RadioGroup
                        value={value}
                        onChange={onChange}
                        name="item-selection"
                        sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
                    >
                        <FormControlLabel
                            value={name}
                            control={<Radio
                                sx={{
                                    color: '#A3A3A3',
                                    '&.Mui-checked': {
                                        color: '#F14445',
                                    },
                                    margin: '0',
                                }}
                            />}
                            label=""
                        />
                    </RadioGroup>
                </div>
            </div>
        </div>
    );
};

export default Item;
