import React, { useState, useCallback, } from "react";
import { useNavigate, useLocation } from 'react-router-dom';

// Assets
import { NOTIFICATIONS_SORT_OPTIONS } from "src/_mock/assets";
import { NOTIFICATIONS_FILTER_OPTIONS } from "src/_mock/assets";

// Components
import DropdownMenu from "src/components/dropdown-menu";
import Pagination from 'src/components/pagination/';

// Icons
import CircleIcon from '@mui/icons-material/Circle';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

// @mui
import {
    FormControl, Typography, IconButton, TextField,
} from '@mui/material';

// ------------------------------------------------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------------------------------------------------

export default function Main({formData}) {

    // Notifications SortBy
    const [sortBy, setSortBy] = useState('Date, new first');

    const handleSortBy = useCallback((newValue) => {
        setSortBy(newValue);
    }, []);

    // Notifications FilterBy
    const [filterBy, setFilterBy] = useState('Drop-off');

    const handleFilterBy = useCallback((newValue) => {
        setFilterBy(newValue);
    }, []);

    // Redirect previous page
    const navigate = useNavigate();
    const location = useLocation(); // Get the current location

    const handleBack = () => {
        // Navigate one step back in history using the current location
        navigate(-1); // Navigate to the previous route
    };

    return (
        <>
            <div className="w-full flex justify-center">
                <div className="flex flex-col gap-[32px] w-[624px]">
                    <div className="flex gap-[16px] items-center">
                        <IconButton onClick={handleBack}><KeyboardBackspaceIcon className="text-[28px] text-heading"/></IconButton> 
                        <Typography variant="h3">Notifications</Typography>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-end gap-[16px] mt-[8px]">
                        <FormControl variant="standard" className='w-full'>
                            <TextField
                                size="small"
                                variant='outlined'
                                required
                                fullWidth
                                placeholder='Search notification name, date, or keyword...'
                            />
                        </FormControl>
                        <div className="w-full flex justify-between">
                            <DropdownMenu title="Sort:" sort={sortBy} onSort={handleSortBy} sortOptions={NOTIFICATIONS_SORT_OPTIONS} />
                            <DropdownMenu title="Filter:" sort={filterBy} onSort={handleFilterBy} sortOptions={NOTIFICATIONS_FILTER_OPTIONS} />
                        </div>
                    </div>
                    <div className="pl-[15px]">
                        <ul>
                            <li className="list-disc list-outside text-primary border-b py-[12px] last:border-0">
                                <Typography variant="subtitle2" className="text-pimary list-desc"><span className="text-primary">Warning:</span> An item <span className="underline">“Kiwi”</span> is nearing expiration and will be tossed soon</Typography>
                                <div className="flex items-center gap-[6px]">
                                    <Typography variant="label">7:12 AM</Typography>
                                    <CircleIcon className="text-[4px] text-gray-400" />
                                    <Typography variant="label">May 20</Typography>
                                </div>
                            </li>
                            <li className="list-disc list-outside text-primary border-b py-[12px] last:border-0">
                                <Typography variant="subtitle2" className="text-pimary list-desc">We have received your drop-off for <span className="underline">DD834703835</span></Typography>
                                <div className="flex items-center gap-[6px]">
                                    <Typography variant="label">6:12 PM</Typography>
                                    <CircleIcon className="text-[4px] text-gray-400" />
                                    <Typography variant="label">May 19</Typography>
                                </div>
                            </li>
                            <li className="list-disc list-outside text-primary border-b py-[12px] last:border-0">
                                <Typography variant="subtitle2" className="text-pimary list-desc">Pickup order <span className="underline">PP9730823</span>has been picked up</Typography>
                                <div className="flex items-center gap-[6px]">
                                    <Typography variant="label">6:12 PM</Typography>
                                    <CircleIcon className="text-[4px] text-gray-400" />
                                    <Typography variant="label">May 19</Typography>
                                </div>
                            </li>
                            <li className="list-disc list-outside text-primary border-b py-[12px] last:border-0">
                                <Typography variant="subtitle2" className="text-pimary list-desc">Your drop-off <span className="underline">DD83739403</span> is overdue!</Typography>
                                <div className="flex items-center gap-[6px]">
                                    <Typography variant="label">6:12 PM</Typography>
                                    <CircleIcon className="text-[4px] text-gray-400" />
                                    <Typography variant="label">May 18</Typography>
                                </div>
                            </li>
                            <li className="text-primary border-b py-[12px] last:border-0">
                                <Typography variant="subtitle2" className="text-pimary list-desc"><span className="text-primary">Warning:</span> An item <span className="underline">Banana</span>is nearing expiration and will be tossed soon</Typography>
                                <div className="flex items-center gap-[6px]">
                                    <Typography variant="label">6:12 PM</Typography>
                                    <CircleIcon className="text-[4px] text-gray-400" />
                                    <Typography variant="label">May 20</Typography>
                                </div>
                            </li>
                            <li className="text-primary border-b py-[12px] last:border-0">
                                <Typography variant="subtitle2" className="text-pimary list-desc">We have received your drop-off for <span className="underline">DD673204801</span></Typography>
                                <div className="flex items-center gap-[6px]">
                                    <Typography variant="label">6:12 PM</Typography>
                                    <CircleIcon className="text-[4px] text-gray-400" />
                                    <Typography variant="label">May 19</Typography>
                                </div>
                            </li>
                            <li className="text-primary border-b py-[12px] last:border-0">
                                <Typography variant="subtitle2" className="text-pimary list-desc">Pickup order <span className="underline">PP1802735</span>has been picked up</Typography>
                                <div className="flex items-center gap-[6px]">
                                    <Typography variant="label">3:34 PM</Typography>
                                    <CircleIcon className="text-[4px] text-gray-400" />
                                    <Typography variant="label">May 19</Typography>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="flex justify-center">
                        <Pagination />
                    </div>
                </div>
            </div>
        </>
    )
}