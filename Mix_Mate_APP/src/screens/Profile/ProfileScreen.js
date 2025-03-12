import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  FlatList,
  TouchableOpacity,
} from "react-native";
import styles from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Stockage local
import allCocktails from "../../../assets/all_cocktails.json"; // Base des cocktails
import userProfileData from "../../../assets/userProfile.json"; // Charger les données initiales

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

  const [profileImage, setProfileImage] = useState(profileImages[0]); // Gestion des images de profil
  const [isSelectingImage, setIsSelectingImage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCocktails, setFilteredCocktails] = useState([]);

  // 📌 Charger les données utilisateur
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const savedProfile = await AsyncStorage.getItem("userProfile");
        if (savedProfile) {
          setProfile(JSON.parse(savedProfile));
        } else {
          setProfile(userProfileData); // Charger le JSON initial
          await AsyncStorage.setItem("userProfile", JSON.stringify(userProfileData));
        }
      } catch (error) {
        console.log("Erreur lors du chargement du profil :", error);
      }
    };

    loadProfile();
  }, []);

  // 📌 Sauvegarder le profil
  const saveProfile = async () => {
    try {
      await AsyncStorage.setItem("userProfile", JSON.stringify(profile));
      console.log("Profil sauvegardé :", profile);
    } catch (error) {
      console.log("Erreur lors de la sauvegarde :", error);
    }
  };

  // 📌 Ajouter un cocktail aux favoris
  const addFavoriteCocktail = (cocktail) => {
    if (!profile.favoriteCocktails.includes(cocktail.strDrink)) {
      const updatedProfile = {
        ...profile,
        favoriteCocktails: [...profile.favoriteCocktails, cocktail.strDrink],
      };
      setProfile(updatedProfile);
      saveProfile();
    }
  };

  // 📌 Supprimer un cocktail favori
  const removeFavoriteCocktail = (cocktail) => {
    const updatedProfile = {
      ...profile,
      favoriteCocktails: profile.favoriteCocktails.filter((fav) => fav !== cocktail),
    };
    setProfile(updatedProfile);
    saveProfile();
  };

  // 📌 Recherche de cocktails
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
    <View style={styles.container}>
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
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileUsername}>@{profile.username}</Text>
            <Text style={styles.profileEmail}>{profile.email}</Text>
          </>
        )}
      </View>

      {/* Cocktails préférés */}
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

      {/* Barre de recherche */}
      <Text style={styles.sectionTitle}>Ajouter un cocktail préféré :</Text>
      <TextInput
        style={styles.input}
        placeholder="Rechercher un cocktail..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Résultats de recherche */}
      {filteredCocktails.length > 0 ? (
        <FlatList
          data={filteredCocktails}
          keyExtractor={(item) => item.idDrink}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.searchResult}
              onPress={() => addFavoriteCocktail(item)}
            >
              <Text style={styles.searchText}>{item.strDrink}</Text>
            </TouchableOpacity>
          )}
        />
      ) : searchQuery.trim() !== "" && (
        <Text style={styles.noResults}>Aucun cocktail trouvé.</Text>
      )}

      {/* Bouton Modifier */}
      <Pressable
        style={styles.editButton}
        onPress={() => {
          if (isEditing) saveProfile();
          setIsEditing(!isEditing);
        }}
      >
        <Text style={styles.editButtonText}>{isEditing ? "Sauvegarder" : "Modifier"}</Text>
      </Pressable>
    </View>
  );
}