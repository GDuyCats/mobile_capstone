import React, { useContext, useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../context/authContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function CreateStaff({navigation }: any) {
  const { user } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullname, setFullname] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleCreateStaff = async () => {
    if (!email || !password || !confirmPassword || !fullname) {
      Alert.alert('Missing Information', 'Please fill all information');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Email is invalid', 'Please fill correct email validation');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password is not match ', 'Please check the password again');
      return;
    }

    try {
      const res = await axios.post(
        'https://marvelous-gentleness-production.up.railway.app/api/Authentication/CreateStaff',
        {
          email,
          password,
          'confirm-password': confirmPassword,
          fullname,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      Alert.alert('Success', 'Create Staff successful !');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setFullname('');
      navigation.goBack()
    } catch (error: any) {
      console.log('Error while making a staff : ', error?.response?.data || error.message);
      Alert.alert('Error ', error?.response?.data.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        placeholder="abc@example.com"
      />

      <Text style={styles.label}>Mật khẩu</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.passwordInput}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <MaterialIcons
            name={showPassword ? 'visibility' : 'visibility-off'}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Xác nhận mật khẩu</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirm}
          style={styles.passwordInput}
        />
        <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
          <MaterialIcons
            name={showConfirm ? 'visibility' : 'visibility-off'}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Họ tên</Text>
      <TextInput
        style={styles.input}
        value={fullname}
        onChangeText={setFullname}
        placeholder="Nguyễn Văn A"
      />

      <Button title="Tạo Staff" onPress={handleCreateStaff} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 8,
  },
});
