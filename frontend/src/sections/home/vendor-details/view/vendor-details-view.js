import React, { useEffect } from 'react';
import Hero from '../hero';
import ImageSec from '../image-sec';
import Works from '../works';
import Products from '../products';
import Vendor from '../vendor';
import OurTreasures from '../our-treasures';
import CustomSlider from '../custom-slider';
import Pricing from '../pricing';
import styles from 'src/style';

export default function VendorDetailsView() {

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.fade-in');
      const windowHeight = window.innerHeight;
      elements.forEach((element) => {
        const positionFromTop = element.getBoundingClientRect().top;
        if (positionFromTop - windowHeight <= 0) {
          element.classList.add('visible');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);

    // Initial check in case some elements are already in view
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <div id="home">
        <div className={`${styles.paddingX} ${styles.flexStart}`}>
          <div className={`${styles.boxWidth}`}>
            <div className='fade-in'>
              <Hero />
            </div>
            <div className='fade-in'>
              <ImageSec />
            </div>
            <div className='fade-in'>
              <OurTreasures />
            </div>
            <div className='fade-in'>
              <Works />
            </div>
            <div className='fade-in'>
              <Products />
            </div>
            <div className='fade-in'>
              <Vendor />
            </div>
            <div className='fade-in'>
              <Pricing />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
