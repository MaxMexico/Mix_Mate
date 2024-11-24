import React from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ onSearch }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center", margin: "1rem 0" }}>
      <TextField
        id="search-bar"
        label="Rechercher un cocktail"
        variant="outlined"
        onChange={(e) => onSearch(e.target.value)}
        style={{ width: "80%", maxWidth: "400px" }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
};

export default SearchBar;
