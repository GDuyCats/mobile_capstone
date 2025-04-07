import axios from 'axios'
import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
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
    <LinearGradient
      colors={['#0af519', '#08bf13']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={style.container}>
      <Text style={style.headerText}>WELCOME TO GAME MKT</Text>
      <View style={style.form}>
        <View style={{ borderBottomWidth: 1, borderBottomColor: 'gray', marginBottom: 20 }}>
          <Text style={style.label}> Gmail </Text>
          <TextInput placeholder='anemone@gmail.com' value={username} onChangeText={setUsername} />
        </View>
        <View style={{ borderBottomWidth: 1, borderBottomColor: 'gray' }}>
          <Text style={style.label}> Password </Text>
          <TextInput placeholder='Abcd@123' value={password} onChangeText={setPassword} />
        </View>
        <Text style={{ marginVertical: 20, fontWeight: 700, marginLeft: 'auto', marginRight: 0 }}>Forgot password ?</Text>
        {message && <Text style={{ marginBottom: 20, fontWeight: 800, color: 'green' }}>{message}</Text>}
        {error && <Text style={{ marginBottom: 20, fontWeight: 800, color: 'red' }}>{error}</Text>}
        {isUploading && (
          <View style={{ marginVertical: 10 }}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Loading ...</Text>
          </View>
        )}

        <TouchableOpacity onPress={handleLogin}>
          <LinearGradient
            colors={['#0af519', '#08bf13']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={style.loginButton}
          >
            <Text style={style.loginButtonText}>SIGN IN</Text>
          </LinearGradient>
        </TouchableOpacity>
        <Text style={{ color: 'black', marginRight: 0, marginLeft: 'auto', fontWeight: 400, fontSize: 15 }}>Don't have an account ?</Text>
        <Text style={{ fontWeight: 900, marginRight: 0, marginLeft: 'auto' }} onPress={() => navigation.navigate('Register')} > Sign up</Text>
      </View>

    </LinearGradient>

  );
}

const style = StyleSheet.create({
  container: {
    flex: 1
  },

  headerText: {
    padding: 40,
    color: 'white',
    fontWeight: '800',
    fontSize: 40,
    flex: 0.3
  },

  label: {
    color: '#11D3AB',
    fontWeight: '800'
  },

  form: {
    flex: 0.7,
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 60,
    paddingHorizontal: 40
  },

  loginButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 'auto',
    width: 250,
    height: 50,
    borderRadius: 10,
    marginBottom: 20
  },

  loginButtonText: {
    color: 'white',
    fontWeight: 800,
    fontSize: 20
  }
})
