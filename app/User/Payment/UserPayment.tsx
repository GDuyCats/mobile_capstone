import React, { useContext, useState } from 'react'
import { View, Text, Alert, ActivityIndicator, StyleSheet, TextInput, Button } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { WebView } from 'react-native-webview'
import axios from 'axios'
import { AuthContext } from '../../../context/authContext'

function UserPayment({ route, navigation }: any) {
  const { user } = useContext(AuthContext)
  const { projectId } = route.params
  const [amount, setAmount] = useState('') 
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useFocusEffect(
    React.useCallback(() => {
      if (!user?.token) {
        Alert.alert('Bạn chưa đăng nhập', 'Vui lòng đăng nhập để tiếp tục.', [
          { text: 'OK', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Login' }] }) },
        ])
      } else if (user.role !== 'CUSTOMER') {
        Alert.alert(
          'Truy cập bị từ chối',
          'Tài khoản của bạn không có quyền truy cập trang thanh toán.',
          [{ text: 'OK', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Home' }] }) }]
        )
      }
    }, [user])
  )

  const createPayment = async () => {
    const parsedAmount = parseFloat(amount)

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập số tiền hợp lệ.')
      return
    }

    try {
      setLoading(true)
      const res = await axios.post(
        `https://marvelous-gentleness-production.up.railway.app/api/PaypalPayment/create?projectId=${projectId}&amount=${parsedAmount}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )

      const url = res.data?.data
      if (url) {
        setPaymentUrl(url)
      } else {
        Alert.alert('Lỗi', 'Không lấy được URL thanh toán.')
      }
    } catch (error: any) {
      console.log('Payment error:', error.response?.data || error.message)
      Alert.alert('Lỗi', error.response?.data?.message || 'Không thể tạo thanh toán.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Đang tạo thanh toán...</Text>
      </View>
    )
  }

  if (paymentUrl) {
    return <WebView source={{ uri: paymentUrl }} />
  }

  return (
    <View style={styles.center}>
      <Text>Nhập số tiền thanh toán:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        placeholder="VD: 2000"
      />
      <Button title="Tiến hành thanh toán" onPress={createPayment} />
    </View>
  )
}

export default UserPayment

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
})
