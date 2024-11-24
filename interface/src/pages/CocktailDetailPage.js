import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CocktailDetail from "../components/CocktailDetail";

const CocktailDetailPage = () => {
  const { id } = useParams();
  const [cocktail, setCocktail] = useState(null);

  useEffect(() => {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
      .then((response) => response.json())
      .then((data) =>
        setCocktail({
          name: data.drinks[0].strDrink,
          image: data.drinks[0].strDrinkThumb,
          ingredients: Object.keys(data.drinks[0])
            .filter((key) => key.includes("Ingredient") && data.drinks[0][key])
            .map((key) => data.drinks[0][key]),
          instructions: data.drinks[0].strInstructions,
        })
      );
  }, [id]);

  return cocktail ? <CocktailDetail cocktail={cocktail} /> : <p>Chargement...</p>;
};

export default CocktailDetailPage;
