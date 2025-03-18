import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 16,
  },
  profileInfo: {
    alignItems: "center",
    width: "100%",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2e2e2e",
    marginBottom: 8,
  },
  profileUsername: {
    fontSize: 18,
    color: "#666",
    marginBottom: 8,
  },
  profileEmail: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  editFields: {
    width: "100%",
  },
  input: {
    borderWidth: 1,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  editButton: {
    backgroundColor: "#7640a3",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    color: "#2e2e2e",
  },
  // Liste déroulante des résultats de recherche
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
    color: "#fff",
    textAlign: "left",
  },
  noResults: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 16,
  },
  // Liste des cocktails favoris
  favoriteItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
  },
  sectionContent: {
    fontSize: 16,
    color: "#2e2e2e",
    textAlign: "left",
    flex: 1,
  },
  searchResultsContainer: {
    maxHeight: 150,
    position: "absolute",
    top: 200,
    left: 16,
    right: 16,
    backgroundColor: "#d09ab2",
    borderRadius: 8,
    zIndex: 10,
  },
  deleteIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  removeText: {
    color: "red",
    fontSize: 16,
  },
});

export default styles;
