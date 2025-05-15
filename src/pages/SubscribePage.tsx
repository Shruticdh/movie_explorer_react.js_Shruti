import React, { useEffect, useState } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Subscription from './Subscription';

const SubscriptionPage: React.FC = () => {

  return (
    <div className="bg-black min-h-screen text-white">
      <Header />
     <div>
        <Subscription />
     </div>
      <Footer />
    </div>
  );
};

export default SubscriptionPage;