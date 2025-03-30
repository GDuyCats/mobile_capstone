import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { AuthContext } from '../context/authContext';
export default function Home({ navigation }: any) {
  const [isAdmin, setIsAdmin] = useState(false)
  const { logout, user } = useContext(AuthContext)

  useEffect(() => {
    if (user?.role === "Admin") {
      setIsAdmin(true)
      console.log(user.role)
    } else {
      setIsAdmin(false)
    }
  },[user])

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>🏠 Home Screen</Text>
      <Button title="Go to Login" onPress={() => navigation.navigate('Login')} />
      {isAdmin && (<Button title="Go to Admin" onPress={() => navigation.navigate('Admin')} />)}
      {user && (<Button title="Logout" onPress={logout} />)}
    </View>
  );
}
