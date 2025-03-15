/* components/SearchBar/SearchBar.js */
import React from "react";
import { TextInput, StyleSheet, View } from "react-native";

const SearchBar = ({ onSearch, placeholder, style }) => {
  return (
    <View style={[styles.container, style]}>
      <TextInput
        style={styles.input}
        onChangeText={onSearch}
        placeholder={placeholder || "Rechercher..."}
        placeholderTextColor="#aaa"
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="always" // Affiche un bouton pour effacer le texte (iOS)
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 25, // Coins arrondis pour un design moderne
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#fff", // Fond blanc pour contraster avec le gradient
  },
});

export default SearchBar;