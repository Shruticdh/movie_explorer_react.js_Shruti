import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MovieCard from "../components/MovieCard";
import { BrowserRouter } from "react-router-dom";
import * as AdminServices from "../Services/AdminServices";
import { toast } from "react-toastify";
import '@testing-library/jest-dom';
import { waitFor } from "@testing-library/react";

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock toast
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock deleteMovie API
jest.spyOn(AdminServices, "deleteMovie").mockResolvedValue({});

const defaultProps = {
  id: "1",
  title: "Inception",
  imageUrl: "https://image.tmdb.org/t/p/original/inception.jpg",
  duration: "2h 28m",
  genre: "Sci-Fi",
  is_premium: false,
  quality: "HD",
};

const renderComponent = (props = {}) =>
  render(
    <BrowserRouter>
      <MovieCard {...defaultProps} {...props} />
    </BrowserRouter>
  );

describe("MovieCard Component", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test("renders movie title, image and duration", () => {
    renderComponent();
    expect(screen.getByText("Inception")).toBeInTheDocument();
    expect(screen.getByAltText("Inception")).toHaveAttribute("src", defaultProps.imageUrl);
    expect(screen.getByText("2h 28m")).toBeInTheDocument();
  });

  test("navigates to movie-details if user has access (non-premium)", () => {
    renderComponent();
    fireEvent.click(screen.getByAltText("Inception"));
    expect(mockNavigate).toHaveBeenCalledWith("/movie-details/1", expect.anything());
  });

  test("navigates to subscription page for premium movie if userPlan is not premium", () => {
    localStorage.setItem("userPlan", "basic");
    renderComponent({ is_premium: true });
    fireEvent.click(screen.getByAltText("Inception"));
    expect(mockNavigate).toHaveBeenCalledWith("/subscription");
  });

  test("navigates to movie-details if user has premium access", () => {
    localStorage.setItem("userPlan", "premium");
    renderComponent({ is_premium: true });
    fireEvent.click(screen.getByAltText("Inception"));
    expect(mockNavigate).toHaveBeenCalledWith("/movie-details/1", expect.anything());
  });

  test("shows Premium badge when is_premium is true", () => {
    renderComponent({ is_premium: true });
    expect(screen.getByText(/Premium/i)).toBeInTheDocument();
  });

  test("renders edit and delete buttons if role is supervisor", () => {
  renderComponent({ role: "supervisor" });
  const buttons = screen.getAllByRole("button");
  expect(buttons.length).toBeGreaterThanOrEqual(2); // edit + delete buttons
});

  test("navigates to edit page on edit button click", () => {
    renderComponent({ role: "supervisor" });
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]); // Edit button
    expect(mockNavigate).toHaveBeenCalledWith("/movies/1/edit");
  });

  test("deletes movie and shows success toast on delete button click", async () => {
    renderComponent({ role: "supervisor" });
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[1]); // Delete button
    expect(AdminServices.deleteMovie).toHaveBeenCalledWith("1");
  });

  test("shows error toast on delete failure", async () => {
  (AdminServices.deleteMovie as jest.Mock).mockRejectedValueOnce(new Error("Error"));
  renderComponent({ role: "supervisor" });
  const deleteButton = screen.getByTestId("delete-button");
  fireEvent.click(deleteButton);
  
  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledWith("Failed to delete movie");
  });
});

  test("clicking edit/delete does not trigger parent click", () => {
    renderComponent({ role: "supervisor" });
    const image = screen.getByAltText("Inception");
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]); // edit
    expect(mockNavigate).not.toHaveBeenCalledWith("/movie-details/1", expect.anything());
  });
});
