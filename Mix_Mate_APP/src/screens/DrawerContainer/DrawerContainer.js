import React from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import styles from "./styles";
import MenuButton from "../../components/MenuButton/MenuButton"; // Assure-toi que MenuButton est bien configuré

export default function DrawerContainer(props) {
  const { navigation } = props;
  return (
    <View style={styles.content}>
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
