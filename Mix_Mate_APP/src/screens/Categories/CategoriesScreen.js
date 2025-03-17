/* CategoriesScreen.js */
import React, { useLayoutEffect, useState, useEffect } from "react";
import { FlatList, Text, View, Image, TouchableHighlight, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // Import du LinearGradient
import styles from "./styles";
import MenuImage from "../../components/MenuImage/MenuImage";
import allCocktails from "../../../assets/Translation_database.json"; // Import de la BDD

export default function CategoriesScreen(props) {
  const { navigation } = props;
  const [categories, setCategories] = useState([]);

  // Organiser les cocktails en catégories uniques
  useEffect(() => {
    const uniqueCategories = [
      ...new Set(allCocktails.map((cocktail) => cocktail.strCategory)),
    ];
    setCategories(uniqueCategories);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleStyle: {
        fontWeight: "bold",
        textAlign: "center",
        alignSelf: "center",
        flex: 1,
      },
      headerLeft: () => (
        <MenuImage
          onPress={() => {
            navigation.openDrawer();
          }}
        />
      ),
      headerRight: () => <View />,
    });
  }, []);

  const onPressCategory = (category) => {
    const title = category;
    const filteredCocktails = allCocktails.filter(
      (cocktail) => cocktail.strCategory === category
    );
    navigation.navigate("Catégorie", { category: filteredCocktails, title });
  };

  const renderCategory = ({ item }) => (
<TouchableOpacity
  onPress={() => onPressCategory(item)}
  style={styles.categoriesItemContainer} // Ajoutez le style ici
>
  <Image
    style={styles.categoriesPhoto}
    source={{
      uri:
        allCocktails.find((cocktail) => cocktail.strCategory === item)
          ?.strDrinkThumb || "", // Affiche la première image de la catégorie
    }}
  />
  <Text style={styles.categoriesName}>{item}</Text>
  <Text style={styles.categoriesInfo}>
    {allCocktails.filter((cocktail) => cocktail.strCategory === item).length}{" "}
    recettes
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
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.listContent} // Ajout d'un style pour le contenu
      />
    </LinearGradient>
  );
}