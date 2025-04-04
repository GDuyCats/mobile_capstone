import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/authContext';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';

function AdminUser({ navigation }: any) {
  const [getAllUser, setGetAllUser] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(
          'https://marvelous-gentleness-production.up.railway.app/api/User/GetAllUser',
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setGetAllUser(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>← Quay lại</Text>
      </TouchableOpacity>

      {getAllUser.map((u: any, index: number) => (
        <TouchableOpacity 
        key={u.id || index} 
        style={styles.card}
        onPress={() => navigation.navigate('AdminUserDetail', { userId: u['user-id'] })}>
          {/* Avatar */}
          {u.avatar ? (
            <Image source={{ uri: u.avatar }} style={styles.avatar} />
          ) : (
            <Text style={styles.label}>Avatar: <Text style={styles.value}>No image</Text></Text>
          )}

          <Text style={styles.label}>Full Name: <Text style={styles.value}>{u['full-name']}</Text></Text>
          <Text style={styles.label}>Email: <Text style={styles.value}>{u.email}</Text></Text>
          <Text style={styles.label}>Phone: <Text style={styles.value}>{u.phone}</Text></Text>
          <Text style={styles.label}>Bio: <Text style={styles.value}>{u.bio || 'N/A'}</Text></Text>
          <Text style={styles.label}>Role: <Text style={styles.value}>{u.role}</Text></Text>
          <Text style={styles.label}>Status: <Text style={styles.value}>{u.status}</Text></Text>

          {/* Created Date */}
          <Text style={styles.label}>Created At:{' '}
            <Text style={styles.value}>
              {new Date(u['created-datetime']).toLocaleString()}
            </Text>
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

export default AdminUser;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  backButton: {
    marginBottom: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#cadcfc',
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  backText: {
    color: '#00246B',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#f0f4ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
    color: '#00246B',
  },
  value: {
    fontWeight: 'normal',
    color: '#000',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
    alignSelf: 'center',
  },
});
