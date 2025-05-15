import React, { useEffect, useRef, useState } from 'react';
import { getAllMovies } from '../Services/MovieService';
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

const MovieCarousel: React.FC = () => {
  const [featured, setFeatured] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [role, setRole] = useState<string | null>(null); 
  const navigate = useNavigate();

  const featuredRef = useRef(null);
  const popularRef = useRef(null);

  const featuredInView = useInView(featuredRef, { once: true });
  const popularInView = useInView(popularRef, { once: true });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setRole(user?.role);
    getAllMovies().then((movies) => {
      if (movies) {
        setFeatured(movies.slice(0, 10));
        setPopular(movies.filter((m: Movie) => m.rating >= 8).slice(0, 10));
      }
    });
  }, []);
   const handleClick = () =>{
    navigate('/all-movies')
   }

  const renderCarousel = (
    title: string,
    movies: Movie[],
    ref: React.RefObject<HTMLDivElement>,
    inView: boolean
  ) => (
    <div className="px-6 md:px-16 text-white mb-10 ">
      <div className="flex items-center justify-between w-full mb-4">
        <h2 className="text-white text-[1.5rem]">{title}</h2>
        <button
          className="text-sm text-white hover:underline hover:text-red-600"
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
        {movies.map((movie, index) => (
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
        ))}
      </div>
    </div>
  );

  return (
    <div className="py-6 ">
      {renderCarousel('Featured Movies', featured, featuredRef, featuredInView)}
      {renderCarousel('Popular Movies', popular, popularRef, popularInView)}
    </div>
  );
};

export default MovieCarousel;
