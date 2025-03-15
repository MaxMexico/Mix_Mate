/* screens/Search/SearchScreen.js */
import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // Importez LinearGradient
import SearchBar from "../../components/SearchBar/SearchBar"; // Votre composant SearchBar
import cocktailsData from "../../../assets/all_cocktails.json"; // Assurez-vous que le chemin est correct
import styles from "./styles";

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

  // Rendu d'un cocktail dans la liste avec image
  const renderCocktail = ({ item }) => (
    <TouchableOpacity
      style={styles.cocktailItem}
      onPress={() => navigation.navigate("Recette", { item })}
    >
      {/* Image du cocktail */}
      <Image 
        source={{ uri: item.strDrinkThumb }} 
        style={styles.cocktailImage} 
      />
      
      {/* Nom du cocktail */}
      <Text style={styles.cocktailName}>{item.strDrink}</Text>
    </TouchableOpacity>
  );

  return (

    
    <LinearGradient
      colors={["#a1628f", "#ebbcb7"]} // Même gradient que les autres écrans
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={{ flex: 1 }} // Gradient comme arrière-plan principal
    >
      <View style={styles.container}>
        {/* Barre de recherche */}
        <SearchBar 
          onSearch={handleSearch} 
          placeholder="Rechercher un cocktail..." 
        />

        {/* Liste des cocktails filtrés */}
        <FlatList
          data={filteredCocktails}
          keyExtractor={(item) => item.idDrink}
          renderItem={renderCocktail}
          ListEmptyComponent={
            searchQuery.length > 0 && ( // Afficher le message uniquement si une recherche a été effectuée
              <Text style={styles.noResults}>Aucun résultat trouvé</Text>
            )
          }
          contentContainerStyle={styles.listContent}
        />
      </View>
    </LinearGradient>
  );
}