import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Success from '../pages/Success'; 
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import '@testing-library/jest-dom';


// Mock react-router hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    search: '?session_id=test-session-id',
  }),
  useNavigate: () => jest.fn(),
}));

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Success Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    mockNavigate.mockClear();
  });
  test('displays loading spinner initially', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { plan_name: 'Premium' } });

    render(<Success />, { wrapper: MemoryRouter });

    expect(screen.getByText(/Verifying your subscription.../i)).toBeInTheDocument();
    await waitFor(() => screen.getByText(/Subscription Activated!/i));
  });

  test('displays success message with plan name after API success', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { plan_name: 'Premium' },
    });

    render(<Success />, { wrapper: MemoryRouter });

    await waitFor(() =>
      expect(screen.getByText('Subscription Activated!')).toBeInTheDocument()
    );

    expect(screen.getByText(/Enjoy your Premium!/)).toBeInTheDocument();
    expect(screen.getByText(/Start Exploring Movies/i)).toBeInTheDocument();
  });

  test('handles API error gracefully and shows retry button', async () => {
    mockedAxios.get.mockRejectedValueOnce({
      response: {
        data: {
          error: 'Invalid session.',
        },
      },
    });

    render(<Success />, { wrapper: MemoryRouter });

    await waitFor(() =>
      expect(screen.getByText('Subscription Error')).toBeInTheDocument()
    );

    expect(screen.getByText('Invalid session.')).toBeInTheDocument();
    expect(screen.getByText(/Try Again/i)).toBeInTheDocument();
  });

  test('handles missing session_id in URL', async () => {
    // Overriding mock for this case
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useLocation: () => ({
        search: '',
      }),
      useNavigate: () => jest.fn(),
    }));

    render(<Success />, { wrapper: MemoryRouter });

    await waitFor(() =>
      expect(screen.getByText('Subscription Error')).toBeInTheDocument()
    );

expect(screen.getByText('Failed to verify subscription. Please try again.')).toBeInTheDocument();

  });
});
