// @mui
import { 
    styled, Slider, 
} from "@mui/material";

const IOSSlider = styled(Slider)(({ theme }) => ({
    color: "#F14445",
    height: 5,
    padding: "14px 0",
    "& .MuiSlider-thumb": {
      height: 12,
      width: 12,
      backgroundColor: "#fff",
      boxShadow: "0 1px 5px 1px rgba(27, 26, 33, 0.2)",
      "&:focus, &:hover, &.Mui-active": {
        boxShadow: "0px 0px 3px 1px rgba(0, 0, 0, 0.1)",
        // Reset on touch devices, it doesn't add specificity
        "@media (hover: none)": {
          boxShadow: "0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)",
        },
      },
      "&:before": {
        boxShadow: "0px 0px 1px 0px rgba(0,0,0,0.2), 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 0px 1px 0px rgba(0,0,0,0.12)",
      },
    },
    "& .MuiSlider-valueLabel": {
      fontSize: 12,
      fontWeight: "normal",
      top: -6,
      backgroundColor: "unset",
      color: theme.palette.text.primary,
      "&::before": {
        display: "none",
      },
      "& *": {
        background: "transparent",
        color: theme.palette.mode === "dark" ? "#fff" : "#000",
      },
    },
    "& .MuiSlider-track": {
      border: "none",
      height: 5,
    },
    "& .MuiSlider-rail": {
      boxShadow: "inset 0px 0px 4px -3px #000",
      backgroundColor: "rgba(0, 0, 0, 0.1)",
    },
}));

export default IOSSlider;