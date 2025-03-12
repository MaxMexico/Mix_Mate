import React, { useLayoutEffect, useEffect, useState } from "react";
import { FlatList, Text, View, TouchableHighlight, Image } from "react-native";
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
    });
  }, []);

  useEffect(() => {
    const shuffled = [...allCocktails].sort(() => 0.5 - Math.random());
    setRandomCocktails(shuffled.slice(0, 12));
  }, []);

  const onPressRecipe = (item) => {
    navigation.navigate("Recipe", { item });
  };

  const renderRecipes = ({ item }) => (
    <TouchableHighlight underlayColor="rgba(190, 73, 171, 0.9)" onPress={() => onPressRecipe(item)}>
      <View style={styles.container}>
        <Image style={styles.photo} source={{ uri: item.strDrinkThumb }} />
        <Text style={styles.title}>{item.strDrink}</Text>
        <Text style={styles.category}>{item.strCategory}</Text>
      </View>
    </TouchableHighlight>
  );

  return (
    <View>
      <FlatList 
        vertical 
        showsVerticalScrollIndicator={false} 
        numColumns={2} 
        data={randomCocktails} 
        renderItem={renderRecipes} 
        keyExtractor={(item) => item.idDrink} // Utilisation d'un identifiant unique
      />
    </View>
  );
}
