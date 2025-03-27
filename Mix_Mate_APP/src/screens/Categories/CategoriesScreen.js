/* CategoriesScreen.js */
import React, { useLayoutEffect, useState, useEffect } from "react";
import { FlatList, Text, View, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./styles";
import MenuImage from "../../components/MenuImage/MenuImage";
import allCocktails from "../../../assets/Translation_database.json";

export default function CategoriesScreen(props) {
  const { navigation } = props;
  const [categories, setCategories] = useState([]);
  const [isAdult, setIsAdult] = useState(null);

  // Récupérer le mode utilisateur depuis AsyncStorage
  useEffect(() => {
    const loadUserMode = async () => {
      try {
        const storedMode = await AsyncStorage.getItem("userMode");
        if (storedMode !== null) {
          setIsAdult(JSON.parse(storedMode));
        } else {
          setIsAdult(true); // Par défaut, on considère majeur
        }
      } catch (error) {
        console.error("Erreur lors du chargement du mode utilisateur", error);
        setIsAdult(true);
      }
    };
    loadUserMode();
  }, []);

  // Filtrer les cocktails pour générer la liste des catégories selon le mode
  useEffect(() => {
    if (isAdult !== null) {
      let cocktailsToUse = [...allCocktails];
      if (!isAdult) {
        cocktailsToUse = cocktailsToUse.filter(
          (cocktail) => cocktail.strAlcoholic === "Non alcoholic"
        );
      }
      const uniqueCategories = [
        ...new Set(cocktailsToUse.map((cocktail) => cocktail.strCategory)),
      ];
      setCategories(uniqueCategories);
    }
  }, [isAdult]);

  // Configuration du header
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

  // Au clic sur une catégorie, filtrer également les cocktails en fonction du mode
  const onPressCategory = (category) => {
    const title = category;
    const filteredCocktails = allCocktails.filter((cocktail) => {
      if (cocktail.strCategory !== category) return false;
      if (!isAdult && cocktail.strAlcoholic !== "Non alcoholic") return false;
      return true;
    });
    navigation.navigate("Catégorie", { category: filteredCocktails, title });
  };

  // Rendu de chaque catégorie
  const renderCategory = ({ item }) => {
    const firstCocktail = allCocktails.find(
      (cocktail) => cocktail.strCategory === item
    );
    const recipesCount = allCocktails.filter((cocktail) => {
      if (cocktail.strCategory !== item) return false;
      if (!isAdult && cocktail.strAlcoholic !== "Non alcoholic") return false;
      return true;
    }).length;

    return (
      <TouchableOpacity
        onPress={() => onPressCategory(item)}
        style={styles.categoriesItemContainer}
      >
        <Image
          style={styles.categoriesPhoto}
          source={{ uri: firstCocktail ? firstCocktail.strDrinkThumb : "" }}
        />
        <Text style={styles.categoriesName}>{item}</Text>
        <Text style={styles.categoriesInfo}>{recipesCount} recettes</Text>
      </TouchableOpacity>
    );
  };

  // Afficher un loader ou rien tant qu'on n'a pas chargé isAdult
  if (isAdult === null) {
    return null;
  }

  return (
    <LinearGradient
      colors={["#a1628f", "#ebbcb7"]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={{ flex: 1 }}
    >
      
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.listContent}
      />
    </LinearGradient>
  );
}
