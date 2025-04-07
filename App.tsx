import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './context/authContext';

import Home from './app/Index';
import Login from './app/Login';
import Register from './app/Register';

import UserPayment from './app/User/Payment/UserPayment';
import Profile from './app/User/Profile/Profile';
import Updateprofile from './app/User/Profile/Updateprofile';
import ProjectDetail from './app/User/ProjectDetail';
import PaymentFailed from './app/User/Payment/PaymentFail';
import PaymentSuccess from './app/User/Payment/PaymentSuccess';

import Admin from './app/Admin/Admin';
import AdminUser from './app/Admin/User/AdminUser';
import AdminUserDetail from './app/Admin/User/AdminUserDetail';
import AdminPledge from './app/Admin/Pledge/AdminPledge';
import AdminPledgeDetail from './app/Admin/Pledge/AdminPledgeDetail';
import AdminCreateStaff from './app/Admin/AdminCreateStaff';

import Staff from './app/Staff/Staff';
import StaffReward from './app/Staff/Reward/StaffReward';
import StaffReport from './app/Staff/StaffReport';
import StaffProject from './app/Staff/Project/StaffProject';
import StaffProjectDetail from './app/Staff/Project/StaffProjectDetail'
import StaffRewardDetail from './app/Staff/Reward/StaffRewardDetail';


export type RootStackParamList = {
  Admin: undefined;
  AdminUser: undefined;
  AdminPledge: undefined;
  AdminUserDetail: undefined;
  AdminPledgeDetail: undefined;
  AdminCreateStaff: undefined

  Staff: undefined;
  StaffReward: undefined;
  StaffRewardDetail: undefined;
  StaffProject: undefined;
  StaffReport: undefined;
  StaffProjectDetail: undefined;

  Home: undefined;
  Login: undefined;
  Register: undefined;

  Profile: undefined;
  UserPayment: undefined;
  Updateprofile: undefined;
  PaymentFailed: undefined;
  PaymentSuccess: undefined;
  ProjectDetail: { projectId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function MainNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Admin" component={Admin} />
      <Stack.Screen name="AdminUser" component={AdminUser} />
      <Stack.Screen name="AdminUserDetail" component={AdminUserDetail} />
      <Stack.Screen name="AdminPledge" component={AdminPledge} />
      <Stack.Screen name="AdminPledgeDetail" component={AdminPledgeDetail} />
      <Stack.Screen name="AdminCreateStaff" component={AdminCreateStaff} />


      <Stack.Screen name="Staff" component={Staff} />
      <Stack.Screen name="StaffProject" component={StaffProject} />
      <Stack.Screen name="StaffProjectDetail" component={StaffProjectDetail} options={{ headerShown: false }} />
      <Stack.Screen name="StaffReport" component={StaffReport} />
      <Stack.Screen name="StaffReward" component={StaffReward} />
      <Stack.Screen name="StaffRewardDetail" component={StaffRewardDetail} />

      <Stack.Screen name="Updateprofile" component={Updateprofile} />
      <Stack.Screen name="ProjectDetail" component={ProjectDetail} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="UserPayment" component={UserPayment} options={{ headerShown: false }} />
      <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />
      <Stack.Screen name="PaymentFailed" component={PaymentFailed} />

      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />



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
