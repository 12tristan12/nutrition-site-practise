import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className="search-bar.container">
      <input
        type="text"
        value={query}
        className="search-bar"
        onChange={handleChange}
        placeholder="Search foods..."
      />
      {query && (
          <button className="clear-button visible" onClick={handleClear}>Clear</button>
      )}
    </div>
  );
};

export default SearchBar;