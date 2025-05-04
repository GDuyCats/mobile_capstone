import React, { useContext, useState } from 'react'
import { View, Text, Alert, ActivityIndicator, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { useFocusEffect, useRoute } from '@react-navigation/native'
import { WebView } from 'react-native-webview'
import axios from 'axios'
import { AuthContext } from '../../../context/authContext'

function UserPayment({ route, navigation }: any) {
  const { user } = useContext(AuthContext)
  const { projectId, amount: amountFromReward } = route.params || {}

  const [amount, setAmount] = useState(amountFromReward ? amountFromReward.toString() : '')
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useFocusEffect(
    React.useCallback(() => {
      if (!user?.token) {
        Alert.alert(
          'You are not log in!',
          'Please sign in to continue!',
          [
            {
              text: 'OK',
              onPress: () =>
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                }),
            },
          ]
        );
        return;
      }

      if (user.role !== 'CUSTOMER') {
        Alert.alert(
          'Access denied!',
          'Your account does not have access to Payment!',
          [
            {
              text: 'OK',
              onPress: () =>
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Home' }],
                }),
            },
          ]
        );
      }
    }, [user])
  );

  const createPayment = async () => {
    const parsedAmount = parseFloat(amount)

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Error', 'Please insert right value!')
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
        Alert.alert('Error', 'Cannot get the payment URL!')
      }
    } catch (error: any) {
      console.log('Payment error:', error.response?.data || error.message)
      Alert.alert('Error', error.response?.data?.message || 'Cannot make a payment')
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
        navigation.navigate('PaymentSuccess')
      } else {
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
      <Text style={styles.label}>Enter Amount</Text>

      <View style={styles.amountInputContainer}>
        <Text style={styles.dollar}>$</Text>
        <TextInput
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="0.00"
          placeholderTextColor="#ccc"
          style={styles.amountInput}
        />
      </View>

      <TouchableOpacity style={styles.sendButton} onPress={createPayment}>
        <Text style={styles.sendButtonText}>Send Money</Text>
      </TouchableOpacity>

      {amountFromReward === undefined && (
        <View style={{ marginTop: 10 }}>
          <Text>No reward, just support the project</Text>
        </View>
      )}

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Go back</Text>
      </TouchableOpacity>
    </View>
  )
}

export default UserPayment

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  dollar: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'black',
  },
  amountInput: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'left',
    paddingLeft: 10,
    minWidth: 150,
  },
  sendButton: {
    backgroundColor: '#6323AF',
    paddingVertical: 20,
    paddingHorizontal: 100,
    borderRadius: 50,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: '900',
    fontSize: 16,
  },
  backText: {
    fontSize: 15,
    marginTop: 20,
    color: '#444',
  },
});
