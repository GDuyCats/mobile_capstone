import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, FlatList, TouchableOpacity, Animated, LayoutAnimation, Platform, UIManager } from 'react-native';
import axios from 'axios';
import AntDesign from '@expo/vector-icons/AntDesign';
import { AuthContext } from '../context/authContext';
import { useRoute } from '@react-navigation/native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function FAQ() {
  const route = useRoute<any>();
  const { projectId } = route.params;
  const { user } = useContext(AuthContext);
  const [faqList, setFaqList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  useEffect(() => {
    const fetchFAQ = async () => {
      try {
        const res = await axios.get(
          `https://marvelous-gentleness-production.up.railway.app/api/Faq/GetFaqByProjectId`,
          {
            params: { projectId },
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setFaqList(res.data.data || []);
      } catch (err) {
        console.log('Error', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQ();
  }, [projectId]);

  const toggleExpand = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (faqList.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Chưa có câu hỏi nào.</Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Frequently Asked Questions</Text>
      <FlatList
        data={faqList}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => {
          const isExpanded = expandedItems.includes(index);
          return (
            <View style={styles.faqItem}>
              <TouchableOpacity
                style={styles.row}
                onPress={() => toggleExpand(index)}
              >
                <Text style={styles.question}>{item.question}</Text>
                <AntDesign
                  name={isExpanded ? 'upcircleo' : 'downcircleo'}
                  size={22}
                  color="#333"
                />
              </TouchableOpacity>
              {isExpanded && (
                <View style={styles.answerContainer}>
                  <Text style={styles.answer}>{item.answer}</Text>
                </View>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faqItem: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  question: {
    fontSize: 16,
    fontWeight: '500',
    color: '#00246B',
    flex: 1,
    paddingRight: 10,
  },
  answerContainer: {
    marginTop: 8,
  },
  answer: {
    fontSize: 15,
    color: '#444',
    lineHeight: 20,
  },
});
