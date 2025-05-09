import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import HeaderLayout from '../components/HeaderLayout';
import { LinearGradient } from 'expo-linear-gradient';

export default function ForgetPassword({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);


  const handleForgetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please insert your email !');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('email', email);

      const response = await axios.post(
        `https://marvelous-gentleness-production.up.railway.app/api/ForgotPassword/Send-Code`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log(response.data);
      if (response.status === 200) {
        Alert.alert('Success', 'Code sent successfully!');
        navigation.navigate('VerifyCode', { email });
      } else {
        Alert.alert('Fail', 'Can not send the email !');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Please try again later !');
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={{flex: 1}}>
      <HeaderLayout title="Forgot Password" onBackPress={() => navigation.goBack()} />
      <View style={styles.container}>
        <Text style={{ marginHorizontal: 'auto', marginVertical: 40, fontSize: 20, fontWeight: 800 }}>Enter Email Address</Text>
        <TextInput
          placeholder="Your email (example: George@gmail.com )"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ marginHorizontal: 'auto', fontWeight: 300, marginBottom: 20 }}>Back to sign in</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleForgetPassword} disabled={loading}>
          <LinearGradient
            colors={['#19c213', '#7cf578']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ padding: 20, borderRadius: 50 }}
          >
            <Text
              style={
                {
                  marginHorizontal: 'auto',
                  color: 'white',
                  fontWeight: 500,
                  fontSize: 15
                }}>
              {loading ? 'Sending...' : 'Send'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
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
    borderRadius: 50
  }
});
