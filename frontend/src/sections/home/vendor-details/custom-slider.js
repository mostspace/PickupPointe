import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Box, Container } from "@mui/material";
import Cards from "src/components/cards/card";
import { customerPic1, customerPic2, customerPic3, customerPic4 } from "src/assets";

const data = [
  {
    name: "Santiago J",
    date: "May 30, 2024",
    rating: "4.8",
    review:
      "Since becoming a vendor with Pickup Pointe, my honey sales have soared! The platform makes it incredibly easy to manage orders and the centralized pickup locations are a game-changer for my customers. I no longer spend hours on the road delivering jars; instead, I can focus on my bees and harvesting the best honey. The support team is fantastic, always ready to help. Pickup Pointe has truly revolutionized my business, making it efficient and allowing me to reach more local buyers effortlessly!",
    img: customerPic1,
  },
  {
    name: "Eduardo J",
    date: "May 28, 2024",
    rating: "5.0",
    review:
      "As a sourdough maker, having strangers come to my property for pickups was a nightmare. Neighbors complained about the traffic, and it was just stressful. Then I found Pickup Pointe! Now, my customers can easily pick up their orders from a central location without disrupting my home life. The process is seamless, and the support from Pickup Pointe has been fantastic. My business runs smoother, and I have peace of mind. It’s been a game-changer for my sourdough business!",
    img: customerPic2,
  },
  {
    name: "Jacquelyn L",
    date: "May 30, 2024",
    rating: "4.8",
    review:
      "Weekly farmers markets weren’t enough to sustain my soap and candle business. Then I found Pickup Pointe! Now, customers can pick up their orders any day from a convenient location. The platform is user-friendly, and the support team is fantastic. My sales have increased significantly, and I finally have the consistent income I needed. Pickup Pointe has transformed my business, allowing me to reach more customers and grow my artisan craft sales beyond what I thought possible!",
    img: customerPic3,
  },
  {
    name: "Elizabeth K",
    date: "May 30, 2024",
    rating: "4.8",
    review:
      "Managing my high-volume packaged food business across multiple farmers markets was challenging until I discovered Pickup Pointe. Now, I can manage over 20 locations with ease, keeping all orders, inventory, and sales analytics in one platform. It has streamlined my operations, increased sales, and significantly cut costs. Planning order drop-offs has never been easier. Pickup Pointe has been a Godsend for my business, providing the tools and support needed to grow efficiently and effectively, big kudos to your team.",
    img: customerPic4,
  },
];

const CustomSlider = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Set breakpoint for mobile devices
    };

    // Initial check
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
    adaptiveHeight: true, // Corrected property name
    arrows: false,
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        padding: {
          xs: "40px 0",
          md: "120px 0 0 0",
        },
      }}
    >
      <div id="reviews">
        <Box sx={{ textAlign: "center" }}>
          <h3 className="text-[24px] ss:text-[40px] font-semibold mb-[30px] ss:mb-[40px] text-heading">
            Real Experiences, Real Success Stories
          </h3>
        </Box>

        {isMobile ? (
          <Slider {...settings}>
            {data.map((item, index) => (
              <Box key={index}>
                <Cards
                  name={item.name}
                  date={item.date}
                  rating={item.rating}
                  review={item.review}
                  img={item.img}
                />
              </Box>
            ))}
          </Slider>
        ) : (
          <div className="w-full flex flex-col md:flex-col lg:flex-row gap-[24px]">
            <div className="w-full">
              <Cards
                name={data[0].name}
                date={data[0].date}
                rating={data[0].rating}
                review={data[0].review}
                img={data[0].img}
              />
            </div>
            <div className="w-full flex flex-col md:flex-row lg:flex-col gap-[24px]">
              <Cards
                name={data[1].name}
                date={data[1].date}
                rating={data[1].rating}
                review={data[1].review}
                img={data[1].img}
              />
              <Cards
                name={data[2].name}
                date={data[2].date}
                rating={data[2].rating}
                review={data[2].review}
                img={data[2].img}
              />
            </div>
            <div className="w-full">
              <Cards
                name={data[3].name}
                date={data[3].date}
                rating={data[3].rating}
                review={data[3].review}
                img={data[3].img}
              />
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default CustomSlider;
