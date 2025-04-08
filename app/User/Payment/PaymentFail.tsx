import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function PaymentFailed({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>❌ Thanh toán thất bại!</Text>
      <Button title="Thử lại" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'red',
  },
});
