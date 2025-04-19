import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import HeaderLayout from '../components/HeaderLayout';

export default function ResetPasswordWebView({ navigation, route }: any) {
  const { email } = route.params
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      Alert.alert('Thành công', 'Đặt lại mật khẩu thành công!');
      navigation.navigate('Login');
    } catch (err) {
      console.log(err);
      Alert.alert('Lỗi', 'Không đặt lại được mật khẩu');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderLayout title={'Reset Password'} onBackPress={() => { navigation.goBack() }} />
      <View style={styles.container}>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Nhập mật khẩu mới"
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

        <Button title="Đặt lại mật khẩu" onPress={handleReset} />
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
    borderRadius: 6,
    marginBottom: 20,
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 20,
  },
  icon: {
    position: 'absolute',
    right: 10,
    top: 12,
  },
});
