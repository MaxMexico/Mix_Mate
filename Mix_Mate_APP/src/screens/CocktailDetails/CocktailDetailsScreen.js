// screens/CocktailDetails/CocktailDetailsScreen.js
import React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import styles from "./styles"; // Importation des styles

export default function CocktailDetailsScreen({ route }) {
  const { cocktail } = route.params;

  return (
    <ScrollView style={styles.container}>
      {/* Image du cocktail */}
      <Image source={{ uri: cocktail.strDrinkThumb }} style={styles.image} />

      {/* Nom du cocktail */}
      <Text style={styles.title}>{cocktail.strDrink}</Text>

      {/* Instructions */}
      <Text style={styles.sectionTitle}>Instructions :</Text>
      <Text style={styles.content}>
        {cocktail.strInstructions || "Pas d'instructions disponibles."}
      </Text>

      {/* Ingrédients */}
      <Text style={styles.sectionTitle}>Ingrédients :</Text>
      {Array.from({ length: 15 }, (_, i) => i + 1).map((num) => {
        const ingredient = cocktail[`strIngredient${num}`];
        const measure = cocktail[`strMeasure${num}`];
        if (ingredient) {
          return (
            <Text key={num} style={styles.content}>
              {measure ? `${measure} ` : ""}{ingredient}
            </Text>
          );
        }
        return null;
      })}
    </ScrollView>
  );
}