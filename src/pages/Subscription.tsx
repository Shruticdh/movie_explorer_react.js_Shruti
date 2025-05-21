import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createSubscription } from "../Services/SubscriptionService";
import toast from "react-hot-toast";

const plans = [
  {
    title: "1_day",
    title2: "1 Day",
    price: "Rs 199",
    features: [
      "Trailer access across all devices",
      "Security & browsing freedom",
      "Limited movie access",
      "720p streaming",
      "Ads supported",
    ],
    goodies: [
      "Embark on a 1-day movie marathon adventure!",
      "Unlock a cinematic sprint with top trailers!",
      "Dive into a quick reel of movie magic!",
    ],
    buttonText: "Get started",
  },
  {
    title: "7_days",
    title2: "7 Days",
    price: "Rs 399",
    features: [
      "Personal account, for daily use",
      "Unlimited access to all movies",
      "No ads, HD content",
      "720p, 1080p & 4K streaming",
      "Lifetime access",
    ],
    goodies: [
      "Launch a week-long epic movie quest!",
      "Stream blockbusters in stunning HD, ad-free!",
      "Unleash 7 days of cinematic glory!",
    ],
    buttonText: "Get started",
  },
  {
    title: "1_month",
    title2: "1 Month",
    price: "Rs 799",
    features: [
      "5 user accounts",
      "Unlimited access across all devices",
      "Exclusive admin & reporting features",
      "720p, 1080p & 4K streaming",
      "Lifetime access",
    ],
    goodies: [
      "Rule the cinematic universe for a month!",
      "Stream in 4K with your movie squad!",
      "Unlock a month of exclusive movie magic!",
    ],
    buttonText: "Get started",
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  const fetchUserPlan = async () => {
    const plan = localStorage.getItem("userPlan");
    return plan || "basic"; 
  };

  const handlePlanSelect = async (planTitle: string) => {
    const userPlan = await fetchUserPlan();
    if (userPlan === "premium") {
      setIsPremium(true); 
    } else {
      setSelectedPlan(planTitle); 
    }
  };

  const handleGoBack = () => {
    navigate("/"); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) {
      toast.error("Please select a plan");
      return;
    }

    setIsSubmitting(true);
    try {
      const checkoutUrl = await createSubscription(selectedPlan);
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPlanDetails = plans.find((plan) => plan.title === selectedPlan);

  const formatPlanTitle = (title: string) =>
    title.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="bg-black text-white flex flex-col items-center px-4 py-6 sm:px-6 sm:py-8">
      <motion.h1
        custom={1}
        initial="hidden"
        animate="visible"
        variants={textVariant}
        className="text-3xl font-bold mb-2 text-center"
      >
        Unlock the Magic — One Spell, Endless Wonders!
      </motion.h1>

      <motion.p
        custom={1}
        initial="hidden"
        animate="visible"
        variants={textVariant}
        className="text-gray-400 text-center mb-7"
      >
        Cast a one-time spell (payment) and enter a world of limitless
        entertainment. <br />
        <span>No monthly rituals, just pure cinematic enchantment—forever!</span>
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl cursor-pointer">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.3 }}
            className={`bg-gradient-to-br from-gray-600 to-gray-900  p-6 rounded-2xl shadow-lg flex flex-col justify-between hover:scale-105 transition-transform duration-300 hover:shadow-xl hover:shadow-gray-700`}
          >
            <div>
              <h2 className="text-2xl font-bold mb-4">{plan.title2}</h2>
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
                onClick={() => handlePlanSelect(plan.title)} 
                disabled={isPremium} 
                className={`font-semibold py-2 px-4 rounded transition ${
                  isPremium
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed cursor-pointer"
                    : "bg-white text-black hover:bg-gray-300 cursor-pointer"
                }`}
                aria-label={`Select ${plan.title2} plan`}
              >
                {plan.buttonText}
              </button>
          </motion.div>
        ))}
      </div>

      {selectedPlan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-10 w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-md cursor-pointer"
        >
          <h2 className="text-xl font-bold mb-4 text-white text-center">
            You’re about to summon the{" "}
            <span className="capitalize">{formatPlanTitle(selectedPlan)}</span>{" "}
            Plan
          </h2>
          <p className="text-2xl font-bold text-white text-center mb-4">
            {selectedPlanDetails?.price}
          </p>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">
              Your Cinematic Goodies:
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              {selectedPlanDetails?.goodies.map((goody, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-red-500">🎬</span>
                  <span>{goody}</span>
                </li>
              ))}
            </ul>
          </div>
          <form onSubmit={handleSubmit}  className="space-y-4" role="form"  aria-label="subscription form" >
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 rounded font-semibold transition ${
                isSubmitting
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed cursor-pointer"
                  : "bg-white text-black hover:bg-gray-300 cursor-pointer"
              }`}
              aria-label={isSubmitting ? "Processing subscription" : "Confirm subscription"}
              aria-disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Confirm Subscription"}
            </button>
            {isSubmitting && (
              <div className="flex justify-center mt-4">
                <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin cursor-pointer"></div>
              </div>
            )}
          </form>
        </motion.div>
      )}

      <motion.div
        custom={2}
        initial="hidden"
        animate="visible"
        variants={textVariant}
        className="mt-10 text-center"
      >
        <h3 className="text-gray-400 text-sm mb-2">Joined by legendary guilds</h3>
        <p className=" text-xs md:text-lg text-white text-center">
          Streamly is the enchanted gateway trusted by realms of dreamers and
          doers alike.
        </p>
        <div className="flex justify-center text-xs md:text-lg gap-8 mt-4 text-gray-400 font-semibold text-center">
          <span>Hogwarts Studios</span>
          <span>Middle Earth Films</span>
          <span>Avengerverse</span>
          <span>Wakanda+</span>
        </div>
      </motion.div>

      {isPremium && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className=" bg-opacity-80 p-6 rounded-lg shadow-lg text-center ">
            <h2 className="text-4xl font-bold text-white mb-4">
              You Are Already <span className="text-red-600">Premium </span>user of{" "}<br></br>
                   <span className="text-red-600">M</span><span className="text-white text-4xl">OVIEXPO!!!</span>
            </h2>
            <button
              onClick={handleGoBack}
              className="mt-5 bg-red-700 text-white font-semibold py-2 px-4 rounded hover:bg-red-800 transition cursor-pointer"
              aria-label="Go back to home"
            >
              Go back to home
            </button>
          </div>
        </div>
        </div>
      )} 
      </div>
  );
};

export default Subscription;
