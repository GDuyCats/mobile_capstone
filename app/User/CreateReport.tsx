import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import HeaderLayout from '../../components/HeaderLayout';
import { AuthContext } from '../../context/authContext';
import axios from 'axios';

export default function CreateReport({ navigation }: any) {
  const { user } = useContext(AuthContext);
  const [description, setDescription] = useState('');
  const [disabled, setDisabled] = useState(false)

  const handleSubmit = async () => {
    if (!description) {
      Alert.alert('Thiếu nội dung', 'Vui lòng nhập chi tiết báo cáo!');
      return;
    }

    try {
      await axios.post(
        'https://marvelous-gentleness-production.up.railway.app/api/Report/CreateReport',
        { detail: description },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      Alert.alert('Success', 'Send report successful !');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Can not sent the report!');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderLayout title={'Create Report'} onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Report Detail</Text>
        <TextInput
          style={[styles.input, { height: 140, textAlignVertical: 'top' }]}
          placeholder="Describe your issue or feedback here..."
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit Report</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 16,
    color: '#00246B',
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#00246B',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
