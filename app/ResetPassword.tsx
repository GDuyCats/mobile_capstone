import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import HeaderLayout from '../components/HeaderLayout';
import { LinearGradient } from 'expo-linear-gradient';

export default function ResetPasswordWebView({ navigation, route }: any) {
  const { email } = route.params;
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async () => {
    if (!newPassword) {
      Alert.alert('Error', 'Please enter a new password');
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        `https://marvelous-gentleness-production.up.railway.app/api/ForgotPassword/Reset-Password`,
        null,
        {
          params: { email, newPassword },
        }
      );

      const { success, message } = res.data;
      if (!success) {
        Alert.alert('Error', message);
        return;
      }

      Alert.alert('Success', 'Password reset successfully');
      navigation.navigate('Login');
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', 'Can not reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <HeaderLayout
        title={'Reset Password'}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="New Password"
            secureTextEntry={!showPassword}
            value={newPassword}
            onChangeText={setNewPassword}
            style={styles.input}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.icon}>
            <MaterialIcons
              name={showPassword ? 'visibility' : 'visibility-off'}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleReset}
          disabled={isLoading}
          style={{ alignSelf: 'center' }}
        >
          <LinearGradient
            colors={['#19c213', '#7cf578']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            {isLoading
              ? <ActivityIndicator color="white" />
              : <Text style={styles.buttonText}>CONTINUE</Text>
            }
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  inputWrapper: {
    marginTop: 60,
    position: 'relative',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    borderRadius: 20,
    marginBottom: 20,
  },
  icon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 50,
    width: 500
  },
  buttonText: {
    color: 'white',
    fontWeight: '900',
    fontSize: 20,
    textAlign: 'center',
  },
});
