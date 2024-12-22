import { Box, Typography, Button } from "@mui/material";
import { logoMobileWhite, icCopy } from "src/assets";
import { toast } from "react-toastify";

const CopyCode = () => {

  const handleCopyCode = () => {
    toast("Your discount code is copied", {
      theme: "light",
      className: 'toast-custom',
      style: {
        backgroundColor: "white",
        color: "primary",
      },
    });
  }

  return (
    <div className="w-full h-full flex flex-col justify-between gap-[24px]">
      <div className="flex flex-col gap-[20px]">
        <div className="flex flex-col gap-[6px]">
          <Typography variant="h6" className="font-gilroyMedium">Thank you for your review!</Typography>
          <Typography variant="subtitle3">
            Your discount code is already applied to your Pickup Pointe account. The discount code will be automatically applied to your first delivery order.
          </Typography>
        </div>

        <Box 
          className="bg-primary flex flex-col px-[24px] py-[32px] gap-[30px] items-center justify-center rounded-[16px]"
          sx={{
            background: 'linear-gradient(45deg, #2d2627, #231616, #481d1d, #952e2f, #d53e3e)',
          }}
        >
          <img src={logoMobileWhite} className="w-auto"/>
          <Typography variant="subtitle3" className="text-[#FEFEFF]">Your discount</Typography>
          <div className="flex gap-[8px] items-end">
            <Typography variant="h1" className="text-[#FEFEFF] font-gilroyBold">10%</Typography>
            <Typography variant="h3" className="text-[#FEFEFF] font-gilroyBold pb-1">off</Typography>
          </div>
          <Typography variant="subtitle3" className="text-[#FEFEFF] text-center">XJ6586S6S08DD</Typography>
        </Box>

        <Button
          className="w-full"
          sx={{
            py: "16px",
            fontFamily: "Gilroy-Medium",
            fontSize: "14px",
            color: "#181818",
            borderRadius: "8px",
            backgroundColor: "#F5F5F5",
            textTransform: "unset",
            gap: "14px",
          }}
          startIcon={<img src={icCopy} className="w-fit" />}
          onClick={handleCopyCode}
        >
          Copy code
        </Button>
      </div>
    </div>
  );
};

export default CopyCode;