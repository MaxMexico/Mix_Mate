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
          title="HOME"
          source={require("../../../assets/icons/home.png")}
          onPress={() => {
            navigation.navigate("Main", { screen: "Home" });
            navigation.closeDrawer();
          }}
        />
        <MenuButton
          title="CATEGORIES"
          source={require("../../../assets/icons/category.png")}
          onPress={() => {
            navigation.navigate("Main", { screen: "Categories" });
            navigation.closeDrawer();
          }}
        />
        <MenuButton
          title="SEARCH"
          source={require("../../../assets/icons/search.png")}
          onPress={() => {
            navigation.navigate("Main", { screen: "Search" });
            navigation.closeDrawer();
          }}
        />
        <MenuButton
          title="PROFILE"
          source={require("../../../assets/icons/profile.png")}
          onPress={() => {
            navigation.navigate("Main", { screen: "Profile" });
            navigation.closeDrawer();
          }}


        />
        <MenuButton
          title="COCKTAIL ALEATOIRE 🍸"
          source={require("../../../assets/icons/random.png")}
          onPress={() => {
            navigation.navigate("Main", { screen: "RandomCocktail" });
            navigation.closeDrawer();
          }}
        />
        <MenuButton
          title="CHATBOT 💬"
          source={require("../../../assets/icons/chatbot.png")}
          onPress={() => {
            navigation.navigate("Main", { screen: "Chatbot" });
            navigation.closeDrawer();
          }}
        />
        <MenuButton
          title="RECOMMANDATION 🍹"
          source={require("../../../assets/icons/recommendation.png")}
          onPress={() => {
            navigation.navigate("Main", { screen: "Reco" });
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
