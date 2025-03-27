/* screens/Search/SearchScreen.js */
import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import SearchBar from "../../components/SearchBar/SearchBar";
import cocktailsData from "../../../assets/Translation_database.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./styles";

export default function SearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCocktails, setFilteredCocktails] = useState([]);
  const [isAdult, setIsAdult] = useState(null);

  // Charger le mode utilisateur depuis AsyncStorage
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

  // Filtrer les cocktails en fonction de la recherche et du mode
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      let filtered = cocktailsData.filter((cocktail) =>
        cocktail.strDrink.toLowerCase().includes(query.toLowerCase())
      );
      // Si l'utilisateur est mineur, ne garder que les cocktails non alcoolisés
      if (isAdult === false) {
        filtered = filtered.filter(
          (cocktail) => cocktail.strAlcoholic === "Non alcoholic"
        );
      }
      setFilteredCocktails(filtered);
    } else {
      setFilteredCocktails([]);
    }
  };

  // Rendu d'un cocktail dans la liste
  const renderCocktail = ({ item }) => (
    <TouchableOpacity
      style={styles.cocktailItem}
      onPress={() => navigation.navigate("Recette", { item })}
    >
      <Image source={{ uri: item.strDrinkThumb }} style={styles.cocktailImage} />
      <Text style={styles.cocktailName}>{item.strDrink}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={["#a1628f", "#ebbcb7"]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>


        {/* Barre de recherche */}
        <SearchBar onSearch={handleSearch} placeholder="Rechercher un cocktail..." />

        {/* Liste des cocktails filtrés */}
        <FlatList
          data={filteredCocktails}
          keyExtractor={(item) => item.idDrink}
          renderItem={renderCocktail}
          ListEmptyComponent={
            searchQuery.length > 0 && (
              <Text style={styles.noResults}>Aucun résultat trouvé</Text>
            )
          }
          contentContainerStyle={styles.listContent}
        />
      </View>
    </LinearGradient>
  );
}
