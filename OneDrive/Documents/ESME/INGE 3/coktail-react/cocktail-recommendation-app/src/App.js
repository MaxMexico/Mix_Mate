import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CocktailDetailPage from "./pages/CocktailDetailPage";
import Profile from "./pages/Profile";

const theme = createTheme({
  palette: {
    primary: {
      main: "#007bff", // Couleur principale
    },
    secondary: {
      main: "#f50057", // Couleur secondaire
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif", // Police par défaut
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cocktail/:id" element={<CocktailDetailPage />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
