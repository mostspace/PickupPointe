import { Typography } from '@mui/material';
import DefaultButton from 'src/components/button/default-button';
import cloverLogo from 'src/assets/images/clover-logo.png'
import { VITE_API_URL, VITE_CLOVER_CLIENT_ID } from 'src/config-global';

export default function Integrations() {
  
  const handleClickSignIn = () => {
    window.location.href = `${VITE_API_URL}/oauth/authorize?client_id=${VITE_CLOVER_CLIENT_ID}`;
  }

  return (
    <div className='w-full flex flex-col gap-[32px] sm:gap-[48px] p-[15px] sm:p-[32px]'>
      <div className='flex flex-col gap-[10px]'>
        <Typography variant='h5'>Integrations</Typography>
        <Typography variant='subtitle3'>
          Integrate popular services for seamless workflows and connectivity of your data.
        </Typography>
      </div>

      <div className='flex flex-col gap-[20px]'>
        <Typography variant='h5'>Point-Of-Sale Integrations</Typography>
        <div className='flex flex-col gap-[20px]'>
          <img src={cloverLogo} alt="" className='w-1/3 sm:w-1/6'/>
          <div className='flex flex-col gap-[10px]'>
            <Typography variant='h6' className='capitalize'>Clover POS Integration</Typography>
            <Typography variant='subtitle3'>
              Import your menu items from your Clover POS and keep the availability of your items synced with the Pickup Pointe Marketplace seamlessly.
            </Typography>
          </div>
        </div>
      </div>

      <div className='w-full flex justify-end items-start lg:items-center gap-4 flex-col lg:flex-row'>
        <DefaultButton value={'Sign in to import menu items'} onClick={handleClickSignIn}/>
      </div>
    </div>
  );
}
