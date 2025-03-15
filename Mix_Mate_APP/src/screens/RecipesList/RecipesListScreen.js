/* RecipesList.js */
import React from "react";
import { FlatList, Text, View, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // Import du LinearGradient
import styles from "./styles";

export default function RecipesList(props) {
  const { navigation, route } = props;
  const { category, title } = route.params; // Recevoir les cocktails de la catégorie et le titre

  // Fonction pour naviguer vers la page de recette
  const onPressRecipe = (item) => {
    navigation.navigate("Recette", { item });
  };

  // Rendu d'une recette individuelle
  const renderRecipe = ({ item }) => (
    <TouchableOpacity
      onPress={() => onPressRecipe(item)}
      style={styles.recipeItemContainer} // Style pour le conteneur de chaque recette
    >
      <Image
        style={styles.recipePhoto}
        source={{
          uri: item.strDrinkThumb || "", // Affiche l'image de la recette
        }}
      />
      <Text style={styles.recipeName}>{item.strDrink}</Text>
      <Text style={styles.recipeInfo}>
        {item.strCategory}
      </Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={["#a1628f", "#ebbcb7"]} // Même gradient que les autres écrans
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={{ flex: 1 }} // Gradient comme arrière-plan principal
    >
      {/* Titre de la catégorie */}
      <Text style={styles.categoryTitle}>{title}</Text>

      {/* Liste des recettes */}
      <FlatList
        data={category} // Afficher les cocktails de la catégorie
        renderItem={renderRecipe}
        keyExtractor={(item) => item.idDrink} // Assurez-vous que chaque cocktail a un identifiant unique
        contentContainerStyle={styles.listContent} // Ajout d'un style pour le contenu
      />
    </LinearGradient>
  );
}