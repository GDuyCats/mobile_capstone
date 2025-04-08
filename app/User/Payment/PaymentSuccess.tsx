import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function PaymentSuccess({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🎉 Thanh toán thành công!</Text>
      <Button title="Về trang chủ" onPress={() => navigation.navigate('Home')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'green',
  },
});
