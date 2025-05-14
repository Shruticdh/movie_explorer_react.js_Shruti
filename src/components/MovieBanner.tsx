import React, { useState, useEffect } from "react";
import { FaPlay, FaClock } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { getAllMovies } from '../Services/MovieService'
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

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  exit: { opacity: 0, y: -20 },
};

const MovieBanner: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);

  useEffect(() => {
    const fetchMovies = async () => {
      const allMovies = await getAllMovies();
      toast.success("You Are in to MOVIEXPO: ")
      if (allMovies && allMovies.length > 0) {
        setMovies(allMovies);
          console.log("Fetched Movies:", allMovies); 
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMovieIndex((prev) => {
        if (movies.length === 0) return 0;
        return (prev + 1) % movies.length;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [movies]);

  const currentMovie = movies[currentMovieIndex];

  if (!currentMovie) return null;
  

  return (
    <section className="relative h-[600px] md:w-full text-white overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentMovie.banner_url}
          src={currentMovie.banner_url}
          alt={currentMovie.title}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full object-cover object-top max-sm:object-cover"
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>

      <div className="relative z-10 flex flex-col items-start justify-center min-h-250 md:min-h-200 text-left px-6 md:px-16 py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMovie.title}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div variants={itemVariants} className="hidden md:flex gap-4 mb-6">
              <button className="flex items-center bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-md transition">
                <FaPlay className="text-sm mr-2" />
                Watch Now
              </button>
              <button className="flex items-center border-2 border-white hover:bg-white hover:text-black text-white font-semibold px-4 py-2 rounded-md transition">
                <FaClock className="text-sm mr-2" />
                Watch Later
              </button>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-2xl md:text-4xl font-bold mb-4">
              {currentMovie.title}
            </motion.h1>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-2 mb-4">
              {currentMovie.genre.split(",").map((g) => (
                <span
                  key={g}
                  className="bg-white text-black px-3 py-1 rounded-full text-sm font-semibold"
                >
                  {g.trim()}
                </span>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 text-gray-300 text-xs mb-4">
              <span>{currentMovie.release_year}</span>
              <span>{currentMovie.duration} min</span>
              <span>{currentMovie.rating} ⭐</span>
            </motion.div>

            <motion.p variants={itemVariants} className="text-gray-300 text-xs md:text-sm mb-8 line-clamp-2 md:line-clamp-4 max-w-md">
              {currentMovie.description}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default MovieBanner;







