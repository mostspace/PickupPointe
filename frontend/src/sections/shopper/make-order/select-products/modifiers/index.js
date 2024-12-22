import React from "react";

// @mui
import { Typography, IconButton, } from '@mui/material';

// Components
import Toppings from './toppings';
import AddOns from './add-ons';
import SideDishes from "./side-dishes";
import PortionSize from "./portion-size";

// --------------------------------------------------------------------------------------------------

const Modifiers = () => {
    
    return (
        <>
            <div className="w-full">
                <div className="w-full flex flex-col gap-[24px]">
                    <PortionSize />
                    <Toppings />
                    <AddOns />
                    <SideDishes />
                </div>
            </div>
        </>
    );
}


export default Modifiers;