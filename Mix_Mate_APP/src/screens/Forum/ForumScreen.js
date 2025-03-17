/* ForumScreen.js */
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ScrollView,
  Modal,
  TextInput,
  StyleSheet,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient"; // Import du LinearGradient
import SearchBar from '../../components/SearchBar/SearchBar'; // Votre composant SearchBar
import allCocktails from "../../../assets/Translation_database.json"; // Import de la BDD

const ForumScreen = () => {
  const navigation = useNavigation();
  const [discussions, setDiscussions] = useState([]);
  const [categories, setCategories] = useState(['Toutes']);
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [modalVisible, setModalVisible] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    cocktailId: null
  });
  const [filteredCocktails, setFilteredCocktails] = useState(allCocktails);

  // Préchargement des avis au montage
  useEffect(() => {
    const formattedDiscussions = allCocktails.reduce((acc, cocktail) => {
      if (cocktail.reviews && cocktail.reviews.length > 0) {
        cocktail.reviews.forEach((review, index) => {
          acc.push({
            id: `${cocktail.idDrink}-${index}`, // Clé unique
            category: cocktail.strCategory,
            cocktailId: cocktail.idDrink,
            cocktailName: cocktail.strDrink,
            cocktailImage: cocktail.strDrinkThumb,
            title: `Avis sur ${cocktail.strDrink}`,
            content: review.comment,
            author: review.user,
            rating: review.sentiment_score,
            date: new Date().toISOString()
          });
        });
      }
      return acc;
    }, []);

    // Extraction des catégories uniques
    const uniqueCategories = ['Toutes', ...new Set(allCocktails.map(c => c.strCategory))];
    setDiscussions(formattedDiscussions);
    setCategories(uniqueCategories);
  }, []);

  // Gestion du clic sur un avis
  const handleDiscussionPress = (discussionItem) => {
    const cocktail = allCocktails.find(c => c.idDrink === discussionItem.cocktailId);
    if (cocktail) {
      navigation.navigate('Recette', { item: cocktail });
    }
  };

  // Gestion de la recherche dans le modal
  const handleSearch = (query) => {
    const filtered = allCocktails.filter(cocktail => 
      cocktail.strDrink.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCocktails(filtered);
  };

  // Ajout d'un nouvel avis
  const handleNewPost = () => {
    if (!newPost.title || !newPost.content || !newPost.cocktailId) return;

    const cocktail = allCocktails.find(c => c.idDrink === newPost.cocktailId);
    const existingReviewsCount = discussions.filter(d => 
      d.cocktailId === cocktail.idDrink
    ).length;

    const newDiscussion = {
      id: `${cocktail.idDrink}-${existingReviewsCount}`,
      category: cocktail.strCategory,
      cocktailId: cocktail.idDrink,
      cocktailName: cocktail.strDrink,
      cocktailImage: cocktail.strDrinkThumb,
      title: newPost.title,
      content: newPost.content,
      author: 'Utilisateur', // À remplacer par un système d'authentification
      rating: 0,
      date: new Date().toISOString()
    };

    setDiscussions([newDiscussion, ...discussions]);
    setNewPost({ title: '', content: '', cocktailId: null });
    setFilteredCocktails(allCocktails);
    setModalVisible(false);
  };

  return (
    <LinearGradient
          colors={["#a1628f", "#ebbcb7"]} // Mêmes couleurs que RecoScreen
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }} // Gradient comme arrière-plan principal
        >
      <View style={styles.container}>
        {/* Barre de catégories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryBar}
        >
          {categories.map(category => (
            <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.activeCategory
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.activeCategoryText
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Liste des avis */}
        <FlatList 
          data={discussions.filter(disc => 
            selectedCategory === 'Toutes' || disc.category === selectedCategory
          )}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.discussionCard}
              onPress={() => handleDiscussionPress(item)}
            >
              <Image 
                source={{ uri: item.cocktailImage }}
                style={styles.cocktailImage}
              />
              <View style={styles.cardContent}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.content}>{item.content}</Text>
                <View style={styles.footer}>
                  <Text style={styles.author}>{item.author}</Text>
                  <View style={styles.rating}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <Ionicons 
                        key={i}
                        name={i < item.rating ? 'star' : 'star-outline'}
                        size={16}
                        color="#FFD700"
                      />
                    ))}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.noResults}>Aucun avis disponible</Text>}
          contentContainerStyle={styles.listContainer}
        />

        {/* Bouton d'ajout */}
        <TouchableOpacity 
          style={styles.fab}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={32} color="#fff" />
        </TouchableOpacity>

        {/* Modal d'ajout */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            {/* SearchBar pour sélectionner un cocktail */}
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Rechercher un cocktail..."
            />
            
            {/* Liste des cocktails */}
            <FlatList 
              data={filteredCocktails}
              keyExtractor={item => item.idDrink}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[
                    styles.cocktailSearchItem,
                    newPost.cocktailId === item.idDrink && styles.selectedSearchItem
                  ]}
                  onPress={() => setNewPost({ ...newPost, cocktailId: item.idDrink })}
                >
                  <Image 
                    source={{ uri: item.strDrinkThumb }}
                    style={styles.searchItemImage}
                  />
                  <Text style={styles.searchItemText}>{item.strDrink}</Text>
                </TouchableOpacity>
              )}
              style={styles.searchList}
            />

            {/* Formulaire */}
            <TextInput 
              style={styles.modalInput}
              placeholder="Titre de votre avis"
              value={newPost.title}
              onChangeText={text => setNewPost({ ...newPost, title: text })}
            />
            <TextInput 
              style={[styles.modalInput, styles.modalContent]}
              placeholder="Votre avis..."
              multiline
              numberOfLines={4}
              value={newPost.content}
              onChangeText={text => setNewPost({ ...newPost, content: text })}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => {
                  setModalVisible(false);
                  setFilteredCocktails(allCocktails);
                }}
              >
                <Text style={styles.buttonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.primaryButton]}
                onPress={handleNewPost}
              >
                <Text style={[styles.buttonText, styles.primaryText]}>Publier</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
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
    backgroundColor: '#7640a3'
  },
  activeCategoryText: {
    color: '#fff'
  },
  categoryText: {
    color: '#333',
    fontSize: 14
  },
  discussionCard: {
    flexDirection: 'row',
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 12,
    elevation: 2
  },
  cocktailImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12
  },
  cardContent: {
    flex: 1
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8
  },
  content: {
    color: '#555',
    marginBottom: 8
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  author: {
    color: '#777',
    fontSize: 12
  },
  rating: {
    flexDirection: 'row'
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#7640a3',
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
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8
  },
  primaryButton: {
    backgroundColor: '#3498db'
  },
  buttonText: {
    fontSize: 16,
    color: '#333'
  },
  primaryText: {
    color: '#fff'
  },
  searchList: {
    maxHeight: 200,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    elevation: 2
  },
  cocktailSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  selectedSearchItem: {
    backgroundColor: '#3498db30'
  },
  searchItemImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12
  },
  searchItemText: {
    fontSize: 16,
    color: '#333'
  },
  listContainer: {
    paddingBottom: 24
  },
  noResults: {
    textAlign: 'center',
    color: '#777',
    padding: 20
  }
});

export default ForumScreen;