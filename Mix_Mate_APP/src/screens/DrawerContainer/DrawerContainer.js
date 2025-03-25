import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./styles";
import MenuButton from "../../components/MenuButton/MenuButton";

export default function DrawerContainer(props) {
  const { navigation } = props;
  const [userMode, setUserMode] = useState(null);

  // Récupère le mode depuis AsyncStorage
  useEffect(() => {
    const loadUserMode = async () => {
      try {
        const storedMode = await AsyncStorage.getItem("userMode");
        if (storedMode !== null) {
          setUserMode(JSON.parse(storedMode));
        }
      } catch (error) {
        console.error("Erreur lors du chargement du mode utilisateur", error);
      }
    };
    loadUserMode();
  }, []);

  return (
    <View style={styles.content}>
      {/* Conteneur centré avec les boutons */}
      <View style={styles.container}>
        <MenuButton
          title="ACCUEIL"
          source={require("../../../assets/icons/home.png")}
          onPress={() => {
            navigation.navigate("Main", { screen: "Accueil" });
            navigation.closeDrawer();
          }}
        />
        <MenuButton
          title="CATEGORIES"
          source={require("../../../assets/icons/category.png")}
          onPress={() => {
            navigation.navigate("Main", { screen: "Catégories" });
            navigation.closeDrawer();
          }}
        />
        <MenuButton
          title="RECHERCHER"
          source={require("../../../assets/icons/search.png")}
          onPress={() => {
            navigation.navigate("Main", { screen: "Rechercher" });
            navigation.closeDrawer();
          }}
        />
        <MenuButton
          title="PROFIL"
          source={require("../../../assets/icons/profile.png")}
          onPress={() => {
            navigation.navigate("Main", { screen: "Profil" });
            navigation.closeDrawer();
          }}
        />
        <MenuButton
          title="COCKTAIL ALEATOIRE"
          source={require("../../../assets/icons/random.png")}
          onPress={() => {
            navigation.navigate("Main", { screen: "Cocktail Aléatoire" });
            navigation.closeDrawer();
          }}
        />
        <MenuButton
          title="CHATBOT"
          source={require("../../../assets/icons/chatbot.png")}
          onPress={() => {
            navigation.navigate("Main", { screen: "Chatbot" });
            navigation.closeDrawer();
          }}
        />
        <MenuButton
          title="RECOMMANDATIONS"
          source={require("../../../assets/icons/recommendation.png")}
          onPress={() => {
            navigation.navigate("Main", { screen: "Recommandations" });
            navigation.closeDrawer();
          }}
        />
        <MenuButton
          title="FORUM"
          source={require("../../../assets/icons/forum.png")}
          onPress={() => {
            navigation.navigate("Main", { screen: "Forum" });
            navigation.closeDrawer();
          }}
        />
      </View>

      {/* Texte du mode tout en bas du drawer */}
      <View style={styles.modeContainer}>
        {userMode !== null && (
          <Text style={styles.modeText}>
            {userMode ? "Mode: Majeur" : "Mode: Mineur"}
          </Text>
        )}
      </View>
    </View>
  );
}

DrawerContainer.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    closeDrawer: PropTypes.func.isRequired,
  }),
};
