import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import styles from "./styles"; // 🔥 Import du fichier de styles

export default function CarouselCard({ cocktail }) {
  return (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: cocktail.strDrinkThumb }} style={styles.image} />
      <Text style={styles.name}>{cocktail.strDrink}</Text>
    </TouchableOpacity>
  );
}
