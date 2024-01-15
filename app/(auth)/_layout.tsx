import { TouchableOpacity } from "react-native";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../provider/AuthProvider";


const InsideLayout = () => {
    const { onLogout, token } = useAuth();

    return (
        <Stack>
            <Stack.Screen name="todos" options={{
                headerTitle: 'My Todos', headerRight: () => (
                    <TouchableOpacity onPress={onLogout}>
                        <Ionicons name="log-out-outline" size={24} />
                    </TouchableOpacity>
                )
            }}
                redirect={!token}
            />
        </Stack>
    )
};

export default InsideLayout;