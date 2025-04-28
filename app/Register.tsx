import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
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

      const message = res.data?.message || 'Sign up successfully!';

      Alert.alert('✅ Sign up successfully', message, [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Login'),
        },
      ]);
    } catch (error: any) {
      const resData = error.response?.data;
      console.log('Register Fail !', resData);

      const errors = resData?.errors;
      const message = resData?.message;

      if (errors) {
        const messages = Object.values(errors).flat();
        const messageString = messages.join('\n');
        Alert.alert('Register Fail !', messageString);
      } else if (message) {
        Alert.alert('Register Fail !', message);
      } else {
        Alert.alert('Register Fail !', 'Error happen. Please try again later !');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView>
      <LinearGradient
        colors={['#0af519', '#08bf13']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={style.container}
      >
        <View style={{
          flex: 0.3, 
          paddingTop: 20,
          paddingLeft: 20,
          marginBottom: 50,
        }}>
          <Text style={style.title}>Create your account</Text>
        </View>

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

          <TouchableOpacity onPress={handleRegister} disabled={isSubmitting}>
            <LinearGradient
              colors={['#0af519', '#08bf13']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                style.loginButton,
                { backgroundColor: isSubmitting ? 'gray' : undefined },
              ]}
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={style.loginButtonText}>SIGN UP</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={{ marginHorizontal: 'auto' }}>
            <Text style={{ color: 'black', marginRight: 0, marginLeft: 'auto', fontWeight: '400', fontSize: 15, padding: 10 }}> You already have an account ?</Text>
            <Text style={{ fontWeight: '900', marginHorizontal: 'auto', padding: 10 }} onPress={() => navigation.navigate('Login')}> Sign in</Text>
          </View>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
  form: {
    flex: 0.7,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 60,
    paddingHorizontal: 40,
    backgroundColor: 'white'
  },
  label: {
    color: '#11D3AB',
    fontWeight: '800'
  },
  loginButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 'auto',
    width: 250,
    height: 50,
    borderRadius: 10,
    marginVertical: 10
  },
  loginButtonText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 20
  }
});
