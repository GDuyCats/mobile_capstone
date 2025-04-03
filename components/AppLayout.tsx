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
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    if (!user?.token) {
      updateUser(null);
    }
  }, []);

  const handleNavigateLogin = () => navigation.navigate('Login');

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.headerBox}>
        <Text style={styles.title}>GameMKt</Text>
        <TouchableOpacity onPress={() => setShowOptions(prev => !prev)}>
          {user?.token && user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <MaterialIcons name="account-circle" size={40} color="black" style={styles.avatar} />
          )}
        </TouchableOpacity>
      </View>

      {showOptions && (
        user?.token ? (
          <Button title="Profile" onPress={() => navigation.navigate('Profile')} />
        ) : (
          <Button title="Log in" onPress={handleNavigateLogin} />
        )
      )}

      <View style={{ flex: 1 }}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBox: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    height: 80,
    paddingTop: 10,
    paddingLeft: 20,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'green',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginTop: 15,
    marginLeft: 100,
  },
});
