import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMoviesById } from "../Services/MovieService";
import { FaArrowLeft } from "react-icons/fa";
import Header from "../components/header";
import Footer from "../components/footer";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface Movie {
  id: number;
  title: string;
  genre: string;
  release_year: number;
  rating: number;
  director: string;
  duration: number;
  description: string;
  is_premium: boolean;
  main_lead: string;
  poster_url: string;
  banner_url: string;
}

const containerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;

      try {
        const data = await getMoviesById(Number(id));
        if (data?.is_premium) {
          setMovie(data as Movie);
        } else {
          setMovie(data as Movie);
        }
      } catch (error: any) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          navigate("/subscription");
        } else {
          console.error("Error fetching movie:", error);
          toast.error("Failed to fetch movie details");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex flex-col items-center justify-center">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white text-lg font-semibold">Loading Movie Details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="bg-black min-h-screen flex flex-col items-center justify-center">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <p className="text-white text-lg font-semibold">Movie Not Found</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />

      <motion.div
        variants={containerVariant}
        initial="hidden"
        animate="visible"
        className="relative flex flex-col items-start justify-center min-h-50 md:min-h-20 text-left px-6 md:px-16 py-10"
        style={{
          backgroundImage: `url(${movie.banner_url})`,
          backgroundSize: "cover",
          backgroundPosition: "top center",
        }}
      >
        <div className="absolute inset-0 bg-black/30 bg-gradient-to-t from-black via-black/30 to-transparent"></div>

        <motion.button
          variants={itemVariant}
          onClick={() => navigate("/")}
          className="flex items-center text-gray-300 mb-4 hover:text-white mb-10 relative z-[5] w-full"
        >
          <FaArrowLeft className="mr-2" /> Back home
        </motion.button>

        <div className="flex flex-col md:flex-row gap-10 relative z-[5] w-full">
          <motion.img
            variants={itemVariant}
            src={movie.poster_url}
            alt={movie.title}
            className="w-[300px] h-[400px] border rounded-lg shadow-md object-cover"
          />

          <motion.div variants={containerVariant} className="flex-1 gap-4">
            <motion.h1
              variants={itemVariant}
              className="text-4xl text-white font-bold mb-2"
            >
              {movie.title}{" "}
              <span className="text-gray-400 text-lg">{movie.release_year}</span>
            </motion.h1>

            <motion.div
              variants={itemVariant}
              className="text-lg text-gray-300 mb-2 space-y-1"
            >
              <p><strong>Genre:</strong> {movie.genre}</p>
              <p><strong>Time:</strong> {movie.duration}m</p>
              <p><strong>Stars:</strong> {movie.main_lead}</p>
              <p><strong>Created by:</strong> {movie.director}</p>
            </motion.div>

            <motion.div
              variants={itemVariant}
              className="flex items-center gap-2 my-2"
            >
              <span className="bg-yellow-600 px-2 py-[2px] rounded-md text-black font-bold text-sm">
                {movie.rating.toFixed(1)}
              </span>
            </motion.div>

            <motion.p variants={itemVariant} className="text-gray-300 mt-4">
              {movie.description}
            </motion.p>
          </motion.div>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
};

export default MovieDetailPage;