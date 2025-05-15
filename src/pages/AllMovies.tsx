import React, { useEffect, useState } from 'react';
import { getAllMoviesPagination, searchMovies as searchMoviesAPI } from '../Services/MovieService';
import MovieCard from '../components/MovieCard';
import Header from '../components/header';
import Footer from '../components/footer';
import { motion } from 'framer-motion';
import SearchBar from '../components/SearchBar';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

interface Movie {
  id: number;
  title: string;
  poster_url: string;
  duration: number;
  is_premium: boolean;
  genre: string;
  quality?: string;
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      searchMovies(debouncedSearchTerm);
    } else {
      fetchMovies(currentPage);
    }
  }, [debouncedSearchTerm, currentPage]);

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
      toast.error('Failed to load movies');
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams({ page: page.toString() });
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
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <h1 className="text-3xl font-bold mt-5">
            All <span className="text-red-500">Movies</span>
          </h1>
        </motion.div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white text-lg font-semibold">Loading Movies...</p>
          </div>
        ) : movies.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <p className="text-white text-lg font-semibold">No Movies Available</p>
          </div>
        ) : (
          <div className="w-[67%] max-w-7xl flex max-sm:w-[92%] flex-wrap gap-[25px] justify-center items-center !mb-[50px] max-md:w-[90%] max-xl:w-[90%] max-[1515px]:w-[90%]">
            {movies.map((movie, index) => (
              <motion.div key={movie.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05, duration: 0.4 }}>
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
          </div>
        )}

        {!debouncedSearchTerm && movies.length > 0 && !isLoading && (
          <motion.div className="flex justify-center items-center mt-8 gap-2 flex-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <button
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-500 text-gray-300 cursor-not-allowed' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-500 text-gray-300 cursor-not-allowed' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
            >
              Next
            </button>
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AllMovies;