import React from "react";
import { FlatList, Text, View, Image, TouchableHighlight } from "react-native";
import styles from "./styles";

export default function RecipesList({ route, navigation }) {
  const { category, title } = route.params;  // Recevoir les cocktails de la catégorie et le titre

  const onPressRecipe = (item) => {
    navigation.navigate("Recipe", { item });
  };

  const renderRecipe = ({ item }) => (
    <TouchableHighlight underlayColor="rgba(73,182,77,0.9)" onPress={() => onPressRecipe(item)}>
      <View style={styles.recipeItemContainer}>
        <Image style={styles.recipeImage} source={{ uri: item.strDrinkThumb }} />
        <Text style={styles.recipeTitle}>{item.strDrink}</Text>
        <Text style={styles.recipeCategory}>{item.strCategory}</Text>
      </View>
    </TouchableHighlight>
  );

  return (
    <View>
      <Text style={styles.categoryTitle}>{title}</Text>
      <FlatList
        data={category}  // Afficher les cocktails de la catégorie
        renderItem={renderRecipe}
        keyExtractor={(item) => item.idDrink}  // Assurez-vous que chaque cocktail a un identifiant unique
      />
    </View>
  );
}
