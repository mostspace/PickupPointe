import React, { useState } from "react";
import { IconButton, FormControl, FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CircleIcon from '@mui/icons-material/Circle';

// Sample data
const data = [
    {
        category: '',
        content: [
            {
                id: '1',
                size: 'Small',
                name: '1-2 people',
                price: '',
            },
            {
                id: '2',
                size: 'Medium',
                name: '2-3 people',
                price: '+$10.00',
            },
            {
                id: '3',
                size: 'Large',
                name: '3-4 people',
                price: '+$12.00',
            },
        ],
    },  
];

const PortionSize = () => {
    // State to control item content visibility
    const [expanded, setExpanded] = useState(true);
    // State to control selected item
    const [selectedItem, setSelectedItem] = useState(null);

    // Handle item click to toggle selection
    const handleItemClick = (id) => {
        setSelectedItem(id);
    };

    // Handle radio button change
    const handleRadioChange = (event) => {
        setSelectedItem(event.target.value); // Set the selected item based on the radio button value
    };

    // Toggle expand/collapse
    const handleExpandToggle = () => {
        setExpanded((prevExpanded) => !prevExpanded);
    };

    return (
        <div className="w-full flex flex-col p-[16px] border rounded-[8px]">
            <div className="flex justify-between items-center">
                <Typography variant="h6">Portion size</Typography>
                <IconButton 
                    className={`expand-item w-[32px] h-[32px] transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                    onClick={handleExpandToggle}
                >
                    <KeyboardArrowDownIcon className="w-[16px]" />
                </IconButton>
            </div>
            <div className={`item-container overflow-hidden transition-all duration-100 ${expanded ? 'max-h-screen mt-[24px]' : 'max-h-0'}`}>
                <FormControl className="w-full">
                    <RadioGroup
                        value={selectedItem}
                        onChange={handleRadioChange}
                        name="item-selection"
                        sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                    >
                        {data.map((categoryData, categoryIndex) => (
                            <div key={categoryIndex} className="item-content flex flex-col gap-[12px]">
                                <Typography variant="subtitle2">{categoryData.category}</Typography>
                                {categoryData.content.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`modifier-item w-full border rounded-[8px] p-[8px] cursor-pointer ${selectedItem === item.id ? 'border-red-500' : 'border-gray-300'}`}
                                        onClick={() => handleItemClick(item.id)}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-end gap-[5px]">
                                                <Typography variant="subtitle2">{item.size}</Typography>
                                                <CircleIcon className="w-[3px] mt-[2px]" />
                                                <Typography variant="label">{item.name}</Typography>
                                            </div>
                                            <div className="flex items-center gap-[5px]">
                                                <Typography variant="subtitle2">{item.price}</Typography>
                                                <FormControlLabel
                                                    value={item.id} // Make sure this is the unique ID of the item
                                                    control={<Radio
                                                        sx={{
                                                            color: '#A3A3A3',
                                                            '&.Mui-checked': {
                                                                color: '#F14445',
                                                            },
                                                            margin: '0',
                                                        }}
                                                        // `onChange` isn't necessary here as it will be controlled by RadioGroup
                                                    />}
                                                    sx={{margin: '0'}}
                                                    label=""
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </RadioGroup>
                </FormControl>
            </div>
        </div>
    );
};

export default PortionSize;
