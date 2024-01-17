import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../provider/AuthProvider";


const InsideLayout = () => {
    const { onLogout, token } = useAuth();

    const HeaderRight = () => (
        <TouchableOpacity onPress={onLogout} style={styles.headerRight}>
            <Ionicons name="log-out-outline" size={24} />
        </TouchableOpacity>
    );

    return (
        <Stack>
            <Stack.Screen name="todos" options={{
                headerTitle: 'My Todos', headerRight: HeaderRight
            }}
                redirect={!token}
            />
        </Stack>
    )
};

export default InsideLayout;

const styles = StyleSheet.create({
    headerRight: {
        marginRight: Platform.OS === 'ios' ? 15 : 0
    }
})