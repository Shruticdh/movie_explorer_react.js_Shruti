// import React from 'react';
// import { motion } from 'framer-motion';
// import { useNavigate } from "react-router-dom";
// import { FiArrowLeft } from "react-icons/fi";


// const plans = [
//   {
//     title: 'Starter',
//     price: 'Free',
//     features: [
//       'Trailer access across all devices',
//       'Security & browsing freedom',
//       'Limited movie access',
//       '720p streaming',
//       'Ads supported',
//     ],
//     buttonText: 'Get started',
//     gradient: 'from-gray-800 to-gray-900',
//   },
//   {
//     title: 'Monthly',
//     price: '$199',
//     features: [
//       'Personal account, for daily use',
//       'Unlimited access to all movies',
//       'No ads, HD content',
//       '720p, 1080p & 4K streaming',
//       'Lifetime access',
//     ],
//     buttonText: 'Get started',
//     gradient: 'from-red-900 to-pink-900',
//   },
//   {
//     title: 'Yearly',
//     price: '$499',
//     features: [
//       '5 user accounts',
//       'Unlimited access across all devices',
//       'Exclusive admin & reporting features',
//       '720p, 1080p & 4K streaming',
//       'Lifetime access',
//     ],
//     buttonText: 'Get started',
//     gradient: 'from-purple-900 to-indigo-900',

//   },
// ];

// const textVariant = {
//   hidden: { opacity: 0, y: -20 },
//   visible: (i: number) => ({
//     opacity: 1,
//     y: 0,
//     transition: { delay: i * 0.3, duration: 0.6 },
//   }),
// };

// const Subscription = () => {
//     const navigate = useNavigate();
//   return (
//     <div className="bg-black text-white min-h-screen flex flex-col items-center px-6 py-10">
//       <motion.h1
//         custom={0}
//         initial="hidden"
//         animate="visible"
//         variants={textVariant}
//         className="text-4xl font-bold mb-2 text-center"
//       >
//         Pay once, enjoy forever!
//       </motion.h1>

//       <motion.p
//         custom={1}
//         initial="hidden"
//         animate="visible"
//         variants={textVariant}
//         className="text-gray-400 text-center mb-7"
//       >
//         No recurring fees. Pay once and unlock a lifetime of usage
//       </motion.p>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
//         {plans.map((plan, index) => (
//           <motion.div
//             key={index}
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: index * 0.3 }}
//             className={`bg-gradient-to-br from-gray-600 to-gray-900 p-6 rounded-2xl shadow-lg flex flex-col justify-between hover:scale-105 transition-transform duration-300 hover:shadow-xl hover:shadow-[gray]`}
//           >
//             <div>
//               <h2 className="text-2xl font-bold mb-4">{plan.title}</h2>
//               <p className="text-3xl font-bold mb-6">{plan.price}</p>
//               <ul className="space-y-2 mb-6 text-sm">
//                 {plan.features.map((feature, i) => (
//                   <li key={i} className="flex items-start gap-2">
//                     <span>✔️</span>
//                     <span>{feature}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//             <button className="bg-white text-black font-semibold py-2 px-4 rounded hover:bg-gray-800 transition">
//               {plan.buttonText}
//             </button>
//           </motion.div>
//         ))}
//       </div>

//       <motion.div
//         custom={2}
//         initial="hidden"
//         animate="visible"
//         variants={textVariant}
//         className="mt-5 text-center"
//       >
//         <h3 className="text-gray-400 text-sm mb-2">In great company</h3>
//         <p className="text-lg text-white">
//           Inbox is the go-to email platform for successful and renowned brands
//         </p>
//         <div className="flex justify-center gap-8 mt-4 text-white-400 font-semibold">
//           <span>Shopify</span>
//           <span>Stripe</span>
//           <span>Cash App</span>
//           <span>Verizon</span>
//         </div>
//         <div className="w-full flex justify-center px-6 mb-6 mt-4">
//   <button
//     onClick={() => navigate("/dashboard")}
//     className="flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-5 py-2 rounded-full hover:opacity-90 transition-all duration-300 text-sm sm:text-base"
//   >
//     <FiArrowLeft className="text-lg" />
//     Back to Home
//   </button>
// </div>
//       </motion.div>
//     </div>
//   );
// };

// export default Subscription;




import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import axios from "axios"; // axios added
import { createSubscription } from "../Services/SubscriptionService";

