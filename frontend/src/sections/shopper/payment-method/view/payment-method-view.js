import Main from '../main';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { STRIPE_PUBLIC_KEY } from 'src/config-global';

export default function PaymentMethodView() {
  const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

  return (
    <Elements stripe={stripePromise}>
      <Main />
    </Elements>
  );
}