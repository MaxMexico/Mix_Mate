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
  Dimensions,
  ScrollView,
  Modal,
  TextInput
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Carousel from "react-native-snap-carousel";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from "@react-native-picker/picker";
import allCocktails from "../../../assets/Translation_database.json"; // Import de la BDD

// Récupère la largeur de l'écran pour configurer le carrousel
const { width } = Dimensions.get("window");

// Mapping des images de profil avec leur nom de fichier
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

export default function RecoScreen({ navigation }) {
  const [preference, setPreference] = useState("");
  const [recommendedCocktails, setRecommendedCocktails] = useState([]);
  const [fcRecommendedCocktails, setFcRecommendedCocktails] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Nouveaux états globaux pour les filtres
  const [desiredCategory, setDesiredCategory] = useState("");
  const [topN, setTopN] = useState(5);

  // États locaux pour le modal
  const [modalPreference, setModalPreference] = useState("");
  const [modalTopN, setModalTopN] = useState("5");
  const [modalSelectedCategories, setModalSelectedCategories] = useState(["Toutes"]);

  // Récupération des catégories uniques depuis allCocktails
  const allCategories = ["Toutes", ...Array.from(new Set(allCocktails.map(cocktail => cocktail.strCategory)))];

  // Fonction pour basculer la sélection d'une catégorie
  const toggleCategory = (cat) => {
    if (cat === "Toutes") {
      setModalSelectedCategories(["Toutes"]);
    } else {
      let newSelection = modalSelectedCategories.includes("Toutes") ? [] : [...modalSelectedCategories];
      if (newSelection.includes(cat)) {
        newSelection = newSelection.filter(c => c !== cat);
      } else {
        newSelection.push(cat);
      }
      if (newSelection.length === 0) {
        newSelection = ["Toutes"];
      }
      setModalSelectedCategories(newSelection);
    }
  };

  // Chargement du profil actif depuis AsyncStorage
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem("userProfile");
        if (storedProfile) {
          const parsedProfile = JSON.parse(storedProfile);
          setSelectedProfile(parsedProfile);
          setModalPreference(preference);
        }
      } catch (error) {
        console.error("Erreur lors du chargement du profil :", error);
      }
    };
    loadUserProfile();
  }, []);

  // Fonction de demande de recommandations CB
  const handleRecommendation = async () => {
    if (!selectedProfile || !preference) {
      Alert.alert("Attention", "Veuillez vous assurer qu'un profil est actif et que vous avez renseigné votre préférence.");
      return;
    }
    if (!selectedProfile.favoriteCocktails || selectedProfile.favoriteCocktails.length === 0) {
      Alert.alert("Attention", "Le profil actif ne contient aucun cocktail favori.");
      return;
    }
    const formattedPreference = preference === "Alcoolisée" ? "Alcoholic" : "Non Alcoholic";
    const payload = {
      favoriteCocktails: selectedProfile.favoriteCocktails,
      alcoholicPreference: formattedPreference,
      desiredCategory: desiredCategory,
      topN: topN,
    };
    try {
      const response = await fetch("http://192.168.1.55:5000/api/CB_recommendations", {
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
      // Fusionner la propriété confidence dans l'objet cocktail
      const recommendations = data.recommendedDrinks.map(drink => {
        const cocktail = allCocktails.find(c =>
          c.strDrink.trim().toLowerCase() === drink.strDrink.trim().toLowerCase()
        );
        return cocktail ? { ...cocktail, confidence: drink.confidence } : null;
      }).filter(item => item !== null);
      setRecommendedCocktails(recommendations);
      await AsyncStorage.setItem("recommendedCocktails", JSON.stringify(recommendations));
    } catch (error) {
      console.error("Erreur lors de la récupération des recommandations :", error);
    }
  };

  // Fonction de demande de recommandations FC
  const handleFCRecommendation = async () => {
    if (!selectedProfile || !preference) {
      Alert.alert("Attention", "Veuillez vous assurer qu'un profil est actif et que vous avez renseigné votre préférence.");
      return;
    }
    if (!selectedProfile.favoriteCocktails || selectedProfile.favoriteCocktails.length === 0) {
      Alert.alert("Attention", "Le profil actif ne contient aucun cocktail favori.");
      return;
    }
    const formattedPreference = preference === "Alcoolisée" ? "Alcoholic" : "Non Alcoholic";
    const payload = {
      userLikedCocktails: selectedProfile.favoriteCocktails,
      alcoholicPreference: formattedPreference,
      desiredCategory: desiredCategory,
      topN: topN,
    };
    try {
      const response = await fetch("http://192.168.1.55:5000/api/FC_recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data.error) {
        console.error("Erreur API FC :", data.error);
        Alert.alert("Erreur", data.error);
        return;
      }
      const recommendations = data.recommendedDrinks.map(drink => {
        const cocktail = allCocktails.find(c =>
          c.strDrink.trim().toLowerCase() === drink.strDrink.trim().toLowerCase()
        );
        return cocktail ? { ...cocktail, confidence: drink.confidence } : null;
      }).filter(item => item !== null);
      setFcRecommendedCocktails(recommendations);
      await AsyncStorage.setItem("fcRecommendedCocktails", JSON.stringify(recommendations));
    } catch (error) {
      console.error("Erreur lors de la récupération des recommandations FC :", error);
    }
  };

  // Fonction combinée pour appeler les deux recommandations en même temps
  const handleCombinedRecommendation = () => {
    handleRecommendation();
    handleFCRecommendation();
  };

  // Fonction de rendu pour chaque carte, en appliquant les styles de HomeScreen (cardStyles)
  const renderCarouselItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("Recette", { item })}
      style={cardStyles.container}
    >
      <View style={cardStyles.innerBorder}>
        <Image source={{ uri: item.strDrinkThumb }} style={cardStyles.photo} />
        <Text style={cardStyles.title}>{item.strDrink}</Text>
        <Text style={cardStyles.category}>{item.strCategory}</Text>
        <Text style={cardStyles.confidence}>{item.confidence}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={["#a1628f", "#ebbcb7"]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container} nestedScrollEnabled={true}>
        {selectedProfile && (
          <View style={styles.profileContainer}>
            <Image
              style={styles.profileImage}
              source={getProfileImage(selectedProfile.profileImage)}
            />
            <Text style={styles.profileText}>{selectedProfile.username}</Text>
          </View>
        )}

        {/* Boutons d'inspiration et d'ouverture du filtre */}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.inspireButton} onPress={handleCombinedRecommendation}>
            <Image 
              source={require("../../../assets/icons/idea.png")} 
              style={styles.inspireButtonIcon} 
            />
            <Text style={styles.inspireButtonText}>Inspire-moi</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsFilterVisible(true)} style={styles.filterButton}>
            <Image 
              source={require("../../../assets/icons/filter.png")} 
              style={styles.filterIcon} 
            />
          </TouchableOpacity>
        </View>

        {/* Carousel pour la reco basée sur le contenu (CB) */}
        {recommendedCocktails.length > 0 && (
          <View style={{ marginTop: 0 }}>
            <Text style={styles.header}>Pour vous</Text>
            <View style={{ height: 240 }}>
              <Carousel
                layout="default"
                data={recommendedCocktails}
                renderItem={renderCarouselItem}
                sliderWidth={width}
                itemWidth={150}
                inactiveSlideScale={0.95}
                inactiveSlideOpacity={0.7}
                activeSlideAlignment="middle"
                firstItem={1}
              />
            </View>
          </View>
        )}

        {/* Carousel pour la reco collaborative (FC) */}
        {fcRecommendedCocktails.length > 0 && (
          <View style={{ marginTop: 0, marginBottom: 0 }}>
            <Text style={styles.header}>Les autres ont aimé aussi</Text>
            <View style={{ height: 240 }}>
              <Carousel
                layout="default"
                data={fcRecommendedCocktails}
                renderItem={renderCarouselItem}
                sliderWidth={width}
                itemWidth={150}
                inactiveSlideScale={0.95}
                inactiveSlideOpacity={0.7}
                activeSlideAlignment="middle"
                firstItem={1}
              />
            </View>
          </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Modal pour les filtres */}
      <Modal
        visible={isFilterVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsFilterVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choisissez vos filtres</Text>

            {/* Choix de la préférence */}
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={[styles.preferenceButton, modalPreference === "Alcoolisée" ? styles.activeButton : null]}
                onPress={() => setModalPreference("Alcoolisée")}
              >
                <Text style={styles.preferenceText}>Alcoolisée</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.preferenceButton, modalPreference === "Sans alcool" ? styles.activeButton : null]}
                onPress={() => setModalPreference("Sans alcool")}
              >
                <Text style={styles.preferenceText}>Sans alcool</Text>
              </TouchableOpacity>
            </View>

            {/* Sélection des catégories */}
            <Text style={styles.modalLabel}>Catégories</Text>
            <View style={styles.categoryContainer}>
              {allCategories.map((cat) => (
                <TouchableOpacity 
                  key={cat} 
                  style={[
                    styles.categoryButton, 
                    modalSelectedCategories.includes(cat) && styles.categoryButtonActive
                  ]}
                  onPress={() => toggleCategory(cat)}
                >
                  <Text style={[
                    styles.categoryButtonText,
                    modalSelectedCategories.includes(cat) && styles.categoryButtonTextActive
                  ]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Ligne avec label et petit Picker */}
            <View style={styles.topNRow}>
              <Text style={styles.topNLabel}>Nombre de cocktails</Text>
              <Picker
                selectedValue={modalTopN}
                style={styles.smallPicker}
                itemStyle={styles.pickerItem}
                onValueChange={(itemValue) => setModalTopN(itemValue)}
                mode="dropdown"
              >
                {Array.from({ length: 15 }, (_, i) => i + 1).map(num => (
                  <Picker.Item key={num} label={num.toString()} value={num.toString()} />
                ))}
              </Picker>
            </View>

            {/* Bouton de validation */}
            <TouchableOpacity
              style={styles.validateButton}
              onPress={() => {
                const finalDesiredCategory = modalSelectedCategories.includes("Toutes")
                  ? ""
                  : modalSelectedCategories.join(",");
                setPreference(modalPreference);
                setDesiredCategory(finalDesiredCategory);
                setTopN(parseInt(modalTopN));
                setIsFilterVisible(false);
                // setTimeout(() => {
                //   handleCombinedRecommendation();
                // }, 100);
              }}
            >
              <Text style={styles.validateButtonText}>Valider les filtres</Text>
            </TouchableOpacity>

            <Button title="Fermer" onPress={() => setIsFilterVisible(false)} />
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

// Styles de la page Reco (non modifiés, sauf pour le Picker)
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileText: {
    fontSize: 16,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
    alignItems: "center",
  },
  inspireButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7640a3",
    padding: 10,
    borderRadius: 5,
  },
  inspireButtonIcon: {
    width: 27,
    height: 27,
    resizeMode: "contain",
    marginRight: 8,
  },
  inspireButtonText: {
    fontSize: 18,
    color: "#fff",
  },
  filterButton: {
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  filterIcon: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  preferenceButton: {
    width: "45%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ccb2e0",
  },
  activeButton: {
    backgroundColor: "#7640a3",
  },
  preferenceText: {
    fontSize: 16,
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 16,
    marginVertical: 10,
  },
  topNRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  topNLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  smallPicker: {
    width: 80,
    height: 40,
    backgroundColor: "#f0f0f0",
  },
  pickerItem: {
    fontSize: 16,
    color: "#000",
  },
  modalTextInput: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  validateButton: {
    backgroundColor: "#7640a3",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
    width: "100%",
  },
  validateButtonText: {
    fontSize: 16,
    color: "#fff",
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 10,
  },
  categoryButton: {
    padding: 8,
    margin: 4,
    borderRadius: 5,
    backgroundColor: "#eee",
  },
  categoryButtonActive: {
    backgroundColor: "#7640a3",
  },
  categoryButtonText: {
    fontSize: 14,
    color: "#000",
  },
  categoryButtonTextActive: {
    color: "#fff",
  },
});

// Styles pour les cartes (mêmes que ceux utilisés dans HomeScreen)
const cardStyles = StyleSheet.create({
  container: {
    backgroundColor: "#ebbcb7",
    borderRadius: 10,
    margin: 8,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    width : 150,
    minHeight: 205
    ,
    position: "relative",
  },
  innerBorder: {
    position: "absolute",
    top: 2,
    left: 2,
    right: 2,
    bottom: 2,
    borderRadius: 10,
    borderWidth: 0,
    borderColor: "#4A4A4A",
  },
  photo: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2e2e2e",
    textAlign: "center",
    flexWrap: "wrap",
  },
  category: {
    fontSize: 13,
    color: "rgb(90, 80, 80)",
    textAlign: "center",
    marginTop: 5,
  },
  confidence: {
    fontSize: 13,
    color: "rgb(35, 152, 42)",
    textAlign: "center",
    marginTop: 5,
  },
});
