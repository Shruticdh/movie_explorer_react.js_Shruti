import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FiXCircle } from 'react-icons/fi';

const Cancel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const logCancellation = async () => {
      const params = new URLSearchParams(location.search);
      const sessionId = params.get('session_id');

      if (!sessionId) {
        setError('No session ID found in the URL.');
        setLoading(false);
        return;
      }

      try {
        const authToken = 'your-valid-jwt-token-here'; 
        await axios.post(
          'https://movie-explorer-ror-ashutosh-singh.onrender.com/api/v1/subscriptions/cancel',
          { session_id: sessionId },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setLoading(false);
      } catch (err: any) {
        setError(err?.response?.data?.error || 'Failed to process cancellation.');
        setLoading(false);
      }
    };

    logCancellation();
  }, [location.search]);

  return (
    <div className="min-h-screen bg-[#14141E] flex items-center justify-center relative px-4">
      {/* Blurred background */}
      <div
        className="absolute inset-0 bg-[url('./assets/background_Dark_signup.webp')] bg-cover bg-center"
        style={{ filter: 'blur(4px)' }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Foreground card */}
      <div className="max-w-md w-full bg-black/90 text-white rounded-2xl shadow-xl p-8 border border-red-900 z-10 text-center relative">
        {loading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin h-12 w-12 border-4 border-red-600 border-t-transparent rounded-full mb-4" />
            <h2 className="text-xl font-semibold text-white">Processing cancellation...</h2>
          </div>
        ) : error ? (
          <>
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <FiXCircle className="text-white text-4xl" />
        </div>
            <h2 className="text-2xl font-bold mb-2 text-white-500">Payment Not Successful</h2>
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => navigate('/subscription')}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-xl transition duration-300 cursor-pointer"
            >
              Try Again
            </button>
          </>
        ) : (
          <>
            <img
              src="https://cdn-icons-png.flaticon.com/512/5944/5944331.png"
              alt="Sad Face"
              className="w-20 h-20 mx-auto mb-4"
            />
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiXCircle className="text-white text-4xl" />
            </div>
            <h2 className="text-3xl font-bold mb-2 text-red-500">Payment Not Successful</h2>
            <p className="text-gray-300 mb-6">
              Your subscription process was cancelled. You can try again whenever you're ready.
            </p>
            <button
              onClick={() => navigate('/user/subscription')}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-xl transition duration-300"
            >
              Return to Subscription Page
            </button>
            <p className="text-sm text-gray-400 mt-4">
              Need help?{' '}
              <span
                className="text-red-400 underline cursor-pointer"
                onClick={() => navigate('/support')}
              >
                Contact Support
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Cancel;
