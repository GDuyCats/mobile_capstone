import React, { useContext, useState, useEffect } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../context/authContext';
import * as ImagePicker from 'expo-image-picker';

export default function Updateprofile({ navigation }: any) {
  const { user, updateUser } = useContext(AuthContext);
  const [isUploading, setIsUploading] = useState(false);
  const [isAvatarChanged, setIsAvatarChanged] = useState(false);

  const [email, setEmail] = useState('');
  const [fullname, setFullname] = useState('');
  const [paymentAccount, setPaymentAccount] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(user?.avatar || null);

  useEffect(() => {
    if (user) {
      setFullname(user.fullName || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setBio(user.bio || '');
      setPaymentAccount(user.paymentAccount || '');
    }
  }, [user]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
      setIsAvatarChanged(true);
    }
  };

  const uploadAvatar = async () => {
    if (!avatarUri) {
      Alert.alert('Please choose an Avatar');
      return;
    }

    setIsUploading(true);

    try {
      const fileName = avatarUri.split('/').pop() || 'avatar.jpg';
      const fileType = fileName.split('.').pop();

      const formData = new FormData();
      formData.append('file', {
        uri: avatarUri.startsWith('file://') ? avatarUri : `file://${avatarUri}`,
        name: fileName,
        type: `image/${fileType === 'jpg' ? 'jpeg' : fileType}`,
      } as any);

      const res = await axios.put(
        'https://marvelous-gentleness-production.up.railway.app/api/User/avatar',
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Upload avatar response:', res.data);

      const imageUrlRaw = res.data['image-url'];
      const imageUrl = imageUrlRaw ? imageUrlRaw.replace('http://', 'https://') : null;

      if (imageUrl) {
        setAvatarUri(imageUrl);
        updateUser({ avatar: imageUrl });
        Alert.alert('Avatar change successful!');
      } else {
        throw new Error('Upload failed: no image URL returned.');
      }
    } catch (error: any) {
      console.error('Upload Avatar Error:', error.message);
      Alert.alert('Failed to upload avatar', error.message || 'Unknown error');
    } finally {
      setIsUploading(false);
    }
  };


  const handleUpdate = async () => {
    const formData = new FormData();

    if (fullname) formData.append('Fullname', fullname);
    if (email) formData.append('Email', email);
    if (password) formData.append('Password', password);
    if (phone) formData.append('Phone', phone);
    if (bio) formData.append('Bio', bio);
    if (paymentAccount) formData.append('PaymentAccount', paymentAccount);

    try {
      await axios.post(
        'https://marvelous-gentleness-production.up.railway.app/api/User/UpdateUser',
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      updateUser({
        fullName: fullname,
        email,
        phone,
        bio,
        paymentAccount,
      });

      Alert.alert('Update successfully');
      navigation.goBack();
    } catch (error: any) {
      console.log('Error while update', error);
      Alert.alert('Error', error?.response?.data?.message || 'Error');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.container}>
        <View style={{ height: 120, backgroundColor: '#0C1C33' }} />
        {/* IMPORTANT*/}
        <View style={styles.avatarWrapper}>
          {avatarUri && avatarUri.startsWith('http') ? (
            <Image
              source={{ uri: avatarUri }}
              style={styles.avatar}
              onError={(e) => {
                console.log('Error loading avatar:', e.nativeEvent.error);
                setAvatarUri(null);
              }}
            />
          ) : (
            <MaterialIcons name="account-circle" size={120} color="black" />
          )}
        </View>
        {/* IMPORTANT*/}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={{ paddingHorizontal: 20, paddingTop: 80 }}>
            <TouchableOpacity onPress={pickImage} style={{ alignSelf: 'center' }}>
              <Text style={{ fontWeight: 900 }}>Choose Avatar</Text>
            </TouchableOpacity>

            {isAvatarChanged && (
              <TouchableOpacity onPress={uploadAvatar} style={{ alignSelf: 'center', marginTop: 6 }}>
                <Text style={{ fontWeight: 900 }}>Update Avatar</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.label}>Your full name</Text>
            <TextInput value={fullname} onChangeText={setFullname} style={styles.input} />
            <Text style={styles.label}>Email</Text>
            <TextInput value={email} onChangeText={setEmail} style={styles.input} />
            <Text style={styles.label}>Password</Text>
            <TextInput value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
            <Text style={styles.label}>Telephone number</Text>
            <TextInput value={phone} onChangeText={setPhone} style={styles.input} />
            <Text style={styles.label}>Payment account</Text>
            <TextInput value={paymentAccount} onChangeText={setPaymentAccount} style={styles.input} />
            <Text style={styles.label}>Your bio</Text>
            <TextInput value={bio} onChangeText={setBio} style={styles.input} />

            {isUploading && (
              <View style={{ marginVertical: 10 }}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading...</Text>
              </View>
            )}
            <View>

            </View>
            <TouchableOpacity
              onPress={handleUpdate}
              style={{ marginTop: 12, backgroundColor: '#5998f0', padding: 15, borderRadius: 50 }}>
              <Text style={{ marginHorizontal: 'auto', fontWeight: '900', color: 'white', borderRadius: 30 }}>Update information</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ScrollView >
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginTop: 4,
  },
  avatarWrapper: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    borderRadius: 100,
    padding: 6,
    backgroundColor: '#fff',
    zIndex: 10,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 100,
  },
});
