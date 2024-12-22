import React, { useState, useRef, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// @mui
import { Typography, IconButton, useMediaQuery } from "@mui/material";
import Iconify from "src/components/iconify"
// Assets
import { foodCategories } from "src/_mock/_mock";

const FoodCategories = ({categories, setSelectedCategory}) => {
    const [selectedCategoryIndex, setSelectedCategoryIndex] = useState([]);
    const sliderRef = useRef(null);

    const handleCategoryClick = (index) => {
        console.log(index)
        setSelectedCategoryIndex((prevIndex) => {
            setSelectedCategory(prevIndex === index ? null : index);
            return (prevIndex === index ? null : index);
        });
    };

    //  Responsive settings
    const isLarge = useMediaQuery("(max-width: 1200px)");
    const isMedium = useMediaQuery("(max-width: 767px)");
    const isSmall = useMediaQuery("(max-width: 600px)");
    const isXSmall = useMediaQuery("(max-width: 500px)");
    const isXXSmall = useMediaQuery("(max-width: 440px)");
    const isTiny = useMediaQuery("(max-width: 380px)");

    // Slider settings
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slidesToShow, setSlidesToShow] = useState(3); // Default number of visible slides

    const updateSlidesToShow = () => {
        const width = window.innerWidth;
        if (width < 380) {
          setSlidesToShow(4);
        } else if (width < 620) {
          setSlidesToShow(5);
        } else if (width < 660) {
          setSlidesToShow(6);
        } else if (width < 860) {
          setSlidesToShow(8);
        } else if (width < 1080) {
          setSlidesToShow(10);
        } else if (width < 1300) {
          setSlidesToShow(12);
        } else if (width < 1450) {
          setSlidesToShow(14);
        } else if (width < 1670) {
          setSlidesToShow(16);
        } else {
          setSlidesToShow(18);
        }
    };

    useEffect(() => {
        updateSlidesToShow();
        window.addEventListener("resize", updateSlidesToShow);
        return () => window.removeEventListener("resize", updateSlidesToShow);
    }, []);

    const getWidth = () => {
        if (isTiny) return "270px";
        if (isXXSmall) return "345px";
        if (isXSmall) return "360px";
        if (isSmall) return "400px";
        if (isMedium) return "100%";
        if (isLarge) return "90%";
        return "95%";
    };

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        touchMove: true,
        slidesToShow: slidesToShow,
        slidesToScroll: slidesToShow,
        initialSlide: 0,
        arrows: false,
        beforeChange: (_, next) => setCurrentSlide(next),
    };

    const totalSlides = foodCategories.length;
    const isPrevDisabled = currentSlide === 0;
    const isNextDisabled = currentSlide + slidesToShow >= totalSlides;

    return (
        <div className="slider-container flex items-center justify-center ss:justify-between">
            <IconButton
                onClick={() => sliderRef.current.slickPrev()}
                disabled={isPrevDisabled}
                className={`bg-white text-heading hover:bg-primary hover:text-white drop-shadow-md hidden sm:block ${
                    isPrevDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
                <Iconify icon="ic:round-arrow-back-ios" width={15} />
            </IconButton>

            <div className="w-full" style={{ width: getWidth() }}>
                <Slider ref={sliderRef} {...settings}>
                    {foodCategories?.map((category, index) => {
                        const isSelected = selectedCategoryIndex === index;
                        return (
                            <div key={index} className="!flex !flex-col !justify-center !items-center">
                                <IconButton
                                    onClick={() => handleCategoryClick(index)}
                                    className={isSelected ? "border border-solid border-[#F14445]" : ""}
                                    sx={{ border: "1px solid transparent", display: 'flex' }}
                                >
                                    <img
                                        src={category.icon}
                                        alt={category.name}
                                        className="w-[32px] h-[32px]"
                                        loading="lazy"
                                    />
                                </IconButton>
                                <Typography variant="subtitle2" className={`line-clamp-1 text-center ${isSelected ? "text-primary font-semibold" : ""}`}>
                                    {category.name}
                                </Typography>
                            </div>
                        );
                    })}
                </Slider>
            </div>

            <IconButton
                onClick={() => sliderRef.current.slickNext()}
                disabled={isNextDisabled}
                className={`bg-white text-heading hover:bg-primary hover:text-white drop-shadow-md hidden sm:block ${
                    isNextDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
                <Iconify icon="ic:round-arrow-forward-ios" width={15} />
            </IconButton>
        </div>
    );
};

export default FoodCategories;