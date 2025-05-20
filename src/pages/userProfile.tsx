import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Footer from '../components/footer';
import Header from '../components/header';
import bgImage from '../assets/background_Dark_signup.webp';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay,
      duration: 0.6,
      ease: 'easeOut',
    },
  },
});

const iconVariant = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
      delay: 0.3,
    },
  },
};

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const planType = localStorage.getItem('userPlan');
    console.log('PLAN TYPE: ', planType);
    if (planType) {
      setPlan(planType);
    } else {
      setPlan('basic');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userPlan');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black text-white px-4">
      <Header />
      <div className=" gap-10 backdrop-blur-sm max-w-4xl mx-auto bg-gradient-to-br from-zinc-900 to-black border border-zinc-700 rounded-2xl shadow-xl w-full p-6 md:p-10 flex flex-col md:flex-row mb-5 mt-5">
        <motion.div initial="hidden" animate="visible" variants={fadeIn(0)}>
          <h2 className="text-3xl font-bold mb-10">
            Profile
            <span className="text-red-600"> M</span>OVIEXPO!
          </h2>
          <p className="text-gray-300 mb-6 leading-relaxed mb-10">
            Your profile details are shown below.
          </p>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-5/6 rounded-lg overflow-hidden flex item-center justify-center"
          >
            <div className="flex flex-col w-full md:w-1/3 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-black border-4 border-red-600 rounded-full p-7"
              >
                <User className="h-20 w-20 text-red-500" />
              </motion.div>
            </div>
          </motion.div>
          <div className="mt-10">

            <br />
            <p className="text-white text-sm">
              Your privacy is our top priority — always secure.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-2/3 flex flex-col space-y-9"
        >
          <h1 className="text-3xl font-bold text-red-600 mt-8 md:mt-0">
            Welcome, <span className="text-white">{user?.role || 'Guest'}</span>
          </h1>

          <div className="space-y-3">
            <div>
              <p className="text-red-500 font-semibold text-lg">Email:</p>
              <p className="text-white">{user?.email}</p>
            </div>
            <div>
              <p className="text-red-500 font-semibold text-lg">Role:</p>
              <p className="text-white capitalize">{user?.role || 'Guest'}</p>
            </div>

            <button
              className="w-[120px] mt-5 cursor-pointer p-1 bg-red-700 border border-red-600 rounded-lg hover:text-white-500"
              onClick={handleLogout}
            >
              Logout
            </button>
            
            <div
              className={`mt-5 p-4 rounded-xl border  ${
                plan === 'premium'
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-500 border-yellow-500 shadow-lg shadow-yellow-500/50'
                  : 'bg-zinc-900 border-zinc-700'
              }`}
            >
              <h2 className="text-lg font-semibold text-red-500 mb-3">
                Current Plan
              </h2>

              {plan && (
                <>
                  <p className="mb-4 text-white">
                    Plan:{' '}
                    <span className="text-red-400 font-medium capitalize">
                      {plan}
                    </span>
                  </p>
                  <button
                    className="px-3 py-1 bg-red-700 hover:bg-red-600 rounded-lg text-white text-sm cursor-pointer"
                    onClick={() => navigate(`/subscription`)}
                  >
                    Explore Plan
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;