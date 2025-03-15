import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "rgb(0, 0, 0)",
  },
  cocktailImage: {
    width: 250,
    height: 250,
    borderRadius: 15,
    marginBottom: 16,
  },
  category: {
    fontSize: 18,
    fontWeight: "bold",
    color: "rgb(84, 80, 80)",
    marginBottom: 16,
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    color: "rgb(0, 0, 0)",
  },
  instructions: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
    color: "rgb(84, 80, 80)",
    paddingHorizontal: 10,
  },
  ingredientsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "rgb(0, 0, 0)",
  },
  ingredientsContainer: {
    marginBottom: 16,
    alignItems: "center",
  },
  ingredientText: {
    fontSize: 16,
    color: "rgb(84, 80, 80)",
    marginBottom: 8,
  },
  randomButton: {
    backgroundColor: "#d09ab2", // Couleur orange vif pour le bouton
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