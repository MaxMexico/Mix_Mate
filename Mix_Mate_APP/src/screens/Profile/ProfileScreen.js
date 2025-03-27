import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import styles from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import allCocktails from "../../../assets/Translation_database.json"; // Import de la BDD

// Tableau associant le nom d'image à son import
const profileImages = [
  { name: "Profile1.png", image: require("../../../assets/Profile1.png") },
  { name: "Profile2.png", image: require("../../../assets/Profile2.png") },
  { name: "Profile3.png", image: require("../../../assets/Profile3.png") },
  { name: "Profile4.png", image: require("../../../assets/Profile4.png") },
];

// Fonction utilitaire pour récupérer l'image en fonction du nom stocké
const getProfileImage = (imageName) => {
  const found = profileImages.find((img) => img.name === imageName);
  return found ? found.image : require("../../../assets/Profile1.png");
};

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    email: "",
    favoriteCocktails: [],
    profileImage: "Profile1.png", // Valeur par défaut
  });
  const [profileImageName, setProfileImageName] = useState("Profile1.png");
  const [isSelectingImage, setIsSelectingImage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCocktails, setFilteredCocktails] = useState([]);

  // Charger le profil existant depuis AsyncStorage au démarrage
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem("userProfile");
        if (storedProfile) {
          const parsedProfile = JSON.parse(storedProfile);
          setProfile(parsedProfile);
          if (parsedProfile.profileImage) {
            setProfileImageName(parsedProfile.profileImage);
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement du profil :", error);
      }
    };
    loadProfile();
  }, []);

  /**
   * Fonction pour sauvegarder le profil et l'envoyer à l'API Flask.
   * On peut lui passer un profil en paramètre pour être sûr d'envoyer
   * la version mise à jour. Sinon, on utilise la valeur de l'état `profile`.
   */
  const saveProfile = async (profileToSave) => {
    const finalProfile = profileToSave || profile;
    try {
      await AsyncStorage.setItem("userProfile", JSON.stringify(finalProfile));
      console.log("Profil sauvegardé localement :", finalProfile);
      const apiUrl = "http://10.4.245.217:5000/api/profile";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalProfile),
      });
      if (response.ok) {
        const result = await response.json();
        console.log("Réponse de l'API :", result);
      } else {
        console.error("Erreur API :", response.status, response.statusText);
      }
    } catch (error) {
      console.log("Erreur lors de la sauvegarde :", error);
    }
  };

  // Ajoute un cocktail préféré
  const addFavoriteCocktail = async (cocktail) => {
    if (!profile.favoriteCocktails.includes(cocktail.strDrink)) {
      const updatedProfile = {
        ...profile,
        favoriteCocktails: [...profile.favoriteCocktails, cocktail.strDrink],
      };
      setProfile(updatedProfile);
      await saveProfile(updatedProfile);
      setSearchQuery("");
      setFilteredCocktails([]);
    }
  };

  // Supprime un cocktail préféré
  const removeFavoriteCocktail = async (cocktailName) => {
    const updatedProfile = {
      ...profile,
      favoriteCocktails: profile.favoriteCocktails.filter(
        (fav) => fav !== cocktailName
      ),
    };
    setProfile(updatedProfile);
    await saveProfile(updatedProfile);
  };

  // Filtrage des cocktails selon la recherche
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCocktails([]);
    } else {
      const filtered = allCocktails.filter((cocktail) =>
        cocktail.strDrink.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCocktails(filtered);
    }
  }, [searchQuery]);

  return (
    <LinearGradient
      colors={["#a1628f", "#ebbcb7"]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Image de profil */}
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={() => setIsSelectingImage(!isSelectingImage)}>
            <Image
              style={styles.profileImage}
              source={getProfileImage(profileImageName)}
            />
          </TouchableOpacity>
          {isSelectingImage && (
            <FlatList
              data={profileImages}
              horizontal
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setProfileImageName(item.name);
                    const updatedProfile = { ...profile, profileImage: item.name };
                    setProfile(updatedProfile);
                    saveProfile(updatedProfile);
                    setIsSelectingImage(false);
                  }}
                >
                  <Image
                    source={item.image}
                    style={[styles.profileImage, { width: 80, height: 80, margin: 5 }]}
                  />
                </TouchableOpacity>
              )}
            />
          )}
        </View>

        {/* Infos Profil */}
        <View style={styles.profileInfo}>
          {isEditing ? (
            <View style={styles.editFields}>
              <TextInput
                style={styles.input}
                value={profile.name}
                onChangeText={(text) => setProfile({ ...profile, name: text })}
                placeholder="Nom"
              />
              <TextInput
                style={styles.input}
                value={profile.username}
                onChangeText={(text) => setProfile({ ...profile, username: text })}
                placeholder="Pseudo"
              />
              <TextInput
                style={styles.input}
                value={profile.email}
                onChangeText={(text) => setProfile({ ...profile, email: text })}
                placeholder="Email"
                keyboardType="email-address"
              />
            </View>
          ) : (
            <>
              <Text style={styles.profileName}>{profile.name || "Jhon"}</Text>
              <Text style={styles.profileUsername}>@{profile.username || "MixMateDemo"}</Text>
              <Text style={styles.profileEmail}>{profile.email || "Demo@MixMate.fr"}</Text>
            </>
          )}
        </View>

        {/* Barre de recherche pour ajouter un cocktail préféré */}
        <Text style={styles.sectionTitle}>Ajouter un cocktail préféré :</Text>
        <TextInput
          style={styles.input}
          placeholder="Rechercher un cocktail..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Liste déroulante des résultats de recherche avec image en rond et nom */}
        {filteredCocktails.length > 0 && (
          <FlatList
            keyboardShouldPersistTaps="always"
            data={filteredCocktails}
            keyExtractor={(item) => item.idDrink}
            style={styles.searchResultsContainer}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.cocktailItem}
                onPress={() => addFavoriteCocktail(item)}
              >
                <Image
                  source={{ uri: item.strDrinkThumb }}
                  style={styles.cocktailImage}
                />
                <Text style={styles.cocktailName}>{item.strDrink}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        {/* Liste des cocktails préférés affichée comme dans Search (avec image et nom)
            En cliquant sur un élément, on navigue vers l'écran de recette */}
        <Text style={[styles.sectionTitle, { textAlign: "left", alignSelf: "flex-start" }]}>
          Cocktails Préférés
        </Text>
        <FlatList
          data={profile.favoriteCocktails}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            const cocktailData = allCocktails.find(
              (cocktail) =>
                cocktail.strDrink.toLowerCase() === item.toLowerCase()
            );
            return (
              <View style={styles.favoriteItem}>
                <TouchableOpacity
                  style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
                  onPress={() =>
                    navigation.navigate("Recette", { item: cocktailData })
                  }
                >
                  {cocktailData && (
                    <Image
                      source={{ uri: cocktailData.strDrinkThumb }}
                      style={styles.cocktailImage}
                    />
                  )}
                  <Text style={styles.cocktailName}>{item}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeFavoriteCocktail(item)}>
                  <Image
                    source={require("../../../assets/icons/delete.png")}
                    style={styles.deleteIcon}
                  />
                </TouchableOpacity>
              </View>
            );
          }}
        />

        {/* Bouton Modifier */}
        <Pressable
          style={[styles.editButton, { marginBottom: 30 }]}
          onPress={async () => {
            if (isEditing) {
              await saveProfile();
            }
            setIsEditing(!isEditing);
          }}
        >
          <Text style={styles.editButtonText}>
            {isEditing ? "Sauvegarder" : "Modifier"}
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
