import { render } from '@testing-library/react';
import FadeInSection from '../components/FadeInSection';
import { useInView, useAnimation, AnimationControls } from 'framer-motion';
import "@testing-library/jest-dom"

// Mock the useInView hook and useAnimation hook from framer-motion
jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion');
  return {
    ...actual,
    useInView: jest.fn(),
    useAnimation: jest.fn(() => ({
      start: jest.fn(),
      subscribe: jest.fn(),
    })),
  };
});

describe('FadeInSection', () => {
  test('renders children correctly', () => {
    const { getByText } = render(
      <FadeInSection>
        <div>Test Content</div>
      </FadeInSection>
    );

    // Check if the children are rendered
    const content = getByText('Test Content');
    expect(content).toBeInTheDocument();
  });

  test('should have correct initial styles', () => {
    const { container } = render(
      <FadeInSection>
        <div>Test Content</div>
      </FadeInSection>
    );

    const content = container.firstChild;
    // Check if the initial styles are correct
    expect(content).toHaveStyle('opacity: 0');
    expect(content).toHaveStyle('transform: translateY(50px)');
  });

  test('should apply correct animation when in view', () => {
    const startAnimationMock = jest.fn();
    (useAnimation as jest.Mock).mockReturnValue({
      start: startAnimationMock,
      subscribe: jest.fn(),
    });

    (useInView as jest.Mock).mockImplementation(() => true); // Mocking that the section is in view

    render(
      <FadeInSection>
        <div>Test Content</div>
      </FadeInSection>
    );

    // Check if the animation start function is called
    expect(startAnimationMock).toHaveBeenCalledWith({ opacity: 1, y: 0 });
  });

  test('should apply correct animation when not in view', () => {
    const startAnimationMock = jest.fn();
    (useAnimation as jest.Mock).mockReturnValue({
      start: startAnimationMock,
      subscribe: jest.fn(),
    });

    (useInView as jest.Mock).mockImplementation(() => false); // Mocking that the section is NOT in view

    render(
      <FadeInSection>
        <div>Test Content</div>
      </FadeInSection>
    );

    // Check if the animation start function is called with the correct values when out of view
    expect(startAnimationMock).toHaveBeenCalledWith({ opacity: 0, y: 50 });
  });
});
