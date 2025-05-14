import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiCheckCircle } from 'react-icons/fi';

const Success = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifySubscription = async () => {
      const params = new URLSearchParams(location.search);
      const sessionId = params.get('session_id');

      if (!sessionId) {
        setError('No session ID found in the URL.');
        setLoading(false);
        return;
      }

      try {
        const authToken = 'your-valid-jwt-token-here'; 
        const response = await axios.get(
          `https://movie-explorer-ror-ashutosh-singh.onrender.com/api/v1/subscriptions/success?session_id=${sessionId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        setSubscriptionDetails(response.data);
        setLoading(false);
      } catch (err: any) {
        setError(
          err?.response?.data?.error || 'Failed to verify subscription. Please try again.'
        );
        setLoading(false);
      }
    };

    verifySubscription();
  }, [location.search]);

  return (
    <div className="min-h-screen bg-[#14141E] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#1a1a2e] text-white rounded-lg shadow-lg p-6 border border-white/10">
        {loading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin h-10 w-10 border-4 border-red-600 border-t-transparent rounded-full mb-4" />
            <h2 className="text-xl font-semibold">Verifying your subscription...</h2>
          </div>
        ) : error ? (
          <>
            <h2 className="text-2xl font-bold mb-2">Subscription Error</h2>
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => navigate('/user/subscription')}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded transition"
            >
              Try Again
            </button>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle className="text-white text-3xl" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-center">
              Subscription Activated!
            </h2>
            <p className="text-gray-300 text-center mb-4">
              Your subscription has been successfully activated.
              {subscriptionDetails?.plan_name &&
                ` Enjoy your ${subscriptionDetails.plan_name}!`}
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded transition"
            >
              Start Exploring Movies
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Success;
