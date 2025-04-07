import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function Register({ navigation }: any) {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    try {
      const res = await axios.post(
        'https://marvelous-gentleness-production.up.railway.app/api/Authentication/register',
        {
          email,
          password,
          'confirm-password': confirmPassword,
          fullname,
        }
      );

      const message = res.data?.message || 'Đăng ký thành công!';

      Alert.alert(
        '✅ Đăng ký thành công',
        message,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (error: any) {
      const resData = error.response?.data;
      console.log('Đăng ký thất bại:', resData);

      const errors = resData?.errors;
      const message = resData?.message;

      if (errors) {
        const messages = Object.values(errors).flat();
        const messageString = messages.join('\n');
        Alert.alert('❌ Đăng ký thất bại', messageString);
      } else if (message) {
        Alert.alert('❌ Đăng ký thất bại', message);
      } else {
        Alert.alert('❌ Đăng ký thất bại', 'Có lỗi xảy ra. Vui lòng thử lại.');
      }
    }
  };


  return (
    <LinearGradient
      colors={['#0af519', '#08bf13']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={style.container}>
      <Text style={style.title}>Create your account</Text>
      <View style={style.form}>
        <View style={{ borderBottomWidth: 1, borderBottomColor: 'gray', marginBottom: 20 }}>
          <Text style={style.label}> Fullname </Text>
          <TextInput
            placeholder="Fullname"
            value={fullname}
            onChangeText={setFullname}
          />
        </View>

        <View>
          <Text style={style.label}> Email</Text>
          <TextInput
            placeholder="Email@gmail.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={{ borderBottomWidth: 1, borderBottomColor: 'gray', marginBottom: 20 }}
          />
        </View>

        <View>
          <Text style={style.label}> Password </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'gray', marginBottom: 20 }}>
            <TextInput
              placeholder="123@Abc"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={{ flex: 1 }}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <MaterialIcons
                name={showPassword ? 'visibility' : 'visibility-off'}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <Text style={style.label}>Confirm Password </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'gray', marginBottom: 20 }}>
            <TextInput
              placeholder="123@Abc"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              style={{ flex: 1 }}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <MaterialIcons
                name={showConfirmPassword ? 'visibility' : 'visibility-off'}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>
        </View>

        <Button title="Đăng ký" onPress={handleRegister} />
      </View>
    </LinearGradient>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    justifyContent: 'center',
  },
  title: {
    flex: 0.3,
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
    paddingTop: 20,
    paddingLeft: 20,
    marginBottom: 24,
  },
  form: {
    flex: 0.7,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 60,
    paddingHorizontal: 40,
    backgroundColor: 'white'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10,
  },

  label: {
    color: '#11D3AB',
    fontWeight: '800'
  },
});
