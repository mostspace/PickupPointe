import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
// @mui
import { Button, IconButton, FormControl, TextField, Popover, MenuItem, Collapse } from "@mui/material";
// Icons
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// Components
import Section from "./section";
import Iconify from "src/components/iconify/iconify";
import DefaultButton from "src/components/button/default-button";
import { addModifier, removeModifier, updateModifier } from "src/api/vendor/modifier";
import { toast } from "react-toastify";
import IOSSwitch from "../../ios-switch/index.js";

const ModifierItem = ({ modifier, setModifiers }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [sections, setSections] = useState([]);
    const [photoFiles, setPhotoFiles] = useState([]);
    const SectionTargetRef = useRef(null);
    const defaultValues = {
        name: "",
        modifierRequired: 0,
        max: 0,
    }
    const { register, handleSubmit, formState: { errors }, formState, setValue, getValues } = useForm({ defaultValues });

    const handleAddSection = () => {
        setSections((prevSections) => [
            ...prevSections,
            { id: prevSections.length, itemName: "", price: 0, hasPhoto: false, }
        ]);
    };

    const handleSection = (e, number) => {
        setSections((prevSections) =>
            prevSections.map((section, index) => {
                if (index === number) {
                    return {
                        ...section,
                        [e.target.name]: e.target.value, // Update the value based on the input name
                    };
                }
                return section; // Return other sections unchanged
            })
        );
    }

    const handlePhotoFiles = (file, index) => {
        setPhotoFiles((prevFiles) => {
            const updatedFiles = [...prevFiles];
            updatedFiles[index] = file;
            return updatedFiles;
        })
    };

    const handleRemoveSection = (numberToRemove) => {
        setSections((prevSections) => prevSections.filter((section, index) => index !== numberToRemove));
    };

    // Toggle modifier section
    const [isSectionOpen, setIsSectionOpen] = useState(false);

    const toggleSection = () => {
        setIsSectionOpen((prevState) => !prevState);
    }

    // Modifier Item Setting Popover Menu
    const [openModifierItemMenu, setOpenModifierItemMenu] = useState(null);

    const handleModifierItemMenuOpen = (event) => {
        setOpenModifierItemMenu(event.currentTarget);
    };

    const handleModifierItemMenuClose = () => {
        setOpenModifierItemMenu(null);
    };

    const onSubmit = async (data) => {
        setIsLoading(true);
        const isUpdate = data._id ? true : false
        try {
            const payload = {
                name: data.modifierName,
                required: data.modifierRequired,
                max: data.max,
                items: sections.map(section => ({
                    name: section.itemName,
                    price: section.price,
                    hasPhoto: section.hasPhoto || (section.photo ? true : false),
                    id: section._id,
                    isCreate: section._id ? false : true,
                    photoStatus: section.photoStatus
                })),
                photos: photoFiles
            }
            if (isUpdate) {
                await updateModifier(payload, data._id)
                toast("Modifier group updated successfully", {type: "success", className: 'toast-custom'})
            } else {
                await addModifier(payload)
                toast("Successfully added new modifier group", {type: "success", className: 'toast-custom'})
            }
        } catch (error) {
            if (isUpdate) {
                toast("Modifier group update failed", { type: "error", className: 'toast-custom' })
            } else {
                toast("Adding modifier group failed", { type: "error", className: 'toast-custom' })
            }
        }
        setIsLoading(false);
    }

    const onRemove = async () => {
        setIsLoading(true);
        handleModifierItemMenuClose();
        const id = getValues()._id
        try {
            if (id) {
                await removeModifier(id)
                setModifiers(prev => {
                    const eIndex = prev.findIndex(elem => elem._id === id)
                    return prev.filter((_elem, index) => index !== eIndex)
                })
            } else {
                setModifiers(prev => {
                    const eIndex = prev.findIndex(elem => elem.id === getValues().id)
                    return prev.filter((_elem, index) => index !== eIndex)
                })
            }
            toast("Modifier group deleted successfully", { type: "success", className: 'toast-custom' })
        } catch (error) {
            toast("Modifier group failed to delete", { type: "error", className: 'toast-custom' })
        }
        setIsLoading(false);
    }

    useEffect(() => {
        setValue('_id', modifier._id)
        setValue('id', modifier.id)
        setValue('modifierName', modifier.name)
        setValue('modifierRequired', modifier.required)
        setValue('max', modifier.max)
        setSections(modifier.modifierItems.map((item, index) => ({
            ...item,
            number: index + 1,
            itemName: item.name,
        })))
    }, [modifier])

    useEffect(() => {
        if (modifier.isCreate) {
            setIsSectionOpen(true)
        } 
    }, [])

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-[16px] border rounded-[8px] p-[12px]" ref={SectionTargetRef}>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-[16px]">
                    <FormControl variant="outlined" className="w-full flex-grow">
                        <TextField
                            type="text"
                            {...register("modifierName", { required: "Name is required" })}
                            required
                            size="small"
                            variant="outlined"
                            placeholder="Enter modifier group name"
                            InputProps={{
                                disableUnderline: true,
                                sx: {
                                    fontSize: '16px',
                                    fontFamily: 'Gilroy',
                                    border: 'unset',
                                    padding: 0,
                                    '& .MuiInputBase-input': {
                                        color: '#181818',
                                    },
                                },
                            }}
                            InputLabelProps={{
                                sx: {
                                    color: '#181818',
                                    fontSize: '14px',
                                    fontFamily: 'Gilroy',
                                    transform: 'none',
                                    position: 'relative',
                                },
                                shrink: false,
                            }}
                            disabled={!isSectionOpen}
                        />
                    </FormControl>
                    <div className="w-full flex gap-[16px] items-center">
                        <FormControl variant="outlined" className='w-full'>
                            <TextField
                                required
                                label="Required"
                                type="number"
                                size="small"
                                variant='outlined'
                                {...register("modifierRequired", {
                                    // required: "Required field is required",
                                    // validate: (value) => value >= 0 || "Delivery time is required"
                                })}
                                InputLabelProps={{
                                    sx: {
                                        color: '#181818',
                                        fontSize: '14px',
                                        fontFamily: 'Gilroy',
                                    },
                                }}
                                disabled={!isSectionOpen}
                            />
                        </FormControl>
                        <FormControl variant="standard" className='w-full'>
                            <TextField
                                required
                                label="Max"
                                type="number"
                                size="small"
                                {...register("max",
                                    {
                                        // required: "Max is required",
                                        // validate: (value) => value >= 0 || "Delivery time is required"
                                    })}
                                variant='outlined'
                                InputLabelProps={{
                                    sx: {
                                        color: '#181818',
                                        fontSize: '14px',
                                        fontFamily: 'Gilroy',
                                    },
                                }}
                                disabled={!isSectionOpen}
                            />
                        </FormControl>
                        <div className="flex items-center">
                            <IconButton onClick={toggleSection}> 
                                <ExpandMoreIcon className={`text-heading text-[22px] transition duration-300 ease-in-out ${isSectionOpen ? 'rotate-180' : ''}`} />
                            </IconButton>
                            <IconButton size="large" color="inherit" onClick={handleModifierItemMenuOpen}>
                                <Iconify icon={'eva:more-vertical-fill'} />
                            </IconButton>
                        </div>
                    </div>
                </div>

                <Collapse in={isSectionOpen}>
                    <div className="flex flex-col gap-[16px]">
                        {sections.map((section, index) => (
                            <Section
                                key={section._id}
                                index={index}
                                section={section}
                                handleSection={handleSection}
                                handlePhotoFiles={handlePhotoFiles}
                                removeSection={handleRemoveSection}
                            />
                        ))}
                        {sections.length > 0 && (
                            <div className="flex flex-col sm:flex-row justify-between gap-[12px]">
                                <Button
                                    sx={{
                                        width: 'w-fit',
                                        height: '44px',
                                        fontFamily: 'Gilroy',
                                        lineHeight: '18px',
                                        fontSize: '14px',
                                        color: '#181818',
                                        borderRadius: '8px',
                                        backgroundColor: '#F5F5F5',
                                        textTransform: 'unset',
                                    }}
                                    onClick={handleAddSection}
                                >
                                    <AddIcon className="mr-2" sx={{ color: '#181818', fontSize: '18px' }} /> Add new item to this modifier group
                                </Button>
                                <DefaultButton value="Save modifier group" sx={{padding: '8px 10px'}} type="submit" loading={isLoading}/>
                            </div>
                        )}
                    </div>
                </Collapse>
            </div>

            {/* Modifier Item Setting Popover */}
            <Popover
                open={Boolean(openModifierItemMenu)}
                anchorEl={openModifierItemMenu}
                onClose={handleModifierItemMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    sx: {
                        p: 1,
                        width: 210,
                        '& .MuiMenuItem-root': {
                            px: 1,
                            typography: 'body2',
                            borderRadius: 0.75,
                            fontFamily: 'Gilroy'
                        },
                    },
                }}
            >
                <MenuItem onClick={() => onRemove()} sx={{ color: 'error.main', fontFamily: 'Gilroy' }}>
                    Delete modifier group
                </MenuItem>
            </Popover>
        </form>
    );
};

export default ModifierItem;