import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Stockage local
import allCocktails from "../../../assets/all_cocktails.json"; // Import de la BDD locale

export default function RecoScreen({ navigation }) {
  const [flavorProfile, setFlavorProfile] = useState("");
  const [preference, setPreference] = useState("");
  const [recommendedCocktails, setRecommendedCocktails] = useState([]);

  // 📌 Fonction pour envoyer les données du profil à l'API
  const sendProfileToAPI = async () => {
    try {
      // Charger les données du profil depuis AsyncStorage
      const savedProfile = await AsyncStorage.getItem("userProfile");
      if (!savedProfile) {
        console.error("Aucun profil trouvé dans AsyncStorage.");
        return;
      }

      const profileData = JSON.parse(savedProfile);

      // Préparer les données à envoyer
      const profileToSend = {
        name: profileData.name,
        username: profileData.username,
        email: profileData.email,
        favoriteCocktails: profileData.favoriteCocktails,
      };

      // URL de l'API (remplacez par votre URL réelle)
      const apiUrl = "https://votre-api.com/profile";

      // Effectuer la requête POST
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileToSend),
      });

      // Vérifier la réponse de l'API
      if (response.ok) {
        const result = await response.json();
        console.log("Réponse de l'API :", result);
        Alert.alert("Succès", "Votre profil a été envoyé avec succès !");
      } else {
        console.error("Erreur lors de l'envoi du profil :", response.status, response.statusText);
        Alert.alert("Erreur", "Une erreur est survenue lors de l'envoi du profil.");
      }
    } catch (error) {
      console.error("Erreur réseau ou API :", error);
      Alert.alert("Erreur", "Impossible de se connecter au serveur.");
    }
  };

  // 📌 Gestion des recommandations
  const handleRecommendation = async () => {
    if (!flavorProfile || !preference) {
      alert("Veuillez renseigner votre profil de saveur et votre préférence.");
      return;
    }

    // Envoyer les données du profil avant de faire la recommandation
    await sendProfileToAPI();

    // 🔥 Normalisation de la préférence
    const formattedPreference = preference === "Alcoolisée" ? "Alcoholic" : "Non Alcoholic";

    try {
      const response = await fetch("https://ton-serveur.com/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flavorProfile,
          preference: formattedPreference,
        }),
      });

      const data = await response.json(); // Récupération de la réponse JSON
      const recommendedIds = data.recommendedDrinks; // ["17222", "11007", ...]

      // Filtrage des cocktails dans la base locale
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

      {/* Saisie du profil de saveur */}
      <Text style={styles.label}>Profil de saveur :</Text>
      <TextInput
        style={styles.input}
        value={flavorProfile}
        onChangeText={setFlavorProfile}
        placeholder="Ex. Fruité, épicé, amer..."
      />

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
          style={[
            styles.preferenceButton,
            preference === "Sans alcool" ? styles.activeButton : null,
          ]}
          onPress={() => setPreference("Sans alcool")}
        >
          <Text style={styles.preferenceText}>Sans alcool</Text>
        </TouchableOpacity>
      </View>

      {/* Bouton pour obtenir les recommandations */}
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
  label: {
    fontSize: 16,
    marginVertical: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: "#fff",
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