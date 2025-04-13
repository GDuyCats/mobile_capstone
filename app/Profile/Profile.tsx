import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../context/authContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface ProfileData {
  avatar: string;
  email: string;
  ['full-name']: string;
  role: string;
  phone: string;
  bio: string;
  ['created-datetime']: string;
}

export default function Profile({ navigation }: any) {
  const { user, updateUser } = useContext(AuthContext);
  const [isUploading, setIsUploading] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);

  const getUser = async () => {
    setIsUploading(true);
    try {
      const res = await axios.get(
        'https://marvelous-gentleness-production.up.railway.app/api/User/GetUserById',
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const profileData = res.data.data;
      setProfile(profileData);
      updateUser({
        fullName: profileData['full-name'],
        email: profileData.email,
        phone: profileData.phone,
        role: profileData.role,
      });
    } catch (error) {
      console.log('❌ Lỗi khi fetch user:', error);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (user?.token) {
        getUser();
      }
    });

    return unsubscribe;
  }, [navigation, user?.token]);

  return (
    <View style={styles.container}>
      {isUploading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#8e44ad" />
          <Text>Đang tải thông tin lên ...</Text>
        </View>
      ) : (
        profile && (
          <View style={styles.card}>
            {user?.avatar ? (
              <Image
                source={{ uri: user?.avatar }}
                style={styles.avatar} />
            ) : (
              <MaterialIcons name="account-circle" size={120} color="black" />
            )}
            <Text style={styles.name}>{profile['full-name']}</Text>
            <Text style={[styles.info, { fontWeight: 900 }]}>Gmail: <Text style={{ fontWeight: 400 }}>{profile.email}</Text></Text>
            <Text style={[styles.info, { fontWeight: 900 }]}>Phone: <Text style={{ fontWeight: 400 }}>{profile.phone}</Text></Text>
            <Text style={[styles.info, { fontWeight: 900 }]}>Role: <Text style={{ fontWeight: 400 }}>{profile.role}</Text></Text>
            <Text style={[styles.info, { fontWeight: 900 }]}>Bio: <Text style={{ fontWeight: 400 }}>{profile.bio}</Text></Text>
            <Text style={[styles.info, { fontWeight: 900 }]}>Created: <Text style={{ fontWeight: 400 }}>{profile['created-datetime']}</Text></Text>
          </View>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f8',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loading: {
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    width: '100%',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#8e44ad',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  info: {
    fontSize: 16,
    color: '#555',
    marginVertical: 2,
  },
  button: {
    marginTop: 16,
    backgroundColor: '#8e44ad',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
