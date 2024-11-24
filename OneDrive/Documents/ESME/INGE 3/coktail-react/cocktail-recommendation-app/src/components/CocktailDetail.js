import React from "react";

const CocktailDetail = ({ cocktail }) => {
  return (
    <div>
      <h2>{cocktail.name}</h2>
      <img src={cocktail.image} alt={cocktail.name} />
      <h3>Ingrédients :</h3>
      <ul>
        {cocktail.ingredients.map((ing, idx) => (
          <li key={idx}>{ing}</li>
        ))}
      </ul>
      <p>{cocktail.instructions}</p>
    </div>
  );
};

export default CocktailDetail;
