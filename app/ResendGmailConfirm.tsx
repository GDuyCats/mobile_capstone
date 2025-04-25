import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import HeaderLayout from '../components/HeaderLayout';

export default function ResendGmailConfirm({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    if (!email) {
      Alert.alert('Error', 'Please fill your email');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `https://marvelous-gentleness-production.up.railway.app/api/Authentication/resend?sEmail=${email}`
      );

      if (res.data.success) {
        Alert.alert('Success', 'A confirm mail has been sent!');
      } else {
        Alert.alert('Failed', res.data.message || 'There is an error');
      }
    } catch (err: any) {
      console.log(err);
      Alert.alert('Error', err?.response?.data?.message || 'Send failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <HeaderLayout title={'Resend Confirm Email'} onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Enter your email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        {loading ? (
          <ActivityIndicator size="small" color="#3366FF" />
        ) : (
          <>
            <TouchableOpacity style={styles.sendButton} onPress={handleResend}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>Go Back</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fefefe',
  },
  container: {
    padding: 20,
    paddingTop: 40,
    flexGrow: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    color: '#00246B',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  sendButton: {
    backgroundColor: '#3366FF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: '#32a852',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
