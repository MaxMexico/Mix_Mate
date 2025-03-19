import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  Image,
} from "react-native";
import styles from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import users from "../../../assets/users.json"; // Import de la liste des utilisateurs

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Fonction de connexion
  const handleLogin = async () => {
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      await AsyncStorage.setItem("loggedUser", JSON.stringify(user));
      navigation.replace("Profil"); // Redirige vers la page profil
    } else {
      Alert.alert("Erreur", "Email ou mot de passe incorrect !");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../../../assets/connexion.png")} style={styles.logo} />
      <Text style={styles.title}>Connexion</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Pressable style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Se connecter</Text>
      </Pressable>
    </View>
  );
}
