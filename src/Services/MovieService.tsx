import toast from 'react-hot-toast';
import axios from 'axios';
import { Movie } from '@mui/icons-material';

// const BASE_URL = 'https://movie-explorer-ror-aalekh-2ewg.onrender.com'; 

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
  
      console.log('Fetched movies:', movieData);
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
            const movies : Movie[] = response.data;
            console.log("fetched movies from the api", movies);

            return movies.movies;
    }
    catch(error : any){
        console.log("error ", error.message);
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

      // if (movie.is_premium && plan !== "premium") {
      //   toast.error("You need to subscribe to a premium plan to watch this movie.");
      //   return null;
      // }

      
      console.log('Fetched movie by ID:', movie);
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
      console.error("Error fetching movies by genre:", error.message);
      return { movies: [] };
    }
  };

