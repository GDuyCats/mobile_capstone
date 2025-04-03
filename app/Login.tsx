import axios from 'axios'
import React, { useContext, useState } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { AuthContext } from '../context/authContext';
export default function Login({ navigation }: any) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const { login } = useContext(AuthContext)
  const [isUploading, setIsUploading] = useState(false);
  const handleLogin = async () => {   
    setIsUploading(true)
    try {
      const res = await axios.post('https://marvelous-gentleness-production.up.railway.app/api/Authentication/login',
        {
          username,
          password,
        }
      )
      const token = res.data?.token
      const role = res.data?.role
      const avatar = res.data?.avatar
      await login({ token, role, avatar })
      setMessage(res.data?.message)
      setError('')
      setTimeout(() => {
        navigation.navigate('Home')
      }, 1000)
    } catch (err) {
      setMessage('')
      setError(err.response?.data?.message)
    } finally {
      setIsUploading(false)
    }
  }
  return (
    <View>
      <Text>GAME MKT</Text>
      <TextInput placeholder='username' value={username} onChangeText={setUsername} />
      <TextInput placeholder='password' value={password} onChangeText={setPassword} />
      <Text>{message}</Text>
      <Text>{error}</Text>
      {isUploading && (
        <View style={{ marginVertical: 10 }}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading ...</Text>
        </View>
      )}
      <Button title='Login' onPress={handleLogin} />
      <Button title='Chưa có tài khoản ?' onPress={() => navigation.navigate('Register')} />
    </View>
  );
}
