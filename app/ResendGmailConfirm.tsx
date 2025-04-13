import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default function ResendGmailConfirm({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    if (!email) {
      Alert.alert('Lỗi', 'Vui lòng nhập email');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `https://marvelous-gentleness-production.up.railway.app/api/Authentication/resend?sEmail=${email}`
      );

      if (res.data.success) {
        Alert.alert('Thành công', 'Email xác nhận đã được gửi lại');
      } else {
        Alert.alert('Thất bại', res.data.message || 'Có lỗi xảy ra');
      }
    } catch (err: any) {
      console.log(err);
      Alert.alert('Lỗi', err?.response?.data?.message || 'Gửi thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nhập email để gửi lại xác nhận:</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        style={styles.input}
        autoCapitalize="none"
      />
      {loading ? (
        <ActivityIndicator size="small" color="#000" />
      ) : (
        <>
          <Button title="Gửi lại xác nhận" onPress={handleResend} />
          <TouchableOpacity
            style={
              { backgroundColor: '#32a852', 
                alignItems: 'center',
                padding: 10,
                marginVertical: 10 }}
            onPress={() => { navigation.goBack() }}>
            <Text style={
              { color: 'white', 
                fontWeight: 900
              }}>
              GO BACK
            </Text>
          </TouchableOpacity>
        </>


      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 40
  },
  label: {
    marginBottom: 10,
    fontSize: 16
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    padding: 10,
    marginBottom: 20
  }
});
