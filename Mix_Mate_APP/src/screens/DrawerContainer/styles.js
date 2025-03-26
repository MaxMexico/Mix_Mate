import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",      // Centre verticalement
    justifyContent: "center",  // Centre horizontalement
    backgroundColor: "#d8d1e0",
    position: "relative"       // Nécessaire pour le positionnement absolu de modeContainer
  },
  container: {
    flex: 1,
    alignItems: "flex-start",  // Les boutons sont alignés à gauche dans ce conteneur
    paddingHorizontal: 20
  },
  modeContainer: {
    position: "absolute",
    bottom: 40,    // Place le texte à 10 px du bas
    left: 0,
    right: 0,
    alignItems: "center"
  },
  modeText: {
    fontSize: 12,
    color: "gray"
  },
  logoutButton: {
    marginTop: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#2e2e2e',
    borderRadius: 8,
    marginHorizontal: 20,
    backgroundColor: '#d8d1e0',
  },
  logoutButtonText: {
    color: '#2e2e2e',
    fontSize: 16,
    textAlign: 'center',
  },
  logoutButton: {
    marginTop: 20, // Espacement vertical avec le Profil
    paddingVertical: 10, // Hauteur interne du bouton (augmentée)
    paddingHorizontal: 18, // Largeur interne du bouton (augmentée)
    borderWidth: 1,
    borderColor: "#2e2e2e",
    borderRadius: 12, // Bords arrondis pour un look plus moderne
    marginHorizontal: 20, // Espacement horizontal par rapport aux bords
    backgroundColor: "#d8d1e0",
    elevation: 3, // Ombre légère (optionnel)
  },
  logoutButtonText: {
    color: "#2e2e2e",
    fontSize: 16, // Taille de police augmentée
    textAlign: "center",
    marginVertical: 5, // Espacement vertical supplémentaire (optionnel)
  }
});

export default styles;
