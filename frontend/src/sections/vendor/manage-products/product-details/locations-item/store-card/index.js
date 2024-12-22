import React, { useEffect, useState, useMemo } from "react";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Components
import CardItem from './card-item';
import PickupLocationCard from "./pickup-location-card";

import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import './expandable.css';

// import { pickupLocationData } from 'src/_mock/assets';

const StoreCard = ({ formData }) => {
  const NewFormDataSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    tags: Yup.array().min(1, 'Must have at least 1 attribute'),
    category: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      name: formData?.name || '',
      tags: formData?.tags || [],
      category: formData?.category || '',
    }),
    [formData]
  );

  const methods = useForm({
    resolver: yupResolver(NewFormDataSchema),
    defaultValues,
  });

  const {
    reset,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (formData) {
      reset(defaultValues);
    }
  }, [formData, defaultValues, reset]);

  const [expandedCardItemId, setExpandedCardItemId] = useState(null);
  const [sliderIndex, setSliderIndex] = useState(0); // Track current slider index

  // RHF Hook Form
  const {
    setValue,
    register,
    watch,
  } = useFormContext();

  const locations = watch("locations");

  const [pickupLocationData, setPickupLocationData] = useState([]);

  useEffect(() => {
    setPickupLocationData(locations)
  }, [locations])


  const handleExpandClick = (id) => {
    setExpandedCardItemId((prevId) => (prevId === id ? null : id));
  };

  const handleSliderAfterChange = (index) => {
    // Update slider index state
    setSliderIndex(index);
    // Collapse all expanded card items
    setExpandedCardItemId(null);
  };

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 250,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    adaptiveHeight: true,
    variableHeight: true,
    afterChange: handleSliderAfterChange, // Call afterChange event handler
    // responsive: [
    //   {
    //     breakpoint: 1411,
    //     settings: {
    //       slidesToShow: 2.2,
    //       slidesToScroll: 1,
    //       infinite: false,
    //       dots: false
    //     }
    //   },
    //   {
    //     breakpoint: 1370,
    //     settings: {
    //       slidesToShow: 2,
    //       slidesToScroll: 1,
    //       infinite: false,
    //       dots: false
    //     }
    //   },
    //   {
    //     breakpoint: 1286,
    //     settings: {
    //       slidesToShow: 1.5,
    //       slidesToScroll: 1,
    //       infinite: false,
    //       dots: false
    //     }
    //   },
    //   {
    //     breakpoint: 1048,
    //     settings: {
    //       slidesToShow: 1.2,
    //       slidesToScroll: 1,
    //       infinite: false,
    //       dots: false,
    //       arrows: false
    //     }
    //   },
    //   {
    //     breakpoint: 900,
    //     settings: {
    //       slidesToShow: 2,
    //       slidesToScroll: 1,
    //       infinite: false,
    //       dots: false,
    //       arrows: false
    //     }
    //   },
    //   {
    //     breakpoint: 760,
    //     settings: {
    //       slidesToShow: 1,
    //       slidesToScroll: 1,
    //       infinite: false,
    //       dots: false,
    //       arrows: false
    //     }
    //   },
    // ]
  };

  if (pickupLocationData.length == 0) return;

  return (
    <div className="flex flex-col">
      <div id="titles" className="slider-container">
        <Slider {...sliderSettings}>
          {locations.map((item) => (
            <PickupLocationCard
              key={item._id}
              item={item}
              expanded={expandedCardItemId === item._id}
              handleExpandClick={() => handleExpandClick(item._id)}
            />
          ))}
        </Slider>
      </div>
      {/* {expandedCardItemId && (
        <div id="content" className="border z-100 p-[20px] -mt-[2px] bg-white rounded-b-[12px]">
          <CardItem />
        </div>
      )} */}
    </div>
  );
}

export default StoreCard;
