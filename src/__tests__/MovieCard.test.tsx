import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MovieCard from '../components/MovieCard';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import * as AdminServices from '../Services/AdminServices';
import '@testing-library/jest-dom';

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Mock deleteMovie
jest.mock('../Services/AdminServices', () => ({
  deleteMovie: jest.fn(),
}));

describe('MovieCard Component', () => {
  const mockNavigate = jest.fn();
  const defaultProps = {
    id: '1',
    title: 'Inception',
    imageUrl: 'https://example.com/poster.jpg',
    duration: '2h 28m',
    genre: 'Sci-Fi',
    quality: 'HD',
  };

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    jest.clearAllMocks();
  });

  test('renders movie card with title, image and duration', () => {
    render(
      <MemoryRouter>
        <MovieCard {...defaultProps} />
      </MemoryRouter>
    );

    expect(screen.getByText('Inception')).toBeInTheDocument();
    expect(screen.getByAltText('Inception')).toHaveAttribute('src', defaultProps.imageUrl);
    expect(screen.getByText('2h 28m')).toBeInTheDocument();
  });

  test('navigates to movie details on click', () => {
    render(
      <MemoryRouter>
        <MovieCard {...defaultProps} />
      </MemoryRouter>
    );

    const card = screen.getByAltText('Inception').closest('div');
    fireEvent.click(card!);
    expect(mockNavigate).toHaveBeenCalledWith('/movie-details/1', {
      state: {
        id: '1',
        title: 'Inception',
        imageUrl: 'https://example.com/poster.jpg',
        duration: '2h 28m',
        genre: 'Sci-Fi',
        quality: 'HD',
      },
    });
  });

  test('shows edit and delete buttons if role is supervisor', () => {
    render(
      <MemoryRouter>
        <MovieCard {...defaultProps} role="supervisor" />
      </MemoryRouter>
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getAllByRole('button').length).toBe(2); // Edit + Delete
  });

  test('does NOT show edit/delete buttons if role is not supervisor', () => {
    render(
      <MemoryRouter>
        <MovieCard {...defaultProps} role="user" />
      </MemoryRouter>
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('edit button navigates to edit page', () => {
    render(
      <MemoryRouter>
        <MovieCard {...defaultProps} role="supervisor" />
      </MemoryRouter>
    );

    const editButton = screen.getAllByRole('button')[0];
    fireEvent.click(editButton);

    expect(mockNavigate).toHaveBeenCalledWith('/movies/1/edit');
  });

  test('delete button confirms and calls delete API', async () => {
    const deleteMovieMock = AdminServices.deleteMovie as jest.Mock;
    deleteMovieMock.mockResolvedValueOnce({});

    // Mock confirm to return true
    window.confirm = jest.fn(() => true);
    window.alert = jest.fn();
    window.location.reload = jest.fn();

    render(
      <MemoryRouter>
        <MovieCard {...defaultProps} role="supervisor" />
      </MemoryRouter>
    );

    const deleteButton = screen.getAllByRole('button')[1];
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalledWith("Are you sure you want to delete this movie?");
    expect(deleteMovieMock).toHaveBeenCalledWith('1');
  });

  test('delete cancelled if user clicks "Cancel"', async () => {
    window.confirm = jest.fn(() => false);

    render(
      <MemoryRouter>
        <MovieCard {...defaultProps} role="supervisor" />
      </MemoryRouter>
    );

    const deleteButton = screen.getAllByRole('button')[1];
    fireEvent.click(deleteButton);

    expect(AdminServices.deleteMovie).not.toHaveBeenCalled();
  });

  test('delete shows alert if error occurs', async () => {
    const deleteMovieMock = AdminServices.deleteMovie as jest.Mock;
    deleteMovieMock.mockRejectedValueOnce(new Error('Delete failed'));

    window.confirm = jest.fn(() => true);
    window.alert = jest.fn();

    render(
      <MemoryRouter>
        <MovieCard {...defaultProps} role="supervisor" />
      </MemoryRouter>
    );

    const deleteButton = screen.getAllByRole('button')[1];
    fireEvent.click(deleteButton);

    // Wait for error alert
    await screen.findByText('2h 28m'); // Wait for re-render
    expect(window.alert).toHaveBeenCalledWith('Failed to delete movie');
  });
});
