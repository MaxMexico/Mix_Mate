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
  Image,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient";
import SearchBar from '../../components/SearchBar/SearchBar';
import allCocktails from "../../../assets/Translation_database.json";

const ForumScreen = () => {
  const navigation = useNavigation();
  const [discussions, setDiscussions] = useState([]);
  const [categories, setCategories] = useState(['Toutes']);
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [modalVisible, setModalVisible] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    cocktailId: null,
    rating: 0,
  });
  const [filteredCocktails, setFilteredCocktails] = useState(allCocktails);

  useEffect(() => {
    const formattedDiscussions = allCocktails.reduce((acc, cocktail) => {
      if (cocktail.reviews && cocktail.reviews.length > 0) {
        cocktail.reviews.forEach((review, index) => {
          acc.push({
            id: `${cocktail.idDrink}-${index}`,
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

    const uniqueCategories = ['Toutes', ...new Set(allCocktails.map(c => c.strCategory))];
    setDiscussions(formattedDiscussions);
    setCategories(uniqueCategories);
  }, []);

  const handleDiscussionPress = (discussionItem) => {
    const cocktail = allCocktails.find(c => c.idDrink === discussionItem.cocktailId);
    if (cocktail) {
      navigation.navigate('Recette', { item: cocktail });
    }
  };

  const handleSearch = (query) => {
    const filtered = allCocktails.filter(cocktail => 
      cocktail.strDrink.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCocktails(filtered);
  };

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
      author: 'Utilisateur',
      rating: newPost.rating,
      date: new Date().toISOString()
    };

    setDiscussions([newDiscussion, ...discussions]);
    setNewPost({ title: '', content: '', cocktailId: null, rating: 0 });
    setFilteredCocktails(allCocktails);
    setModalVisible(false);
  };

  return (
    <LinearGradient
      colors={["#a1628f", "#ebbcb7"]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={{ flex: 1 }}
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
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={50}
          >
            <ScrollView contentContainerStyle={styles.modalScrollContainer}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
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

                  {/* Zone de notation par étoiles */}
                  <View style={styles.ratingContainer}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <TouchableOpacity key={i} onPress={() => setNewPost({ ...newPost, rating: i })}>
                        <Ionicons 
                          name={i <= newPost.rating ? 'star' : 'star-outline'}
                          size={16}
                          color="#FFD700"
                        />
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Formulaire */}
                  <TextInput 
                    style={styles.modalInput}
                    placeholder="Titre de votre avis"
                    value={newPost.title}
                    onChangeText={text => setNewPost({ ...newPost, title: text })}
                  />
                  <TextInput 
                    style={[styles.modalInput, styles.modalContentInput]}
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
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
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
  /* --- Modal styles modifiés --- */
  modalScrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20
    // Retiré alignItems: "center" pour éviter que tout soit collé à gauche
  },
  modalContent: {
    width: "100%"
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
    width: "100%"
  },
  modalContentInput: {
    height: 150,
    textAlignVertical: "top"
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    gap: 16,
    width: "100%"
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8
  },
  primaryButton: {
    backgroundColor: "#3498db"
  },
  buttonText: {
    fontSize: 16,
    color: "#333"
  },
  primaryText: {
    color: "#fff"
  },
  searchList: {
    maxHeight: 200,
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    elevation: 2,
    width: "100%"
  },
  cocktailSearchItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },
  selectedSearchItem: {
    backgroundColor: "#3498db30"
  },
  searchItemImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12
  },
  searchItemText: {
    fontSize: 16,
    color: "#333"
  },
  listContainer: {
    paddingBottom: 24
  },
  noResults: {
    textAlign: "center",
    color: "#777",
    padding: 20
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10
  },
  /* --- Fin modal styles modifiés --- */
  favoritesContainer: {
    width: "100%"
  },
  favoritesTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff"
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center"
  },
  inspireButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7640a3",
    padding: 10,
    borderRadius: 5
  },
  inspireButtonIcon: {
    width: 27,
    height: 27,
    resizeMode: "contain",
    marginRight: 8
  },
  inspireButtonText: {
    fontSize: 18,
    color: "#fff"
  },
  filterButton: {
    padding: 10,
    borderRadius: 5,
    marginLeft: 10
  },
  filterIcon: {
    width: 50,
    height: 50,
    resizeMode: "contain"
  },
  filterText: {
    fontSize: 16,
    color: "#fff"
  }
});

export default ForumScreen;
