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
    color: "#2e2e2e",
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
    color: "rgb(84, 80, 80)53)",
    marginBottom: 16,
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    color: "#2e2e2e",
  },
  instructions: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
    color: "rgb(84, 80, 80)53)",
    paddingHorizontal: 10,
  },
  ingredientsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#2e2e2e",
  },
  ingredientsContainer: {
    marginBottom: 16,
    alignItems: "center",
  },
  ingredientText: {
    fontSize: 16,
    color: "rgb(84, 80, 80)53)",
    marginBottom: 8,
  },
});

export default styles;
