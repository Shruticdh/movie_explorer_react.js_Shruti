import React, { useEffect, useState, useRef } from 'react';
import { getAllMoviesPagination, searchMovies as searchMoviesAPI, getRecommendedMovies } from '../Services/MovieService';
import MovieCard from '../components/MovieCard';
import Header from '../components/header';
import Footer from '../components/footer';
import { motion } from 'framer-motion';
import SearchBar from '../components/SearchBar';
import RecommendationQuiz from '../components/RecomendQuiz';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Sparkles, Grid, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Movie {
  id: number;
  title: string;
  poster_url: string;
  duration: number;
  is_premium: boolean;
  genre: string;
  quality?: string;
}

interface RecommendationPreferences {
  genre?: string;
  release_year_from?: number;
  release_year_to?: number;
  duration_max?: number;
  include_premium?: boolean;
}

const AllMovies: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = parseInt(searchParams.get('page') || '1', 10);
  const [role, setRole] = useState<string | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // New states for recommendation feature
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isRecommendationMode, setIsRecommendationMode] = useState(false);
  const [currentPreferences, setCurrentPreferences] = useState<RecommendationPreferences>({});

  // Carousel states
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);  
  }, []);

  // Check if screen is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (isRecommendationMode) {
      // Don't fetch if we're in recommendation mode
      return;
    }
    
    if (debouncedSearchTerm) {
      searchMovies(debouncedSearchTerm);
    } else {
      fetchMovies(currentPage);
    }
  }, [debouncedSearchTerm, currentPage, isRecommendationMode]);

  // Reset carousel when movies change
  useEffect(() => {
    setCurrentSlide(0);
  }, [movies]);

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
    } catch (error: any) {
      console.error('Fetch error:', error.message);
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const searchMovies = async (query: string) => {
    try {
      setIsLoading(true);
      const results = await searchMoviesAPI(query);
      if (results && results.length > 0) {
        setMovies(results);
        setTotalPages(1);
      } else {
        setMovies([]);
        setTotalPages(1);
        toast.error('No movies found for this search');
      }
    } catch (error: any) {
      console.error('Search error:', error.message);
      setMovies([]);
      toast.error('Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecommendationSubmit = async (preferences: RecommendationPreferences) => {
    try {
      setIsLoading(true);
      setCurrentPreferences(preferences);
      const recommendations = await getRecommendedMovies(preferences);
      
      if (recommendations && recommendations.length > 0) {
        setMovies(recommendations);
        setIsRecommendationMode(true);
        setTotalPages(1);
        toast.success(`Found ${recommendations.length} movie recommendations for you!`);
      } else {
        setMovies([]);
        toast.error('No movies found matching your preferences. Try adjusting your criteria.');
      }
    } catch (error: any) {
      console.error('Recommendation error:', error.message);
      setMovies([]);
      toast.error('Failed to get recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams({ page: page.toString() });
  };

  const exitRecommendationMode = () => {
    setIsRecommendationMode(false);
    setCurrentPreferences({});
    setSearchTerm('');
    setCurrentPage(1);
    setSearchParams({});
    fetchMovies(1);
  };

  const getRecommendationSummary = () => {
    const parts = [];
    if (currentPreferences.genre) parts.push(currentPreferences.genre);
    if (currentPreferences.release_year_from && currentPreferences.release_year_to) {
      parts.push(`${currentPreferences.release_year_from}-${currentPreferences.release_year_to}`);
    }
    if (currentPreferences.duration_max && currentPreferences.duration_max < 999) {
      parts.push(`under ${currentPreferences.duration_max}min`);
    }
    if (currentPreferences.include_premium === false) parts.push('free only');
    
    return parts.join(', ');
  };

  // Carousel navigation functions
  const nextSlide = () => {
    if (isMobile && movies.length > 0) {
      const maxSlide = Math.max(0, movies.length - 2); // Show 2 cards at once on mobile
      setCurrentSlide(prev => Math.min(prev + 1, maxSlide));
    }
  };

  const prevSlide = () => {
    if (isMobile) {
      setCurrentSlide(prev => Math.max(prev - 1, 0));
    }
  };

  // Touch/swipe functionality
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
  };

  // Mouse wheel scrolling functionality
  const handleWheel = (e: React.WheelEvent) => {
    if (!isMobile) return; // Only enable wheel scrolling on mobile carousel
    
    e.preventDefault();
    
    if (e.deltaY > 0) {
      // Scrolling down - go to next slide
      nextSlide();
    } else if (e.deltaY < 0) {
      // Scrolling up - go to previous slide
      prevSlide();
    }
  };

  const movieContainerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const movieCardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const renderMovieCards = () => {
    if (isMobile && movies.length > 0) {
      // Mobile Carousel View
      return (
        <div className="w-full px-4">
          {/* Carousel Navigation Buttons */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={`p-2 rounded-full ${
                currentSlide === 0 
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              <ChevronLeft size={20} />
            </button>
            
            <span className="text-white text-sm">
              {currentSlide + 1} - {Math.min(currentSlide + 2, movies.length)} of {movies.length}
            </span>
            
            <button
              onClick={nextSlide}
              disabled={currentSlide >= movies.length - 2}
              className={`p-2 rounded-full ${
                currentSlide >= movies.length - 2
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Carousel Container */}
          <div 
            className="overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onWheel={handleWheel}
          >
            <motion.div
              ref={carouselRef}
              className="flex transition-transform duration-300 ease-in-out gap-4"
              style={{
                transform: `translateX(-${currentSlide * 50}%)`,
              }}
            >
              {movies.map((movie, index) => (
                <motion.div 
                  key={movie.id} 
                  className="flex-shrink-0 w-1/2"
                  variants={movieCardVariants}
                  initial="hidden"
                  animate="show"
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                >
                  <MovieCard
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
          </div>

          {/* Dots Indicator */}
          {movies.length > 2 && (
            <div className="flex justify-center mt-4 gap-2">
              {Array.from({ length: Math.max(1, movies.length - 1) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === currentSlide ? 'bg-red-500' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      );
    } else {
      // Desktop Grid View
      return (
        <motion.div
          className="w-[67%] max-w-7xl flex flex-wrap gap-[25px] justify-center items-center !mb-[50px] max-sm:w-[92%] max-md:w-[90%] max-xl:w-[90%] max-[1515px]:w-[90%]"
          variants={movieContainerVariants}
          initial="hidden"
          animate="show"
        >
          {movies.map((movie, index) => (
            <motion.div 
              key={movie.id} 
              variants={movieCardVariants}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              <MovieCard
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
      );
    }
  };

  return (
    <div>
      <Header />
      <div className="bg-black min-h-screen text-white w-full flex flex-col justify-center items-center z-10">
        <motion.div className="text-center mt-5 mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-3xl font-bold">
            Your Gateway to Movie <span className="text-red-500">Magic</span>
          </h1>
          <p className="text-gray-400 mt-2 mb-5">Dive into the world of cinema with MovieVerse.</p>
          
          {/* Search Bar and Recommendation Button */}
          {!isRecommendationMode && (
            <>
              <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              
              {/* Get Recommendations Button */}
              <motion.button
                onClick={() => setIsQuizOpen(true)}
                className="mt-4 mb-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center ">
                  <Sparkles size={20} />
                  <span className='px-1 py-1 sm:px-1 sm:py-1 text-xs lg:text-lg '>Get Personal Recommendations</span>
                </div>
              </motion.button>
            </>
          )}

          {/* Recommendation Mode Header */}
          {isRecommendationMode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <div className="bg-gradient-to-r from-red-900/30 to-red-800/30 border border-red-700/50 rounded-lg p-4 max-w-2xl mx-auto ">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles className="text-red-400" size={24} />
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-white">Personalized Recommendations</h3>
                      <p className="text-sm text-gray-300">Based on: {getRecommendationSummary()}</p>
                    </div>
                  </div>
                  <button
                    onClick={exitRecommendationMode}
                    className="text-gray-400 hover:text-white transition-colors"
                    title="Back to all movies"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          <h1 className="text-3xl font-bold mt-5">
            {isRecommendationMode ? (
              <>Recommended <span className="text-red-500">Movies</span></>
            ) : (
              <>All <span className="text-red-500">Movies</span></>
            )}
          </h1>
        </motion.div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white text-lg font-semibold">
              {isRecommendationMode ? 'Finding Perfect Movies for You...' : 'Loading Movies...'}
            </p>
          </div>
        ) : movies.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <p className="text-white text-lg font-semibold mb-4">
              {isRecommendationMode ? 'No movies match your preferences' : 'No Movies Available'}
            </p>
            {isRecommendationMode && (
              <button
                onClick={() => setIsQuizOpen(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors"
              >
                Try Different Preferences
              </button>
            )}
          </div>
        ) : (
          renderMovieCards()
        )}

        {/* Pagination - only show if not in recommendation mode and not searching */}
        {!debouncedSearchTerm && !isRecommendationMode && movies.length > 0 && !isLoading && (
          <motion.div className=" mb-10 flex justify-center items-center mt-8 gap-2 flex-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <button
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className={`px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm  rounded ${currentPage === 1 ? 'bg-gray-500 text-gray-300 cursor-not-allowed' : 'bg-red-700 text-gray-200 hover:bg-red-600 cursor-pointer'}`}
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`cursor-pointer px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm  rounded ${currentPage === i + 1 ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm rounded ${currentPage === totalPages ? 'bg-gray-500 text-gray-300 cursor-not-allowed' : 'bg-red-700 text-gray-200 hover:bg-red-600 cursor-pointer'}`}
            >
              Next
            </button>
          </motion.div>
        )}

        {/* Recommendation Mode Footer */}
        {isRecommendationMode && movies.length > 0 && (
          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-gray-400 mb-4">
              Found {movies.length} movies matching your preferences
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => setIsQuizOpen(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors"
              >
                Refine Preferences
              </button>
              <button
                onClick={exitRecommendationMode}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors flex items-center gap-2"
              >
                <Grid size={16} />
                Browse All Movies
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Recommendation Quiz Modal */}
      <RecommendationQuiz
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onSubmit={handleRecommendationSubmit}
      />

      <Footer />
    </div>
  );
};

export default AllMovies;