import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { AuthContext } from '../../../../context/authContext';
import HeaderLayout from '../../../../components/HeaderLayout';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

export default function UpdateProjectPost({ route, navigation }: any) {
  const { postId, currentTitle, currentDescription, currentStatus } = route.params;
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState(currentTitle || '');
  const [description, setDescription] = useState(currentDescription || '');
  const [status, setStatus] = useState(currentStatus || 'PUBLIC');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!title || !description) {
      Alert.alert('Error', 'Please enter title and description');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('status', status);

      await axios.put(
        'https://marvelous-gentleness-production.up.railway.app/api/Post/Update',
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data',
          },
          params: { postId },
        }
      );

      Alert.alert('Success', 'Post updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.log('Update post error:', error);
      Alert.alert('Error', 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <HeaderLayout title="Update Post" onBackPress={() => navigation.goBack()} />
      <View style={styles.form}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          placeholder="Enter title"
        />

        <Text style={styles.label}>Description (HTML allowed)</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          multiline
          style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
          placeholder="Enter description"
        />

        <Text style={styles.label}>Status</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={status} onValueChange={setStatus}>
            <Picker.Item label="EXCLUSIVE" value="EXCLUSIVE" />
            <Picker.Item label="PRIVATE" value="PRIVATE" />
            <Picker.Item label="PUBLIC" value="PUBLIC" />
            <Picker.Item label="DELETED" value="DELETED" />
          </Picker>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleUpdate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Update Post</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f4f7' },
  form: { padding: 20 },
  label: { fontSize: 15, fontWeight: '600', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 24,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4da6ff',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
