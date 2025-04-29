import React, { useEffect, useState, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    ScrollView,
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../../context/authContext';
import { Feather } from '@expo/vector-icons';
import HeaderLayout from '../../../components/HeaderLayout';

export default function FAQList({ route, navigation }: any) {
    const { projectId } = route.params;
    const { user } = useContext(AuthContext);
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFAQs = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                `https://marvelous-gentleness-production.up.railway.app/api/Faq/GetFaqByProjectId?projectId=${projectId}`,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );
            setFaqs(res.data.data || []);
        } catch (error) {
            console.log('Failed to fetch FAQs:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchFAQs();
        }, [])
    );

    const renderItem = ({ item }: any) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() =>
                navigation.navigate('UpdateFAQs', {
                    projectId,
                    oldQuestion: item.question,
                    oldAnswer: item.answer,
                })
            }
        >
            <Text style={styles.question}>Q: {item.question}</Text>
            <Text style={styles.answer}>A: {item.answer}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1 }}>
            <HeaderLayout title={'FAQs'} onBackPress={() => navigation.goBack()} />

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#4da6ff" />
                </View>
            ) : faqs.length === 0 ? (
                <View style={styles.centered}>
                    <Text style={styles.empty}>No FAQs found.</Text>
                </View>
            ) : (
                <FlatList
                    data={faqs}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                />
            )}

            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AddFAQs', { projectId })}
            >
                <Feather name="plus" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        position: 'relative',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    list: {
        padding: 20,
        paddingBottom: 50,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    question: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 6,
        color: '#333',
    },
    answer: {
        fontSize: 15,
        color: '#666',
    },
    empty: {
        textAlign: 'center',
        color: '#999',
        fontStyle: 'italic',
        marginTop: 50,
    },
    fab: {
        position: 'absolute',
        bottom: 25,
        right: 25,
        backgroundColor: '#4da6ff',
        width: 55,
        height: 55,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
    },
});
