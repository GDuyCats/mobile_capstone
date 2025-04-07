import React from 'react'
import { View, Text, StyleSheet, Button } from 'react-native'

const PaymentFailed = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>❌ Thanh toán thất bại</Text>
      <Text style={styles.subText}>Đã có lỗi xảy ra hoặc bạn đã hủy giao dịch.</Text>
      <Button title="Thử lại" onPress={() => navigation.goBack()} />
    </View>
  )
}

export default PaymentFailed

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
    color: 'red',
    marginBottom: 12,
  },
  subText: {
    fontSize: 16,
    marginBottom: 20,
  },
})
