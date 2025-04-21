import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Button, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { AuthContext } from '../context/authContext';

interface LayoutProps {
  children: React.ReactNode;
  navigation: any;
}

export default function AppLayout({ children, navigation }: LayoutProps) {
  const { user, updateUser } = useContext(AuthContext);
  useEffect(() => {
    if (!user?.token) {
      updateUser(null);
    }
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.headerBox}>
        <Text style={styles.title}>Home</Text>
        {user?.token ? (
          <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <MaterialIcons name="account-circle" size={40} color="black" style={styles.avatar} />
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => { navigation.navigate('Login') }}>
            <Text style={{ fontWeight: 700, fontSize: 15, marginTop: 10 }}>Sign in</Text>
          </TouchableOpacity>

        )}
      </View>
      <View style={{ flex: 1 }}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 80,
    paddingTop: 10,
    paddingLeft: 20,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    color: 'black',
    flex: 0.9,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginTop: 15,
    marginLeft: 100,
  },
});
