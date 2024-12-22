import React from "react";
import { Button } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import RemoveIcon from "@mui/icons-material/Remove";

// -------------------------------------------------------------------------------------------------

export default function SocialLinkItem(props) {
  const { number, removeSection, link, register } = props;

  const handleRemoveClick = () => {
    removeSection(number);
  };

  return (
    <>
      <div className="flex justify-between items-center gap-[24px]">
        <FormControl variant="standard" className="w-full !mb-2 sm:!mb-0">
          <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
            Social media
          </label>
          <TextField
            {...register(`social[${number}]`)}
            size="small"
            variant="outlined"
            required
            fullWidth
            placeholder="Paste social media link"
            value={link}
          />
        </FormControl>
        <Button
          className="mt-5"
          sx={{
            width: "25px",
            minWidth: "unset",
            height: "24px",
            padding: "0 !important",
            fontSize: "10px",
            color: "#181818",
            borderRadius: "50%",
            backgroundColor: "#f6f6f6",
            textTransform: "unset",
          }}
          onClick={handleRemoveClick}
        >
          <RemoveIcon
            className=""
            sx={{ color: "#181818", fontSize: "18px" }}
          />
        </Button>
      </div>
    </>
  );
}
