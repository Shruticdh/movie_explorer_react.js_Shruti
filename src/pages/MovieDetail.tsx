import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMoviesById, getMoviesByGenre } from "../Services/MovieService";
import { FaArrowLeft, FaPlay } from "react-icons/fa";
import Header from "../components/header";
import Footer from "../components/footer";
import MovieCard from "../components/MovieCard";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import YouTube, { YouTubeProps } from "react-youtube";

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
  trailer?: string;
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

const similarMoviesVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const movieCardVariant = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const modalVariant = {
  hidden: { 
    opacity: 0,
    scale: 0.8,
    y: 50
  },
  visible: { 
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 500,
      duration: 0.4
    }
  },
  exit: { 
    opacity: 0,
    scale: 0.8,
    y: 50,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

const backdropVariant = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.3 }
  }
};


const extractYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
    /^([a-zA-Z0-9_-]{11})$/, 
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  console.warn('Could not extract YouTube video ID from:', url);
  return null;
};

const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [similarMoviesLoading, setSimilarMoviesLoading] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;

      try {
        const data = await getMoviesById(Number(id));
        console.log('Fetched movie data:', data);
        console.log('Movie trailer URL:', data?.trailer);
        
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

  useEffect(() => {
    const fetchSimilarMovies = async () => {
      if (!movie) return;

      setSimilarMoviesLoading(true);
      try {
        const response = await getMoviesByGenre(movie.genre, 1);
        const movies = response.movies || [];
        
        const filteredMovies = movies
          .filter((m: Movie) => m.id !== movie.id)
          .slice(0, 6);
        
        setSimilarMovies(filteredMovies);
      } catch (error) {
        console.error("Error fetching similar movies:", error);
        toast.error("Failed to fetch similar movies");
      } finally {
        setSimilarMoviesLoading(false);
      }
    };

    fetchSimilarMovies();
  }, [movie]);

  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    console.log('YouTube player ready');
  };

  const onPlayerError: YouTubeProps['onError'] = (event) => {
    console.error('YouTube player error:', event);
    toast.error('Error loading trailer');
  };

  const opts: YouTubeProps['opts'] = {
    height: '390',
    width: '100%',
    playerVars: {
      autoplay: 1,
      controls: 1,
      modestbranding: 1,
      rel: 0,
    },
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="bg-black min-h-screen flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white text-lg font-semibold">Loading Movie Details...</p>
          </div>
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

  const videoId = movie.trailer ? extractYouTubeVideoId(movie.trailer) : null;
  
  console.log('Movie trailer:', movie.trailer);
  console.log('Extracted video ID:', videoId);

  return (
    <div className="bg-black min-h-screen">
      <Header />

      <motion.div
        variants={containerVariant}
        initial="hidden"
        animate="visible"
        className="relative flex flex-col items-start justify-center min-h-50 md:min-h-20 text-left px-6 md:px-16 py-10"
        style={{
          backgroundImage:`url(${movie.banner_url})`,
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

            <motion.div variants={itemVariant} className="mt-4">
              <p className="text-gray-300">{movie.description}</p>
              
               <div className="flex justify-start md:justify-end mt-6">
              {movie.trailer ? (
                videoId ? (
                 <motion.button
                      onClick={() => {
                        console.log('Play trailer clicked, video ID:', videoId);
                        setShowTrailer(true);
                      }}
                      className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105 hover:from-red-500 hover:to-red-600 cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      <div className="relative flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-full">
                          <FaPlay className="text-sm" />
                        </div>
                        <span>Play Trailer</span>
                      </div>
                    </motion.button>
                  ) : (
                    <div className="px-8 py-4 bg-gray-600/50 text-gray-400 rounded-xl font-bold text-lg border border-gray-500">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-500/50 rounded-full">
                          <FaPlay className="text-sm" />
                        </div>
                        <span>Trailer Unavailable</span>
                      </div>
                    </div>
                )
              ) : (
                 <div className="px-8 py-4 bg-gray-600/50 text-gray-400 rounded-xl font-bold text-lg border border-gray-500">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-500/50 rounded-full">
                        <FaPlay className="text-sm" />
                      </div>
                      <span>No Trailer Available</span>
                    </div>
                  </div>
              )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {showTrailer && videoId && (
        <motion.div
          variants={backdropVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setShowTrailer(false)}
        >
          <motion.div 
            variants={modalVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.button
              onClick={() => {
                console.log('Close trailer clicked');
                setShowTrailer(false);
              }}
              className="absolute -top-10 right-0 text-white text-3xl hover:text-red-500 transition-colors z-10 rounded-full cursor-pointer"
              title="Close trailer"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            > 
              ✕
            </motion.button>
            <motion.div
             className="relative w-full"
             style={{ paddingBottom: '56.25%'}}
              initial={{ borderRadius: 0 }}
              animate={{ borderRadius: 16 }}
              transition={{ delay: 0.2 }}
             >
              <div className="absolute inset-0">
                <YouTube 
                  videoId={videoId} 
                  opts={{
                    ...opts,
                    height: '100%',
                    width: '100%',
                  }} 
                  onReady={onPlayerReady}
                  onError={onPlayerError}
                  className="w-full h-full"
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      <motion.div
        variants={containerVariant}
        initial="hidden"
        animate="visible"
        className="px-6 md:px-16 py-10 bg-black"
      >
        <motion.h2
          variants={itemVariant}
          className="text-2xl md:text-3xl text-white font-bold mb-6"
        >
          More like this
        </motion.h2>

        {similarMoviesLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white ml-4">Loading similar movies...</p>
          </div>
        ) : similarMovies.length > 0 ? (
          <motion.div
            variants={similarMoviesVariant}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
          >
            {similarMovies.map((similarMovie) => (
              <motion.div key={similarMovie.id} variants={movieCardVariant}>
                <MovieCard
                  id={similarMovie.id.toString()}
                  title={similarMovie.title}
                  imageUrl={similarMovie.poster_url}
                  duration={`${similarMovie.duration}min`}
                  genre={similarMovie.genre}
                  is_premium={similarMovie.is_premium}
                  quality="HD"
                  role={localStorage.getItem("role") || ""}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.p
            variants={itemVariant}
            className="text-gray-400 text-center py-10"
          >
            No similar movies found in the {movie.genre} genre.
          </motion.p>
        )}
      </motion.div>

      <Footer />
    </div>
  );
};

export default MovieDetailPage;