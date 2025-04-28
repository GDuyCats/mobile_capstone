import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Zocial from '@expo/vector-icons/Zocial';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../../context/authContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import HeaderLayout from '../../components/HeaderLayout';
interface ProfileData {
  avatar: string;
  email: string;
  ['full-name']: string;
  phone: string;
  bio: string;
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
      console.log('Error while getting user information', error);
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
      <HeaderLayout title='Profile' onBackPress={() => navigation.goBack()} background="#0C1C33" fontColor="#fff" />
      {isUploading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#8e44ad" />
        </View>
      ) : (
        profile && (
          <View style={{ flex: 1 }}>
            <View style={{ flex: 0.1, backgroundColor: '#0C1C33' }}>
            </View>
            <View style={{ flex: 0.9, backgroundColor: 'white' }}>
              <View style={{ marginTop: 100, paddingHorizontal: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 }}>
                  <Zocial name="persona" size={24} color="black" />
                  <Text style={styles.name}>{profile['full-name']}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 }}>
                  <MaterialCommunityIcons name="gmail" size={28} color="black" />
                  <Text style={{ fontWeight: 300, fontSize: 20 }}>{profile.email}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 }}>
                  <Feather name="phone" size={24} color="black" />
                  <Text style={{ fontWeight: 300, fontSize: 20 }}>{profile.phone}</Text>
                </View>
                <View style={{ marginVertical: 10 }}>
                  <FontAwesome name="sticky-note" size={24} color="black" />
                  <Text style={{ fontWeight: 300, fontSize: 20 }}>{profile.bio}</Text>
                </View>
              </View>
            </View>
            <View style={styles.avatarWrapper}>
              {user?.avatar ? (
                <Image
                  source={{ uri: user?.avatar }}
                  style={styles.avatar} />
              ) : (
                <MaterialIcons name="account-circle" size={120} color="black" />
              )}
            </View>
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
  },
  loading: {
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
  },
  avatarWrapper: {
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
    padding: 6,
    borderRadius: 100,
    backgroundColor: '#fff',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 100,
  },
  name: {
    fontSize: 24,
    fontWeight: 400,
    color: '#2c3e50',
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
