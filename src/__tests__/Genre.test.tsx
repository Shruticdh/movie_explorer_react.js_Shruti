import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Genre from '../components/Genre'; // Adjust path as per your structure
import '@testing-library/jest-dom';

const mockOnGenreClick = jest.fn();

describe('Genre Component', () => {
  beforeEach(() => {
    render(<Genre onGenreClick={mockOnGenreClick} />);
  });

  it('renders genre images with correct alt text', () => {
    const genreImages = screen.getAllByRole('img');
    expect(genreImages.length).toBe(8); // All 8 genres
    genreImages.forEach((img) => {
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src');
      expect(img).toHaveAttribute('alt');
    });
  });

  it('renders genre names as text', () => {
    const genres = [
      'Fantasy', 'Sci-fi', 'Drama', 'Romance',
      'Action', 'Horror', 'Adventure', 'Comedy',
    ];

    genres.forEach((genre) => {
      expect(screen.getByText(genre)).toBeInTheDocument();
    });
  });

  it('calls onGenreClick when a genre card is clicked', () => {
    const genreCard = screen.getByText('Fantasy');
    fireEvent.click(genreCard);
    expect(mockOnGenreClick).toHaveBeenCalledWith('Fantasy');
  });

  it('renders all genre cards with expected classnames', () => {
    const genreCards = screen.getAllByRole('img');
    genreCards.forEach((img) => {
      expect(img).toHaveClass('object-cover');
    });
  });

  it('genre overlay and text layer exist inside each card', () => {
    const genreTitles = screen.getAllByRole('heading');
    expect(genreTitles.length).toBe(8);
    genreTitles.forEach((title) => {
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass('text-xl');
    });
  });
});
