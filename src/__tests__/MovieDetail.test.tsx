import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import MovieDetailPage from "../pages/MovieDetail";
import * as MovieService from "../Services/MovieService";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom"

// Mock toast
jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
  },
}));

// Mock Header & Footer
jest.mock("../components/header", () => () => <div data-testid="header">Header</div>);
jest.mock("../components/footer", () => () => <div data-testid="footer">Footer</div>);

// Mock navigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
//   useParams: () => ({ id: "1" }),
}));

// Dummy movie
const mockMovie = {
  id: 1,
  title: "Inception",
  genre: "Sci-Fi",
  release_year: 2010,
  rating: 8.8,
  director: "Christopher Nolan",
  duration: 148,
  description: "A thief who steals corporate secrets...",
  is_premium: true,
  main_lead: "Leonardo DiCaprio",
  poster_url: "https://example.com/poster.jpg",
  banner_url: "https://example.com/banner.jpg",
};

describe("MovieDetailPage", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading spinner initially", async () => {
    jest.spyOn(MovieService, "getMoviesById").mockImplementation(() => new Promise(() => {}));
    render(
      <MemoryRouter initialEntries={["/movie/1"]}>
        <Routes>
          <Route path="/movie/:id" element={<MovieDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Loading Movie Details...")).toBeInTheDocument();
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("renders movie details after fetch", async () => {
    jest.spyOn(MovieService, "getMoviesById").mockResolvedValue(mockMovie);

    render(
      <MemoryRouter initialEntries={["/movie/1"]}>
        <Routes>
          <Route path="/movie/:id" element={<MovieDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Inception")).toBeInTheDocument();
    });

    expect(screen.getByText("2010")).toBeInTheDocument();
    expect(screen.getByText("Sci-Fi")).toBeInTheDocument();
    expect(screen.getByText("Leonardo DiCaprio")).toBeInTheDocument();
    expect(screen.getByText("Christopher Nolan")).toBeInTheDocument();
    expect(screen.getByText("8.8")).toBeInTheDocument();
    expect(screen.getByText(mockMovie.description)).toBeInTheDocument();
    expect(screen.getByAltText("Inception")).toHaveAttribute("src", mockMovie.poster_url);
  });

  it("redirects to subscription on 401/403 error", async () => {
    jest.spyOn(MovieService, "getMoviesById").mockRejectedValue({
      response: { status: 403 },
    });

    render(
      <MemoryRouter initialEntries={["/movie/1"]}>
        <Routes>
          <Route path="/movie/:id" element={<MovieDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/subscription");
    });
  });

  it("shows toast on other errors", async () => {
    const toast = require("react-hot-toast").default;
    jest.spyOn(MovieService, "getMoviesById").mockRejectedValue(new Error("Server error"));

    render(
      <MemoryRouter initialEntries={["/movie/1"]}>
        <Routes>
          <Route path="/movie/:id" element={<MovieDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to fetch movie details");
    });
  });

  it("shows movie not found if movie is null", async () => {
    jest.spyOn(MovieService, "getMoviesById").mockResolvedValue(null);

    render(
      <MemoryRouter initialEntries={["/movie/1"]}>
        <Routes>
          <Route path="/movie/:id" element={<MovieDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Movie Not Found")).toBeInTheDocument();
    });
  });

});
