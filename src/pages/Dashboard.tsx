import React, { useEffect } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import MovieBanner from "../components/MovieBanner";
import Subscription from "./Subscription";
import FadeInSection from "../components/FadeInSection";
import MovieCarousel from "../components/MovieCarousel";
import Genre from "../components/Genre";
import { useNavigate } from "react-router-dom";
import { getSubscriptionStatus } from "../Services/SubscriptionService";
import { toast } from "react-toastify";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      const token = localStorage.getItem("token");
      console.log("Token:", token);
      try {
        const response = await getSubscriptionStatus(token || "");
        const userPlan = response;
        localStorage.setItem("userPlan", userPlan.plan_type);
      } catch (error) {
        console.error("Error fetching subscription status:", error);
        toast.error("Failed to fetch subscription status.");
      }
    };
  
    fetchSubscriptionStatus();
  }, []);
  

  const handleGenreClick = () => {
    navigate("/genre");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-start ">
        <MovieBanner />

        <FadeInSection>
          <MovieCarousel />
        </FadeInSection>

        <FadeInSection>
          <div className="bg-black px-6 py-8 md:px-16 text-white ">
            <div className="flex justify-between items-center mb-6 ">
              <h2 className="text-white text-2xl font-semibold flex items-center gap-2">
                <span className="text-red-600">▣</span> Genres
              </h2>
              <button
                onClick={handleGenreClick}
                className="text-sm text-white hover:text-red-600 border-b border-red-600 cursor-pointer"
              >
                View All
              </button>
            </div>
          </div>
          <div style={{ marginBottom: "5rem" }}
          onClick={handleGenreClick}>
            <Genre
              onGenreClick={(genre: string) => {
              }}
            />
          </div>
        </FadeInSection>

  <FadeInSection>
    <Subscription />
  </FadeInSection>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
