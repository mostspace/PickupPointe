import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DefaultButton from 'src/components/button/default-button';
import { Typography } from '@mui/material';

// Assets
import { page_404 } from 'src/assets';

const Page404 = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const previousPath = location.state?.from || '/';

  const handleBackToPrevious = () => {
    navigate(previousPath);
  };

  return (
    <>
      <div className="w-full flex flex-col justify-center items-center min-h-[100vh] gap-[40px] bg-white px-[15px]">
        <img src={page_404} className='sm:w-[50%]' loading="lazy"/>
        <div className='flex flex-col text-center gap-[12px]'>
          <Typography variant="h1" className='text-[40px] font-semibold'>Looks like you're lost 😞</Typography>
          <Typography variant="h6" className="text-[#a3a3a3]">Try refreshing the page, confirm you have an internet connection or<br/> click back on your browser to try again.</Typography>
        </div>
        <DefaultButton value="Back" onClick={handleBackToPrevious} />
      </div>
    </>
  );
};

export default Page404;