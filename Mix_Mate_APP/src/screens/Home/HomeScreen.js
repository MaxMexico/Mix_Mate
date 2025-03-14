import React, { useLayoutEffect, useEffect, useState } from "react";
import { FlatList, Text, View, TouchableHighlight, Image, Dimensions } from "react-native";
import styles from "./styles";
import MenuImage from "../../components/MenuImage/MenuImage";
import allCocktails from "../../../assets/all_cocktails.json"; // Import de la BDD

export default function HomeScreen(props) {
  const { navigation } = props;
  const [randomCocktails, setRandomCocktails] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <MenuImage
          onPress={() => {
            navigation.openDrawer();
          }}
        />
      ),
      headerRight: () => <View />,
      headerStyle: {
        backgroundColor: "#292929", // Fond sombre
      },
      headerTintColor: "#F28A1A", // Couleur d'accent
      headerTitleStyle: {
        color: "#E0E0E0", // Texte principal clair
      },
    });
  }, []);

  useEffect(() => {
    const shuffled = [...allCocktails].sort(() => 0.5 - Math.random());
    setRandomCocktails(shuffled.slice(0, 12));
  }, []);

  const onPressRecipe = (item) => {
    navigation.navigate("Recette", { item });
  };

  const renderRecipes = ({ item }) => (
    <TouchableHighlight
      underlayColor="#3A3A3A" // Effet de survol
      onPress={() => onPressRecipe(item)}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <View style={styles.innerBorder}>
          <Image style={styles.photo} source={{ uri: item.strDrinkThumb }} />
          <Text style={styles.title}>{item.strDrink}</Text>
          <Text style={styles.category}>{item.strCategory}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#292929" }}>
      <FlatList
        contentContainerStyle={{ paddingHorizontal: 8 }}
        vertical
        showsVerticalScrollIndicator={false}
        numColumns={2}
        data={randomCocktails}
        renderItem={renderRecipes}
        keyExtractor={(item) => item.idDrink}
      />
    </View>
  );
}