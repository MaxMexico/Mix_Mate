/* HomeScreen.js */
import React, { useLayoutEffect, useEffect, useState } from "react";
import { FlatList, Text, View, TouchableOpacity, Image, Dimensions, Modal } from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // Import du LinearGradient
import styles from "./styles";
import MenuImage from "../../components/MenuImage/MenuImage";
import allCocktails from "../../../assets/Translation_database.json"; // Import de la BDD

// Import des icônes
import Icon18 from "../../../assets/icons/18.png";
import IconMineur from "../../../assets/icons/mineur.png";
import IconAbus from "../../../assets/icons/abus.png";

export default function HomeScreen(props) {
  const { navigation } = props;
  const [randomCocktails, setRandomCocktails] = useState([]);
  const [showModal, setShowModal] = useState(true);
  const [isAdult, setIsAdult] = useState(null); // null: choix non encore effectué, true: +18, false: non

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <MenuImage
          onPress={() => {
            navigation.openDrawer();
          }}
        />
      ),
      headerRight: () => <View />,
      headerStyle: {
        backgroundColor: "#d8d1e0", // Fond sombre
      },
      headerTintColor: "#F28A1A", // Couleur d'accent
      headerTitleStyle: {
        color: "#2e2e2e", // Texte principal clair
      },
    });
  }, []);

  useEffect(() => {
    const shuffled = [...allCocktails].sort(() => 0.5 - Math.random());
    setRandomCocktails(shuffled.slice(0, 12));
  }, []);

  const onPressRecipe = (item) => {
    navigation.navigate("Recette", { item });
  };

  const renderRecipes = ({ item }) => (
    <TouchableOpacity onPress={() => onPressRecipe(item)} style={styles.container}>
      <View style={styles.innerBorder}>
        <Image style={styles.photo} source={{ uri: item.strDrinkThumb }} />
        <Text style={styles.title}>{item.strDrink}</Text>
        <Text style={styles.category}>{item.strCategory}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      {/* Modal de vérification d'âge */}
      {showModal && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showModal}
          onRequestClose={() => {}}
        >
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <View style={{ backgroundColor: "#ebbcb7", padding: 20, borderRadius: 10, alignItems: "center", width: "80%" }}>
              {isAdult === null && (
                <>
                  <Image source={Icon18} style={{ width: 100, height: 100, marginBottom: 20 }} />
                  <Text style={{ marginBottom: 20, textAlign: "center", fontSize: 16 }}>
                    Avez-vous plus de 18 ans ?
                  </Text>
                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity style={{ margin: 10 }} onPress={() => setIsAdult(true)}>
                      <Text style={{ fontSize: 16 }}>Oui</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ margin: 10 }} onPress={() => setIsAdult(false)}>
                      <Text style={{ fontSize: 16 }}>Non</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
              {isAdult === true && (
                <>
                  <Image source={IconAbus} style={{ width: 100, height: 100, marginBottom: 20 }} />
                  <Text style={{ marginBottom: 20, textAlign: "center", fontSize: 16 }}>
                    L'abus d'alcool est dangereux pour la santé. À consommer avec modération.
                  </Text>
                  <TouchableOpacity onPress={() => setShowModal(false)}>
                    <Text style={{ fontSize: 16, color: "#F28A1A" }}>OK</Text>
                  </TouchableOpacity>
                </>
              )}
              {isAdult === false && (
                <>
                  <Image source={IconMineur} style={{ width: 100, height: 100, marginBottom: 20 }} />
                  <Text style={{ marginBottom: 20, textAlign: "center", fontSize: 16 }}>
                    Accès à l'alcool interdit. Mode mineur activé.
                  </Text>
                  <TouchableOpacity onPress={() => setShowModal(false)}>
                    <Text style={{ fontSize: 16, color: "#F28A1A" }}>OK</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>
      )}

      <LinearGradient
        colors={["#a1628f", "#ebbcb7"]} // Mêmes couleurs que RecoScreen
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={{ flex: 1 }} // Gradient comme arrière-plan principal
      >
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 8 }}
          vertical
          showsVerticalScrollIndicator={false}
          numColumns={2}
          data={randomCocktails}
          renderItem={renderRecipes}
          keyExtractor={(item) => item.idDrink}
        />
      </LinearGradient>
    </>
  );
}
