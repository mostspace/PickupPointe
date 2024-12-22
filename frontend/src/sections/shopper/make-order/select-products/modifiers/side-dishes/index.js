import React, { useState } from "react";
import { IconButton, Typography } from "@mui/material";

// Icons
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// Components
import Item from './item';

// Assets
import { modifier_10, modifier_11 } from 'src/assets';

// Sample data
const data = [
    {
        category: 'Salads',
        content: [
            {
                id: '1',
                img: modifier_10,
                name: 'Caesar Salad',
                price: '+$9.00',
            },
            {
                id: '2',
                img: modifier_10,
                name: 'Garden Salad',
                price: '+$12.00',
            },
        ],
    },  
];

const SideDishes = () => {
    // Maintain a set of selected item IDs
    const [selectedItems, setSelectedItems] = useState(new Set());
    // State to control item content visibility
    const [expanded, setExpanded] = useState(true);

    // Handle item click to toggle selection
    const handleItemClick = (id) => {
        setSelectedItems((prevSelected) => {
            const newSelected = new Set(prevSelected);
            if (newSelected.has(id)) {
                newSelected.delete(id); // Deselect item
            } else {
                newSelected.add(id); // Select item
            }
            return newSelected;
        });
    };

    // Toggle expand/collapse
    const handleExpandToggle = () => {
        setExpanded((prevExpanded) => !prevExpanded);
    };

    return (
        <div className="w-full flex flex-col p-[16px] border rounded-[8px]">
            <div className="flex justify-between items-center">
                <Typography variant="h6">SideDishes</Typography>
                <IconButton 
                    className={`expand-item w-[32px] h-[32px] transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                    onClick={handleExpandToggle}
                >
                    <KeyboardArrowDownIcon className="w-[16px]" />
                </IconButton>
            </div>
            <div className={`item-container overflow-hidden transition-all duration-100 ${expanded ? 'max-h-screen mt-[24px]' : 'max-h-0'}`}>
                <div className="flex flex-col gap-[24px]">
                    {data.map((categoryData, categoryIndex) => (
                        <div key={categoryIndex} className="item-content flex flex-col gap-[12px]">
                            <Typography variant="subtitle2">{categoryData.category}</Typography>
                            {categoryData.content.map((item) => (
                                <Item
                                    key={item.id}
                                    img={item.img}
                                    name={item.name}
                                    price={item.price}
                                    isSelected={selectedItems.has(item.id)}
                                    onClick={() => handleItemClick(item.id)}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SideDishes;
