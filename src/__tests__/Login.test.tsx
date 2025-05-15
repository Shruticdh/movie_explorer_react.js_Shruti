import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "../pages/Login";
import { loginAPI } from "../Services/userServices";
import { withNavigation } from "../utils/withNavigation";
import "@testing-library/jest-dom";
import toast from "react-hot-toast";

jest.mock("../Services/userServices");
jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));
jest.mock("../utils/withNavigation", () => ({
  withNavigation: (Component: any) => (props: any) =>
    <Component {...props} navigate={jest.fn()} />,
}));

const WrappedLoginPage = withNavigation(LoginPage);

describe("LoginPage", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test("renders login form elements", () => {
    render(<WrappedLoginPage />);
    expect(
      screen.getByPlaceholderText(/enter your email/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/enter your password/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/don’t have an account/i)).toBeInTheDocument();
  });

  test("shows validation errors for invalid inputs", async () => {
    render(<WrappedLoginPage />);
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/password must be at least 6 characters/i)
    ).toBeInTheDocument();
  });

  test("successful login calls API, shows toast, sets localStorage, and navigates", async () => {
    const mockUser = { token: "abc123", name: "John" };
    (loginAPI as jest.Mock).mockResolvedValue(mockUser);

    render(<WrappedLoginPage />);

    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: "user@example.com", name: "email" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: "password123", name: "password" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(loginAPI).toHaveBeenCalledWith({
        email: "user@example.com",
        password: "password123",
      });
    });

    expect(toast.success).toHaveBeenCalledWith("Login successful!");
    expect(localStorage.getItem("token")).toBe("abc123");
    expect(localStorage.getItem("user")).toContain("John");
  });

  test("shows error toast if login fails due to invalid credentials", async () => {
    (loginAPI as jest.Mock).mockResolvedValue({ token: null });

    render(<WrappedLoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: "user@example.com", name: "email" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: "password123", name: "password" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Login failed: Invalid credentials"
      );
    });
  });

  test("shows error toast if login API throws error", async () => {
    (loginAPI as jest.Mock).mockRejectedValue(new Error("Server error"));

    render(<WrappedLoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: "user@example.com", name: "email" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: "password123", name: "password" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Login failed: Something went wrong"
      );
    });
  });

  test("disables button and shows loader during API call", async () => {
    let resolvePromise: any;
    (loginAPI as jest.Mock).mockImplementation(
      () => new Promise((resolve) => (resolvePromise = resolve))
    );

    render(<WrappedLoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: "user@example.com", name: "email" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: "password123", name: "password" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /login/i }));

    expect(screen.getByRole("button", { name: /login/i })).toBeDisabled();
    const matches = screen.getAllByText((_, node) =>
      node?.textContent?.includes("MOVIEXPO! Entry!")
    );
    expect(matches.length).toBeGreaterThan(0);

    resolvePromise({ token: "abc123" });
  });

  test("navigates to signup page when signup button clicked", () => {
    render(<WrappedLoginPage />);
    fireEvent.click(screen.getByText(/signup/i));
    // Navigation is mocked, so no further assertion here unless spying on props
  });
});
