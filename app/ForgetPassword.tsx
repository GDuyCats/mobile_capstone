import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

export default function ForgetPassword({navigation}: any) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please insert your email !');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `https://marvelous-gentleness-production.up.railway.app/api/Authentication/ForgetPassword?email=${email}`
      );

      if (response.data.success) {
        console.log(response.data.message)
        Alert.alert('Success', `${response.data.message}`);
        navigation.navigate('ResetPassword')
      } else {
        Alert.alert('Fail', 'Can not send the email !');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Please try again letter !');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset password</Text>
      <TextInput
        placeholder="Your email (example: George@gmail.com )"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <Button title={loading ? 'Sending...' : 'Send email'} onPress={handleForgetPassword} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 16,
    borderRadius: 6
  }
});
