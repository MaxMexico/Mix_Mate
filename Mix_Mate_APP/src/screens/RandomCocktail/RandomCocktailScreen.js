/* RandomCocktailScreen.js */
import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import cocktailsData from "../../../assets/Translation_database.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./styles"; // Assurez-vous que ce fichier contient vos styles habituels

export default function RandomCocktailScreen() {
  const [cocktail, setCocktail] = useState(null);
  const [isAdult, setIsAdult] = useState(null);

  // Fonction pour obtenir un cocktail aléatoire selon le mode utilisateur
  const getRandomCocktail = () => {
    let data = cocktailsData;
    if (isAdult === false) {
      // En mode mineur, filtrer pour n'afficher que les cocktails non alcoolisés
      data = cocktailsData.filter((c) => c.strAlcoholic === "Non alcoholic");
    }
    if (data.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.length);
      setCocktail(data[randomIndex]);
    } else {
      setCocktail(null);
    }
  };

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

  // Obtenir un cocktail aléatoire dès que le mode est chargé
  useEffect(() => {
    if (isAdult !== null) {
      getRandomCocktail();
    }
  }, [isAdult]);

  // Affichage d'un loader tant que le mode ou le cocktail n'est pas chargé
  if (isAdult === null || cocktail === null) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.title}>Chargement...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#a1628f", "#ebbcb7"]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container}>
        
        <View style={styles.cocktailContainer}>
          <Image
            source={{ uri: cocktail.strDrinkThumb }}
            style={styles.cocktailImage}
          />
          <Text style={styles.title}>{cocktail.strDrink}</Text>
          <Text style={styles.category}>{cocktail.strCategory}</Text>
          <Text style={styles.instructionsTitle}>Recette :</Text>
          <Text style={styles.instructions}>
            {cocktail.strInstructionsFR || cocktail.strInstructions}
          </Text>
          <Text style={styles.ingredientsTitle}>Ingrédients :</Text>
          <View style={styles.ingredientsContainer}>
            {Array.from({ length: 15 }, (_, i) => i + 1).map((num) => {
              const ingredient = cocktail[`strIngredient${num}`];
              const measure = cocktail[`strMeasure${num}`];
              return ingredient ? (
                <Text key={num} style={styles.ingredientText}>
                  {measure ? `${measure} ` : ""}{ingredient}
                </Text>
              ) : null;
            })}
          </View>
          <TouchableOpacity style={styles.randomButton} onPress={getRandomCocktail}>
            <Image
              source={require("../../../assets/icons/random_white.png")}
              style={styles.randomButtonIcon}
            />
            <Text style={styles.randomButtonText}>Nouveau Cocktail</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </LinearGradient>
  );
}
