import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

// @mui
import {
    Card, Table, Stack, Paper, Avatar, Select, FormControl, Button, Popover, TableContainer, TableHead, Box, Grid, Drawer, styled, alpha, Radio, RadioGroup, FormLabel, 
    Checkbox, TableRow, Menu, MenuItem, TableBody, TableCell, Container, Typography, IconButton, TablePagination, OutlinedInput, InputAdornment, Stepper, Step, StepLabel,
    Tabs, Tab, useMediaQuery, useTheme, Fade, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Chip, FormControlLabel, FormGroup,
} from '@mui/material';

// Checkbox
const CheckboxList = ({ checkboxData }) => {
    const [checkboxes, setCheckboxes] = useState([]);

    // Initialize state based on checkboxData
    useEffect(() => {
        if (checkboxData) {
            const initialState = checkboxData.map(item => ({
                id: item.id,
                isChecked: false,
                label: item.label,
                subLabel: item.subLabel
            }));
            setCheckboxes(initialState);
        }
    }, [checkboxData]);

    const handleCheckboxChange = (id) => {
        setCheckboxes(prevState =>
            prevState.map(checkbox =>
                checkbox.id === id ? { ...checkbox, isChecked: !checkbox.isChecked } : checkbox
            )
        );
    };

    return (
        <div className='w-full'>
            {checkboxes.map(checkbox => (
                <div key={checkbox.id} className='w-full mb-2'>
                    <FormGroup className='w-full relative'>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checkbox.isChecked}
                                    onChange={() => handleCheckboxChange(checkbox.id)}
                                    sx={{
                                        color: 'rgba(0, 0, 0, 0.08)',
                                        padding: 0,
                                        '&.Mui-checked': {
                                            color: '#F14445',
                                        },
                                    }}
                                />
                            }
                            label={
                                <div className='ml-3'>
                                    {checkbox.label}<br />
                                    <span className="text-sm text-gray-500">{checkbox.subLabel}</span>
                                </div>
                            }
                            className={`items-start border ${checkbox.isChecked ? 'border-[#F14445]' : 'border-[rgba(0, 0, 0, 0.08)]'} rounded-[12px] w-full py-[12px] px-[16px] z-[100] mx-0`}
                        />
                    </FormGroup>
                </div>
            ))}
        </div>
    );
};

export default CheckboxList