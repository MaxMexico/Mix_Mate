/* HomeScreen.js */
import React, { useLayoutEffect, useEffect, useState } from "react";
import { FlatList, Text, View, TouchableOpacity, Image, Modal } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from "./styles";
import MenuImage from "../../components/MenuImage/MenuImage";
import allCocktails from "../../../assets/Translation_database.json";
import Logo from "../../../assets/icons/logo.png";

// Import des icônes
import Icon18 from "../../../assets/icons/18.png";
import IconMineur from "../../../assets/icons/mineur.png";
import IconAbus from "../../../assets/icons/abus.png";

export default function HomeScreen(props) {
  const { navigation } = props;
  const [randomCocktails, setRandomCocktails] = useState([]);
  const [showModal, setShowModal] = useState(true);
  const [isAdult, setIsAdult] = useState(null); // null: choix non encore effectué, true: majeur, false: mineur

  // Charger le mode utilisateur sauvegardé (si existant)
  useEffect(() => {
    const loadUserMode = async () => {
      try {
        const storedMode = await AsyncStorage.getItem('userMode');
        if (storedMode !== null) {
          setIsAdult(JSON.parse(storedMode));
          setShowModal(false);
        }
      } catch (error) {
        console.error("Erreur lors du chargement du mode utilisateur", error);
      }
    };
    loadUserMode();
  }, []);

  // Fonction pour sauvegarder le mode utilisateur
  const storeUserMode = async (mode) => {
    try {
      await AsyncStorage.setItem('userMode', JSON.stringify(mode));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du mode utilisateur", error);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <MenuImage
          onPress={() => {
            navigation.openDrawer();
          }}
        />
      ),
      headerRight: () => (
        <Image
          source={Logo}
          style={{ width: 80, height: 80, marginRight: 10 }}
        />
      ),
      headerStyle: {
        backgroundColor: "#d8d1e0",
      },
      headerTintColor: "#F28A1A",
      headerTitleStyle: {
        color: "#2e2e2e",
      },
    });
  }, []);

  // Chargement et filtrage des cocktails en fonction du mode utilisateur
  useEffect(() => {
    if (isAdult !== null) { // On attend que le choix soit effectué
      let cocktails = [...allCocktails];
      if (!isAdult) {
        // Si l'utilisateur est mineur, filtrer pour n'afficher que les cocktails non alcoolisés
        cocktails = cocktails.filter(cocktail => cocktail.strAlcoholic === 'Non alcoholic');
      }
      const shuffled = cocktails.sort(() => 0.5 - Math.random());
      setRandomCocktails(shuffled.slice(0, 12));
    }
  }, [isAdult]);

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
                    <TouchableOpacity
                      style={{ margin: 10 }}
                      onPress={() => {
                        setIsAdult(true);
                        storeUserMode(true);
                      }}
                    >
                      <Text style={{ fontSize: 16 }}>Oui</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ margin: 10 }}
                      onPress={() => {
                        setIsAdult(false);
                        storeUserMode(false);
                      }}
                    >
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
        colors={["#a1628f", "#ebbcb7"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={{ flex: 1 }}
      >
        {/* Bannière affichée seulement en mode mineur */}
        {isAdult === false && (
          <View style={{ backgroundColor: "#F28A1A", paddingVertical: 5 }}>
            <Text style={{ textAlign: "center", color: "#fff", fontSize: 12 }}>
              Mode mineur activé
            </Text>
          </View>
        )}

        <FlatList
          contentContainerStyle={{ paddingHorizontal: 8 }}
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
