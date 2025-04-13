import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import axios from 'axios';

export default function ResetPasswordWebView({ navigation }: any) {
  const [token, setToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');

  const handleReset = async () => {
    if (!token || !newPassword) return Alert.alert('Thiếu token hoặc mật khẩu');

    try {
      await axios.post(
        'https://marvelous-gentleness-production.up.railway.app/api/Authentication/ResetPassword',
        null,
        {
          params: {
            token: token,
            newPassword: newPassword,
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
      {!token && (
        <WebView
          source={{ uri: 'https://marvelous-gentleness-production.up.railway.app/swagger/confirm?token=abc123' }}
          onNavigationStateChange={(navState) => {
            const { url } = navState;
            if (url.includes('token=')) {
              const params = new URLSearchParams(url.split('?')[1]);
              const foundToken = params.get('token');
              if (foundToken) {
                setToken(foundToken);
              }
            }
          }}
        />
      )}
      {token && (
        <View style={styles.container}>
          <TextInput
            placeholder="Nhập mật khẩu mới"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            style={styles.input}
          />
          <Button title="Đặt lại mật khẩu" onPress={handleReset} />
        </View>
      )}
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
});
