// import React, { useEffect, useState } from 'react';
// import { getAllMoviesPagination, searchMovies as searchMoviesAPI, getRecommendedMovies } from '../Services/MovieService';
// import MovieCard from '../components/MovieCard';
// import Header from '../components/header';
// import Footer from '../components/footer';
// import { motion } from 'framer-motion';
// import SearchBar from '../components/SearchBar';
// import RecommendationQuiz from '../components/RecomendQuiz';
// import { useSearchParams } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { Sparkles, Grid, X } from 'lucide-react';

// interface Movie {
//   id: number;
//   title: string;
//   poster_url: string;
//   duration: number;
//   is_premium: boolean;
//   genre: string;
//   quality?: string;
// }

// interface RecommendationPreferences {
//   genre?: string;
//   release_year_from?: number;
//   release_year_to?: number;
//   duration_max?: number;
//   include_premium?: boolean;
// }

// const AllMovies: React.FC = () => {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const initialPage = parseInt(searchParams.get('page') || '1', 10);
//   const [role, setRole] = useState<string | null>(null);
//   const [movies, setMovies] = useState<Movie[]>([]);
//   const [currentPage, setCurrentPage] = useState(initialPage);
//   const [totalPages, setTotalPages] = useState(1);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
  
//   // New states for recommendation feature
//   const [isQuizOpen, setIsQuizOpen] = useState(false);
//   const [isRecommendationMode, setIsRecommendationMode] = useState(false);
//   const [currentPreferences, setCurrentPreferences] = useState<RecommendationPreferences>({});

//   useEffect(() => {
//   window.scrollTo(0, 0);  
// }, []);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearchTerm(searchTerm);
//     }, 400);

//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   useEffect(() => {
//     if (isRecommendationMode) {
//       // Don't fetch if we're in recommendation mode
//       return;
//     }
    
//     if (debouncedSearchTerm) {
//       searchMovies(debouncedSearchTerm);
//     } else {
//       fetchMovies(currentPage);
//     }
//   }, [debouncedSearchTerm, currentPage, isRecommendationMode]);

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
//     } catch (error: any) {
//       console.error('Fetch error:', error.message);
//       setMovies([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const searchMovies = async (query: string) => {
//     try {
//       setIsLoading(true);
//       const results = await searchMoviesAPI(query);
//       if (results && results.length > 0) {
//         setMovies(results);
//         setTotalPages(1);
//       } else {
//         setMovies([]);
//         setTotalPages(1);
//         toast.error('No movies found for this search');
//       }
//     } catch (error: any) {
//       console.error('Search error:', error.message);
//       setMovies([]);
//       toast.error('Search failed');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleRecommendationSubmit = async (preferences: RecommendationPreferences) => {
//     try {
//       setIsLoading(true);
//       setCurrentPreferences(preferences);
//       const recommendations = await getRecommendedMovies(preferences);
      
//       if (recommendations && recommendations.length > 0) {
//         setMovies(recommendations);
//         setIsRecommendationMode(true);
//         setTotalPages(1);
//         toast.success(`Found ${recommendations.length} movie recommendations for you!`);
//       } else {
//         setMovies([]);
//         toast.error('No movies found matching your preferences. Try adjusting your criteria.');
//       }
//     } catch (error: any) {
//       console.error('Recommendation error:', error.message);
//       setMovies([]);
//       toast.error('Failed to get recommendations');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//     setSearchParams({ page: page.toString() });
//   };

//   const exitRecommendationMode = () => {
//     setIsRecommendationMode(false);
//     setCurrentPreferences({});
//     setSearchTerm('');
//     setCurrentPage(1);
//     setSearchParams({});
//     fetchMovies(1);
//   };

//   const getRecommendationSummary = () => {
//     const parts = [];
//     if (currentPreferences.genre) parts.push(currentPreferences.genre);
//     if (currentPreferences.release_year_from && currentPreferences.release_year_to) {
//       parts.push(`${currentPreferences.release_year_from}-${currentPreferences.release_year_to}`);
//     }
//     if (currentPreferences.duration_max && currentPreferences.duration_max < 999) {
//       parts.push(`under ${currentPreferences.duration_max}min`);
//     }
//     if (currentPreferences.include_premium === false) parts.push('free only');
    
//     return parts.join(', ');
//   };

//   return (
//     <div>
//       <Header />
//       <div className="bg-black min-h-screen text-white w-full flex flex-col justify-center items-center z-10">
//         <motion.div className="text-center mt-5 mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
//           <h1 className="text-3xl font-bold">
//             Your Gateway to Movie <span className="text-red-500">Magic</span>
//           </h1>
//           <p className="text-gray-400 mt-2 mb-5">Dive into the world of cinema with MovieVerse.</p>
          
