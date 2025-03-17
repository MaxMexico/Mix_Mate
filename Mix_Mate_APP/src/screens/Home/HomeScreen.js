/* HomeScreen.js */
import React, { useLayoutEffect, useEffect, useState } from "react";
import { FlatList, Text, View, TouchableHighlight, Image,TouchableOpacity, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // Import du LinearGradient
import styles from "./styles";
import MenuImage from "../../components/MenuImage/MenuImage";
import allCocktails from "../../../assets/Translation_database.json"; // Import de la BDD

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
        backgroundColor: "#d8d1e0", // Fond sombre
      },
      headerTintColor: "#F28A1A", // Couleur d'accent
      headerTitleStyle: {
        color: "#2e2e2e", // Texte principal clair
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
<TouchableOpacity
  onPress={() => onPressRecipe(item)}
  style={styles.container} // Ajoutez le style ici
>
  <View style={styles.innerBorder}>
    <Image style={styles.photo} source={{ uri: item.strDrinkThumb }} />
    <Text style={styles.title}>{item.strDrink}</Text>
    <Text style={styles.category}>{item.strCategory}</Text>
  </View>
  
</TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={["#a1628f", "#ebbcb7"]} // Mêmes couleurs que RecoScreen
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={{ flex: 1 }} // Gradient comme arrière-plan principal
    >
      <FlatList
        contentContainerStyle={{ paddingHorizontal: 8 }}
        vertical
        showsVerticalScrollIndicator={false}
        numColumns={2}
        data={randomCocktails}
        renderItem={renderRecipes}
        keyExtractor={(item) => item.idDrink}
      />
    </LinearGradient>
  );
}