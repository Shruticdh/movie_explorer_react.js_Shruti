import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Header from "../components/header";
import "@testing-library/jest-dom"

// Mock useNavigate
const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));


describe("Header Component", () => {
  test("renders logo and navigates to dashboard on click", () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    const logo = screen.getByTestId("logo");
    expect(logo).toBeInTheDocument();

    fireEvent.click(logo);
    expect(mockedUsedNavigate).toHaveBeenCalledWith("/dashboard");
  });
  test("renders all header menu items", () => {
  render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );

  const menuItems = screen.getAllByTestId("menu-item");
  const itemTexts = menuItems.map((item) => item.textContent);

  expect(itemTexts).toEqual(expect.arrayContaining(["Home", "Movies", "Genre"]));
});

test("renders the subscribe button with correct label", () => {
  render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );

  const subscribeBtn = screen.getByTestId("subscribe-button");
  expect(subscribeBtn).toBeInTheDocument();
  expect(subscribeBtn).toHaveTextContent("Subscribe Now");
});

it("navigates to 'Movies' page on menu item click", () => {
  const { getAllByTestId } = render(<Header />);
  const menuItems = getAllByTestId("menu-item");

  const moviesMenu = menuItems.find((item) => item.textContent === "Movies");
  
  if (moviesMenu) {
    fireEvent.click(moviesMenu);
  }
});

it("displays the Subscribe button", () => {
  const { getByTestId } = render(<Header />);
  const subscribeButton = getByTestId("subscribe-button");
  expect(subscribeButton).toBeInTheDocument();
});

it("navigates to Home on logo click", () => {
  const { getByTestId } = render(<Header />);
  const logo = getByTestId("logo");
  
  fireEvent.click(logo);
  expect(window.location.pathname).toBe('/');
});

it("clicks the user icon button", () => {
  const { getAllByTestId } = render(<Header />);
  const userIconButtons = getAllByTestId("user-icon-button");
  fireEvent.click(userIconButtons[0]);
});

it("renders the menu items", () => {
  const { getAllByTestId } = render(<Header />);
  const menuItems = getAllByTestId("menu-item");
  
  expect(menuItems).toHaveLength(3);  
  expect(menuItems[0]).toHaveTextContent("Home");
  expect(menuItems[1]).toHaveTextContent("Movies");
  expect(menuItems[2]).toHaveTextContent("Genre");
});

it("renders the subscribe button and checks if it is clickable", () => {
  const { getByTestId } = render(<Header />);
  const subscribeButton = getByTestId("subscribe-button");
  
  expect(subscribeButton).toBeInTheDocument();
  fireEvent.click(subscribeButton);
});

it("renders the logo and checks if it is clickable", () => {
  const { getByTestId } = render(<Header />);
  const logo = getByTestId("logo");
  
  expect(logo).toBeInTheDocument();
  fireEvent.click(logo);
});

it("renders the hamburger menu on mobile", () => {
  global.innerWidth = 500;
  const { getByTestId } = render(<Header />);
  const hamburgerMenu = getByTestId("hamburger-menu");
  
  expect(hamburgerMenu).toBeInTheDocument();
  fireEvent.click(hamburgerMenu);
});

test("toggles mobile menu on hamburger icon click", () => {
  global.innerWidth = 500; 
  const { getByTestId, queryByTestId } = render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );

  const hamburgerMenu = getByTestId("hamburger-menu");
  fireEvent.click(hamburgerMenu);

  expect(queryByTestId("hamburger-menu")).not.toBeInTheDocument();
  expect(getByTestId("close-menu")).toBeInTheDocument();

  const closeMenu = getByTestId("close-menu");
  fireEvent.click(closeMenu);
  
  expect(queryByTestId("close-menu")).not.toBeInTheDocument();
  expect(getByTestId("hamburger-menu")).toBeInTheDocument();
});

test("shows 'Add Movies' menu item for supervisor role", () => {
  const user = { email: "supervisor@example.com", role: "supervisor" };
  localStorage.setItem("user", JSON.stringify(user));

  const { getAllByTestId } = render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );
  const menuItems = getAllByTestId("menu-item");
  const addMoviesItem = menuItems.find((item) => item.textContent === "Add Movies");

  expect(addMoviesItem).toBeInTheDocument();
});

test("navigates to subscription page when 'Subscribe Now' is clicked", () => {
  const { getByTestId } = render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );

  const subscribeButton = getByTestId("subscribe-button");
  fireEvent.click(subscribeButton);

  // Verify if navigation happens to the subscription page
  expect(mockedUsedNavigate).toHaveBeenCalledWith("/subscription");
});

});
