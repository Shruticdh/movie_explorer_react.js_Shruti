import axios from 'axios';

interface Movie {
  id: number;
  title: string;
  genre: string;
  release_year: number;
  is_premium: boolean;
  // Add other fields as needed
}

// Fetch movies and filter based on quiz responses
const recommendMovies = async (genre: string, minYear: number, maxYear: number): Promise<Movie[]> => {
  try {
    // Fetch all movies from the API
    const response = await axios.get('/api/v1/movies');
    const movies: Movie[] = response.data;

    // Get user's plan status from local storage
    const userPlan = localStorage.getItem('userPlan') || 'basic'; // Assuming 'basic' or 'premium'

    // Filter movies based on quiz inputs and plan status
    const filteredMovies = movies.filter((movie: Movie) => {
      const matchesGenre = genre ? movie.genre === genre : true;
      const matchesYear = movie.release_year >= minYear && movie.release_year <= maxYear;
      const isAccessible = userPlan === 'premium' || !movie.is_premium; // Basic users can't access premium movies
      return matchesGenre && matchesYear && isAccessible;
    });

    return filteredMovies;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
};

export default recommendMovies;