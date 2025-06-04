import React from 'react';
import { FaSearch } from 'react-icons/fa';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm, suggestions, onSuggestionClick }) => {
  return (
    <div className="w-full px-4 py-2 relative">
      <div className="flex items-center max-w-5xl mx-auto bg-black rounded-md overflow-hidden shadow-md">
        <input
          type="text"
          placeholder="Search movie you want..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 text-white bg-[#1a1a1a] focus:outline-none placeholder-gray-400"
        />
        <button className="p-3 bg-red-700 hover:bg-red-800 transition duration-200">
          <FaSearch className="text-white cursor-pointer" />
        </button>
      </div>
      {suggestions.length > 0 && (
        <div className="absolute top-full left-4 right-4 max-w-5xl mx-auto bg-[#1a1a1a] rounded-md shadow-md mt-1 z-50 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => onSuggestionClick(suggestion)}
              className="px-4 py-2 text-white hover:bg-red-700/50 cursor-pointer transition duration-200"
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;