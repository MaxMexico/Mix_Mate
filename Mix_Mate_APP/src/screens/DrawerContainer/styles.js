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
  }
});

export default styles;
