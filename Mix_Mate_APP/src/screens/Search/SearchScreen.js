// screens/Search/SearchScreen.js
import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import SearchBar from "../../components/SearchBar/SearchBar";
import cocktailsData from "../../../assets/all_cocktails.json"; // Assure-toi que le chemin est correct
import styles from "./styles"; // Importe les styles depuis le fichier séparé

export default function SearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCocktails, setFilteredCocktails] = useState([]);

  // Fonction pour filtrer les cocktails en fonction de la recherche
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = cocktailsData.filter((cocktail) =>
        cocktail.strDrink.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCocktails(filtered);
    } else {
      setFilteredCocktails([]); // Réinitialiser si la recherche est vide
    }
  };

  // Rendu d'un cocktail dans la liste
  const renderCocktail = ({ item }) => (
    <TouchableOpacity
      style={styles.cocktailItem}
      onPress={() => navigation.navigate("CocktailDetails", { cocktail: item })}
    >
      <Text style={styles.cocktailName}>{item.strDrink}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Barre de recherche */}
      <SearchBar onSearch={handleSearch} />

      {/* Liste des cocktails filtrés */}
      <FlatList
        data={filteredCocktails}
        keyExtractor={(item) => item.idDrink}
        renderItem={renderCocktail}
        ListEmptyComponent={
          <Text style={styles.noResults}>Aucun résultat trouvé</Text>
        }
      />
    </View>
  );
}