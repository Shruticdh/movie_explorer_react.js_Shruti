import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../components/footer'; // adjust path as needed
import '@testing-library/jest-dom';

// Mocking the image imports
jest.mock('../assets/AppStore.jpg', () => 'AppStore.jpg');
jest.mock('../assets/playStore.png', () => 'playStore.png');

describe('Footer Component', () => {
  beforeEach(() => {
    render(<Footer />);
  });

  test('renders all footer links', () => {
    expect(screen.getByText(/Terms of Use/i)).toBeInTheDocument();
    expect(screen.getByText(/Privacy-Policy/i)).toBeInTheDocument();
    expect(screen.getByText(/Blog/i)).toBeInTheDocument();
    expect(screen.getByText(/FAQ/i)).toBeInTheDocument();
    expect(screen.getByText(/Watch List/i)).toBeInTheDocument();
  });

  test('renders copyright',
    () => {
      expect(screen.getByText(/© 2022 STREAMIT. All Rights Reserved/i)).toBeInTheDocument();
    });

  test('renders Follow Us heading', () => {
    expect(screen.getByText(/Follow Us/i)).toBeInTheDocument();
  });

  test('renders social icons', () => {
    const icons = screen.getAllByRole('img', { hidden: true }); // icons are SVGs
    expect(icons.length).toBeGreaterThanOrEqual(4); // At least 4 social icons
  });

  test('renders Streamit App heading', () => {
    expect(screen.getByText(/Streamit App/i)).toBeInTheDocument();
  });

  test('renders app store images and labels', () => {
    const appStoreImg = screen.getByAltText('App Store') as HTMLImageElement;
    const playStoreImg = screen.getByAltText('Google Play Store') as HTMLImageElement;

    expect(appStoreImg).toBeInTheDocument();
    expect(appStoreImg.src).toContain('AppStore.jpg');

    expect(playStoreImg).toBeInTheDocument();
    expect(playStoreImg.src).toContain('playStore.png');

    expect(screen.getByText('AppStore')).toBeInTheDocument();
    expect(screen.getByText('PlayStore')).toBeInTheDocument();
  });

  test('renders correct number of sections', () => {
    const sections = screen.getAllByText(/(Follow Us|Streamit App)/);
    expect(sections.length).toBe(2);
  });
});
