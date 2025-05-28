import axios from 'axios';
import { Movie } from '@mui/icons-material';

const BASE_URL = 'https://movie-explorer-ror-ashutosh-singh.onrender.com'; 

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

  interface MovieResponse {
    movies: Movie[];
    pagination: {
      total_pages: number;
      current_page: number;
      per_page: number;
      total_count: number;
    };
  }

  interface RecommendationPreferences {
    genre?: string;
    release_year_from?: number;
    release_year_to?: number;
    duration_max?: number;
    include_premium?: boolean;
  }
     
  export const getAllMoviesPagination = async (page: number = 1): Promise<MovieResponse> => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/movies?page=${page}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      const data = response.data;
  
      const movieData: MovieResponse = {
        movies: data.movies || [],
        pagination: data.pagination || {
          current_page: data.current_page || page,
          total_pages: data.total_pages || 1,
          total_count: data.total_count || data.movies?.length || 0,
          per_page: data.per_page || 10,
        },
      };
  
      return movieData;
  
    } catch (error: any) {
      console.error('Error fetching movies:', error.message);
      return {
        movies: [],
        pagination: {
          current_page: page,
          total_pages: 1,
          total_count: 0,
          per_page: 10,
        },
      };
    }
  };

  export const searchMovies = async (query: string): Promise<Movie[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/movies`, {
        params: { query },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data.movies || [];
    } catch (error: any) {
      console.error('Error searching movies:', error.message);
      return [];
    }
  };

  // New function for movie recommendations based on user preferences
  export const getRecommendedMovies = async (preferences: RecommendationPreferences): Promise<Movie[]> => {
    try {
      // Get all movies first (or use pagination if needed)
      const allMoviesResponse = await getAllMovies();
      
      if (!allMoviesResponse || allMoviesResponse.length === 0) {
        return [];
      }

      // Filter movies based on preferences
      let filteredMovies = allMoviesResponse.filter((movie: Movie) => {
        // Genre filter
        if (preferences.genre && preferences.genre !== 'any') {
          if (!movie.genre.toLowerCase().includes(preferences.genre.toLowerCase())) {
            return false;
          }
        }

        // Release year filter
        if (preferences.release_year_from && movie.release_year < preferences.release_year_from) {
          return false;
        }
        if (preferences.release_year_to && movie.release_year > preferences.release_year_to) {
          return false;
        }

        // Duration filter
        if (preferences.duration_max && movie.duration > preferences.duration_max) {
          return false;
        }

        // Premium filter - if user doesn't want premium, exclude premium movies
        if (preferences.include_premium === false && movie.is_premium) {
          return false;
        }

        return true;
      });

      // Sort by rating (highest first) and return top 12 movies
      filteredMovies.sort((a: Movie, b: Movie) => b.rating - a.rating);
      
      return filteredMovies.slice(0, 12);

    } catch (error: any) {
      console.error('Error getting recommended movies:', error.message);
      return [];
    }
  };
  
  
  export const getAllMovies = async()=>{
    try{
        const response = await axios.get(`${BASE_URL}/api/v1/movies`,
            {
                headers:{
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });

            const movies : Movie[] = response.data.movies;
            return movies;
    }
    catch(error : any){
        console.error("Error fetching movies", error.message);
    }
}

export const getMoviesById = async (id: number) => {
  const plan=localStorage.getItem("userPlan");
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/movies/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const movie: Movie = await response.data;       
      return movie;
    } catch (error: any) {
      console.error(`Error fetching movie with ID ${id}: ${error}`);
      return null;
    }
  };

  export const getMoviesByGenre = async (genre: string, page: number = 1) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/movies`, {
        params: { genre, page },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching movies ", error.message);
      return { movies: [] };
    }
  };