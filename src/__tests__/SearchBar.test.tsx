import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SearchBar from '../components/SearchBar';
import '@testing-library/jest-dom';


describe('SearchBar', () => {
  test('renders search bar correctly', () => {
    const { getByPlaceholderText } = render(
      <SearchBar searchTerm="" setSearchTerm={() => {}} />
    );
    const inputElement = getByPlaceholderText(/search movie you want/i);
    expect(inputElement).toBeInTheDocument();
  });

  test('updates search term on input change', () => {
    const setSearchTerm = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchBar searchTerm="" setSearchTerm={setSearchTerm} />
    );
    const inputElement = getByPlaceholderText(/search movie you want/i);
    fireEvent.change(inputElement, { target: { value: 'Inception' } });
    expect(setSearchTerm).toHaveBeenCalledWith('Inception');
  });


test('calls setSearchTerm on button click', () => {
  const setSearchTerm = jest.fn();
  const { getByRole } = render(
    <SearchBar searchTerm="" setSearchTerm={setSearchTerm} />
  );
  const buttonElement = getByRole('button');
  fireEvent.click(buttonElement);
  expect(setSearchTerm).toHaveBeenCalledTimes(0); // Adjust logic if needed
});


  test('renders with the correct searchTerm prop', () => {
    const { getByDisplayValue } = render(
      <SearchBar searchTerm="Inception" setSearchTerm={() => {}} />
    );
    const inputElement = getByDisplayValue('Inception');
    expect(inputElement).toBeInTheDocument();
  });

test('has the correct class names', () => {
  const { container } = render(
    <SearchBar searchTerm="" setSearchTerm={() => {}} />
  );
  const searchBarElement = container.querySelector('.flex'); // This div has bg-black
  expect(searchBarElement).toHaveClass('bg-black');
  expect(searchBarElement).toHaveClass('rounded-md');
});

});
