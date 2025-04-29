import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../../context/authContext';
import HeaderLayout from '../../../components/HeaderLayout';

export default function UpdateFAQ({ route, navigation }: any) {
    const { projectId, oldQuestion, oldAnswer } = route.params;
    const { user } = useContext(AuthContext);
    const [question, setQuestion] = useState(oldQuestion);
    const [answer, setAnswer] = useState(oldAnswer);
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        if (!question.trim() || !answer.trim()) {
            Alert.alert('Warning', 'Please fill in both fields.');
            return;
        }

        setLoading(true);
        try {
            await axios.put(
                `https://marvelous-gentleness-production.up.railway.app/api/Faq/UpdateFaq?projectId=${projectId}&oldQuestion=${encodeURIComponent(oldQuestion)}`,
                {
                    Question: question,
                    Answer: answer,
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            Alert.alert('Success', 'FAQ updated successfully!');
            navigation.goBack();
        } catch (err) {
            console.log(err.response?.data || err.message);
            Alert.alert('Error', 'Failed to update FAQ.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        Alert.alert('Confirm Delete', 'Are you sure you want to delete this FAQ?', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    setLoading(true); 
                    try {
                      await axios.delete(
                        `https://marvelous-gentleness-production.up.railway.app/api/Faq/DeleteFaq?projectId=${projectId}&question=${encodeURIComponent(oldQuestion)}`,
                        {
                          headers: {
                            Authorization: `Bearer ${user.token}`,
                          },
                        }
                      );
                      Alert.alert('Deleted', 'FAQ deleted successfully!');
                      navigation.goBack();
                    } catch (err) {
                      console.log(err.response?.data || err.message);
                      Alert.alert('Error', 'Failed to delete FAQ.');
                    } finally {
                      setLoading(false); 
                    }
                  }
            },
        ]);
    };

    return (
        <View style={{ flex: 1 }}>
            <HeaderLayout title="Update FAQ" onBackPress={() => navigation.goBack()} />
            <ScrollView style={styles.container}>

                <Text style={styles.label}>Question</Text>
                <TextInput
                    style={styles.input}
                    value={question}
                    onChangeText={setQuestion}
                    placeholder="Enter new question"
                />

                <Text style={styles.label}>Answer</Text>
                <TextInput
                    style={[styles.input, { height: 100 }]}
                    value={answer}
                    onChangeText={setAnswer}
                    multiline
                    placeholder="Enter new answer"
                />

                <TouchableOpacity
                    style={[styles.button, loading && { opacity: 0.6 }]}
                    onPress={handleUpdate}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Update FAQ</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.deleteButton, loading && { opacity: 0.6 }]}
                    onPress={handleDelete}
                    disabled={loading}
                >
                    <Text style={styles.deleteText}>Delete FAQ</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    label: {
        fontWeight: '600',
        fontSize: 16,
        marginBottom: 6,
        color: '#444',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#fff',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#4da6ff',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
    deleteButton: {
        backgroundColor: '#ff4d4d',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    deleteText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
});
