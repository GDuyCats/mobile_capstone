import React from 'react'
import { View, Text, StyleSheet, Button } from 'react-native'

const PaymentSuccess = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Thanh toán thành công!</Text>
      <Text style={styles.subText}>Cảm ơn bạn đã sử dụng dịch vụ.</Text>
      <Button title="Về trang chính" onPress={() => navigation.navigate('Home')} />
    </View>
  )
}

export default PaymentSuccess

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 12,
  },
  subText: {
    fontSize: 16,
    marginBottom: 20,
  },
})
