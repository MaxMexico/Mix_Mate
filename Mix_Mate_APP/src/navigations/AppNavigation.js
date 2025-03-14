import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
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

const Stack = createStackNavigator();

function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen name='Accueil' component={HomeScreen} />
      <Stack.Screen name='Catégories' component={CategoriesScreen}/>
      <Stack.Screen name='Recipe' component={RecipeScreen}/>
      <Stack.Screen name='RecipesList' component={RecipesListScreen} />
      <Stack.Screen name='Ingredient' component={IngredientScreen} />
      <Stack.Screen name='Rechercher' component={SearchScreen} />
      <Stack.Screen name="Profil" component={ProfileScreen} />
      <Stack.Screen name="Chatbot" component={ChatbotScreen} />
      <Stack.Screen name="CocktailDetails" component={CocktailDetailsScreen} />
      <Stack.Screen name="IngredientsDetails" component={IngredientsDetailsScreen} />
      <Stack.Screen name="Cocktail Aléatoire" component={RandomCocktailScreen} />
      <Stack.Screen name="Recommandations" component={RecoScreen} />



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
      drawerContent={({navigation}) => <DrawerContainer navigation={navigation}/>}
    >
      <Drawer.Screen name='Main' component={MainNavigator} />
    </Drawer.Navigator>
  );
}

export default function AppContainer() {
  return (
    <NavigationContainer>
      <DrawerStack/>
    </NavigationContainer>
  );
}

console.disableYellowBox = true;