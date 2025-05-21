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
      <section className="bg-black px-4 md:px-16 py-8 text-white">
        <div className="bg-black text-white w-full flex flex-col justify-center items-center z-10 -mt-5 -mb-5">
          <h1 className="text-3xl font-bold">
            Your Gateway to Movie <span className="text-red-500">Magic</span>
          </h1>
          <p className="text-gray-400 mt-2 mb-5">
            Dive into the world of cinema with MovieVerse.
          </p>
        </div>

        <Genre onGenreClick={handleGenreClick} />

        <div className="bg-black text-white w-full flex flex-col justify-center items-center z-10 mt-3">
          <h1 className="text-3xl font-bold mb-5">
            Your Favorite Genre Movie <span className="text-red-500">Magic</span>
          </h1>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-white text-lg font-semibold">Loading Movies...</p>
            </div>
          ) : movies.length > 0 ? (
            <motion.div
              className="w-[67%] max-w-7xl flex flex-wrap gap-[25px] justify-center items-center !mb-[50px] max-sm:w-[92%] max-md:w-[90%] max-xl:w-[90%] max-[1515px]:w-[90%] mt-3"
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
                className={`px-4 py-2 rounded ${
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
                  className={`cursor-pointer px-4 py-2 rounded ${
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
                className={`px-4 py-2 rounded ${
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