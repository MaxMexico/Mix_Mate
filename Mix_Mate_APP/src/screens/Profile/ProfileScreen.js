import React, { useState } from "react";
import { View, Text, Image, TextInput, Pressable } from "react-native";
import styles from "./styles"; // Importez les styles

export default function ProfileScreen({ navigation }) {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [isEditing, setIsEditing] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          style={styles.profileImage}
          source={{ uri: "https://via.placeholder.com/150" }}
        />
        {isEditing ? (
          <View style={styles.editFields}>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Nom"
            />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              keyboardType="email-address"
            />
          </View>
        ) : (
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{name}</Text>
            <Text style={styles.profileEmail}>{email}</Text>
          </View>
        )}
      </View>
    </View>
  );
}