//           {/* Search Bar and Recommendation Button */}
//           {!isRecommendationMode && (
//             <>
//               <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              
//               {/* Get Recommendations Button */}
//               <motion.button
//                 onClick={() => setIsQuizOpen(true)}
//                 className="mt-4 mb-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <div className="flex items-center ">
//                   <Sparkles size={20} />
//                   <span className='px-1 py-1 sm:px-1 sm:py-1 text-xs lg:text-lg '>Get Personal Recommendations</span>
//                 </div>
//               </motion.button>
//             </>
//           )}

//           {/* Recommendation Mode Header */}
//           {isRecommendationMode && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="mb-4"
//             >
//               <div className="bg-gradient-to-r from-red-900/30 to-red-800/30 border border-red-700/50 rounded-lg p-4 max-w-2xl mx-auto ">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <Sparkles className="text-red-400" size={24} />
//                     <div className="text-left">
//                       <h3 className="text-lg font-semibold text-white">Personalized Recommendations</h3>
//                       <p className="text-sm text-gray-300">Based on: {getRecommendationSummary()}</p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={exitRecommendationMode}
//                     className="text-gray-400 hover:text-white transition-colors"
//                     title="Back to all movies"
//                   >
//                     <X size={20} />
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           )}

//           <h1 className="text-3xl font-bold mt-5">
//             {isRecommendationMode ? (
//               <>Recommended <span className="text-red-500">Movies</span></>
//             ) : (
//               <>All <span className="text-red-500">Movies</span></>
//             )}
//           </h1>
//         </motion.div>

//         {isLoading ? (
//           <div className="flex flex-col items-center justify-center min-h-[400px]">
//             <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
//             <p className="text-white text-lg font-semibold">
//               {isRecommendationMode ? 'Finding Perfect Movies for You...' : 'Loading Movies...'}
//             </p>
//           </div>
//         ) : movies.length === 0 ? (
//           <div className="flex flex-col items-center justify-center min-h-[400px]">
//             <p className="text-white text-lg font-semibold mb-4">
//               {isRecommendationMode ? 'No movies match your preferences' : 'No Movies Available'}
//             </p>
//             {isRecommendationMode && (
//               <button
//                 onClick={() => setIsQuizOpen(true)}
//                 className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors"
//               >
//                 Try Different Preferences
//               </button>
//             )}
//           </div>
//         ) : (
//           <div 
//           className="w-[67%] max-w-7xl flex max-sm:w-[92%] flex-wrap gap-[25px] justify-center items-center !mb-[50px] max-md:w-[90%] max-xl:w-[90%] max-[1515px]:w-[90%]"
//           >
//             {movies.map((movie, index) => (
//               <motion.div key={movie.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05, duration: 0.4 }}>
//                 <MovieCard
//                   id={movie.id.toString()}
//                   title={movie.title}
//                   imageUrl={movie.poster_url}
//                   duration={`${movie.duration} min`}
//                   is_premium={movie.is_premium}
//                   genre={movie.genre}
//                   role={role || undefined}
//                 />
//               </motion.div>
//             ))}
//           </div>
//         )}

//         {/* Pagination - only show if not in recommendation mode and not searching */}
//         {!debouncedSearchTerm && !isRecommendationMode && movies.length > 0 && !isLoading && (
//           <motion.div className="flex justify-center items-center mt-8 gap-2 flex-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
//             <button
//               onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
//               disabled={currentPage === 1}
//               className={`px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm  rounded ${currentPage === 1 ? 'bg-gray-500 text-gray-300 cursor-not-allowed' : 'bg-red-700 text-gray-200 hover:bg-red-600 cursor-pointer'}`}
//             >
//               Previous
//             </button>

//             {[...Array(totalPages)].map((_, i) => (
//               <button
//                 key={i}
//                 onClick={() => handlePageChange(i + 1)}
//                 className={`cursor-pointer px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm  rounded ${currentPage === i + 1 ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
//               >
//                 {i + 1}
//               </button>
//             ))}

//             <button
//               onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
//               disabled={currentPage === totalPages}
//               className={`px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm rounded ${currentPage === totalPages ? 'bg-gray-500 text-gray-300 cursor-not-allowed' : 'bg-red-700 text-gray-200 hover:bg-red-600 cursor-pointer'}`}
//             >
//               Next
//             </button>
//           </motion.div>
//         )}

