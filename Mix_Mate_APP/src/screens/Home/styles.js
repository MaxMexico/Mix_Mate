import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#292929",
    borderRadius: 10,
    margin: 8,
    padding: 10,
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    width: width / 2 - 24,
    minHeight: 234,
    position: "relative",
  },
  innerBorder: {
    position: "absolute",
    top: 2,
    left: 2,
    right: 2,
    bottom: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#4A4A4A",
  },
  photo: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#E0E0E0",
    textAlign: "center",
    flexWrap: "wrap",
    maxHeight: 40,
    numberOfLines: 2,
    ellipsizeMode: "tail",
  },
  category: {
    fontSize: 12,
    color: "#B0B0B0",
    textAlign: "center",
    marginTop: 5,
  },
});

export default styles;