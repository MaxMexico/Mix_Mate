// screens/Search/styles.js
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5"
  },
  cocktailItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },
  cocktailImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12
  },
  cocktailName: {
    fontSize: 16,
    color: "#333"
  },
  noResults: {
    textAlign: "center",
    color: "#777",
    padding: 20
  },
  listContent: {
    paddingBottom: 24
  }
});

export default styles;