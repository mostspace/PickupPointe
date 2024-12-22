import React, { useState, useRef, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// @mui
import { Typography, IconButton } from "@mui/material";
// Components
import Iconify from "src/components/iconify/iconify";
// Assets
import { icDeal } from 'src/assets';

const DealsAndSavings = ({data, shopId, locationId}) => {
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3);
  const updateSlidesToShow = () => {
    const width = window.innerWidth;
    if (width < 480) {
      setSlidesToShow(1);
    } else if (width < 768) {
      setSlidesToShow(2);
    } else if (width < 1024) {
      setSlidesToShow(2);
    } else {
      setSlidesToShow(2);
    }
  };

  useEffect(() => {
    updateSlidesToShow();
    window.addEventListener("resize", updateSlidesToShow);
    return () => window.removeEventListener("resize", updateSlidesToShow);
  }, []);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: slidesToShow,
    initialSlide: 0,
    arrows: false,
    beforeChange: (_, next) => setCurrentSlide(next),
  };

  // const filteredData = data.filter((item) => item.isActive && item.shop === shopId && item.locations[0] === locationId);
  const filteredData = data.filter((item) => item.isActive && item.shop === shopId);

  const totalSlides = filteredData.length;
  const isPrevDisabled = currentSlide === 0;
  const isNextDisabled = currentSlide + slidesToShow >= totalSlides;

  return (
    <>
      <div className="flex flex-col gap-[14px]">
        <div className="flex gap-6 justify-between items-end">
          <Typography variant="h5" className="capitalize">
            Deals & savings
          </Typography>
          <div className="flex items-center gap-3">
            <IconButton
              onClick={() => sliderRef.current.slickPrev()}
              disabled={isPrevDisabled}
              className={`bg-white text-heading hover:bg-primary hover:text-white drop-shadow-md ${
                isPrevDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Iconify icon="ic:round-arrow-back-ios" width={15} />
            </IconButton>
            <IconButton
              onClick={() => sliderRef.current.slickNext()}
              disabled={isNextDisabled}
              className={`bg-white text-heading hover:bg-primary hover:text-white drop-shadow-md ${
                isNextDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Iconify icon="ic:round-arrow-forward-ios" width={15} />
            </IconButton>
          </div>
        </div>

        {filteredData.length === 0 ? (
          <Typography variant="subtitle3" className="text-center py-6">
            No deals & savings
          </Typography>
        ) : (
          <div className="slider-container">
            <Slider ref={sliderRef} {...settings}>
                {filteredData.map((discount, index) => (
                    <div key={index} className="pr-[10px] py-[10px]">
                        <div className="flex gap-[16px] items-start p-[24px] category-card cursor-pointer hover:shadow-md">
                            <img src={icDeal} />
                            <div className="flex flex-col gap-[4px]">
                                <Typography variant="subtitle1">{discount.title}</Typography>
                                <Typography variant="subtitle3" className="line-clamp-2">{discount.description}</Typography>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
          </div>
        )}
      </div>
    </>
  );
};

export default DealsAndSavings;
