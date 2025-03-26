// screens/Login/LoginScreen.js
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const LoginScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (username === 'demo' && password === 'password') {
            await AsyncStorage.setItem('isLoggedIn', 'true');
            navigation.replace('Drawer');
        } else {
            setError('Identifiants incorrects');
        }
    };

    return (
        <LinearGradient
            colors={['#a1628f', '#ebbcb7']}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={styles.container}
        >
            <View style={styles.formContainer}>
                <Text style={styles.title}>CONNEXION</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nom d'utilisateur"
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Mot de passe"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                {error && <Text style={styles.error}>{error}</Text>}
                {/* Première button (SE CONNECTER) */}
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>SE CONNECTER</Text>
                </TouchableOpacity>
                {/* Deuxième button (Créer un compte) */}
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>SE CREER UN COMPTE</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20
    },
    formContainer: {
        alignItems: 'center'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2e2e2e',
        marginBottom: 30,
        textAlign: 'center'
    },
    input: {
        width: '100%',
        height: 48,
        borderColor: '#2e2e2e',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 16,
        color: '#2e2e2e',
        fontSize: 16
    },
    button: {
        width: '100%',
        height: 48,
        backgroundColor: '#2e2e2e',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16
    },
    buttonText: {
        color: '#d8d1e0',
        fontSize: 16,
        fontWeight: 'bold'
    },
    error: {
        color: 'red',
        fontSize: 16,
        marginBottom: 15,
        textAlign: 'center'
    }
});

export default LoginScreen;