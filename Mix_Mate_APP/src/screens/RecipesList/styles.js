/* styles.js */
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  listContent: {
    padding: 16, // Ajoute un espace autour des éléments
  },
  recipeItemContainer: {
    flex: 1,
    margin: 10,
    backgroundColor: "#ebbcb7", // Fond blanc pour chaque carte
    borderRadius: 12,
    shadowColor: "#000", // Ombre légère pour un effet de profondeur
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Pour Android
  },
  recipePhoto: {
    width: "100%",
    height: 155,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2e2e2e",
    marginTop: 8,
    
  },
  recipeInfo: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 1,
    color: "#2e2e2e",
  },
});

export default styles;