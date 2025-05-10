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
  useWindowDimensions,
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../../context/authContext';
import { Feather } from '@expo/vector-icons';
import HeaderLayout from '../../../components/HeaderLayout';
import RenderHTML from 'react-native-render-html';

export default function FAQList({ route, navigation }: any) {
  const { projectId } = route.params;
  const { user } = useContext(AuthContext);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();

  const fetchFAQs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://marvelous-gentleness-production.up.railway.app/api/Faq/GetFaqByProjectId?projectId=${projectId}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setFaqs(res.data.data || []);
    } catch (err) {
      console.warn('Fetch FAQs error', err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchFAQs(); }, []));

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate('UpdateFAQs', {
          projectId,
          oldQuestion: item.question,
          oldAnswer: item.answer,
        })
      }
    >
      <Text style={styles.answerPrefix}>
        Q: <Text style={styles.questionText}>{item.question}</Text>
      </Text>

      <View style={styles.answerContainer}>
        <Text style={styles.answerPrefix}>A:</Text>
        <RenderHTML
          contentWidth={width - 64}  // list padding + card padding
          source={{ html: item.answer }}
          baseStyle={styles.answerText}
          tagsStyles={{
            h1: { fontSize: 20, fontWeight: '700', color: '#333' },
            p: { lineHeight: 20 },
            strong: { fontWeight: '700', color: '#222' },
          }}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <HeaderLayout title="FAQs" onBackPress={() => navigation.goBack()} />
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
          keyExtractor={(_, i) => i.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddFAQs', { projectId })}
      >
        <Feather name="plus" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f4f7' },

  list: {
    padding: 16,
    paddingBottom: 80,
  },

  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // Android
    elevation: 5,
  },

  question: {
    fontSize: 18,
    marginBottom: 8,
  },
  questionText: {
    fontWeight: '700',
    color: '#1a1a1a',
  },

  answerContainer: {
    flexDirection: 'row',
    justifyContent:'center',
    alignItems: 'baseline',
  },
  answerPrefix: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginRight: 6,
    marginTop:9,
    lineHeight: 24,
  },
  answerText: {
    flex: 1,
    fontSize: 16,
    color: '#4a4a4a',
  },

  empty: {
    fontStyle: 'italic',
    color: '#888',
  },

  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#4da6ff',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
});
