/* screens/Search/styles.js */
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  cocktailItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  cocktailImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  cocktailName: {
    fontSize: 16,
    color: "#fff", // Texte en blanc pour contraster avec le gradient
  },
  noResults: {
    textAlign: "center",
    color: "#fff", // Texte en blanc pour contraster avec le gradient
    padding: 20,
    fontSize: 20,
  },
  listContent: {
    paddingBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25, // Ajoute un border radius arrondi
    padding: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
});

export default styles;