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
import ForumScreen from "../screens/Forum/ForumScreen";
import LoginScreen from '../screens/Login/LoginScreen'; // Import de la page de connexion

import Logo from "../../assets/icons/logo.png";

const Stack = createStackNavigator();
const MainStack = createStackNavigator(); // Stack pour la navigation principale
const Drawer = createDrawerNavigator();

function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#d8d1e0' },
        headerTitleStyle: { fontWeight: 'bold', color: '#2e2e2e' },
        headerTitleAlign: 'center',
        headerRight: () => (
          <Image source={Logo} style={{ width: 80, height: 80, marginRight: 10 }} />
        ),
      }}
    >
      <Stack.Screen name="Accueil" component={HomeScreen} />
      <Stack.Screen name="Catégories" component={CategoriesScreen} />
      <Stack.Screen name="Recette" component={RecipeScreen} />
      <Stack.Screen name="Catégorie" component={RecipesListScreen} />
      <Stack.Screen name="Ingredient" component={IngredientScreen} />
      <Stack.Screen name="Rechercher" component={SearchScreen} />
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

function DrawerStack() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: { width: 250 },
      }}
      drawerContent={({ navigation }) => <DrawerContainer navigation={navigation} />}
    >
      <Drawer.Screen name="Main" component={MainNavigator} />
    </Drawer.Navigator>
  );
}

export default function AppContainer() {
  const [isReady, setIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        // Réinitialisation de "userMode" (fonctionnalité existante)
        
        await AsyncStorage.removeItem('userMode');
        await AsyncStorage.removeItem('isLoggedIn'); // <--- AJOUTEZ CETTE LIGNE

        console.log("userMode réinitialisé");

        // Vérification de la connexion
        const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
        setIsLoggedIn(!!isLoggedIn);
      } catch (error) {
        console.error("Erreur lors de la configuration de l'application", error);
      } finally {
        setIsReady(true);
      }
    };

    checkLogin();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#F28A1A" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <MainStack.Navigator
        initialRouteName={isLoggedIn ? 'Drawer' : 'Login'}
        screenOptions={{ headerShown: false }}
      >
        <MainStack.Screen name="Login" component={LoginScreen} />
        <MainStack.Screen name="Drawer" component={DrawerStack} />
      </MainStack.Navigator>
    </NavigationContainer>
  );
}

console.disableYellowBox = true;  