const plans = [
  {
    title: '1_day',
    price: 'Free',
    features: [
      'Trailer access across all devices',
      'Security & browsing freedom',
      'Limited movie access',
      '720p streaming',
      'Ads supported',
    ],
    buttonText: 'Get started',
    gradient: 'from-gray-800 to-gray-900',
  },
  {
    title: 'Monthly',
    price: '$199',
    features: [
      'Personal account, for daily use',
      'Unlimited access to all movies',
      'No ads, HD content',
      '720p, 1080p & 4K streaming',
      'Lifetime access',
    ],
    buttonText: 'Get started',
    gradient: 'from-red-900 to-pink-900',
  },
  {
    title: 'Yearly',
    price: '$499',
    features: [
      '5 user accounts',
      'Unlimited access across all devices',
      'Exclusive admin & reporting features',
      '720p, 1080p & 4K streaming',
      'Lifetime access',
    ],
    buttonText: 'Get started',
    gradient: 'from-purple-900 to-indigo-900',
  },
];

const textVariant = {
  hidden: { opacity: 0, y: -20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.3, duration: 0.6 },
  }),
};

const Subscription = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return alert("No plan selected");
  
    try {
      const checkoutUrl = await createSubscription(selectedPlan);
      if (checkoutUrl) {
        window.location.href = checkoutUrl; // redirect to Razorpay or payment page
      }
    } catch (err: any) {
      alert(err.message || "Failed to subscribe.");
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!selectedPlan) return alert("No plan selected");

  //   const payload = {
  //     // ...formData,
  //     plan_type: selectedPlan,
  //   };

  //   try {
  //     await axios.post("https://movie-explorer-ror-ashutosh-singh.onrender.com/api/v1/subscriptions", payload);
  //     alert("Subscription successful!");
  //     // setFormData({ name: '', email: '' });
  //     setSelectedPlan(null);
  //   } catch (err) {
  //     console.error("Error submitting form", err);
  //     alert("Failed to subscribe.");
  //   }
  // };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center px-6 py-10">
      <motion.h1
        custom={0}
        initial="hidden"
        animate="visible"
        variants={textVariant}
        className="text-4xl font-bold mb-2 text-center"
      >
        Pay once, enjoy forever!
      </motion.h1>

      <motion.p
        custom={1}
        initial="hidden"
        animate="visible"
        variants={textVariant}
        className="text-gray-400 text-center mb-7"
      >
        No recurring fees. Pay once and unlock a lifetime of usage
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.3 }}
            className={`bg-gradient-to-br ${plan.gradient} p-6 rounded-2xl shadow-lg flex flex-col justify-between hover:scale-105 transition-transform duration-300 hover:shadow-xl hover:shadow-[gray]`}
          >
            <div>
              <h2 className="text-2xl font-bold mb-4">{plan.title}</h2>
              <p className="text-3xl font-bold mb-6">{plan.price}</p>
              <ul className="space-y-2 mb-6 text-sm">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span>✔️</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => setSelectedPlan(plan.title)}
              className="bg-white text-black font-semibold py-2 px-4 rounded hover:bg-gray-800 transition"
            >
              {plan.buttonText}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Form Section */}
      {selectedPlan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-md"
        >
          <h2 className="text-xl font-bold mb-4 text-white text-center">
            Subscribe to {selectedPlan} Plan
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 rounded bg-gray-700 text-white outline-none"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 rounded bg-gray-700 text-white outline-none"
            /> */}
            <button
              type="submit"
              className="w-full bg-white text-black py-2 rounded font-semibold hover:bg-gray-300"
            >
              Confirm Subscription
            </button>
          </form>
        </motion.div>
      )}

      {/* Footer */}
      <motion.div
        custom={2}
        initial="hidden"
        animate="visible"
        variants={textVariant}
        className="mt-10 text-center"
      >
        <h3 className="text-gray-400 text-sm mb-2">In great company</h3>
        <p className="text-lg text-white">
          Inbox is the go-to email platform for successful and renowned brands
        </p>
        <div className="flex justify-center gap-8 mt-4 text-white-400 font-semibold">
          <span>Shopify</span>
          <span>Stripe</span>
          <span>Cash App</span>
          <span>Verizon</span>
        </div>
        <div className="w-full flex justify-center px-6 mb-6 mt-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-5 py-2 rounded-full hover:opacity-90 transition-all duration-300 text-sm sm:text-base"
          >
            <FiArrowLeft className="text-lg" />
            Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Subscription;
