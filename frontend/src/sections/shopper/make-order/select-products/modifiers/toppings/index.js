import React, { useState } from "react";
import { IconButton, Typography } from "@mui/material";

// Icons
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// Components
import Item from './item';

// Assets
import { modifier_1, modifier_2, modifier_3, modifier_4, modifier_5, modifier_6 } from 'src/assets';

// Sample data
const data = [
    {
        category: 'Cheese Varieties',
        content: [
            {
                id: '1',
                img: modifier_1,
                name: 'Cheddar',
                price: '+$5.20',
            },
            {
                id: '2',
                img: modifier_2,
                name: 'Parmesan',
                price: '+$6.20',
            },
            {
                id: '3',
                img: modifier_3,
                name: 'Provolone',
                price: '+$12.20',
            },
        ],
    },
    {
        category: 'Meat Varieties',
        content: [
            {
                id: '4',
                img: modifier_4,
                name: 'Pepperoni',
                price: '+$8.00',
            },
            {
                id: '5',
                img: modifier_5,
                name: 'Bacon',
                price: '+$9.00',
            },
            {
                id: '6',
                img: modifier_6,
                name: 'Ham',
                price: '+$12.00',
            },
        ],
    },    
];

const Toppings = () => {
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
                <Typography variant="h6">Toppings</Typography>
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

export default Toppings;
