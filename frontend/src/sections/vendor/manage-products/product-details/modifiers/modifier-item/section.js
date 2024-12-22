import React, { useState, useRef } from "react";
import { Button, Typography, IconButton, } from "@mui/material";

// Icons
import RemoveIcon from '@mui/icons-material/Remove';

// Components
import Item from "./item";

// -------------------------------------------------------------------------------------------------

export default function Section(props) {
    
    const handleRemoveItem = (numberToRemove) => {
        const updatedSectionNumbers = sectionNumbers.filter((number) => number !== numberToRemove);
        setSectionNumbers(updatedSectionNumbers);
        setAppendItemComponents((prevComponents) => (
            prevComponents.filter((component) => {
                const componentNumber = parseInt(component.props.number, 10);
                return componentNumber !== numberToRemove;
            })
        ));
    };

    const { number, removeSection, section, isPreview } = props;
    
    const [appendItemComponents, setAppendItemComponents] = useState([
        <Item key={1} number={1} removeItem={handleRemoveItem} item={section} isPreview={isPreview}/>
    ]);

    const [sectionNumbers, setSectionNumbers] = useState([1]); 
    const [sectionNum, setSectionNum] = useState(2); 
    const itemTargetRef = useRef(null);

    const handleRemoveClick = () => {
        removeSection(number);
    };

    return (
        <>
            <div className="flex flex-col gap-[16px] border rounded-[8px]">
                <div className="flex justify-between items-center p-[16px] pb-0">
                    <Typography variant="subtitle1">Item {number}</Typography>
                    {!isPreview && <IconButton className="bg-[#f6f6f6]" onClick={handleRemoveClick}><RemoveIcon sx={{ color: '#181818', fontSize: '18px' }} /></IconButton>}
                </div>

                <div className="flex flex-col" ref={itemTargetRef}>
                    {appendItemComponents.map((component, index) => (
                        <React.Fragment key={index}>{component}</React.Fragment>
                    ))}
                </div>
            </div>
        </>
    );
}