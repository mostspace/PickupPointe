import { loadStripe } from '@stripe/stripe-js';
import Main from '../main';
import { STRIPE_PUBLIC_KEY } from 'src/config-global';
import { Elements } from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';
import { createPaymentIntent } from 'src/api/shopper/payment';

export default function MakeOrderView() {
  const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
  // const [clientSecret, setClientSecret] = useState('');

  // useEffect(() => {
  //   const createSecret = async () => {
  //     const data = await createPaymentIntent({amount: 100})
  //     setClientSecret(data.clientSecret);
  //   }
  //   createSecret();
  // })

  return (
    <div className='p-[15px] md:p-[48px]'>
      <Elements stripe={stripePromise}>
        <Main />
      </Elements>
    </div>
  );
}