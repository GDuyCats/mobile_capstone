import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../../context/authContext';
import { Feather } from '@expo/vector-icons';
import HeaderLayout from '../../../components/HeaderLayout';

export default function AddFAQs({ route, navigation }: any) {
  const { projectId } = route.params;
  const { user } = useContext(AuthContext);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddFaq = async () => {
    if (!question.trim() || !answer.trim()) {
      Alert.alert('Warning', 'Please fill in both the Question and Answer.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `https://marvelous-gentleness-production.up.railway.app/api/Faq/AddFaq?projectId=${projectId}`,
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
      Alert.alert('Success', 'FAQ added successfully!');
      navigation.goBack();
    } catch (err) {
      console.log(err.response?.data || err.message);
      Alert.alert('Error', 'Failed to add FAQ. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{flex: 1}}>
      <HeaderLayout title={'Add New FAQ'} onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Question</Text>
        <TextInput
          value={question}
          onChangeText={setQuestion}
          style={styles.input}
          placeholder="Enter your question"
          placeholderTextColor="#aaa"
        />

        <Text style={styles.label}>Answer</Text>
        <TextInput
          value={answer}
          onChangeText={setAnswer}
          style={[styles.input, { height: 100 }]}
          placeholder="Enter the answer"
          placeholderTextColor="#aaa"
          multiline
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleAddFaq}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Submit FAQ</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
    backgroundColor: '#f9f9f9',
    flexGrow: 1,
  },
  backButton: {
    marginBottom: 10,
    width: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4da6ff',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
