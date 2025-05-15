import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import MovieBanner from '../components/MovieBanner'; // Adjust path as needed
import { getAllMovies } from '../Services/MovieService';
import toast from 'react-hot-toast';
import '@testing-library/jest-dom'; // Import jest-dom matchers

// Mock dependencies
jest.mock('../Services/MovieService');
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
}));

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    img: 'img',
    div: 'div',
    h1: 'h1',
    p: 'p',
    span: 'span',
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock react-icons
jest.mock('react-icons/fa', () => ({
  FaPlay: () => <span data-testid="play-icon" />,
  FaClock: () => <span data-testid="clock-icon" />,
}));

// Mock timers globally
jest.useFakeTimers();

// Sample movie data
const mockMovies = [
  {
    id: 1,
    title: 'Test Movie 1',
    genre: 'Action, Adventure',
    release_year: 2023,
    rating: 8.5,
    director: 'John Doe',
    duration: 120,
    description: 'A thrilling action adventure.',
    is_premium: false,
    main_lead: 'Jane Doe',
    poster_url: 'poster1.jpg',
    banner_url: 'banner1.jpg',
  },
  {
    id: 2,
    title: 'Test Movie 2',
    genre: 'Comedy',
    release_year: 2022,
    rating: 7.0,
    director: 'Jane Smith',
    duration: 90,
    description: 'A hilarious comedy.',
    is_premium: true,
    main_lead: 'John Smith',
    poster_url: 'poster2.jpg',
    banner_url: 'banner2.jpg',
  },
];

describe('MovieBanner Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('renders nothing when no movies are loaded', async () => {
    (getAllMovies as jest.Mock).mockResolvedValue([]);
    render(<MovieBanner />);
    await waitFor(() => expect(getAllMovies).toHaveBeenCalled());
    expect(screen.queryByText(/Test Movie/)).not.toBeInTheDocument();
  });

  it('displays genres correctly', async () => {
    (getAllMovies as jest.Mock).mockResolvedValue(mockMovies);
    render(<MovieBanner />);

    await waitFor(() => expect(getAllMovies).toHaveBeenCalled());
    await waitFor(() => {
      expect(screen.getByText('Action')).toBeInTheDocument();
      expect(screen.getByText('Adventure')).toBeInTheDocument();
    });
  });

  it('switches movies after 4 seconds', async () => {
    (getAllMovies as jest.Mock).mockResolvedValue(mockMovies);
    render(<MovieBanner />);

    await waitFor(() => expect(getAllMovies).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByText('Test Movie 1')).toBeInTheDocument());

    act(() => {
      jest.advanceTimersByTime(4000);
    });

    await waitFor(() => expect(screen.getByText('Test Movie 2')).toBeInTheDocument());
  });

  it('cleans up interval on unmount', async () => {
    (getAllMovies as jest.Mock).mockResolvedValue(mockMovies);
    const { unmount } = render(<MovieBanner />);
    await waitFor(() => expect(getAllMovies).toHaveBeenCalled());

    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();
  });

  it('handles empty genre string', async () => {
    const movieWithEmptyGenre = [
      {
        ...mockMovies[0],
        genre: '',
      },
    ];
    (getAllMovies as jest.Mock).mockResolvedValue(movieWithEmptyGenre);
    render(<MovieBanner />);

    await waitFor(() => expect(getAllMovies).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByText('Test Movie 1')).toBeInTheDocument());
    expect(screen.queryByText(/,.*/)).not.toBeInTheDocument();
  });

  it('renders image with correct attributes', async () => {
    (getAllMovies as jest.Mock).mockResolvedValue(mockMovies);
    render(<MovieBanner />);

    await waitFor(() => expect(getAllMovies).toHaveBeenCalled());
    await waitFor(() => {
      const img = screen.getByAltText('Test Movie 1');
      expect(img).toHaveAttribute('src', 'banner1.jpg');
      expect(img).toHaveClass('absolute inset-0 w-full h-full object-cover object-top max-sm:object-cover');
    });
  });

  it('handles API failure gracefully', async () => {
    (getAllMovies as jest.Mock).mockResolvedValue(null);
    render(<MovieBanner />);
    await waitFor(() => expect(getAllMovies).toHaveBeenCalled());
    expect(screen.queryByText(/Test Movie/)).not.toBeInTheDocument();
  });
});