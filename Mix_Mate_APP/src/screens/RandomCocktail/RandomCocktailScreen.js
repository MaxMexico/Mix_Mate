import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
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
    <ScrollView style={styles.container}>
      <View style={styles.cocktailContainer}>
        <Text style={styles.title}>{cocktail.strDrink}</Text>

        <Image 
          source={{ uri: cocktail.strDrinkThumb }} 
          style={styles.cocktailImage} 
          resizeMode="cover"
        />

        <Text style={styles.instructionsTitle}>Recette :</Text>
        <Text style={styles.instructions}>{cocktail.strInstructionsFR || cocktail.strInstructions}</Text>

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

        {/* 🔄 Nouveau bouton stylisé */}
        <TouchableOpacity style={styles.randomButton} onPress={getRandomCocktail}>
          <Text style={styles.randomButtonText}>🔀 Nouveau Cocktail</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
