import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../components/footer';
import '@testing-library/jest-dom';

jest.mock('../assets/AppStore.jpg', () => 'appstore.jpg');
jest.mock('../assets/playStore.png', () => 'playstore.png');

describe('Footer component', () => {
  beforeEach(() => {
    render(<Footer />);
  });

  it('renders all footer links', () => {
    const links = ['Terms of Use', 'Privacy-Policy', 'Blog', 'FAQ', 'Watch List'];
    links.forEach(link => {
      expect(screen.getByText(link)).toBeInTheDocument();
    });
  });

  it('renders copyright text', () => {
    expect(screen.getByText(/© 2022 STREAMIT/i)).toBeInTheDocument();
  });

it('renders social media icons', () => {
  expect(screen.getByLabelText('Facebook')).toBeInTheDocument();
  expect(screen.getByLabelText('Twitter')).toBeInTheDocument();
  expect(screen.getByLabelText('GitHub')).toBeInTheDocument();
  expect(screen.getByLabelText('Instagram')).toBeInTheDocument();
});


  it('renders the "Follow Us" heading', () => {
    expect(screen.getByText('Follow Us')).toBeInTheDocument();
  });

  it('renders the "Streamit App" heading', () => {
    expect(screen.getByText('Streamit App')).toBeInTheDocument();
  });

  it('renders App Store and Play Store images with correct alt text', () => {
    expect(screen.getByAltText('App Store')).toBeInTheDocument();
    expect(screen.getByAltText('Google Play Store')).toBeInTheDocument();
  });

  it('renders AppStore and PlayStore text labels', () => {
    expect(screen.getByText('AppStore')).toBeInTheDocument();
    expect(screen.getByText('PlayStore')).toBeInTheDocument();
  });
});
