import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { logoMobileWhite } from "src/assets";
import DefaultButton from "src/components/button/default-button";

const CreateAccount = () => {

  const navigate = useNavigate();

  return (
    <div className="w-full h-full flex flex-col justify-between gap-[24px]">
      <div className="flex flex-col gap-[20px]">
        <div className="flex flex-col gap-[6px]">
          <Typography variant="h6" className="font-gilroyMedium">Account Created!</Typography>
          <Typography variant="subtitle3">
            After you finish posting your review, we will apply the following discount to your account on your next Pickup Pointe delivery order.
          </Typography>
        </div>

        <Box 
          className="bg-primary flex flex-col px-[24px] py-[32px] gap-[30px] items-center justify-center rounded-[16px]"
          sx={{
            background: 'linear-gradient(45deg, #2d2627, #231616, #481d1d, #952e2f, #d53e3e)',
          }}
        >
          <img src={logoMobileWhite} className="w-auto" loading="lazy"/>
          <Typography variant="subtitle3" className="text-[#FEFEFF]">You will soon get</Typography>
          <div className="flex gap-[8px] items-end">
            <Typography variant="h1" className="text-[#FEFEFF] font-gilroyBold">10%</Typography>
            <Typography variant="h3" className="text-[#FEFEFF] font-gilroyBold pb-1">off</Typography>
          </div>
          <Typography variant="subtitle3" className="text-[#FEFEFF] text-center">Your first Pickup Pointe<br/>Delivery Order!</Typography>
        </Box>
      </div>
      
      <div className="flex flex-col gap-[12px] pt-[24px] border-t">
        <DefaultButton
          value='Post Review & give me my discount'
          onClick={() => navigate(`/leave-review/choose-platform`)}
        />
      </div>
    </div>
  );
};

export default CreateAccount;