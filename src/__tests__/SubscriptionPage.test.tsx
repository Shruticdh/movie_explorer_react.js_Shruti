import React from 'react';
import { render, screen } from '@testing-library/react';
import SubscriptionPage from '../pages/SubscribePage'; // adjust path as needed
import '@testing-library/jest-dom';

// Mock subcomponents
jest.mock('../components/header', () => () => <div data-testid="header">Header</div>);
jest.mock('../components/footer', () => () => <div data-testid="footer">Footer</div>);
jest.mock('../pages/Subscription', () => () => <div data-testid="subscription">Subscription</div>);

// Optional if toast or motion is used in future (already imported)
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children }: any) => <div>{children}</div>,
  },
}));

describe('SubscriptionPage Component', () => {
  it('renders without crashing', () => {
    render(<SubscriptionPage />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('subscription')).toBeInTheDocument();
  });

  it('has correct styling applied', () => {
    const { container } = render(<SubscriptionPage />);
    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass('bg-black', 'min-h-screen', 'text-white');
  });

  it('contains Header, Subscription, and Footer in correct order', () => {
    const { getByTestId } = render(<SubscriptionPage />);
    const header = getByTestId('header');
    const subscription = getByTestId('subscription');
    const footer = getByTestId('footer');

    expect(header).toBeInTheDocument();
    expect(subscription).toBeInTheDocument();
    expect(footer).toBeInTheDocument();

    const elements = screen.getAllByTestId(/(header|subscription|footer)/);
    expect(elements[0]).toHaveTextContent('Header');
    expect(elements[1]).toHaveTextContent('Subscription');
    expect(elements[2]).toHaveTextContent('Footer');
  });
});
