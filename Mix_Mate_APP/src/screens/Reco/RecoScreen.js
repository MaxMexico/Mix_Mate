import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  Dimensions,
  ScrollView  // Import du ScrollView
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Stockage local
import Carousel from "react-native-snap-carousel"; // Import du Carousel
import { LinearGradient } from "expo-linear-gradient"; // Import de LinearGradient
import allCocktails from "../../../assets/all_cocktails.json"; // Base des cocktails

// Récupère la largeur de l'écran pour configurer le carrousel
const { width } = Dimensions.get("window");

export default function RecoScreen({ navigation }) {
  const [preference, setPreference] = useState("");
  const [recommendedCocktails, setRecommendedCocktails] = useState([]);
  const [fcRecommendedCocktails, setFcRecommendedCocktails] = useState([]);
  
  const [profiles, setProfiles] = useState([]);         // Liste des profils récupérés via l'API
  const [selectedProfile, setSelectedProfile] = useState(null); // Profil choisi
  const [showDropdown, setShowDropdown] = useState(false);      // Contrôle l'affichage du menu déroulant

  // Au chargement, on récupère la liste des profils depuis l'API
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch("http://192.168.1.124:5000/api/get_all_profiles");
        if (response.ok) {
          const data = await response.json();
          setProfiles(data.profiles || []);
        } else {
          console.error("Erreur lors de la récupération des profils :", response.status);
        }
      } catch (error) {
        console.error("Erreur réseau lors de la récupération des profils :", error);
      }
    };
    fetchProfiles();
  }, []);

  // Fonction de demande de recommandations CB
  const handleRecommendation = async () => {
    if (!selectedProfile || !preference) {
      Alert.alert("Attention", "Veuillez sélectionner un profil et renseigner votre préférence.");
      return;
    }
  
    if (!selectedProfile.favoriteCocktails || selectedProfile.favoriteCocktails.length === 0) {
      Alert.alert("Attention", "Le profil sélectionné ne contient aucun cocktail favori.");
      return;
    }
  
    const formattedPreference = preference === "Alcoolisée" ? "Alcoholic" : "Non Alcoholic";
  
    const payload = {
      favoriteCocktails: selectedProfile.favoriteCocktails,
      alcoholicPreference: formattedPreference,
      desiredCategory: null,
      topN: 5
    };
  
    try {
      const response = await fetch("http://192.168.1.124:5000/api/CB_recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data.error) {
        console.error("Erreur API :", data.error);
        Alert.alert("Erreur", data.error);
        return;
      }
      const recommendedNames = data.recommendedDrinks.map(drink => drink.strDrink);
      // Comparaison insensible à la casse
      const recommendations = allCocktails.filter((cocktail) =>
        recommendedNames.some(name => name.trim().toLowerCase() === cocktail.strDrink.trim().toLowerCase())
      );
      setRecommendedCocktails(recommendations);
      await AsyncStorage.setItem("recommendedCocktails", JSON.stringify(recommendations));
    } catch (error) {
      console.error("Erreur lors de la récupération des recommandations :", error);
    }
  };

  // Fonction de demande de recommandations FC
  const handleFCRecommendation = async () => {
    if (!selectedProfile || !preference) {
      Alert.alert("Attention", "Veuillez sélectionner un profil et renseigner votre préférence.");
      return;
    }
  
    if (!selectedProfile.favoriteCocktails || selectedProfile.favoriteCocktails.length === 0) {
      Alert.alert("Attention", "Le profil sélectionné ne contient aucun cocktail favori.");
      return;
    }
  
    const formattedPreference = preference === "Alcoolisée" ? "Alcoholic" : "Non Alcoholic";
  
    const payload = {
      userLikedCocktails: selectedProfile.favoriteCocktails,
      alcoholicPreference: formattedPreference,
      desiredCategory: null,
      topN: 5,
    };
  
    try {
      const response = await fetch("http://192.168.1.124:5000/api/FC_recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data.error) {
        console.error("Erreur API FC :", data.error);
        Alert.alert("Erreur", data.error);
        return;
      }
      const recommendedNames = data.recommendedDrinks.map((drink) => drink.strDrink);
      const recommendations = allCocktails.filter((cocktail) =>
        recommendedNames.some(name => name.trim().toLowerCase() === cocktail.strDrink.trim().toLowerCase())
      );
      setFcRecommendedCocktails(recommendations);
      await AsyncStorage.setItem("fcRecommendedCocktails", JSON.stringify(recommendations));
    } catch (error) {
      console.error("Erreur lors de la récupération des recommandations FC :", error);
    }
  };

  // Fonction combinée pour appeler les deux reco en même temps
  const handleCombinedRecommendation = () => {
    handleRecommendation();
    handleFCRecommendation();
  };

  // Fonction de rendu pour chaque item du carrousel
  const renderCarouselItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("Recette", { item })}
        style={styles.cocktailCard}
      >
        <Image source={{ uri: item.strDrinkThumb }} style={styles.cocktailImage} />
        <Text style={styles.cocktailName}>{item.strDrink}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
    colors={["#a1628f", "#ebbcb7"]}
    start={{ x: 0, y: 1 }}
    end={{ x: 1, y: 0 }}
    style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container} nestedScrollEnabled={true}>
        <Text style={styles.header}>Recommandations de Cocktails</Text>
        
        {/* Dropdown pour sélectionner un profil */}
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowDropdown(!showDropdown)}
        >
          <Text style={styles.dropdownText}>
            {selectedProfile ? selectedProfile.username : "Sélectionner un profil"}
          </Text>
        </TouchableOpacity>
        {showDropdown && (
          <FlatList
            data={profiles}
            keyExtractor={(item, index) => index.toString()}
            style={styles.dropdownList}
            nestedScrollEnabled={true}  // Ajout de nestedScrollEnabled ici
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedProfile(item);
                  setShowDropdown(false);
                }}
              >
                <Text style={styles.dropdownItem}>{item.username}</Text>
              </TouchableOpacity>
            )}
          />
        )}
        
        {/* Sélection de la préférence */}
        <Text style={styles.label}>Préférence :</Text>
        <View style={styles.preferenceContainer}>
          <TouchableOpacity
            style={[styles.preferenceButton, preference === "Alcoolisée" ? styles.activeButton : null]}
            onPress={() => setPreference("Alcoolisée")}
          >
            <Text style={styles.preferenceText}>Alcoolisée</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.preferenceButton, preference === "Sans alcool" ? styles.activeButton : null]}
            onPress={() => setPreference("Sans alcool")}
          >
            <Text style={styles.preferenceText}>Sans alcool</Text>
          </TouchableOpacity>
        </View>
        
        {/* Bouton unique appelant les deux reco */}
        <Button title="🔍 Trouver des cocktails" onPress={handleCombinedRecommendation} />

        {/* Carousel pour la reco basée sur le contenu (CB) */}
        {recommendedCocktails.length > 0 && (
          <View style={{ marginTop: 20 }}>
            <Text style={styles.header}>Vous allez aimer</Text>
            {/* Enveloppez le Carousel dans une View à hauteur fixe */}
            <View style={{ height: 210 }}>  
              <Carousel
                layout="default"
                data={recommendedCocktails}
                renderItem={renderCarouselItem}
                sliderWidth={width}
                itemWidth={150}
                inactiveSlideScale={0.95}
                inactiveSlideOpacity={0.7}
                activeSlideAlignment="start"
              />
            </View>
          </View>
        )}


        {/* Carousel pour la reco collaborative (FC) */}
        {fcRecommendedCocktails.length > 0 && (
          <View style={{ marginTop: 20, marginBottom: 30 }}>
            <Text style={styles.header}>Les autres ont aimé aussi</Text>
            <View style={{ height: 210 }}>  
              <Carousel
                layout="default"
                data={fcRecommendedCocktails}
                renderItem={renderCarouselItem}
                sliderWidth={width}
                itemWidth={150}
                inactiveSlideScale={0.95}
                inactiveSlideOpacity={0.7}
                activeSlideAlignment="start"
              />
            </View>
          </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,  // Permet au ScrollView de s'étendre avec le contenu
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  dropdown: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#d8d1e0",
    borderRadius: 5,
    backgroundColor: "#d8d1e0",
    marginBottom: 20,
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownList: {
    width: "100%",
    maxHeight: 150,
    borderWidth: 1,
    borderColor: "#d8d1e0",
    borderRadius: 5,
    backgroundColor: "#d8d1e0",
    marginBottom: 20,
  },
  dropdownItem: {
    padding: 10,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
  },
  preferenceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  preferenceButton: {
    width: "45%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9dd5f5",
  },
  activeButton: {
    backgroundColor: "#007BFF",
  },
  preferenceText: {
    fontSize: 16,
    color: "#fff",
  },
  cocktailCard: {
    backgroundColor: "#d8d1e0",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    width: 150,
    height: 190,
  },
  cocktailImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  cocktailName: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
});
