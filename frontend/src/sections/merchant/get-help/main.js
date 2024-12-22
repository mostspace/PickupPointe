import React from "react";
import { useNavigate } from "react-router-dom";
// @mui
import { Typography } from "@mui/material";
// Components
import DefaultButton from "src/components/button/default-button";
// Icons
import NavigateNextOutlinedIcon from '@mui/icons-material/NavigateNextOutlined';
// Asset
import { icPaperBin, icListCross, icTagPrice } from "src/assets";
import TransparentButton from "src/components/button/transparent-button";

// ---------------------------------------------------------------------------------------------

const data = [
  {
    img: icPaperBin,
    title1: "Item out of stock?",
    title2: "How to disable an item?",
  },
  {
    img: icListCross,
    title1: "Option out of stock? ",
    title2: "How to disable an option?",
  },
  {
    img: icTagPrice,
    title1: "Need to adjust the price of an order?",
    title2: "How to create additional charges?",
  },
];

// ---------------------------------------------------------------------------------------------

const Main = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col gap-[16px] p-[15px] sm:p-[32px]">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex flex-wrap px-[16px] py-[12px] justify-between items-center gap-12px self-stretch rounded-[12px] border border-[rgba(0, 0, 0, 0.08)]"
            >
              <div className="flex flex-1 gap-[16px] items-start">
                <img
                  loading="lazy"
                  src={item.img}
                  className="w-[36px] h-[36px] sm:w-[48px] sm:h-[48px]"
                  alt={item.title1}
                />
                <div className="flex flex-col flex-grow gap-[2px]">
                  <Typography variant="subtitle">{item.title1}</Typography>
                  <Typography variant="subtitle">{item.title2}</Typography>
                </div>
              </div>
              <TransparentButton value="Tutorial" color="#F14445" component={<NavigateNextOutlinedIcon className="text-[20px] mb-[2px] text-primary"/>} />
            </div>
          ))}
        </div>

        <div className="border-t p-[15px] sm:p-[32px]">
          <DefaultButton value="Have unique question? Chat us directly" onClick={() => navigate('/merchant/chat')} className="w-full" />
        </div>
      </div>
    </>
  );
};

export default Main;
