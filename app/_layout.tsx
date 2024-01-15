import { useEffect } from "react";
import { Slot, useRouter, useSegments } from "expo-router"
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { AuthProvider, useAuth } from "../provider/AuthProvider";

const queryClient = new QueryClient();

const InitialLayout = () => {
    const { token, initialized } = useAuth();
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        if (!initialized) return;
        console.log({ segments })

        const inAuthGroup = segments[0] === '(auth)';

        if (token && !inAuthGroup) {
            return router.replace('/(auth)/todos');
        } else if (!token && inAuthGroup) {
            return router.replace('/(public)/login');
        }

    }, [token, initialized]);

    return <Slot />
};

const RootLayout = () => {
    return (
        <AuthProvider>
            <QueryClientProvider client={queryClient}>
                <InitialLayout />
            </QueryClientProvider>
        </AuthProvider>
    )
};

export default RootLayout;