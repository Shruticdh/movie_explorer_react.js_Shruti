// import React, { useEffect, useState, useRef } from 'react';
// import Genre from '../components/Genre';
// import Header from '../components/header';
// import Footer from '../components/footer';
// import { getAllMoviesPagination, getMoviesByGenre } from '../Services/MovieService';
// import MovieCard from '../components/MovieCard';
// import { motion } from 'framer-motion';
// import toast from 'react-hot-toast';
// import { useSearchParams } from 'react-router-dom';
// import { ChevronLeft, ChevronRight } from 'lucide-react';

// interface Movie {
//   id: number;
//   title: string;
//   poster_url: string;
//   duration: number;
//   genre: string;
//   quality?: string;
// }

// const GenreSection: React.FC = () => {
//   const [movies, setMovies] = useState<Movie[]>([]);
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [totalPages, setTotalPages] = useState<number>(1);
//   const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
//   const [role, setRole] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [isMobile, setIsMobile] = useState(false);
//   const carouselRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     window.scrollTo(0, 0);  
//   }, []);

//   // Check if screen is mobile
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768); // md breakpoint
//     };
    
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   useEffect(() => {
//     const pageFromUrl = searchParams.get('page');
//     const pageNum = pageFromUrl ? parseInt(pageFromUrl, 10) : 1;
//     if (!isNaN(pageNum) && pageNum > 0) {
//       setCurrentPage(pageNum);
//     } else {
//       setCurrentPage(1);
//       setSearchParams({ page: '1' });
//     }
//   }, [searchParams, setSearchParams]);

//   const fetchMovies = async (page: number) => {
//     try {
//       setIsLoading(true);
//       const user = JSON.parse(localStorage.getItem('user') || '{}');
//       setRole(user?.role);
//       const data = await getAllMoviesPagination(page);
//       if (data.movies && data.movies.length > 0) {
//         setMovies(data.movies);
//         setTotalPages(data.pagination.total_pages);
//       } else {
//         setMovies([]);
//         setTotalPages(1);
//         toast.error('No movies found');
//       }
//     } catch (error) {
//       console.error("Error fetching all movies:", error);
//       setMovies([]);
//       toast.error('Failed to load movies');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleGenreClick = async (genre: string) => {
//     try {
//       setIsLoading(true);
//       const user = JSON.parse(localStorage.getItem('user') || '{}');
//       setRole(user?.role);
//       const movieData = await getMoviesByGenre(genre);
//       if (movieData.movies && movieData.movies.length > 0) {
//         setMovies(movieData.movies);
//         setSelectedGenre(genre);
//         setCurrentPage(1);
//         setCurrentSlide(0); // Reset carousel
//         setSearchParams({});
//       } else {
//         setMovies([]);
//         setSelectedGenre(genre);
//         toast.error(`No movies found for genre: ${genre}`);
//       }
//     } catch (error) {
//       console.error("Error fetching movies by genre", error);
//       setMovies([]);
//       toast.error('Failed to load movies for this genre');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handlePageChange = (page: number) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//       setSelectedGenre(null);
//       setCurrentSlide(0); // Reset carousel
//       setSearchParams({ page: page.toString() });
//     }
//   };

//   useEffect(() => {
//     if (!selectedGenre) {
//       fetchMovies(currentPage);
//     }
//   }, [currentPage, selectedGenre]);

//   // Carousel navigation functions
//   const nextSlide = () => {
//     if (isMobile && movies.length > 0) {
//       const maxSlide = Math.max(0, movies.length - 2); // Show 2 cards at once on mobile
//       setCurrentSlide(prev => Math.min(prev + 1, maxSlide));
//     }
//   };

//   const prevSlide = () => {
//     if (isMobile) {
//       setCurrentSlide(prev => Math.max(prev - 1, 0));
//     }
//   };

//   // Touch/swipe functionality
//   const [touchStart, setTouchStart] = useState<number | null>(null);
//   const [touchEnd, setTouchEnd] = useState<number | null>(null);

//   const onTouchStart = (e: React.TouchEvent) => {
//     setTouchEnd(null);
//     setTouchStart(e.targetTouches[0].clientX);
//   };

//   const onTouchMove = (e: React.TouchEvent) => {
//     setTouchEnd(e.targetTouches[0].clientX);
//   };

//   const onTouchEnd = () => {
//     if (!touchStart || !touchEnd) return;
    
//     const distance = touchStart - touchEnd;
//     const isLeftSwipe = distance > 50;
//     const isRightSwipe = distance < -50;

//     if (isLeftSwipe) {
//       nextSlide();
//     }
//     if (isRightSwipe) {
//       prevSlide();
//     }
//   };

//   // Mouse wheel scrolling functionality
//   const handleWheel = (e: React.WheelEvent) => {
//     e.preventDefault();
    
//     if (e.deltaY > 0) {
//       // Scrolling down - go to next slide
//       nextSlide();
//     } else if (e.deltaY < 0) {
//       // Scrolling up - go to previous slide
//       prevSlide();
//     }
//   };

//   const movieContainerVariants = {
//     hidden: {},
//     show: {
//       transition: {
//         staggerChildren: 0.15,
//       },
//     },
//   };

//   const movieCardVariants = {
//     hidden: { opacity: 0, y: 30 },
//     show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
//   };

//   const renderMovieCards = () => {
//     if (isMobile && movies.length > 0) {
//       // Mobile Carousel View
//       return (
//         <div className="w-full px-4">
//           {/* Carousel Navigation Buttons */}
//           <div className="flex justify-between items-center mb-4">
//             <button
//               onClick={prevSlide}
//               disabled={currentSlide === 0}
//               className={`p-2 rounded-full ${
//                 currentSlide === 0 
//                   ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
//                   : 'bg-red-600 text-white hover:bg-red-700'
//               }`}
//             >
//               <ChevronLeft size={20} />
//             </button>
            
//             <span className="text-white text-sm">
//               {currentSlide + 1} - {Math.min(currentSlide + 2, movies.length)} of {movies.length}
//             </span>
            
//             <button
//               onClick={nextSlide}
//               disabled={currentSlide >= movies.length - 2}
//               className={`p-2 rounded-full ${
//                 currentSlide >= movies.length - 2
//                   ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
//                   : 'bg-red-600 text-white hover:bg-red-700'
//               }`}
//             >
//               <ChevronRight size={20} />
//             </button>
//           </div>

//           {/* Carousel Container */}
//           <div 
//             className="overflow-hidden"
//             onTouchStart={onTouchStart}
//             onTouchMove={onTouchMove}
//             onTouchEnd={onTouchEnd}
//           >
//             <motion.div
//               ref={carouselRef}
//               className="flex transition-transform duration-300 ease-in-out gap-4"
//               style={{
//                 transform: `translateX(-${currentSlide * 50}%)`,
//               }}
//             >
//               {movies.map((movie: any, index) => (
//                 <motion.div 
//                   key={movie.id} 
//                   className="flex-shrink-1 w-[50%] sm:w-[33.33%] md:w-[25%] lg:w-[20%] px-2"
//                   variants={movieCardVariants}
//                   initial="hidden"
//                   animate="show"
//                 >
//                   <MovieCard
//                     {...movie}
//                     id={movie.id.toString()}
//                     title={movie.title}
//                     imageUrl={movie.poster_url}
//                     duration={`${movie.duration} min`}
//                     genre={movie.genre}
//                     role={role || undefined}
//                   />
//                 </motion.div>
//               ))}
//             </motion.div>
//           </div>

//           {/* Dots Indicator */}
//           <div className="flex justify-center mt-4 gap-2">
//             {Array.from({ length: Math.max(1, movies.length - 1) }, (_, i) => (
//               <button
//                 key={i}
//                 onClick={() => setCurrentSlide(i)}
//                 className={`w-2 h-2 rounded-full transition-colors ${
//                   i === currentSlide ? 'bg-red-500' : 'bg-gray-600'
//                 }`}
//               />
//             ))}
//           </div>
//         </div>
//       );
//     } else {
//       // Desktop Grid View
//       return (
//         <motion.div
//           className="w-[67%] max-w-7xl flex flex-wrap gap-[25px] justify-center items-center !mb-[50px] max-sm:w-[92%] max-md:w-[90%] max-xl:w-[90%] max-[1515px]:w-[90%] mt-3"
//           variants={movieContainerVariants}
//           initial="hidden"
//           animate="show"
//         >
//           {movies.map((movie: any) => (
//             <motion.div key={movie.id} variants={movieCardVariants}>
//               <MovieCard
//                 {...movie}
//                 id={movie.id.toString()}
//                 title={movie.title}
//                 imageUrl={movie.poster_url}
//                 duration={`${movie.duration} min`}
//                 genre={movie.genre}
//                 role={role || undefined}
//               />
//             </motion.div>
//           ))}
//         </motion.div>
//       );
//     }
//   };

//   return (
//     <div>
//       <Header />
//       <section className="bg-black px-4 md:px-16 py-8 text-white">
//         <div className="bg-black text-white w-full flex flex-col justify-center items-center z-10 -mt-5 -mb-5">
//           <h1 className="text-3xl font-bold">
//             Your Gateway to Movie <span className="text-red-500">Magic</span>
//           </h1>
//           <p className="text-gray-400 mt-2 mb-5">
//             Dive into the world of cinema with MovieVerse.
//           </p>
//         </div>

//         <Genre onGenreClick={handleGenreClick} />

//         <div className="bg-black text-white w-full flex flex-col justify-center items-center z-10 mt-3">
//           <h1 className="text-3xl font-bold mb-5">
//             Your Favorite Genre Movie <span className="text-red-500">Magic</span>
//           </h1>

//           {isLoading ? (
//             <div className="flex flex-col items-center justify-center min-h-[400px]">
//               <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
//               <p className="text-white text-lg font-semibold">Loading Movies...</p>
//             </div>
//           ) : movies.length > 0 ? (
//             renderMovieCards()
//           ) : (
//             <div className="flex flex-col items-center justify-center min-h-[400px]">
//               <p className="text-white text-lg font-semibold">No Movies Available</p>
//             </div>
//           )}

//           {!selectedGenre && totalPages > 1 && !isLoading && movies.length > 0 && (
//             <div className="flex flex-wrap justify-center gap-1 sm:gap-2 mt-8">
//               <button
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className={`px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm rounded ${
//                   currentPage === 1
//                     ? 'bg-gray-500 cursor-not-allowed'
//                     : 'bg-red-600 hover:bg-red-700 cursor-pointer'
//                 } text-white`}
//               >
//                 Prev
//               </button>

//               {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//                 <button
//                   key={page}
//                   onClick={() => handlePageChange(page)}
//                   className={`cursor-pointer px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm rounded min-w-[32px] sm:min-w-[40px] ${
//                     page === currentPage
//                       ? 'bg-red-500 text-white'
//                       : 'bg-gray-700 text-white hover:bg-gray-600'
//                   }`}
//                 >
//                   {page}
//                 </button>
//               ))}

//               <button
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className={`px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm rounded ${
//                   currentPage === totalPages
//                     ? 'bg-gray-500 cursor-not-allowed'
//                     : 'bg-red-600 hover:bg-red-700 cursor-pointer'
//                 } text-white`}
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </div>
//       </section>
//       <Footer />
//     </div>
//   );
// };

// export default GenreSection;








import React, { useEffect, useState } from 'react';
import Genre from '../components/Genre';
import Header from '../components/header';
import Footer from '../components/footer';
import { getAllMoviesPagination, getMoviesByGenre } from '../Services/MovieService';
import MovieCard from '../components/MovieCard';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';

interface Movie {
  id: number;
  title: string;
  poster_url: string;
  duration: number;
  genre: string;
  quality?: string;
}

const GenreSection: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
  window.scrollTo(0, 0);  
}, []);

  useEffect(() => {
    const pageFromUrl = searchParams.get('page');
    const pageNum = pageFromUrl ? parseInt(pageFromUrl, 10) : 1;
    if (!isNaN(pageNum) && pageNum > 0) {
      setCurrentPage(pageNum);
    } else {
      setCurrentPage(1);
      setSearchParams({ page: '1' });
    }
  }, [searchParams, setSearchParams]);

  const fetchMovies = async (page: number) => {
    try {
      setIsLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setRole(user?.role);
      const data = await getAllMoviesPagination(page);
      if (data.movies && data.movies.length > 0) {
        setMovies(data.movies);
        setTotalPages(data.pagination.total_pages);
      } else {
        setMovies([]);
        setTotalPages(1);
        toast.error('No movies found');
      }
    } catch (error) {
      console.error("Error fetching all movies:", error);
      setMovies([]);
      toast.error('Failed to load movies');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenreClick = async (genre: string) => {
    try {
      setIsLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setRole(user?.role);
      const movieData = await getMoviesByGenre(genre);
      if (movieData.movies && movieData.movies.length > 0) {
        setMovies(movieData.movies);
        setSelectedGenre(genre);
        setCurrentPage(1);
        setSearchParams({});
      } else {
        setMovies([]);
        setSelectedGenre(genre);
        toast.error(`No movies found for genre: ${genre}`);
      }
    } catch (error) {
      console.error("Error fetching movies by genre", error);
      setMovies([]);
      toast.error('Failed to load movies for this genre');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setSelectedGenre(null);
      setSearchParams({ page: page.toString() });
    }
  };

  useEffect(() => {
    if (!selectedGenre) {
      fetchMovies(currentPage);
    }
  }, [currentPage, selectedGenre]);

  const movieContainerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const movieCardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div>
      <Header />
      <section 
      className="bg-black px-2 md:px-16 py-8 text-white"
      >
        <div className="bg-black text-white w-full flex flex-col justify-center items-center z-10">
           <motion.div className="text-center mb-3" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-3xl font-bold">
            Your Gateway to Movie <span className="text-red-500">Magic</span>
          </h1>
          <p className="text-gray-400 mt-2 ">
            Dive into the world of cinema with MovieVerse.
          </p>
          </motion.div>
        </div>

        <Genre onGenreClick={handleGenreClick} />

        <div className="bg-black text-white w-full flex flex-col justify-center items-center z-10 mt-3">
          <motion.div className="text-center  mb-3" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-3xl font-bold mb-5">
            Your Favorite Genre Movie <span className="text-red-500">Magic</span>
          </h1>
          </motion.div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-white text-lg font-semibold">Loading Movies...</p>
            </div>
          ) : movies.length > 0 ? (
            <motion.div
            className='w-[67%] max-w-7xl flex max-sm:w-[92%] flex-wrap gap-[25px] justify-center items-center !mb-[50px] max-md:w-[90%] max-xl:w-[90%] max-[1515px]:w-[90%]'
              // className="w-[67%] max-w-7xl flex max-sm:w-[92%] flex-wrap gap-[25px] justify-center items-center !mb-[50px] max-md:w-[90%] max-xl:w-[90%] max-[1515px]:w-[90%]"
              variants={movieContainerVariants}
              initial="hidden"
              animate="show"
            >
              {movies.map((movie: any) => (
                <motion.div key={movie.id} variants={movieCardVariants}>
                  <MovieCard
                    {...movie}
                    id={movie.id.toString()}
                    title={movie.title}
                    imageUrl={movie.poster_url}
                    duration={`${movie.duration} min`}
                    is_premium={movie.is_premium}
                    genre={movie.genre}
                    role={role || undefined}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <p className="text-white text-lg font-semibold">No Movies Available</p>
            </div>
          )}

          {!selectedGenre && totalPages > 1 && !isLoading && movies.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm  rounded ${
                  currentPage === 1
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 cursor-pointer'
                } text-white`}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`cursor-pointer px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm rounded ${
                    page === currentPage
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-700 text-white'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm rounded ${
                  currentPage === totalPages
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 cursor-pointer'
                } text-white`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default GenreSection;

