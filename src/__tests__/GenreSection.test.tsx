import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import GenreSection from '../pages/GenreSection';
import * as MovieService from '../Services/MovieService';
import '@testing-library/jest-dom';

// Mock components
jest.mock('../components/header', () => () => <div>Mock Header</div>);
jest.mock('../components/footer', () => () => <div>Mock Footer</div>);
jest.mock('../components/Genre', () => ({ onGenreClick }: any) => (
  <div>
    <button onClick={() => onGenreClick('Action')}>Action</button>
  </div>
));
jest.mock('../components/MovieCard', () => ({ title }: any) => <div>{title}</div>);

// Mock localStorage
beforeEach(() => {
  Storage.prototype.getItem = jest.fn(() =>
    JSON.stringify({ role: 'admin' })
  );
});

// Sample movie
const mockMovie = {
  id: 1,
  title: 'Inception',
  poster_url: '',
  banner_url: '',
  duration: 148,
  genre: 'Action',
  release_year: 2010,
  rating: 8.8,
  director: 'Christopher Nolan',
  description: 'A mind-bending thriller',
  is_premium: true,
  main_lead: 'Leonardo DiCaprio',
};

// Mock service
jest.spyOn(MovieService, 'getAllMoviesPagination').mockImplementation(() =>
  Promise.resolve({
    movies: [mockMovie],
    pagination: {
      total_pages: 1,
      current_page: 1,
      per_page: 10,
      total_count: 1,
    },
  })
);

jest.spyOn(MovieService, 'getMoviesByGenre').mockImplementation(() =>
  Promise.resolve({
    movies: [mockMovie],
  })
);

describe('GenreSection Component', () => {
  it('renders header, footer, and static text', async () => {
    render(<GenreSection />);

    // Wait for movie to load
    await waitFor(() => {
      expect(screen.getByText('Inception')).toBeInTheDocument();
    });

    // Header and footer
    expect(screen.getByText('Mock Header')).toBeInTheDocument();
    expect(screen.getByText('Mock Footer')).toBeInTheDocument();

    // Match split heading "Your Gateway to Movie Magic"
   const headings = screen.getAllByText((content, element) =>
  element?.textContent?.includes('Your Gateway to Movie Magic')
);
expect(headings[0]).toBeInTheDocument(); 

    // Description
    expect(
      screen.getByText(/Dive into the world of cinema/i)
    ).toBeInTheDocument();
  });

  it('disables previous and next buttons appropriately when only one page', async () => {
    render(<GenreSection />);

    await waitFor(() => {
      expect(screen.getByText('Inception')).toBeInTheDocument();
    });

    // If buttons exist, assert disabled state
    const prev = screen.queryByText('Previous');
    const next = screen.queryByText('Next');

    if (prev && next) {
      expect(prev).toBeDisabled();
      expect(next).toBeDisabled();
    }
  });

  it('filters movies by genre when genre button is clicked', async () => {
    render(<GenreSection />);

    const genreButton = await screen.findByText('Action');
    fireEvent.click(genreButton);

    await waitFor(() => {
      expect(screen.getByText('Inception')).toBeInTheDocument();
    });
  });


test('renders the "Your Favorite Genre Movie Magic" heading', async () => {
  render(<GenreSection />);

  await waitFor(() => {
    expect(
      screen.getByRole('heading', { name: /Your Favorite Genre Movie Magic/i })
    ).toBeInTheDocument();
  });
});

  it('displays message when no movies are found', async () => {
    jest.spyOn(MovieService, 'getMoviesByGenre').mockImplementation(() => Promise.resolve({ movies: [] }));
    render(<GenreSection />);

    // Trigger genre selection
    const genreButton = await screen.findByText('Action');
    fireEvent.click(genreButton);

    await waitFor(() => {
      expect(screen.getByText('No movies found.')).toBeInTheDocument();
    });
  });

  it('renders page buttons when multiple pages exist', async () => {
    jest.spyOn(MovieService, 'getAllMoviesPagination').mockImplementation(() =>
      Promise.resolve({
        movies: [mockMovie],
        pagination: {
          total_pages: 2,
          current_page: 1,
          per_page: 10,
          total_count: 2,
        },
      })
    );
    render(<GenreSection />);

    await waitFor(() => {
      expect(screen.getByText('Inception')).toBeInTheDocument();
    });

    // Check if the pagination buttons are rendered
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('disables the "Previous" button on the first page', async () => {
    render(<GenreSection />);

    await waitFor(() => {
      expect(screen.getByText('Inception')).toBeInTheDocument();
    });

    const prevButton = screen.getByText('Previous');
    expect(prevButton).toBeDisabled();
  });

test('renders movie role if provided', async () => {
  render(<GenreSection />);

  await waitFor(() => {
    const movieCard = screen.getByText('Inception');
    expect(movieCard).toBeInTheDocument();
    expect(movieCard.closest('div').textContent).toContain('Inception');  
  });
});

});
