import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// @mui
import { Typography, IconButton } from '@mui/material';

const FoodCategories = ({categories}) => {
    console.log(categories);
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        touchMove: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 0,
        arrows: true,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 768, // Adjusted for tablets
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 1,
                    arrows: false
                },
            },
        ],
    };

    return (
        <div className="slider-container">
            <Slider {...settings}>
                {categories.map((item, index) => {
                    return (
                        <div key={index} className="!flex !flex-col !justify-center !items-center">
                            <IconButton>
                                <img src={item.photo} alt={item.category} className="w-[32px] h-[32px]"/>
                            </IconButton>
                            <Typography variant="subtitle3">{item.category}</Typography>
                        </div>
                    );
                })}
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

export default FoodCategories;
