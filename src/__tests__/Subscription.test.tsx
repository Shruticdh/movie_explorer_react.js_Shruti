import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Subscription from "../pages/Subscription"; // Update path if needed
import * as subscriptionService from "../Services/SubscriptionService";
import { BrowserRouter } from "react-router-dom";
import toast from "react-hot-toast";
import '@testing-library/jest-dom';


// Mock toast
jest.mock("react-hot-toast", () => ({
  error: jest.fn(),
}));

// Mock createSubscription service
jest.mock("../Services/SubscriptionService", () => ({
  createSubscription: jest.fn(),
}));

// Wrapper with router context
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Subscription Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders all subscription plans", () => {
    renderWithRouter(<Subscription />);
    expect(screen.getByText(/1 Day/i)).toBeInTheDocument();
    expect(screen.getByText(/7 Days/i)).toBeInTheDocument();
    expect(screen.getByText(/1 Month/i)).toBeInTheDocument();
  });

  test("submits selected plan and redirects", async () => {
    const mockUrl = "https://checkout.example.com";
    (subscriptionService.createSubscription as jest.Mock).mockResolvedValue(mockUrl);
    delete (window as any).location;
    (window as any).location = { href: "" };

    renderWithRouter(<Subscription />);
    fireEvent.click(screen.getAllByText(/Get started/i)[1]); // 7 Days plan
fireEvent.submit(screen.getByRole("form", { name: /subscription form/i }));


    await waitFor(() => {
      expect(subscriptionService.createSubscription).toHaveBeenCalledWith("7_days");
      expect(window.location.href).toBe(mockUrl);
    });
  });

  test("handles error if subscription fails", async () => {
    (subscriptionService.createSubscription as jest.Mock).mockRejectedValue(
      new Error("Failed")
    );

    renderWithRouter(<Subscription />);
    fireEvent.click(screen.getAllByText(/Get started/i)[1]); // 7 Days
    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed");
    });
  });


  test("displays brand/guild info at bottom", () => {
    renderWithRouter(<Subscription />);
    expect(screen.getByText(/Hogwarts Studios/i)).toBeInTheDocument();
    expect(screen.getByText(/Wakanda\+/i)).toBeInTheDocument();
  });

  test("renders the main heading and subtitle", () => {
    renderWithRouter(<Subscription />);
    expect(
      screen.getByText(/Unlock the Magic — One Spell, Endless Wonders!/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Cast a one-time spell \(payment\)/i)
    ).toBeInTheDocument();
  });
});
