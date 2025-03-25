import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Image, ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from '../screens/Home/HomeScreen';
import CategoriesScreen from '../screens/Categories/CategoriesScreen';
import RecipeScreen from '../screens/Recipe/RecipeScreen';
import RecipesListScreen from '../screens/RecipesList/RecipesListScreen';
import DrawerContainer from '../screens/DrawerContainer/DrawerContainer';
import IngredientScreen from '../screens/Ingredient/IngredientScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import RandomCocktailScreen from '../screens/RandomCocktail/RandomCocktailScreen';
import ChatbotScreen from "../screens/Chatbot/ChatbotScreen";
import SearchScreen from "../screens/Search/SearchScreen";
import CocktailDetailsScreen from "../screens/CocktailDetails/CocktailDetailsScreen";
import IngredientsDetailsScreen from '../screens/CocktailDetails/CocktailDetailsScreen';
import RecoScreen from '../screens/Reco/RecoScreen';
import ForumScreen from "../screens/Forum/ForumScreen"; // Import de la page Forum

import Logo from "../../assets/icons/logo.png"; // Import du logo

const Stack = createStackNavigator();

function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#d8d1e0', // Couleur de fond du header
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#2e2e2e', // Couleur du titre du header
        },
        headerTitleAlign: 'center',
        headerRight: () => (
          <Image source={Logo} style={{ width: 80, height: 80, marginRight: 10 }} />
        ),
      }}
    >
      <Stack.Screen name='Accueil' component={HomeScreen} />
      <Stack.Screen name='Catégories' component={CategoriesScreen} />
      <Stack.Screen name='Recette' component={RecipeScreen} />
      <Stack.Screen name='Catégorie' component={RecipesListScreen} />
      <Stack.Screen name='Ingredient' component={IngredientScreen} />
      <Stack.Screen name='Rechercher' component={SearchScreen} />
      <Stack.Screen name="Profil" component={ProfileScreen} />
      <Stack.Screen name="Chatbot" component={ChatbotScreen} />
      <Stack.Screen name="CocktailDetails" component={CocktailDetailsScreen} />
      <Stack.Screen name="IngredientsDetails" component={IngredientsDetailsScreen} />
      <Stack.Screen name="Cocktail Aléatoire" component={RandomCocktailScreen} />
      <Stack.Screen name="Recommandations" component={RecoScreen} />
      <Stack.Screen name="Forum" component={ForumScreen} />
    </Stack.Navigator>
  );
}

const Drawer = createDrawerNavigator();

function DrawerStack() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: 250, 
        },
      }}
      drawerContent={({ navigation }) => <DrawerContainer navigation={navigation} />}
    >
      <Drawer.Screen name='Main' component={MainNavigator} />
    </Drawer.Navigator>
  );
}

export default function AppContainer() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Supprime la clé "userMode" à chaque reload de l'app et indique que l'app est prête après
    AsyncStorage.removeItem('userMode')
      .then(() => {
        console.log("userMode réinitialisé");
        setIsReady(true);
      })
      .catch((error) => {
        console.error("Erreur lors de la réinitialisation de userMode", error);
        setIsReady(true);
      });
  }, []);

  // Affiche un loader pendant la suppression de la clé
  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#F28A1A" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <DrawerStack />
    </NavigationContainer>
  );
}

console.disableYellowBox = true;
