import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, Button, FlatList, ListRenderItem, TouchableOpacity, Image, ActivityIndicator, Platform } from 'react-native'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { Todo } from '@/interfaces';
import { createTodo, deleteTodo, getTodos, updateTodo, uploadImage } from '../../api/todos';
import { useAuth } from '../../provider/AuthProvider';

const Page = () => {
    const queryClient = useQueryClient();
    const { token } = useAuth();

    const [todo, setTodo] = useState('');

    const updateQueryClient = (updatedTodo: Todo) => {
        queryClient.setQueryData(['todos'], (data: any) => {
            return data.map((item: Todo) => (item._id === updatedTodo._id ? updatedTodo : item))
        });
    };

    // Query
    const { data, isFetching } = useQuery({
        queryKey: ['todos'],
        queryFn: getTodos
    });

    // Mutations
    const addMutation = useMutation({
        mutationFn: createTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
            setTodo('');
        }
    });

    const addTodo = () => {
        addMutation.mutate(todo);
    };

    const updateMutation = useMutation({
        mutationFn: updateTodo,
        onSuccess: updateQueryClient
    });

    const uploadImageMutation = useMutation({
        mutationFn: uploadImage,
        onSuccess: updateQueryClient
    });

    const deleteMutation = useMutation({
        mutationFn: deleteTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        }
    });


    const renderItem: ListRenderItem<Todo> = ({ item }) => {
        const deleteTodo = () => {
            deleteMutation.mutate(item._id);
        };

        const captureImage = async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1
            });

            if (!result.canceled) {
                const uri = result.assets[0].uri;
                uploadImageMutation.mutate({ id: item._id, uri, token: token! });
            }
        };

        const toggleDone = () => {
            const updatedTodo = { ...item, status: item.status === 1 ? 0 : 1 };
            updateMutation.mutate(updatedTodo);
        };

        return (
            <View style={styles.rootContainer}>
                {item.img && <Image source={{ uri: item.img, headers: { Authorization: `Bearer ${token}` } }} style={{ width: '100%', height: 200, opacity: item.status === 0 ? 1 : 0.4 }} />}
                <View style={styles.todoContainer}>
                    <TouchableOpacity onPress={toggleDone} style={styles.todo}>
                        {item.status === 0 && <Entypo name="circle" size={24} color='black' />}
                        {item.status === 1 && <Ionicons name="checkmark-circle-outline" size={24} color='green' />}
                        <Text style={styles.todoText}>{item.task}</Text>
                    </TouchableOpacity>
                    <Ionicons name="trash-bin-outline" size={24} color='red' onPress={deleteTodo} />
                    <Ionicons name="camera-outline" size={24} color='blue' onPress={captureImage} />
                </View>
            </View>
        )
    };

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <TextInput placeholder="Add new todo" style={styles.input} value={todo} onChangeText={setTodo} />
                <Button title="Add" onPress={addTodo} disabled={todo === ''} />
            </View>
            <FlatList data={data} keyExtractor={(item) => item._id} renderItem={renderItem} />
            {isFetching && <ActivityIndicator />}
        </View>

    );
};

export default Page;

const styles = StyleSheet.create({
    rootContainer: {
        marginBottom: 6
    },
    container: {
        marginHorizontal: 20,
    },
    form: {
        flexDirection: 'row',
        marginVertical: 20,
        alignItems: 'center'
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#fff',
        borderColor: 'gray',
        marginRight: Platform.OS === 'ios' ? 0 : 10
    },
    todoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        gap: 10,
        marginVertical: 4,
        backgroundColor: '#fff',
    },
    todo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    todoText: {
        flex: 1,
        paddingHorizontal: 12

    }
});
