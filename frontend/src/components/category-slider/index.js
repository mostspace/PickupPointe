import { useNavigate } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// @mui
import { Typography } from '@mui/material';

// Assets
import { shopImg1, food_9, food_10 } from 'src/assets';

const CategorySlider = () => {
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
        initialSlide: 0,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false,
                    arrows: true,
                },
            },
            {
                breakpoint: 768, // Adjusted for tablets
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                },
            },
            {
                breakpoint: 480, // Mobile screens
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                },
            },
        ],
    };

    // Handle Navigate slider path
    const navigate = useNavigate();
    const categoryPath = 'category';

    const handleCategoryPath = () => {
        navigate(categoryPath);
    };

    return (
        <div className="slider-container px-4 md:px-0">
            <Slider {...settings}>
                {/* Item 1 */}
                <div className="cursor-pointer rounded-[16px] overflow-hidden" onClick={handleCategoryPath}>
                    <div className="flex flex-col md:flex-row category-card md:mr-[20px]">
                        <div className="flex items-center bg-[#F9DD701F] w-full sm:w-[80%] h-[156px] overflow-hidden">
                          <img src={food_9} alt="Main dishes" className="w-full h-full object-cover" loading="lazy"/>
                        </div>
                        <div className="flex flex-col gap-[12px] items-start justify-center w-full py-[21px] px-[24px]">
                          <Typography variant="h6">Main dishes</Typography>
                          {/* <Typography variant="subtitle2" className="clamp-3-lines">
                              Indulge in our delectable selection of main dishes crafted with authentic Italian flavors and fresh ingredients.
                          </Typography> */}
                        </div>
                    </div>
                </div>
                
                {/* Item 2 */}
                <div className="cursor-pointer rounded-[16px] overflow-hidden" onClick={handleCategoryPath}>
                    <div className="flex flex-col md:flex-row category-card md:mr-[20px]">
                        <div className="flex items-center bg-[#F9DD701F] w-full sm:w-[80%] h-[156px]">
                          <img src={food_10} alt="Side dishes" className="w-full h-full object-cover" loading="lazy"/>
                        </div>
                        <div className="flex flex-col gap-[12px] items-start justify-center w-full py-[21px] px-[24px]">
                          <Typography variant="h6">Side dishes</Typography>
                          {/* <Typography variant="subtitle2" className="clamp-3-lines">
                              Complement your main course with our enticing selection of side dishes, designed to elevate your dining experience.
                          </Typography> */}
                        </div>
                    </div>
                </div>
            </Slider>
        </div>
    );
};

// Custom Arrow Functions
function SampleNextArrow(props) {
    const { className, style, onClick, currentSlide, slideCount } = props;
    // Hide arrow if there are no more slides to show
    if (currentSlide === slideCount - 1) return null;
    return (
        <div
            className={className}
            style={{ ...style, display: "block", background: "transparent" }}
            onClick={onClick}
        />
    );
}

function SamplePrevArrow(props) {
    const { className, style, onClick, currentSlide } = props;
    // Hide arrow if there are no previous slides to show
    if (currentSlide === 0) return null;
    return (
        <div
            className={className}
            style={{ ...style, display: "block", background: "transparent" }}
            onClick={onClick}
        />
    );
}

export default CategorySlider;
