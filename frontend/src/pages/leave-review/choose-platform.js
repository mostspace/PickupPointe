import { GoogleLogo, YelpLogo, FacebookLogo } from "src/assets";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

// ============================================================================================================================

const PlatformBox = ({ logo, label, onClick }) => (
  <Box
    className="flex flex-col justify-center items-center gap-[8px] rounded-[16px] px-[32px] py-[20px] bg-[#F5F5F5] cursor-pointer hover:bg-hover duration-300"
    onClick={onClick}
  >
    <img src={logo} alt={label} className="w-fit"/>
    <Typography variant="subtitle1" className="text-center">
      {label}
    </Typography>
  </Box>
);

// ============================================================================================================================

const ChoosePlatform = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/leave-review/copy-code`);
  };

  return (
    <div className="w-full h-full flex flex-col gap-[20px]">
      <div className="flex flex-col gap-[6px]">
        <Typography variant="h6" className="font-gilroyMedium">
          Choose a platform to leave a review
        </Typography>
        <Typography variant="subtitle3">
          Pick one platform to leave your review. Once it's posted, you'll receive your discount for your next Pickup Pointe delivery!
        </Typography>
      </div>

      <div className="flex flex-col gap-[16px]">
        <PlatformBox
          logo={GoogleLogo}
          label="Leave a Google Review"
          onClick={handleClick}
        />
        <PlatformBox
          logo={YelpLogo}
          label="Leave a Yelp Review"
          onClick={handleClick}
        />
        <PlatformBox
          logo={FacebookLogo}
          label="Leave a Facebook Review"
          onClick={handleClick}
        />
      </div>
    </div>
  );
};

export default ChoosePlatform;