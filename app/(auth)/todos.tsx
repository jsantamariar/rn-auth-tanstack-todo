import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, Button, FlatList, ListRenderItem, TouchableOpacity } from 'react-native'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createTodo, deleteTodo, getTodos, updateTodo } from '../../api/todos';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { Todo } from '@/interfaces';

const Page = () => {
    const queryClient = useQueryClient();

    const [todo, setTodo] = useState('');

    const query = useQuery({
        queryKey: ['todos'],
        queryFn: getTodos
    });

    const addMutation = useMutation({
        mutationFn: createTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
            setTodo('');
        }
    });

    const updateMutation = useMutation({
        mutationFn: updateTodo,
        onSuccess: (updated) => {
            queryClient.setQueryData(['todos'], (data: Todo[]) => {
                return data.map((item: Todo) => item._id === updated._id ? updated : item)
            });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        }
    })

    const addTodo = () => {
        addMutation.mutate(todo);
    };

    const renderItem: ListRenderItem<Todo> = ({ item }) => {
        const deleteTodo = () => {
            deleteMutation.mutate(item._id);
        };

        const captureImage = () => {

        };

        const toggleDone = () => {
            const updatedTodo = { ...item, status: item.status === 1 ? 0 : 1 }
            updateMutation.mutate(updatedTodo);
        };

        return (
            <View style={{ marginBottom: 6 }}>
                <View style={styles.todoContainer}>
                    <TouchableOpacity onPress={toggleDone} style={styles.todo}>
                        {item.status === 0 && <Entypo name="circle" size={24} color='black' />}
                        {item.status === 1 && <Ionicons name="checkmark-circle-outline" size={24} color='green' />}
                        <Text style={styles.todoText}>{item.task}</Text>
                    </TouchableOpacity>
                    <Ionicons name="trash-bin-outline" size={24} color={'red'} onPress={deleteTodo} />
                    <Ionicons name="camera-outline" size={24} color={'blue'} onPress={deleteTodo} />
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
            <FlatList data={query.data} keyExtractor={todo => todo._id} renderItem={renderItem} />
        </View>
    );
};

export default Page;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        flex: 1,
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
