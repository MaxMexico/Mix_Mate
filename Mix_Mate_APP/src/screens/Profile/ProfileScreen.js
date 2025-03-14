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
import allCocktails from "../../../assets/all_cocktails.json"; 

const profileImages = [
  require("../../../assets/Profile1.png"),
  require("../../../assets/Profile2.png"),
  require("../../../assets/Profile3.png"),
  require("../../../assets/Profile4.png"),
];

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    email: "",
    favoriteCocktails: [],
  });

  const [profileImage, setProfileImage] = useState(profileImages[0]);
  const [isSelectingImage, setIsSelectingImage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCocktails, setFilteredCocktails] = useState([]);

  // 📌 Sauvegarde le profil
  const saveProfile = async () => {
    try {
      await AsyncStorage.setItem("userProfile", JSON.stringify(profile));
      console.log("Profil sauvegardé !");
    } catch (error) {
      console.log("Erreur lors de la sauvegarde :", error);
    }
  };

  // 📌 Ajoute un cocktail préféré
  const addFavoriteCocktail = (cocktail) => {
    if (!profile.favoriteCocktails.includes(cocktail.strDrink)) {
      const updatedProfile = {
        ...profile,
        favoriteCocktails: [...profile.favoriteCocktails, cocktail.strDrink],
      };
      setProfile(updatedProfile);
      saveProfile();
      setSearchQuery(""); // Réinitialise la recherche
      setFilteredCocktails([]);
    }
  };

  // 📌 Supprime un cocktail préféré
  const removeFavoriteCocktail = (cocktail) => {
    const updatedProfile = {
      ...profile,
      favoriteCocktails: profile.favoriteCocktails.filter((fav) => fav !== cocktail),
    };
    setProfile(updatedProfile);
    saveProfile();
  };

  // 📌 Filtrage des cocktails selon la recherche
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
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Image de profil */}
      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={() => setIsSelectingImage(!isSelectingImage)}>
          <Image style={styles.profileImage} source={profileImage} />
        </TouchableOpacity>

        {isSelectingImage && (
          <FlatList
            data={profileImages}
            horizontal
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setProfileImage(item);
                  setIsSelectingImage(false);
                }}
              >
                <Image source={item} style={[styles.profileImage, { width: 80, height: 80, margin: 5 }]} />
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
            <Text style={styles.profileName}>{profile.name || "Nom"}</Text>
            <Text style={styles.profileUsername}>@{profile.username || "Pseudo"}</Text>
            <Text style={styles.profileEmail}>{profile.email || "Email"}</Text>
          </>
        )}
      </View>

      {/* 📌 Liste déroulante des résultats de recherche vers le haut */}
      {filteredCocktails.length > 0 && (
        <FlatList
          data={filteredCocktails}
          keyExtractor={(item) => item.idDrink}
          style={styles.searchResultsContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.searchResult}
              onPress={() => addFavoriteCocktail(item)}
            >
              <Text style={styles.searchText}>{item.strDrink}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* 📌 Barre de recherche */}
      <Text style={styles.sectionTitle}>Ajouter un cocktail préféré :</Text>
      <TextInput
        style={styles.input}
        placeholder="Rechercher un cocktail..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* 📌 Cocktails préférés maintenant en dessous */}
      <Text style={styles.sectionTitle}>Cocktails Préférés</Text>
      <FlatList
        data={profile.favoriteCocktails}
        renderItem={({ item }) => (
          <View style={styles.favoriteItem}>
            <Text style={styles.sectionContent}>{item}</Text>
            <TouchableOpacity onPress={() => removeFavoriteCocktail(item)}>
              <Text style={styles.removeText}>❌</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      {/* Bouton Modifier (remonté de quelques pixels) */}
      <Pressable
        style={[styles.editButton, { marginBottom: 30 }]}
        onPress={() => {
          if (isEditing) saveProfile();
          setIsEditing(!isEditing);
        }}
      >
        <Text style={styles.editButtonText}>{isEditing ? "Sauvegarder" : "Modifier"}</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}
