import React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import styles from "./styles"; // Import des styles

export default function RecipeScreen({ route }) {
  const { item } = route.params || {}; // Vérifie que item existe

  if (!item) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Erreur : Aucune recette trouvée.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.cocktailContainer}>
        {/* Affichage de l'image du cocktail */}
        <Image source={{ uri: item.strDrinkThumb }} style={styles.cocktailImage} />

        {/* Nom du cocktail */}
        <Text style={styles.title}>{item.strDrink}</Text>

        {/* Catégorie du cocktail */}
        <Text style={styles.category}>{item.strCategory}</Text>

        {/* Instructions de la recette */}
        <Text style={styles.instructionsTitle}>Recette :</Text>
        <Text style={styles.instructions}>{item.strInstructionsFR || item.strInstructions}</Text>

        {/* Liste des ingrédients */}
        <Text style={styles.ingredientsTitle}>Ingrédients :</Text>
        <View style={styles.ingredientsContainer}>
          {Array.from({ length: 15 }, (_, i) => i + 1).map((num) => {
            const ingredient = item[`strIngredient${num}`];
            const measure = item[`strMeasure${num}`];
            return ingredient ? (
              <Text key={num} style={styles.ingredientText}>
                {measure ? `${measure} ` : ""}{ingredient}
              </Text>
            ) : null;
          })}
        </View>
      </View>
    </ScrollView>
  );
}
