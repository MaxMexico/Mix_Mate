/* RandomCocktailScreen.js */
import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // Import du LinearGradient
import cocktailsData from "../../../assets/all_cocktails.json";
import styles from "./styles"; // 🎨 Import des nouveaux styles

export default function RandomCocktailScreen() {
  const [cocktail, setCocktail] = useState(null);

  const getRandomCocktail = () => {
    const randomIndex = Math.floor(Math.random() * cocktailsData.length);
    setCocktail(cocktailsData[randomIndex]);
  };

  useEffect(() => {
    getRandomCocktail();
  }, []);

  if (!cocktail) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.title}>Chargement...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#a1628f", "#ebbcb7"]} // Mêmes couleurs que RecipeScreen
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={{ flex: 1 }} // Gradient comme arrière-plan principal
    >
      <ScrollView style={styles.container}>
        <View style={styles.cocktailContainer}>
          {/* Affichage de l'image du cocktail */}
          <Image source={{ uri: cocktail.strDrinkThumb }} style={styles.cocktailImage} />

          {/* Nom du cocktail */}
          <Text style={styles.title}>{cocktail.strDrink}</Text>

          {/* Catégorie du cocktail */}
          <Text style={styles.category}>{cocktail.strCategory}</Text>

          {/* Instructions de la recette */}
          <Text style={styles.instructionsTitle}>Recette :</Text>
          <Text style={styles.instructions}>
            {cocktail.strInstructionsFR || cocktail.strInstructions}
          </Text>

          {/* Liste des ingrédients */}
          <Text style={styles.ingredientsTitle}>Ingrédients :</Text>
          <View style={styles.ingredientsContainer}>
            {Array.from({ length: 15 }, (_, i) => i + 1).map((num) => {
              const ingredient = cocktail[`strIngredient${num}`];
              const measure = cocktail[`strMeasure${num}`];
              return ingredient ? (
                <Text key={num} style={styles.ingredientText}>
                  {measure ? `${measure} ` : ""}{ingredient}
                </Text>
              ) : null;
            })}
          </View>

          {/* Bouton pour générer un nouveau cocktail */}
          <TouchableOpacity style={styles.randomButton} onPress={getRandomCocktail}>
            <Text style={styles.randomButtonText}>🔀 Nouveau Cocktail</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}