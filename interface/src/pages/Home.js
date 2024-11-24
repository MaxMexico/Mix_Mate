import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import SearchBar from "../components/SearchBar";
import CocktailList from "../components/CocktailList";

const Home = () => {
  const [cocktails, setCocktails] = useState([]);
  const [filteredCocktails, setFilteredCocktails] = useState([]);
  //const [searchTerm, setSearchTerm] = useState("");
  const [categories] = useState(["Classiques", "Sans alcool", "Exotiques", "Festifs"]);
  const [alcoholType, setAlcoholType] = useState("");
  const navigate = useNavigate();

  // Simuler un cocktail du jour
  const dailyCocktail = {
    id: "11007",
    name: "Margarita",
    image: "https://www.thecocktaildb.com/images/media/drink/5noda61589575158.jpg",
  };

  // Simuler des cocktails populaires
  const popularCocktails = [
    {
      id: "1",
      name: "Mojito",
      image: "https://www.thecocktaildb.com/images/media/drink/metwgh1606770327.jpg",
    },
    {
      id: "2",
      name: "Whiskey Sour",
      image: "https://www.thecocktaildb.com/images/media/drink/hbkfsh1589574990.jpg",
    },
    {
      id: "3",
      name: "Pina Colada",
      image: "https://www.thecocktaildb.com/images/media/drink/cpf4j51504371346.jpg",
    },
  ];

  // Charger les cocktails depuis l'API
  useEffect(() => {
    fetch("https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic")
      .then((response) => response.json())
      .then((data) => {
        setCocktails(data.drinks);
        setFilteredCocktails(data.drinks); // Par défaut, tout afficher
      });
  }, []);

  // Fonction pour filtrer par catégorie
  const filterByCategory = (category) => {
    // Exemple de filtrage arbitraire (adapter en fonction de votre API)
    const filtered = cocktails.filter((_, index) => index % 2 === 0); // Filtrer les cocktails pair pour l'exemple
    setFilteredCocktails(filtered);
  };

  // Fonction pour filtrer par type d'alcool
  const filterByAlcohol = (type) => {
    setAlcoholType(type);
    // Exemple : Filtrer selon le type (adapter en fonction de votre API)
    const filtered = cocktails.filter((cocktail) =>
      cocktail.strDrink.toLowerCase().includes(type.toLowerCase())
    );
    setFilteredCocktails(filtered);
  };

  // Fonction pour gérer la recherche
  const handleSearch = (term) => {
    //setSearchTerm(term);
    const filtered = cocktails.filter((cocktail) =>
      cocktail.strDrink.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredCocktails(filtered);
  };

  return (
    <div>
      {/* Titre principal */}
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>MiX'Mate by ZipetteAI</h1>

      {/* Barre de recherche */}
      <SearchBar onSearch={handleSearch} />

      {/* Recherche avancée : Filtrer par type d'alcool */}
      <div style={{ textAlign: "center", margin: "1.5rem 0" }}>
        <TextField
          select
          label="Type d'alcool"
          variant="outlined"
          value={alcoholType}
          onChange={(e) => filterByAlcohol(e.target.value)}
          style={{ width: "200px" }}
        >
          {["Vodka", "Rhum", "Whiskey", "Gin", "Sans alcool"].map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>
      </div>

      {/* Explorer par catégories */}
      <div style={{ margin: "1.5rem 0", textAlign: "center" }}>
        <h3>Explorer par catégorie</h3>
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
          {categories.map((category, index) => (
            <Button
              key={index}
              variant="outlined"
              onClick={() => filterByCategory(category)}
              style={{ textTransform: "none" }}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Carrousel de cocktails */}
      <CocktailList
        cocktails={filteredCocktails.map((drink) => ({
          id: drink.idDrink,
          name: drink.strDrink,
          image: drink.strDrinkThumb,
        }))}
      />

      {/* Cocktails populaires */}
      <div style={{ margin: "2rem 0" }}>
        <h3 style={{ textAlign: "center", color: "#007bff" }}>Cocktails Populaires</h3>
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
          {popularCocktails.map((cocktail) => (
            <div key={cocktail.id} style={{ textAlign: "center", maxWidth: "150px" }}>
              <img
                src={cocktail.image}
                alt={cocktail.name}
                style={{
                  width: "100%",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              />
              <h4>{cocktail.name}</h4>
            </div>
          ))}
        </div>
      </div>

      {/* Cocktail du jour */}
      <div style={{ margin: "2rem 0", textAlign: "center" }}>
        <h3>Cocktail du jour</h3>
        <div style={{ display: "inline-block", border: "1px solid #ddd", padding: "1rem", borderRadius: "10px" }}>
          <img
            src={dailyCocktail.image}
            alt={dailyCocktail.name}
            style={{
              width: "100%",
              maxWidth: "200px",
              borderRadius: "10px",
              marginBottom: "1rem",
            }}
          />
          <h4>{dailyCocktail.name}</h4>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/cocktail/${dailyCocktail.id}`)}
          >
            Voir la recette
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
