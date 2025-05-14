import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import AllMovies from '../pages/AllMovies';
import { MemoryRouter } from 'react-router-dom';
import * as movieService from '../Services/MovieService';
import '@testing-library/jest-dom';

const mockMovies = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  title: `Movie ${index + 1}`,
  poster_url: `https://example.com/poster${index + 1}.jpg`,
  duration: 120,
  is_premium: index % 2 === 0,
  genre: 'Action',
  quality: 'HD',
  release_year: 2021,
  rating: 8.5,
  director: `Director ${index + 1}`,
  description: `Description for movie ${index + 1}.`,
  cast: [`Actor ${index + 1}`, `Actor ${index + 2}`],
  main_lead: `Actor ${index + 1}`,
  banner_url: `https://example.com/banner${index + 1}.jpg`,
}));

jest.mock('../components/Header', () => () => <div data-testid="header">Header</div>);
jest.mock('../components/Footer', () => () => <div data-testid="footer">Footer</div>);
jest.mock('../components/MovieCard', () => (props: any) => <div data-testid="movie-card">{props.title}</div>);
jest.mock('../components/SearchBar', () => ({ searchTerm, setSearchTerm }: any) => (
  <input
    data-testid="search-bar"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="Search..."
  />
));

describe('AllMovies Page', () => {
  beforeEach(() => {
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation((key) => {
      if (key === 'user') return JSON.stringify({ role: 'admin' });
      return null;
    });

    jest.spyOn(movieService, 'getAllMoviesPagination').mockImplementation((page) =>
      Promise.resolve({
        movies: mockMovies,
        pagination: {
          total_pages: 2,
          current_page: page,
          per_page: 10,
          total_count: 20,
        },
      })
    );

    jest.spyOn(movieService, 'searchMovies').mockResolvedValue([mockMovies[0]]);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('renders header and footer', async () => {
    render(<AllMovies />, { wrapper: MemoryRouter });
    await waitFor(() => {
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
  });

  it('fetches and displays movies on initial load', async () => {
    render(<AllMovies />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(screen.getAllByTestId('movie-card').length).toBe(10);
    });
  });

  it('shows correct role from localStorage', async () => {
    render(<AllMovies />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(screen.getAllByTestId('movie-card')[0]).toHaveTextContent('Movie 1');
    });
  });

  it('paginates correctly', async () => {
    render(<AllMovies />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(screen.getAllByTestId('movie-card').length).toBe(10);
    });

    fireEvent.click(screen.getByText('2'));
    await waitFor(() => {
      expect(movieService.getAllMoviesPagination).toHaveBeenCalledWith(2);
      expect(screen.getAllByTestId('movie-card').length).toBe(10); // Same mock data for page 2
    });
  });

  it('searches movies with debounce', async () => {
    jest.useFakeTimers();

    render(<AllMovies />, { wrapper: MemoryRouter });

    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'Movie 1' } });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(movieService.searchMovies).toHaveBeenCalledWith('Movie 1');
      expect(screen.getAllByTestId('movie-card').length).toBe(1);
    });

    jest.useRealTimers();
  });

  it('disables previous button on first page', async () => {
    render(<AllMovies />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(screen.getByText('Previous')).toBeDisabled();
    });
  });

  it('disables next button on last page', async () => {
  render(<AllMovies />, { wrapper: MemoryRouter });
  await waitFor(() => {
    expect(screen.getByText('2')).toBeInTheDocument();
  });
  fireEvent.click(screen.getByText('2'));
  await waitFor(() => {
    expect(screen.getByText('Next')).toBeDisabled();
  });
});

  it('does not show pagination when search term is active', async () => {
    jest.useFakeTimers();

    render(<AllMovies />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'Movie' } });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(screen.queryByText('Next')).not.toBeInTheDocument();
    });

    jest.useRealTimers();
  });
});