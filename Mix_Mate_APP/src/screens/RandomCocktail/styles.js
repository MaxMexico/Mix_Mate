import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#292929", // 🌑 Fond gris foncé
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cocktailContainer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#E0E0E0", // ✅ Texte clair
  },
  cocktailImage: {
    width: 250,
    height: 250,
    borderRadius: 15,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#F28A1A", // 🟠 Bordure orange
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    color: "#F28A1A", // 🟠 Orange vif
  },
  instructions: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
    color: "#E0E0E0",
    paddingHorizontal: 10,
  },
  ingredientsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#F28A1A", // 🟠 Titre en orange
  },
  ingredientsContainer: {
    marginBottom: 16,
    alignItems: "center",
  },
  ingredientText: {
    fontSize: 16,
    color: "#B0B0B0",
    marginBottom: 8,
  },
  randomButton: {
    backgroundColor: "#F28A1A", // 🟠 Bouton orange vif
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
  },
  randomButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default styles;
