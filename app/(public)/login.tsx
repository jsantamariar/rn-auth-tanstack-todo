import React, { useState } from 'react'
import { View, StyleSheet, Image, TextInput, Button, Pressable, Text } from 'react-native';
import { Link } from 'expo-router';
import Spinner from 'react-native-loading-spinner-overlay'
import { useAuth } from '../../provider/AuthProvider';

const Page = () => {
    const [email, setEmail] = useState('jorge@dev.com');
    const [password, setPassword] = useState('123456');
    const [loading, setLoading] = useState(false);

    const { onLogin } = useAuth();

    const handleLogin = async () => {
        try {
            setLoading(true);
            await onLogin!(email, password);
        } catch (error: any) {
            alert(error.message)
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Spinner visible={loading} />
            <Image style={styles.image} source={{ uri: 'https://galaxies.dev/img/lockup.webp' }} />
            <TextInput style={styles.inputField} placeholder="Email" value={email} onChangeText={setEmail} />
            <TextInput secureTextEntry style={styles.inputField} placeholder="Password" value={password} onChangeText={setPassword} />
            <Button title="Login" onPress={handleLogin} disabled={loading} />
            <Link href="/(public)/register" asChild>
                <Pressable style={styles.button}>
                    <Text>Create a new account</Text>
                </Pressable>
            </Link>
        </View>
    )
}

export default Page;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    image: {
        width: 200,
        height: 200,
        objectFit: 'contain',
        alignSelf: 'center',
        marginBottom: 20
    },
    inputField: {
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        marginVertical: 8
    },
    button: {
        alignItems: 'center'
    }

})