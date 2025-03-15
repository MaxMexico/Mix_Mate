/* styles.js */
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  listContent: {
    padding: 16, // Ajoute un espace autour des éléments
  },
  categoriesItemContainer: {
    flex: 1,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 215,
    backgroundColor: '#fff', // Fond blanc pour chaque catégorie
    borderRadius: 20,
    shadowColor: '#000', // Ombre légère pour un effet de profondeur
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Pour Android
  },
  categoriesPhoto: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  categoriesName: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333333',
    marginTop: 8,
  },
  categoriesInfo: {
    fontSize: 14,
    color: '#777',
    marginTop: 3,
    marginBottom: 5,
  },
});

export default styles;