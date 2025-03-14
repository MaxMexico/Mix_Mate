/* styles.js */
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5'
  },
  categoryBar: {
    marginBottom: 16,
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
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2
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
    padding: 24,
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
    gap: 16
  }
});