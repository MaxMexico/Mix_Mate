import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
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
    width: '100%',
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
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
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  editButton: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  // Styles pour la barre de recherche
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  searchResult: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  searchText: {
    fontSize: 16,
  },
  noResults: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 16,
  },

  // Styles pour les cocktails favoris
  favoriteItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  sectionContent: {
    fontSize: 16,
  },
  searchResultsContainer: {
    maxHeight: 150, // Limite la hauteur des résultats
    position: "absolute",
    top: 200, // Place les résultats au-dessus de la barre de recherche
    left: 16,
    right: 16,
    backgroundColor: "rgb(230, 108, 217)",
    borderRadius: 8,
    zIndex: 10,
  },
  removeText: {
    color: "red",
    fontSize: 16,
  },
});

export default styles;