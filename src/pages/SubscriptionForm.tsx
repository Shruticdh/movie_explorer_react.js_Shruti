import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import {
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { StripeCardElement } from '@stripe/stripe-js';

const SubscriptionForm: React.FC = () => {
  const [plan, setPlan] = useState<string>('basic');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!stripe || !elements) {
      setMessage('Stripe is not loaded');
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setMessage('Card element not found');
      setLoading(false);
      return;
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement as StripeCardElement,
      });

      if (error) {
        setMessage(error.message || 'Payment error');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('jwt');
      const response = await axios.post(
        'http://localhost:3000/api/v1/subscription',
        { subscription: { plan_type: plan } },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { client_secret } = response.data;

      if (client_secret) {
        const confirmResult = await stripe.confirmCardPayment(client_secret, {
          payment_method: paymentMethod?.id!,
        });

        if (confirmResult.error) {
          setMessage(confirmResult.error.message || 'Payment failed');
        } else if (confirmResult.paymentIntent?.status === 'succeeded') {
          setMessage('Subscription successful!');
        }
      } else {
        setMessage('Subscription created, no payment confirmation needed.');
      }
    } catch (err: any) {
      setMessage(err.response?.data?.errors?.[0] || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} 
    className='bg-white'>
      <h2>Subscribe to a Plan</h2>

      <label>
        Choose Plan:
        <select value={plan} onChange={(e) => setPlan(e.target.value)}>
          <option value="basic">Basic (₹499/month)</option>
          <option value="premium">Premium (₹999/month)</option>
        </select>
      </label>

      <div style={{ margin: '1rem 0' }}>
        <CardElement />
      </div>

      <button type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing...' : 'Subscribe'}
      </button>

      {message && <p>{message}</p>}
    </form>
  );
};

export default SubscriptionForm;
