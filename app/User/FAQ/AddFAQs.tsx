import React, { useState, useContext } from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../../context/authContext';
import { Feather } from '@expo/vector-icons';
import HeaderLayout from '../../../components/HeaderLayout';
import RenderHtml from 'react-native-render-html';

export default function AddFAQs({ route, navigation }) {
  const { projectId } = route.params;
  const { user } = useContext(AuthContext);
  const { width } = useWindowDimensions();

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [answerHeight, setAnswerHeight] = useState(80);
  const [loading, setLoading] = useState(false);

  const handleAddFaq = async () => {
    if (!question.trim() || !answer.trim()) {
      Alert.alert('Warning', 'Please fill in both the Question and Answer.');
      return;
    }

    setLoading(true);
    try {
      await axios.post(
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
    <View style={{ flex: 1 }}>
      <HeaderLayout title="Add New FAQ" onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Question</Text>
        <TextInput
          value={question}
          onChangeText={setQuestion}
          style={styles.input}
          placeholder="Enter your question"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Answer (HTML)</Text>
        <TextInput
          value={answer}
          onChangeText={setAnswer}
          multiline
          placeholder="<p><strong>Answer content here</strong></p>"
          placeholderTextColor="#999"
          onContentSizeChange={e => setAnswerHeight(e.nativeEvent.contentSize.height)}
          style={[styles.input, { height: Math.max(80, answerHeight) }]}
        />

        <Text style={[styles.label, { marginTop: 12 }]}>Preview</Text>
        <View style={styles.preview}>
          <RenderHtml
            contentWidth={width - 32}
            source={{ html: answer }}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleAddFaq}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Submit FAQ</Text>}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    flexGrow: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
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
  preview: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
    minHeight: 80,
    marginBottom: 16,
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
