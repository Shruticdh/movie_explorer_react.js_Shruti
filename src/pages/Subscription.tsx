import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
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

  // Find the selected plan's details
  const selectedPlanDetails = plans.find((plan) => plan.title === selectedPlan);

  // Format plan title for display
  const formatPlanTitle = (title: string) =>
    title.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center px-6 py-10">

      <motion.h1
        custom={0}
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
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
              onClick={() => setSelectedPlan(plan.title)}
              className="bg-white text-black font-semibold py-2 px-4 rounded hover:bg-gray-300 transition"
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
          className="mt-10 w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-md"
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
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-white text-black hover:bg-gray-300"
              }`}
              aria-label={isSubmitting ? "Processing subscription" : "Confirm subscription"}
              aria-disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Confirm Subscription"}
            </button>
            {isSubmitting && (
              <div className="flex justify-center mt-4">
                <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
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
        <p className="text-lg text-white">
          Streamly is the enchanted gateway trusted by realms of dreamers and
          doers alike.
        </p>
        <div className="flex justify-center gap-8 mt-4 text-gray-400 font-semibold">
          <span>Hogwarts Studios</span>
          <span>Middle Earth Films</span>
          <span>Avengerverse</span>
          <span>Wakanda+</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Subscription;