import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";

// @mui
import {
  Button, IconButton, FormControl, TextField, Popover, MenuItem, Collapse 
} from "@mui/material";

import { UploadImg, } from "src/assets";

// Icons
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Components
import Section from "./section";
import Iconify from "src/components/iconify/iconify";

const ModifierItem = ({ removeModifier, modifier, isPreview }) => {
  const [sections, setSections] = useState(modifier.modifierItems || []);
  const [sectionNum, setSectionNum] = useState(1);
  const SectionTargetRef = useRef(null);
  const handleAddSection = () => {
    // setSections((prevSections) => [...prevSections, { number: sectionNum }]);
    // setSectionNum((prevNum) => prevNum + 1);

    setSections((prevSections) => [...prevSections, { number: sectionNum, img: UploadImg, item_name: "", price: "" },]);
    setSectionNum((prevNum) => prevNum + 1);
  };

  const handleRemoveSection = (numberToRemove) => {
    setSections((prevSections) =>
      prevSections.filter((section) => section.number !== numberToRemove)
    );
  };

  const handleModifier = () => {
    if (sections.length > 0) {
      setSections([]);
    } else {
      handleAddSection();
    }
  };

  const [modifierName, setModifierName] = useState(modifier.name);

  const handleModifierNameChange = (event) => {
    setModifierName(event.target.value);
  };

  // Modifier Item Setting Popover Menu
  const [openModifierItemMenu, setOpenModifierItemMenu] = useState(null);

  const handleModifierItemMenuOpen = (event) => {
    setOpenModifierItemMenu(event.currentTarget);
  };

  const handleModifierItemMenuClose = () => {
    setOpenModifierItemMenu(null);
  };

  // Toggle modifier section
  const [isSectionOpen, setIsSectionOpen] = useState(false);

  const toggleSection = () => {
      setIsSectionOpen((prevState) => !prevState);
  }

  return (
    <>
      <div className="flex flex-col gap-[16px] border rounded-[8px] p-[12px]" ref={SectionTargetRef}>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-[16px]">
          <FormControl variant="outlined" className="flex-grow">
            <TextField
              value={modifierName}
              onChange={handleModifierNameChange}
              size="small"
              variant="standard"
              placeholder="Enter modifier group name"
              InputProps={{
                disableUnderline: true,
                sx: {
                  fontSize: "16px",
                  fontFamily: "Gilroy",
                  border: "unset",
                  padding: 0,
                  "& .MuiInputBase-input": {
                    color: "#181818",
                  },
                },
              }}
              InputLabelProps={{
                sx: {
                  color: "#181818",
                  fontSize: "14px",
                  fontFamily: "Gilroy",
                  transform: "none",
                  position: "relative",
                },
                shrink: false,
              }}
              disabled={!sections.length > 0}
            />
          </FormControl>
          <div className="flex gap-[16px] items-center">
            <FormControl variant="outlined" className="w-full">
              <TextField
                label="Required"
                type="number"
                size="small"
                variant="outlined"
                value={modifier.required}
                InputLabelProps={{
                  sx: {
                    color: "#181818",
                    fontSize: "14px",
                    fontFamily: "Gilroy",
                  },
                }}
                disabled={!sections.length > 0 || isPreview}
              />
            </FormControl>
            <FormControl variant="standard" className="w-full">
              <TextField
                label="Max"
                type="number"
                size="small"
                variant="outlined"
                value={modifier.max}
                InputLabelProps={{
                  sx: {
                    color: "#181818",
                    fontSize: "14px",
                    fontFamily: "Gilroy",
                  },
                }}
                disabled={!sections.length > 0 || isPreview}
              />
            </FormControl>
            {!isPreview && <IconButton
              sx={{ backgroundColor: "#f6f6f6" }}
              onClick={handleModifier}
            >
              {sections.length > 0 ? (
                <RemoveIcon sx={{ color: "#181818", fontSize: "18px" }} />
              ) : (
                <AddIcon sx={{ color: "#181818", fontSize: "18px" }} />
              )}
            </IconButton>}
            <IconButton onClick={toggleSection}>  
              <ExpandMoreIcon className={`text-heading text-[22px] transition duration-300 ease-in-out ${isSectionOpen ? 'rotate-180' : ''}`} />
            </IconButton>
            <IconButton
              size="large"
              color="inherit"
              onClick={handleModifierItemMenuOpen}
            >
              <Iconify icon={"eva:more-vertical-fill"} />
            </IconButton>
          </div>
        </div>

        <Collapse in={isSectionOpen}>
          <div className="flex flex-col gap-[14px]">
            {sections.map((section, index) => (
              <Section
                key={index}
                number={index + 1}
                section={section}
                removeSection={handleRemoveSection}
                isPreview={isPreview}
              />
            ))}
          </div>
        </Collapse>
        

        {!isPreview && sections.length > 0 && (
          <div className="flex justify-between">
            <Button
              sx={{
                width: "w-fit",
                height: "44px",
                fontFamily: "Gilroy",
                fontSize: "14px",
                color: "#181818",
                borderRadius: "8px",
                backgroundColor: "#F5F5F5",
                textTransform: "unset",
                lineHeight: '1.2',
              }}
              onClick={handleAddSection}
            >
              <AddIcon
                className="mr-2"
                sx={{ color: "#181818", fontSize: "18px" }}
              />{" "}
              Add new item to this modifier group
            </Button>
            <Button
              type="submit"
              className="w-48"
              sx={{
                padding: '8px 40px',
                height: '44px',
                fontFamily: 'Gilroy',
                fontSize: '14px',
                color: "rgba(254, 254, 255, 1)", // Change text color if needed
                borderRadius: "8px",
                backgroundColor: "rgba(241, 68, 69, 1)", // Change background color
                textTransform: "unset",
                "&:hover": {
                  backgroundColor: "rgba(300, 68, 69, 1)", // Change hover background color
                },
              }}
            >
              Save
            </Button>
          </div>
        )}
      </div>

      {/* Modifier Item Setting Popover */}
      <Popover
        open={Boolean(openModifierItemMenu)}
        anchorEl={openModifierItemMenu}
        onClose={handleModifierItemMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 1,
            width: 210,
            "& .MuiMenuItem-root": {
              px: 1,
              typography: "body2",
              borderRadius: 0.75,
              fontFamily: "Gilroy",
            },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            removeModifier(); // Call the remove function
            handleModifierItemMenuClose(); // Close the menu after deleting
          }}
          sx={{ color: "error.main", fontFamily: "Gilroy" }}
        >
          Remove modifier
        </MenuItem>
      </Popover>
    </>
  );
};

export default ModifierItem;
