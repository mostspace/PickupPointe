import React, { useState, useRef, useEffect } from "react";
import { Button } from "@mui/material";
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';

// Components
import OrderItem from "./order-item";
import PhoneNumberMaskInput from "src/components/phonenumber-mask-input";

// Assests
import { icTrash } from "src/assets";
import PhoneNumberInput from "src/components/phonenumber";

// -------------------------------------------------------------------------------------------------

export default function OrderSection(props) {
    
    const handleRemoveItem = (numberToRemove) => {
        // Filter the orderNumbers array to remove the specified number
        const updatedOrderNumbers = orderNumbers.filter((number) => number !== numberToRemove);

        // Update the orderNumbers state
        setOrderNumbers(updatedOrderNumbers);

        // Filter the appendItemComponents array to remove the corresponding item
        setAppendItemComponents((prevComponents) => (
            prevComponents.filter((component) => {
                const componentNumber = parseInt(component.props.number, 10);
                return componentNumber !== numberToRemove;
            })
        ));
    };

    const { number, removeSection, dropoff } = props;
    
    const [appendItemComponents, setAppendItemComponents] = useState([
        // Initial item
        <OrderItem key={1} number={1} removeItem={handleRemoveItem} />
    ]);

    const [orderNumbers, setOrderNumbers] = useState([1]); // New array to store order numbers
    const [orderNum, setOrderNum] = useState(2); // State to keep track of order number
    const itemTargetRef = useRef(null);

    const handleAddOrderItem = () => {
        setOrderNum(prevOrderNum => prevOrderNum + 1);
        // Create a new component to append
        const newComponent = <OrderItem key={orderNum} number={orderNum} removeItem={handleRemoveItem} />;
        // Update the state by adding the new component
        setAppendItemComponents([...appendItemComponents, newComponent]);
        // Update the orderNumbers array
        setOrderNumbers([...orderNumbers, orderNum]);
    };

    const [radioValue, setRadioValue] = useState("team");

    const handleRadioTabChange = (event) => {
        setRadioValue(event.target.value);
    };

    const handleRemoveClick = () => {
        handleDeleteOrderModalClose();
        removeSection(number);
    };

    // ====================== Delete Order Modal ===========================

    const [openDeleteOrderModal, setOpenDeleteOrderModal] = React.useState(false);

    const handleDeleteOrderModalOpen = () => {
        setOpenDeleteOrderModal(true);
    };

    const handleDeleteOrderModalClose = () => {
        setOpenDeleteOrderModal(false);
    };

    return (
        <>
            <div className="flex flex-col gap-[16px]">
                <div className="flex justify-between items-center">
                    <h6 className="text-heading text-[20px] font-medium capitalize">Order #{number}</h6>
                    <Button
                        sx={{
                            width: '24px',
                            minWidth: 'unset',
                            height: '24px',
                            padding: '0 !important',
                            fontSize: '10px',
                            color: '#181818',
                            borderRadius: '50%',
                            backgroundColor: '#f6f6f6',
                            textTransform: 'unset',
                        }}
                        onClick={handleDeleteOrderModalOpen}
                    >
                        <RemoveIcon className="" sx={{ color: '#181818', fontSize: '18px' }} />
                    </Button>
                </div>

                <div className="sm:flex justify-between items-center gap-[24px]">
                    <FormControl variant="standard" className='w-full !mb-2 sm:!mb-0'>
                        <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>{dropoff === 'dropoff_orders' ? 'Pickup name' : 'Receiving location contact'}</label>
                        <TextField
                            size="small"
                            variant='outlined'
                            required
                            fullWidth
                            placeholder='Enter location contact'
                        />
                    </FormControl>
                    <FormControl variant="standard" className='w-full'>
                        <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Phone number</label>
                        {/* <TextField
                            InputProps={{
                                inputComponent: PhoneNumberMaskInput,
                            }}
                            size="small"
                            variant='outlined'
                            required
                            fullWidth
                            placeholder='Enter pickup phone number'
                        /> */}
                        <PhoneNumberInput
                            name="phonenumber"
                            placeholder="Enter pickup phone number"
                            fullWidth
                            onChange={() => {}}
                        />
                    </FormControl>
                </div>

                <div className="flex flex-col border rounded-[8px]" ref={itemTargetRef}>
                    {appendItemComponents.map((component, index) => (
                        <React.Fragment key={index}>{component}</React.Fragment>
                    ))}

                    <div className="p-[16px] border-t">
                        <div className="flex gap-[8px]">
                            <Button
                                sx={{
                                    width: '250px',
                                    height: '44px',
                                    fontFamily: 'Gilroy',
                                    fontSize: '14px',
                                    color: '#181818',
                                    borderRadius: '8px',
                                    backgroundColor: 'transparent',
                                    textTransform: 'unset',
                                }}
                                onClick={handleAddOrderItem}
                            >
                                <AddIcon className="mr-2" sx={{ color: '#181818', fontSize: '18px' }} />
                                {dropoff === 'dropoff_orders' ? 'Add new item to this drop-off' : 'Add new item to this order'}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-[8px] w-full">
                    <div className="sm:flex justify-between items-center">
                        <h6 className="text-[#666] text-[14px] mb-2 sm:mb-0">Important notes</h6>
                        <div>
                            <FormControl>
                                <RadioGroup
                                    row
                                    value={radioValue}
                                    onChange={handleRadioTabChange}
                                    aria-label="tabs"
                                    name="tabs"
                                >
                                    <FormControlLabel
                                        value="team"
                                        control={<Radio sx={{ '&.Mui-checked': { color: '#F14445', fontSize: '12px' } }} size="small" />}
                                        label={<span className="text-[14px]">Internal notes</span>}
                                    />
                                    {dropoff === 'dropoff_orders' && (
                                        <FormControlLabel
                                            value="customers"
                                            control={<Radio sx={{ '&.Mui-checked': { color: '#F14445' } }} size="small"/>}
                                            label={<span className="text-[14px]">Visible to customers</span>}
                                        />
                                    )}
                                </RadioGroup>
                            </FormControl>
                        </div>
                    </div>
                    <TextareaAutosize maxRows="10" minRows='2' className="border rounded-[8px] p-[16px] text-[14px]" placeholder="Enter important notes for this order" />
                </div>
            </div>

            {/* Delete Order Modal */}
            <React.Fragment>
                <Dialog className="w-full"
                    open={openDeleteOrderModal}
                    onClose={handleDeleteOrderModalClose}
                    sx={{
                        width: "100% !important",
                    }}
                >
                    <DialogTitle id="" className='pt-[32px] sm:!pt-[64px] flex flex-col gap-[6px] items-center'>
                        <img src={icTrash} className='w-[40%]'/>
                    </DialogTitle>
                    <DialogContent dividers={scroll === 'paper'}>
                        <DialogContentText
                            id="scroll-dialog-description"
                            tabIndex={-1}
                        >
                            <div className='flex flex-col gap-[14px] font-gilroy sm:px-[60px] py-[16px]'>
                                <h1 className='text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center font-gilroy'>Are you sure you want to delete the order?</h1>
                                <p className='text-normal font-light leading-[25px] text-[16px] text-center'>You won’t be able to recover it afterwards.</p>
                            </div>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions className="!px-[22px] !pb-[32px] sm:!pb-[64px] sm:!px-[80px] !gap-[14px]">
                        <Button 
                            sx={{
                                width: '100%',
                                height: '44px',
                                fontFamily: 'Gilroy',
                                fontSize: '14px',
                                color: '#181818',
                                borderRadius: '8px',
                                backgroundColor: '#F5F5F5',
                                textTransform: 'unset',
                            }}
                            onClick={handleDeleteOrderModalClose}
                        >
                        Cancel
                        </Button>
                        <Button className='w-full'
                            sx={{
                                width: '100%',
                                height: '44px',
                                fontFamily: 'Gilroy',
                                fontSize: '14px',
                                color: '#ffffff',
                                // color: isFormValid() ? '#ffffff' : '#181818',  // Change text color if needed
                                borderRadius: '8px',
                                backgroundColor: '#F14445',
                                // backgroundColor: isFormValid() ? '#F14445' : '#F5F5F5',  // Change background color
                                textTransform: 'unset',
                                '&:hover': {
                                    backgroundColor: '#E13031',
                                    // backgroundColor: isFormValid() ? '#E13031' : '#F5F5F5',  // Change hover background color
                                }
                            }}
                            onClick={handleRemoveClick}
                        > 
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        </>
    );
}
