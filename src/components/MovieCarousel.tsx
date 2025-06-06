import React, { useEffect, useRef, useState } from 'react';
import { getAllMovies, getMoviesByGenre } from '../Services/MovieService';
import { useNavigate } from 'react-router-dom';
import MovieCard from './MovieCard';
import { motion, useInView } from 'framer-motion';

interface Movie {
  id: number;
  title: string;
  rating: number;
  duration: number;
  poster_url: string;
  is_premium: boolean;
  genre: string;
}
interface MovieResponse {
  movies: Movie[];
  pagination: {
    total_pages: number;
    current_page: number;
    per_page: number;
    total_count: number;
  };
}

const MovieCarousel: React.FC = () => {
  const [featured, setFeatured] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [mixedGenre, setMixedGenre] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [loadingStates, setLoadingStates] = useState({
    featured: true,
    popular: true,
    mixedGenre: true,
    topRated: true
  });
  const navigate = useNavigate();

  const featuredRef = useRef(null);
  const popularRef = useRef(null);
  const mixedGenreRef = useRef(null);
  const topRatedRef = useRef(null);

  const featuredInView = useInView(featuredRef, { once: true });
  const popularInView = useInView(popularRef, { once: true });
  const mixedGenreInView = useInView(mixedGenreRef, { once: true });
  const topRatedInView = useInView(topRatedRef, { once: true });

  const fetchMixedGenreMovies = async () => {
    const genres = ['Action', 'Comedy', 'Drama', 'Thriller', 'Horror', 'Sci-Fi'];
    const mixedMovies: Movie[] = [];

    try {
      for (const genre of genres) {
        try {
          const response = await getMoviesByGenre(genre);
          const movies = response?.movies || response;
          
          if (movies && Array.isArray(movies)) {
            const genreMovies = movies.slice(0, 2);
            mixedMovies.push(...genreMovies);
          }
        } catch (error) {
          console.error(`Error fetching ${genre} movies:`, error);
        }
      }

      const shuffledMovies = mixedMovies.sort(() => Math.random() - 0.5);
      
      setMixedGenre(shuffledMovies.slice(0, 12));
    } catch (error) {
      console.error("Error fetching mixed genre movies:", error);
      setMixedGenre([]);
    } finally {
      setLoadingStates(prev => ({ ...prev, mixedGenre: false }));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        setRole(user?.role || "");
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        setRole("");
      }

      try {
        const response = await getAllMovies();
        const movies = response?.movies || response;
        if (movies && Array.isArray(movies)) {
          setFeatured(movies.slice(0, 10));
        } else {
          console.warn("No valid movies data:", movies);
          setFeatured([]);
        }
      } catch (error) {
        console.error("Error fetching all movies:", error);
        setFeatured([]);
      } finally {
        setLoadingStates(prev => ({ ...prev, featured: false }));
      }

      try {
        const response = await getMoviesByGenre("Romance");
        const movies = response?.movies || response;
        if (movies && Array.isArray(movies)) {
          setPopular(movies.slice(0, 10));
        } else {
          console.warn("No valid romance movies data:", movies);
          setPopular([]);
        }
      } catch (error) {
        console.error("Error fetching romance movies:", error);
        setPopular([]);
      } finally {
        setLoadingStates(prev => ({ ...prev, popular: false }));
      }

      try {
        const allMoviesResponse = await getAllMovies();
        const allMovies = allMoviesResponse?.movies || allMoviesResponse;
        if (allMovies && Array.isArray(allMovies)) {
          const oldMovies = allMovies
            .filter(movie => movie.release_year < 2003)
            .sort((a, b) => b.rating - a.rating)
          setTopRated(oldMovies);
        }
      } catch (error) {
        console.error("Error fetching top rated old movies:", error);
        setTopRated([]);
      } finally {
        setLoadingStates(prev => ({ ...prev, topRated: false }));
      }

      await fetchMixedGenreMovies();
    };
    
    fetchData();
  }, []);

  const handleClick = () => {
    navigate('/all-movies')        
  }

  const renderCarouselSkeletonCards = (count: number = 10) => {
    return Array.from({ length: count }).map((_, index) => (
      <motion.div
        key={`carousel-skeleton-${index}`}
        style={{ scrollSnapAlign: 'start', flex: '0 0 auto' }}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          ease: 'easeOut',
          delay: index * 0.1,
        }}
      >
        <MovieCard
          id=""
          title=""
          imageUrl=""
          duration=""
          is_premium={false}
          genre=""
          role={role || undefined}
          isLoading={true}
        />
      </motion.div>
    ));
  };

  const renderCarousel = (
    title: string,
    movies: Movie[],
    ref: React.RefObject<HTMLDivElement>,
    inView: boolean,
    isLoading: boolean
  ) => (
    <div className="px-6 md:px-16 text-white mb-10 ">
      <div className="flex items-center justify-between w-full mb-4">
        <h2 className="text-white text-[1.5rem]">{title}</h2>
        <button
          className="text-sm text-white hover:underline hover:text-red-600 cursor-pointer"
          onClick={handleClick}
        >
          View All
        </button>
      </div>

      <div
        ref={ref}
        className="flex overflow-x-scroll space-x-4 scrollbar-hide py-4 flex-nowrap "
        style={{ scrollSnapType: 'x mandatory', scrollBehavior: 'smooth' }}
      >
        {isLoading ? (
          renderCarouselSkeletonCards()
        ) : (
          movies.map((movie, index) => (
            <motion.div
              key={movie.id}
              style={{ scrollSnapAlign: 'start', flex: '0 0 auto' }}
              initial={{ opacity: 0, y: 60 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                ease: 'easeOut',
                delay: index * 0.2,
              }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: index * 0.2 + 0.3, duration: 0.5 }}
              >
                <MovieCard
                  id={movie.id.toString()}
                  title={movie.title}
                  imageUrl={movie.poster_url}
                  duration={`${movie.duration} min`}
                  genre={movie.genre}
                  role={role || undefined}
                  is_premium={movie.is_premium}
                />
              </motion.div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="py-4 ">
      {renderCarousel('Top Rated ', featured, featuredRef, featuredInView, loadingStates.featured)}
      {renderCarousel('Popular Movies', popular, popularRef, popularInView, loadingStates.popular)}
      {renderCarousel('CineShuffle ', mixedGenre, mixedGenreRef, mixedGenreInView, loadingStates.mixedGenre)}
      {/* {renderCarousel('Top Rated', topRated, topRatedRef, topRatedInView, loadingStates.topRated)} */}
    </div>
  );
};

export default MovieCarousel;