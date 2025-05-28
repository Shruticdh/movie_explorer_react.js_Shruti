// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getMoviesById } from "../Services/MovieService";
// import { FaArrowLeft } from "react-icons/fa";
// import Header from "../components/header";
// import Footer from "../components/footer";
// import { motion } from "framer-motion";
// import toast from "react-hot-toast";

// interface Movie {
//   id: number;
//   title: string;
//   genre: string;
//   release_year: number;
//   rating: number;
//   director: string;
//   duration: number;
//   description: string;
//   is_premium: boolean;
//   main_lead: string;
//   poster_url: string;
//   banner_url: string;
// }

// const containerVariant = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.3,
//     },
//   },
// };

// const itemVariant = {
//   hidden: { opacity: 0, y: 30 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.6, ease: "easeOut" },
//   },
// };

// const MovieDetailPage: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const [movie, setMovie] = useState<Movie | null>(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchMovie = async () => {
//       if (!id) return;

//       try {
//         const data = await getMoviesById(Number(id));
//         if (data?.is_premium) {
//           setMovie(data as Movie);
//         } else {
//           setMovie(data as Movie);
//         }
//       } catch (error: any) {
//         if (error.response?.status === 401 || error.response?.status === 403) {
//           navigate("/subscription");
//         } else {
//           console.error("Error fetching movie:", error);
//           toast.error("Failed to fetch movie details");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMovie();
//   }, [id, navigate]);

//   if (loading) {
//     return (
//       <div className="bg-black min-h-screen flex flex-col items-center justify-center">
//         <Header />
//         <div className="flex flex-col items-center justify-center min-h-[400px]">
//           <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
//           <p className="text-white text-lg font-semibold">Loading Movie Details...</p>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   if (!movie) {
//     return (
//       <div className="bg-black min-h-screen flex flex-col items-center justify-center">
//         <Header />
//         <div className="flex flex-col items-center justify-center min-h-[400px]">
//           <p className="text-white text-lg font-semibold">Movie Not Found</p>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   return (
//     <div>
//       <Header />

//       <motion.div
//         variants={containerVariant}
//         initial="hidden"
//         animate="visible"
//         className="relative flex flex-col items-start justify-center min-h-50 md:min-h-20 text-left px-6 md:px-16 py-10"
//         style={{
//           backgroundImage: `url(${movie.banner_url})`,
//           backgroundSize: "cover",
//           backgroundPosition: "top center",
//         }}
//       >
//         <div className="absolute inset-0 bg-black/30 bg-gradient-to-t from-black via-black/30 to-transparent"></div>

//         <motion.button
//           variants={itemVariant}
//           onClick={() => navigate("/")}
//           className="flex items-center text-gray-300 mb-4 hover:text-white mb-10 relative z-[5] w-full"
//         >
//           <FaArrowLeft className="mr-2" /> Back home
//         </motion.button>

//         <div className="flex flex-col md:flex-row gap-10 relative z-[5] w-full">
//           <motion.img
//             variants={itemVariant}
//             src={movie.poster_url}
//             alt={movie.title}
//             className="w-[300px] h-[400px] border rounded-lg shadow-md object-cover"
//           />

//           <motion.div variants={containerVariant} className="flex-1 gap-4">
//             <motion.h1
//               variants={itemVariant}
//               className="text-4xl text-white font-bold mb-2"
//             >
//               {movie.title}{" "}
//               <span className="text-gray-400 text-lg">{movie.release_year}</span>
//             </motion.h1>

//             <motion.div
//               variants={itemVariant}
//               className="text-lg text-gray-300 mb-2 space-y-1"
//             >
//               <p><strong>Genre:</strong> {movie.genre}</p>
//               <p><strong>Time:</strong> {movie.duration}m</p>
//               <p><strong>Stars:</strong> {movie.main_lead}</p>
//               <p><strong>Created by:</strong> {movie.director}</p>
//             </motion.div>

//             <motion.div
//               variants={itemVariant}
//               className="flex items-center gap-2 my-2"
//             >
//               <span className="bg-yellow-600 px-2 py-[2px] rounded-md text-black font-bold text-sm">
//                 {movie.rating.toFixed(1)}
//               </span>
//             </motion.div>

//             <motion.p variants={itemVariant} className="text-gray-300 mt-4">
//               {movie.description}
//             </motion.p>
//           </motion.div>
//         </div>
//       </motion.div>

//       <Footer />
//     </div>
//   );
// };

// export default MovieDetailPage;



import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMoviesById, getMoviesByGenre } from "../Services/MovieService";
import { FaArrowLeft } from "react-icons/fa";
import Header from "../components/header";
import Footer from "../components/footer";
import MovieCard from "../components/MovieCard"; // Import your MovieCard component
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

const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [similarMoviesLoading, setSimilarMoviesLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  window.scrollTo(0, 0);  
}, []);

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

  // Fetch similar movies when movie data is loaded
  useEffect(() => {
    const fetchSimilarMovies = async () => {
      if (!movie) return;

      setSimilarMoviesLoading(true);
      try {
        const response = await getMoviesByGenre(movie.genre, 1);
        const movies = response.movies || [];
        
        // Filter out the current movie and limit to 6 similar movies
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

  return (
    <div className="bg-black min-h-screen">
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

      {/* Similar Movies Section */}
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
                  quality="HD" // You can adjust this based on your data
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