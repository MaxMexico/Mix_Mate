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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Stockage local
import allCocktails from "../../../assets/all_cocktails.json"; // Base des cocktails

export default function RecoScreen({ navigation }) {
  // On supprime flavorProfile et on ajoute l'état pour les profils
  const [preference, setPreference] = useState("");
  const [recommendedCocktails, setRecommendedCocktails] = useState([]);
  
  const [profiles, setProfiles] = useState([]);         // Liste des profils récupérés via l'API
  const [selectedProfile, setSelectedProfile] = useState(null); // Profil choisi
  const [showDropdown, setShowDropdown] = useState(false);      // Contrôle l'affichage du menu déroulant

  // Au chargement, on récupère la liste des profils depuis l'API
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        // Remplacez l'URL par celle de votre endpoint qui renvoie tous les profils
        const response = await fetch("http://192.168.1.55:5000/api/get_all_profiles");
        if (response.ok) {
          const data = await response.json();
          // On suppose que l'API renvoie { profiles: [ {username: ..., name: ...}, ... ] }
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

  // La fonction pour envoyer le profil à l'API (si besoin) reste inchangée ou peut être adaptée
  const sendProfileToAPI = async (profileData) => {
    try {
      // Exemple d'URL (à adapter)
      const apiUrl = "http://192.168.1.55:5000/api/get_all_profiles";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
      if (response.ok) {
        const result = await response.json();
        console.log("Réponse de l'API :", result);
        Alert.alert("Succès", "Profil envoyé avec succès !");
      } else {
        console.error("Erreur lors de l'envoi du profil :", response.status, response.statusText);
        Alert.alert("Erreur", "Une erreur est survenue lors de l'envoi du profil.");
      }
    } catch (error) {
      console.error("Erreur réseau ou API :", error);
      Alert.alert("Erreur", "Impossible de se connecter au serveur.");
    }
  };

  // Fonction de demande de recommandations
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
  
    console.log("Payload envoyé à /api/recommendations :", payload);
  
    try {
      const response = await fetch("http://192.168.1.55:5000/api/recommendations", {
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
      console.log("Réponse de l'API :", data);
      const recommendedIds = data.recommendedDrinks; // Exemple : ["17222", "11007", ...]
      const recommendations = allCocktails.filter((cocktail) =>
        recommendedIds.includes(cocktail.idDrink)
      );
      setRecommendedCocktails(recommendations);
    } catch (error) {
      console.error("Erreur lors de la récupération des recommandations :", error);
    }
  };
  
  

  return (
    <View style={styles.container}>
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
      
      {/* Suppression de la saisie du profil de saveur */}
      
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
      
      <Button title="🔍 Trouver des cocktails" onPress={handleRecommendation} />

      {/* Affichage des recommandations */}
      {recommendedCocktails.length > 0 && (
        <FlatList
          data={recommendedCocktails}
          keyExtractor={(item) => item.idDrink}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("Recipe", { item })}
              style={styles.cocktailCard}
            >
              <Image source={{ uri: item.strDrinkThumb }} style={styles.cocktailImage} />
              <Text style={styles.cocktailName}>{item.strDrink}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
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
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownList: {
    width: "100%",
    maxHeight: 150,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
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
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    alignItems: "center",
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
