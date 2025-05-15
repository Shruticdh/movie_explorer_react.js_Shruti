import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllMovies } from "../Services/MovieService";
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const allMovies = await getAllMovies();
        if (allMovies && allMovies.length > 0) {
          setMovies(allMovies);
        } else {
          toast.error("No movies available");
        }
      } catch (error) {
        console.error("Failed to fetch movies:", error);
        toast.error("Failed to load movies");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMovieIndex((prev) => {
        console.log("movies length", movies.length);
        if (movies.length === 0) return 0;
        return (prev + 1) % movies.length;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [movies]);

  if (isLoading || movies.length === 0) {
    return (
      <section className="relative h-[600px] md:w-full bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-semibold">Loading Movies...</p>
        </div>
      </section>
    );
  }

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

      <div className="relative z-10 flex flex-col items-start justify-center min-h-250 md:min-h-200 text-left px-6 md:px-16 py-10 -mt-15">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMovie.title}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.h1
              variants={itemVariants}
              className="text-2xl md:text-5xl font-bold mb-6"
            >
              {currentMovie.title}
            </motion.h1>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-2 mb-4"
            >
              {currentMovie.genre.split(",").map((g) => (
                <span
                  key={g}
                  className="bg-red-700 text-white px-3 py-1 rounded-full text-md font-semibold"
                >
                  {g.trim()}
                </span>
              ))}
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4 text-gray-300 text-sm mb-4"
            >
              <span>{currentMovie.release_year}</span>
              <span>{currentMovie.duration} min</span>
              <span>{currentMovie.rating} ⭐</span>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-gray-300 text-sm md:text-sm mb-8 line-clamp-2 md:line-clamp-4 max-w-md"
            >
              {currentMovie.description}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default MovieBanner;