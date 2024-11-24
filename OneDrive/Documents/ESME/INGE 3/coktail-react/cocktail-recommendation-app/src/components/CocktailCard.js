import React from "react";

const CocktailCard = ({ cocktail }) => {
  return (
    <div style={{ border: "1px solid #ddd", padding: "1rem", margin: "0.5rem" }}>
      <img src={cocktail.image} alt={cocktail.name} style={{ width: "100%" }} />
      <h3>{cocktail.name}</h3>
    </div>
  );
};

export default CocktailCard;
