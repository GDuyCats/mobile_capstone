import React, { useContext, useState } from 'react'
import { View, Text, Alert, ActivityIndicator, StyleSheet, TextInput, Button, TouchableOpacity } from 'react-native'
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
        return null
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

  const executePayment = async (paymentId: string, token: string, PayerID: string) => {
    try {
      setLoading(true)
      const res = await axios.get(
        'https://marvelous-gentleness-production.up.railway.app/api/PaypalPayment/execute',
        {
          params: { paymentId, token, PayerID },
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )

      if (res.data?.success) {
        Alert.alert('✅ Success', res.data.message || 'Payment Success !')
        navigation.navigate('PaymentSuccess')
      } else {
        Alert.alert('❌ Fail', res.data.message || 'Payment Fail !')
        navigation.navigate('PaymentFailed')
      }
    } catch (error: any) {
      Alert.alert('Error', `${error}`)
      navigation.navigate('PaymentFailed')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Đang xử lý...</Text>
      </View>
    )
  }

  if (paymentUrl) {
    return (
      <WebView
        source={{ uri: paymentUrl }}
        onNavigationStateChange={(navState) => {
          const { url } = navState
          if (url.includes('/payment/result')) {
            const params = new URLSearchParams(url.split('?')[1])
            const paymentId = params.get('paymentId')
            const token = params.get('token')
            const PayerID = params.get('PayerID')

            if (paymentId && token && PayerID) {
              setPaymentUrl(null)
              executePayment(paymentId, token, PayerID)
            }
          }
        }}
      />
    )
  }

  return (
    <View style={styles.center}>
      <Text>Enter the amount you want to contribute.
      </Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        placeholder="For example : 2000 $"
      />
      <Button title="Process payment" onPress={createPayment} />
      <TouchableOpacity
        style={
          {
            marginTop: 10,
            backgroundColor: 'green',
            alignItems: 'center',
            padding: 10
          }}
        onPress={() => navigation.goBack()} >
        <Text style={{ color: 'white', fontSize: 15 }}>GO BACK</Text>
      </TouchableOpacity>
    </View>
  )
}

export default UserPayment

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginVertical: 12,
  },
})
