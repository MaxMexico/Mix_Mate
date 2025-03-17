/* styles.js */
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 32, // Ajout d'un espace en haut
    paddingHorizontal: 16
  },
  categoryBar: {
    marginTop: 16, // Ajout d'une marge en haut
    marginBottom: 24, // Augmentation de l'espace sous la barre
    flexDirection: 'row',
    paddingHorizontal: 4
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#fff'
  },
  activeCategory: {
    backgroundColor: '#3498db'
  },
  categoryText: {
    color: '#333',
    fontSize: 14
  },
  discussionCard: {
    marginTop: 12, // Ajout d'une marge en haut pour chaque carte
    marginBottom: 16, // Espacement entre les cartes
    borderRadius: 12,
    elevation: 2,
    backgroundColor: '#fff', // Assurez-vous que les cartes ont un fond
    padding: 16 // Ajout de padding interne
  },
  categoryBadge: {
    backgroundColor: '#3498db',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 12
  },
  badgeText: {
    color: '#fff',
    fontSize: 12
  },
  discussionContent: {
    color: '#555',
    marginBottom: 8
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#3498db',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4
  },
  modalContainer: {
    flex: 1,
    paddingTop: 40, // Ajout d'un espace en haut du modal
    paddingHorizontal: 24,
    backgroundColor: '#fff'
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff'
  },
  modalContent: {
    height: 150,
    textAlignVertical: 'top'
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    marginTop: 24 // Ajout d'une marge en haut des boutons
  }
});