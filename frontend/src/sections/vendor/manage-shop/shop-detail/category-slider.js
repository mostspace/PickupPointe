import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// @mui
import { Typography } from '@mui/material';

const CategorySlider = ({categories}) => {

  console.log(categories);
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
          arrows: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
          arrows: false // Hide arrows on small screens
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false // Hide arrows on very small screens
        }
      }
    ]
  };

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {
          categories.map((element, index) => {
            return (
              <div>
                <div className="flex category-card mr-[20px]">
                  <div className="flex items-center bg-[#AFC2361A] py-[21px] px-[21px]">
                    <img src={element.photo} className="w-full" alt="Shop category"/>
                  </div>
                  <div className="flex flex-col gap-[12px] items-start justify-center w-full py-[21px] px-[24px]">
                    <Typography variant="h5">{element.category}</Typography>
                  </div>
                </div>
              </div>
            )
          })
        }
        {/* <div className="">
          <div className="flex category-card mr-[20px]">
            <div className="flex items-center bg-[#F9DD701F] py-[21px] px-[14px]">
              <img src={shopImg1} className="w-[150px]" alt="Fruits" />
            </div>
            <div className="flex flex-col gap-[12px] items-start justify-center w-full py-[21px] px-[24px]">
              <Typography variant="h6">Fruits</Typography>
              <Typography variant="subtitle2" className="clamp-3-lines">Discover a variety of fresh, delicious fruits sourced from the best local farms. Enjoy the vibrant flavors and health benefits of our seasonal and exotic fruit selection.</Typography>
            </div>
          </div>
        </div>
        <div>
          <div className="flex category-card mr-[20px]">
            <div className="flex items-center bg-[#F9DD701F] py-[21px] px-[14px]">
              <img src={shopImg2} className="w-[150px]" alt="Vegetables" />
            </div>
            <div className="flex flex-col gap-[12px] items-start justify-center w-full py-[21px] px-[24px]">
              <Typography variant="h6">Vegetables</Typography>
              <Typography variant="subtitle2" className="clamp-3-lines">Explore our range of fresh, high-quality vegetables. From leafy greens to root vegetables, find everything you need to create nutritious and tasty meals.</Typography>
            </div>
          </div>
        </div>
        <div>
          <div className="flex category-card mr-[20px]">
            <div className="flex items-center bg-[#F9DD701F] py-[21px] px-[14px]">
              <img src={shopImg1} className="w-[150px]" alt="Fruits" />
            </div>
            <div className="flex flex-col gap-[12px] items-start justify-center w-full py-[21px] px-[24px]">
              <Typography variant="h6">Fruits</Typography>
              <Typography variant="subtitle2" className="clamp-3-lines">Discover a variety of fresh, delicious fruits sourced from the best local farms. Enjoy the vibrant flavors and health benefits of our seasonal and exotic fruit selection.</Typography>
            </div>
          </div>
        </div> */}
      </Slider>
    </div>
  );
};

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
