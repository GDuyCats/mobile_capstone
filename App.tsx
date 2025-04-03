import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './context/authContext';

import Home from './app/Index';
import Login from './app/Login';
import Admin from './app/Admin';
import Register from './app/Register';
import Profile from './app/Profile';
import Updateprofile from './app/Updateprofile';
import ProjectDetail from './app/ProjectDetail';

// 🧠 Khai báo kiểu params để điều hướng có type an toàn
export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Admin: undefined;
  Register: undefined;
  Profile: undefined;
  Updateprofile: undefined;
  ProjectDetail: { projectId: number }; // truyền projectId khi navigate
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function MainNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        animation: 'slide_from_right', // 👈 hiệu ứng chuyển mượt
      }}
    >
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="Admin" component={Admin} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Updateprofile" component={Updateprofile} />
      <Stack.Screen name="ProjectDetail" component={ProjectDetail} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