//         {/* Recommendation Mode Footer */}
//         {isRecommendationMode && movies.length > 0 && (
//           <motion.div 
//             className="mt-8 text-center"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.4 }}
//           >
//             <p className="text-gray-400 mb-4">
//               Found {movies.length} movies matching your preferences
//             </p>
//             <div className="flex gap-4 justify-center flex-wrap">
//               <button
//                 onClick={() => setIsQuizOpen(true)}
//                 className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors"
//               >
//                 Refine Preferences
//               </button>
//               <button
//                 onClick={exitRecommendationMode}
//                 className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors flex items-center gap-2"
//               >
//                 <Grid size={16} />
//                 Browse All Movies
//               </button>
//             </div>
//           </motion.div>
//         )}
//       </div>

//       {/* Recommendation Quiz Modal */}
//       <RecommendationQuiz
//         isOpen={isQuizOpen}
//         onClose={() => setIsQuizOpen(false)}
//         onSubmit={handleRecommendationSubmit}
//       />

//       <Footer />
//     </div>
//   );
// };

// export default AllMovies;


import React, { useEffect, useState, useCallback } from 'react';
import { getAllMoviesPagination, searchMovies as searchMoviesAPI, getRecommendedMovies, getMoviesByGenre } from '../Services/MovieService';
import MovieCard from '../components/MovieCard';
import Header from '../components/header';
import Footer from '../components/footer';
import { motion } from 'framer-motion';
import SearchBar from '../components/SearchBar';
import RecommendationQuiz from '../components/RecomendQuiz';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Sparkles, Grid, X } from 'lucide-react';
import { partial_ratio } from 'fuzzball';

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
  const initialGenre = searchParams.get('genre') || 'all';
  const [role, setRole] = useState<string | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecommendationMode, setIsRecommendationMode] = useState(false);
  const [currentPreferences, setCurrentPreferences] = useState<RecommendationPreferences>({});
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false); // Add this state
  const [isSearching, setIsSearching] = useState(false); // Add this to track search state


    useEffect(() => {
    window.scrollTo(0, 0);  
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setRole(user?.role || null);
  }, []);

  // Debounce function
  const debounce = <T extends (...args: any[]) => void>(func: T, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Fetch suggestions
  const fetchSuggestions = async (query: string) => {
    if (!query || !showSuggestions) { // Check showSuggestions flag
      setSuggestions([]);
      return;
    }
    try {
      let movieData;
      if (query.length <= 4) {
        movieData = selectedGenre === 'all' ? await getAllMoviesPagination(1) : await getMoviesByGenre(selectedGenre, 1);
      } else {
        movieData = await searchMoviesAPI(query, selectedGenre, 1);
      }

      const movieTitles = movieData?.movies?.map((movie: Movie) => movie.title) || [];

      const fuzzyResults = movieTitles
        .map((title) => ({
          title,
          score: partial_ratio(query.toLowerCase(), title.toLowerCase()),
        }))
        .filter((result) => result.score > 40)
        .sort((a, b) => b.score - a.score)
        .map((result) => result.title)
        .slice(0, 5);

      setSuggestions(fuzzyResults);
    } catch (error: any) {
      console.error('Error fetching suggestions:', error.message);
      setSuggestions([]);
    }
  };

  const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 500), [selectedGenre, showSuggestions]);

  // Handle search
  const loadMovies = async (query: string, genre: string, page: number) => {
    // Prevent multiple simultaneous searches
    if (isSearching) return;
    
    try {
      setIsSearching(true);
      setIsLoading(true);
      let movieData;
      if (query) {
        movieData = await searchMoviesAPI(query, genre, page);
      } else if (genre === 'all') {
        movieData = await getAllMoviesPagination(page);
      } else {
        movieData = await getMoviesByGenre(genre, page);
      }

      let movieArray = movieData?.movies || [];
      const paginationData = movieData?.pagination || {
        current_page: page,
        total_pages: 1,
        total_count: movieArray.length,
        per_page: 10,
      };

      if (query) {
        movieArray = movieArray
          .map((movie: Movie) => ({
            ...movie,
            score: partial_ratio(query.toLowerCase(), movie.title.toLowerCase()),
          }))
          .filter((movie: Movie & { score: number }) => movie.score > 40)
          .sort((a, b) => b.score - a.score);
      }

      if (movieArray.length > 0) {
        setMovies(movieArray);
        setTotalPages(paginationData.total_pages);
      } else {
        setMovies([]);
        setTotalPages(1);
        console.error('No movies found for this search');
      }
    } catch (error: any) {
      console.error('Search error:', error.message);
      setMovies([]);
      toast.error('Search failed');
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };

  const debouncedSearch = useCallback(debounce(loadMovies, 1000), []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Modified useEffect for search term changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      // Only show suggestions if user is actively typing (not after selecting a suggestion)
      if (searchTerm && showSuggestions) {
        debouncedFetchSuggestions(searchTerm);
      } else {
        setSuggestions([]);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm, debouncedFetchSuggestions, showSuggestions]);

  // Modified useEffect for debouncedSearchTerm and URL params
  useEffect(() => {
    if (isRecommendationMode) {
      return;
    }

    const page = parseInt(searchParams.get('page') || '1', 10);
    const genre = searchParams.get('genre') || 'all';
    
    // Only update state if they're different to prevent unnecessary re-renders
    if (currentPage !== page) setCurrentPage(page);
    if (selectedGenre !== genre) setSelectedGenre(genre);
    
    loadMovies(debouncedSearchTerm, genre, page);
  }, [debouncedSearchTerm, searchParams, isRecommendationMode]);

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
    setSearchParams({ page: page.toString(), genre: selectedGenre });
  };

  const handleGenreSelect = (genreId: string) => {
    setSelectedGenre(genreId);
    setCurrentPage(1);
    setSearchParams({ page: '1', genre: genreId });
    // Don't call loadMovies here - let the useEffect handle it
  };

  // Modified suggestion click handler
  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
    setShowSuggestions(false); // Hide suggestions after selection
    setCurrentPage(1);
    setSearchParams({ page: '1', genre: selectedGenre });
    // Don't call loadMovies here - let the useEffect handle it
  };

  // Add handler for search input focus/blur
  const handleSearchFocus = () => {
    setShowSuggestions(true);
    if (searchTerm) {
      debouncedFetchSuggestions(searchTerm);
    }
  };

  const handleSearchBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false);
      setSuggestions([]);
    }, 150);
  };

  // Add handler for search term changes from SearchBar
  const handleSearchTermChange = (term: string) => {
    setSearchTerm(term);
    setShowSuggestions(true); // Show suggestions when user is typing
  };

  const exitRecommendationMode = () => {
    setIsRecommendationMode(false);
    setCurrentPreferences({});
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
    setIsSearching(false); // Reset search state
    setCurrentPage(1);
    setSearchParams({ page: '1', genre: 'all' });
    loadMovies('', 'all', 1);
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

  return (
    <div>
      <Header />
      <div className="bg-black min-h-screen text-white w-full flex flex-col justify-center items-center z-10">
        <motion.div className="text-center mt-5 mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-3xl font-bold">
            Your Gateway to Movie <span className="text-red-500">Magic</span>
          </h1>
          <p className="text-gray-400 mt-2 mb-5">Dive into the world of cinema with MovieVerse.</p>

          {/* Genre Chips and Search Bar */}
          {!isRecommendationMode && (
            <>
              <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={handleSearchTermChange} // Use the new handler
                suggestions={showSuggestions ? suggestions : []} // Only show suggestions when flag is true
                onSuggestionClick={handleSuggestionClick}
                onFocus={handleSearchFocus} // Add these props if your SearchBar supports them
                onBlur={handleSearchBlur}
              />
              <motion.button
                onClick={() => setIsQuizOpen(true)}
                className="mt-4 mb-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center">
                  <Sparkles size={20} />
                  <span className="px-1 py-1 sm:px-1 sm:py-1 text-xs lg:text-lg">Get Personal Recommendations</span>
                </div>
              </motion.button>
            </>
          )}

          {/* Recommendation Mode Header */}
          {isRecommendationMode && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
              <div className="bg-gradient-to-r from-red-900/30 to-red-800/30 border border-red-700/50 rounded-lg p-4 max-w-2xl mx-auto">
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
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
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
          <div className="w-[67%] max-w-7xl flex max-sm:w-[92%] flex-wrap gap-[25px] justify-center items-center !mb-[50px] max-md:w-[90%] max-xl:w-[90%] max-[1515px]:w-[90%]">
            {movies.map((movie, index) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
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
          </div>
        )}

        {!debouncedSearchTerm && !isRecommendationMode && movies.length > 0 && !isLoading && (
          <motion.div
            className="flex justify-center items-center mt-8 gap-2 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <button
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className={`px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm rounded ${
                currentPage === 1 ? 'bg-gray-500 text-gray-300 cursor-not-allowed' : 'bg-red-700 text-gray-200 hover:bg-red-600 cursor-pointer'
              }`}
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`cursor-pointer px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm rounded ${
                  currentPage === i + 1 ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm rounded ${
                currentPage === totalPages ? 'bg-gray-500 text-gray-300 cursor-not-allowed' : 'bg-red-700 text-gray-200 hover:bg-red-600 cursor-pointer'
              }`}
            >
              Next
            </button>
          </motion.div>
        )}

        {isRecommendationMode && movies.length > 0 && (
          <motion.div className="mt-8 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <p className="text-gray-400 mb-4">Found {movies.length} movies matching your preferences</p>
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