import React from 'react'

// @mui
import {
    Select, FormControl, MenuItem, Typography, TextField,
} from '@mui/material';

// Assets
import { rackImg } from "src/assets";

const AnticipatedRackSpaceUsage = () => {
    
    return (
        <>
            <div className='w-full flex justify-center'>
                <div className='w-full flex flex-col sm:max-w-[624px] gap-[48px]'>
                    <div className='flex flex-col gap-[24px]'>
                        <Typography variant='h5' className='capitalize'>Rack space rent</Typography>
                        <div className='flex flex-col gap-[14px]'>
                            <Typography variant='h6'>Your rack space will be available for unlimited use on a month:</Typography>
                            <div className='flex flex-col sm:flex-row justify-between items-center sm:items-end gap-[40px]'>
                                <ul className='ml-[18px]'>
                                    <li className='list-disc pb-1'><Typography variant='subtitle2'>Unlimited order drop-offs between the hours of 7AM - 9PM PST, Monday - Sunday, 7 days a week</Typography></li>
                                    <li className='list-disc pb-1'><Typography variant='subtitle2'>As many orders as you can fit on your purchased shelves</Typography></li>
                                    <li className='list-disc pb-1'><Typography variant='subtitle2'>Location comes with a front-desk attendant to retrieve packages for your customer pickups</Typography></li>
                                    <li className='list-disc pb-1'><Typography variant='subtitle2'>Racks located in a secure location and only accessible by a Pickup Pointe team member</Typography></li>
                                    <li className='list-disc pb-1'><Typography variant='subtitle2'>Each rack can sustain a maximum of 3,000 pounds</Typography></li>
                                    <li className='list-disc pb-1'><Typography variant='subtitle2'>Curbside pickup eligible on most orders</Typography></li>
                                </ul>
                                <img src={rackImg} className='w-[304px]' loading="lazy"/>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col gap-[14px]'>
                        <Typography variant='h5' className='capitalize'>Choose the amount of racks or shelves you anticipate needing</Typography>
                        <Typography variant='subtitle2' className='-mt-[8px] text-normal'>You can scale up or down your space allocation at any time</Typography>
                        <div className='w-full flex flex-col sm:flex-row justify-between items-center gap-[14px]'>
                            <FormControl variant="standard" className='w-full sm:w-[30%]'>
                                <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Amount</label>
                                <TextField
                                    size="small"
                                    variant='outlined'
                                    required
                                    fullWidth
                                    placeholder='Enter amount'
                                />
                            </FormControl>
                            <FormControl className="w-full">
                                <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Racks or shelves</label>
                                <Select
                                    labelId="demo-simple-select-label"
                                    size="small"
                                    defaultValue={1}
                                >
                                <MenuItem value={1} className="!text-[12px] sm:!text-[14px] !font-gilroy">Racks - 241 in. x 121 in. of useable shelf space per rack</MenuItem>
                                <MenuItem value={2} className="!text-[12px] sm:!text-[14px] !font-gilroy">Racks - 241 in. x 121 in. of useable shelf space per rack</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </div>

                    <div className='flex flex-col gap-[14px]'>
                        <div className='flex flex-col sm:flex-row justify-between items-center'>
                            <Typography variant='h5' className='capitalize'>Estimated subscription cost</Typography>
                            <Typography variant='h3' className=''>$450/month</Typography>
                        </div>
                        <div className='w-full sm:w-[70%]'>
                            <Typography variant='subtitle2' className='-mt-[8px] text-normal'>You will be charged once a month regardless of rack space usage, with unlimited access to your rack</Typography>
                        </div>
                    </div>
                </div>
            </div>
            
        </>
    )
}

export default AnticipatedRackSpaceUsage;