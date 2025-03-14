import React, { useLayoutEffect, useState, useEffect } from "react";
import { FlatList, Text, View, Image, TouchableHighlight } from "react-native";
import styles from "./styles";
import MenuImage from "../../components/MenuImage/MenuImage";
import allCocktails from "../../../assets/all_cocktails.json"; // Import de la BDD

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
    <TouchableHighlight
      underlayColor="rgba(73,182,77,0.9)"
      onPress={() => onPressCategory(item)}
    >
      <View style={styles.categoriesItemContainer}>
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
          {allCocktails.filter((cocktail) => cocktail.strCategory === item)
            .length}{" "}
          recettes
        </Text>
      </View>
    </TouchableHighlight>
  );

  return (
    <View>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item}
      />
    </View>
  );
}
