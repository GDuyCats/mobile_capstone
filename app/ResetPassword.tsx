import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import HeaderLayout from '../components/HeaderLayout';
import { LinearGradient } from 'expo-linear-gradient';
export default function ResetPasswordWebView({ navigation, route }: any) {
  const { email } = route.params
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
      const [isLoading, setisLoading] = useState(false)
  const handleReset = async () => {
    try {
      await axios.post(
        `https://marvelous-gentleness-production.up.railway.app/api/ForgotPassword/Reset-Password`,
        null,
        {
          params: {
            email,
            newPassword
          },
        }
      );
      Alert.alert('Success', 'Password reset successfully');
      navigation.navigate('Login');
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Can not reset password');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <HeaderLayout title={'Reset Password'} onBackPress={() => { navigation.goBack() }} />
      <View style={styles.container}>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="New Password"
            secureTextEntry={!showPassword}
            value={newPassword}
            onChangeText={setNewPassword}
            style={styles.input}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.icon}
          >
            <MaterialIcons
              name={showPassword ? 'visibility' : 'visibility-off'}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleReset}>
          <LinearGradient
            colors={['#19c213', '#7cf578']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ paddingVertical: 20, paddingHorizontal: 40, borderRadius: 50 }}
          >
            <Text
              style={
                {
                  marginHorizontal: 'auto',
                  color: 'white',
                  fontWeight: 500,
                  fontSize: 15,
                }}>
              {isLoading ? 'CONTINUE...' : 'CONTINUE'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    borderRadius: 20,
    marginBottom: 20,
  },
  inputWrapper: {
    marginTop: 60,

    position: 'relative',
    marginBottom: 20,
  },
  icon: {
    position: 'absolute',
    right: 10,
    top: 8,
  },
});
