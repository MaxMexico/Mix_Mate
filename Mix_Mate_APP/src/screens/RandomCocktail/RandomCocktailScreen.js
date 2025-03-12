import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, Button, ScrollView } from "react-native";
import cocktailsData from "../../../assets/all_cocktails.json";
import styles from "./styles"; // Importez les styles

export default function RandomCocktailScreen() {
  const [cocktail, setCocktail] = useState(null);

  // Fonction pour obtenir un cocktail aléatoire
  const getRandomCocktail = () => {
    const randomIndex = Math.floor(Math.random() * cocktailsData.length);
    setCocktail(cocktailsData[randomIndex]);
  };

  // Charger un cocktail au démarrage
  useEffect(() => {
    getRandomCocktail();
  }, []);

  if (!cocktail) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.cocktailContainer}>
        <Text style={styles.title}>{cocktail.strDrink}</Text>

        <Image 
          source={{ uri: cocktail.strDrinkThumb }} 
          style={styles.cocktailImage} 
        />

        <Text style={styles.instructionsTitle}>Recette :</Text>
        <Text style={styles.instructions}>{cocktail.strInstructionsFR || cocktail.strInstructions}</Text>

        <Text style={styles.ingredientsTitle}>Ingrédients :</Text>
        <View style={styles.ingredientsContainer}>
          {Array.from({ length: 15 }, (_, i) => i + 1)
            .map((num) => {
              const ingredient = cocktail[`strIngredient${num}`];
              const measure = cocktail[`strMeasure${num}`];
              return ingredient ? (
                <Text key={num} style={styles.ingredientText}>
                  {measure ? `${measure} ` : ""}{ingredient}
                </Text>
              ) : null;
            })}
        </View>

        <Button title="🔀 Nouveau Cocktail" onPress={getRandomCocktail} />
      </View>
    </ScrollView>
  );
}
