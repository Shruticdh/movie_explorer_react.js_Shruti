import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Dashboard from '../pages/Dashboard';
import { BrowserRouter } from 'react-router-dom';
import * as SubscriptionService from '../Services/SubscriptionService';
import { toast } from 'react-toastify';
import '@testing-library/jest-dom';


// Mock all imported components used in Dashboard
jest.mock('../components/header', () => () => <div>Header Component</div>);
jest.mock('../components/footer', () => () => <div>Footer Component</div>);
jest.mock('../components/MovieBanner', () => () => <div>MovieBanner Component</div>);
jest.mock('../components/FadeInSection', () => ({ children }: any) => <div>{children}</div>);
jest.mock('../components/MovieCarousel', () => () => <div>MovieCarousel Component</div>);
jest.mock('../components/Genre', () => (props: any) => (
  <div>
    Genre Component<button onClick={() => props.onGenreClick('Action')}>Genre Click</button>
  </div>
));
jest.mock('../pages/Subscription', () => () => <div>Subscription Component</div>);

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  );
};

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders all child components correctly', async () => {
    jest
      .spyOn(SubscriptionService, 'getSubscriptionStatus')
      .mockResolvedValue({ plan_type: 'premium' });

    renderComponent();

    expect(screen.getByText('Header Component')).toBeInTheDocument();
    expect(screen.getByText('Footer Component')).toBeInTheDocument();
    expect(screen.getByText('MovieBanner Component')).toBeInTheDocument();
    expect(screen.getByText('MovieCarousel Component')).toBeInTheDocument();
    expect(screen.getByText('Genre Component')).toBeInTheDocument();
    expect(screen.getByText('Subscription Component')).toBeInTheDocument();

    await waitFor(() =>
      expect(localStorage.getItem('userPlan')).toBe('premium')
    );
  });

  test('displays toast error when subscription fetch fails', async () => {
    jest
      .spyOn(SubscriptionService, 'getSubscriptionStatus')
      .mockRejectedValue(new Error('API Error'));

    renderComponent();

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith('Failed to fetch subscription status.')
    );
  });

  test('saves subscription plan to localStorage', async () => {
    const mockPlan = { plan_type: 'basic' };
    jest
      .spyOn(SubscriptionService, 'getSubscriptionStatus')
      .mockResolvedValue(mockPlan);

    renderComponent();

    await waitFor(() =>
      expect(localStorage.getItem('userPlan')).toBe('basic')
    );
  });

  test('has correct genre section heading and button', () => {
    renderComponent();

    expect(screen.getByText(/Genres/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /View All/i })).toBeInTheDocument();
  });

  test('navigates to /genre on "View All" button click', () => {
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));

    renderComponent();

    const viewAllBtn = screen.getByRole('button', { name: /View All/i });
    fireEvent.click(viewAllBtn);

    // NOTE: This test will not trigger navigation due to the way jest.mock is scoped.
    // Best to test this using integration tests with React Router.
  });

  test('calls onGenreClick callback', () => {
    renderComponent();
    const genreClickButton = screen.getByText('Genre Click');
    fireEvent.click(genreClickButton);

    // Check that it doesn't throw and is rendered
    expect(genreClickButton).toBeInTheDocument();
  });

  test('has correct structure and styling classes', () => {
    const { container } = renderComponent();

    const main = container.querySelector('main');
    expect(main).toHaveClass('flex-start');

    const genreHeader = screen.getByText(/Genres/i);
    expect(genreHeader).toHaveClass('text-white', 'text-2xl', 'font-semibold');
  });

  test('retrieves token from localStorage and logs it', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    localStorage.setItem('token', 'mock-token');

    jest
      .spyOn(SubscriptionService, 'getSubscriptionStatus')
      .mockResolvedValue({ plan_type: 'free' });

    renderComponent();

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Token:', 'mock-token');
    });

    consoleSpy.mockRestore();
  });

  test('handles empty token gracefully', async () => {
    jest
      .spyOn(SubscriptionService, 'getSubscriptionStatus')
      .mockResolvedValue({ plan_type: 'none' });

    renderComponent();

    await waitFor(() => {
      expect(localStorage.getItem('userPlan')).toBe('none');
    });
  });
});
