// screens/Chatbot/ChatbotScreen.js

import React from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";
import styles from "./styles"; // Importation des styles

export default function ChatbotScreen() {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: "https://mixmate.zapier.app/" }} // URL du chatbot Zapier
        style={styles.webview}
      />
    </View>
  );
}