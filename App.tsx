import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './context/authContext';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import Home from './app/Index';
import Login from './app/Login';
import Register from './app/Register';
import Setting from './app/Setting';
import ForgetPassword from './app/ForgetPassword';
import ResetPassword from './app/ResetPassword';
import GetProjectComment from './app/Comment/GetProjectComment';
import AddProjectPost from './app/User/Post/ProjectPost/AddProjectPost';

import UserPayment from './app/User/Payment/UserPayment';
import MyProject from './app/User/Project/MyProject';
import MyProjectDetail from './app/User/Project/MyProjectDetail';
import Profile from './app/Profile/Profile';
import MyUpdateProject from './app/User/Project/UpdateProject'
import Updateprofile from './app/Profile/Updateprofile';
import MyPledge from './app/User/Pledge/MyPledge';
import ProjectDetail from './app/ProjectDetail';
import PaymentFailed from './app/User/Payment/PaymentFail';
import PaymentSuccess from './app/User/Payment/PaymentSuccess';
import MoneyHistory from './app/User/Project/MoneyHistory';
import VerifyCode from './app/VerifyCode';
import AddReward from './app/User/Project/Reward/AddReward';
import ViewProjectReward from './app/User/Project/Reward/ViewProjectReward';
import Rewardetail from './app/User/Project/Reward/Rewardetail';
import RewardUpdate from './app/User/Project/Reward/UpdateReward'
import CreateReport from './app/User/Project/CreateReport';
import AddPlatform from './app/User/Project/AddPlatform';
import AddCategory from './app/User/Project/AddCategory';
import AddFAQs from './app/User/FAQ/AddFAQs';
import ViewFAQs from './app/User/FAQ/ViewFAQs';
import UpdateFAQ from './app/User/FAQ/UpdateFAQ';
import ProjectPost from './app/User/Post/ProjectPost';
import ProjectPostDetail from './app/User/Post/ProjectPostDetail';
import ViewMyProjectPost from './app/User/Post/ViewMyProjectPost';
import ViewProjectPostDetail from './app/User/Post/ProjectPost/ViewProjectPostDetail';
import UpdateProjectPost from './app/User/Post/ProjectPost/UpdateProjectPost';

import Admin from './app/Admin/Admin';
import AdminUser from './app/Admin/User/AdminUser';
import AdminUserDetail from './app/Admin/User/AdminUserDetail';
import AdminPledge from './app/Admin/Pledge/AdminPledge';
import AdminPledgeDetail from './app/Admin/Pledge/AdminPledgeDetail';
import AdminCreateStaff from './app/Admin/AdminCreateStaff';

import Staff from './app/Staff/Staff';
import StaffReward from './app/Staff/Reward/StaffReward';
import StaffGetComment from './app/Staff/Comment/GetAllComment';
import StaffGetPost from './app/Staff/Post/GetAllPost';
import StaffReport from './app/Staff/StaffReport';
import StaffGetProject from './app/Staff/Project/StaffGetProject';
import StaffProjectDetail from './app/Staff/Project/StaffProjectDetail'
import StaffRewardDetail from './app/Staff/Reward/StaffRewardDetail';
import CreateProject from './app/User/Project/CreateProject';
import StaffProjectApprove from './app/Staff/Project/StaffProjectApprove';
import ApprovedProject from './app/Staff/Project/AprrovedProject';
import ResendGmailConfirm from './app/ResendGmailConfirm';
import OtherUserProfile from './app/Profile/OtherUserProfile/Profile'

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
  StaffGetComment: undefined;
  StaffGetPost: undefined;
  StaffGetProject: undefined;
  StaffReport: undefined;
  StaffProjectDetail: undefined;
  StaffProjectApprove: undefined;
  ApprovedProject: undefined

  Home: undefined;
  Login: undefined;
  Register: undefined;
  Setting: undefined;
  ForgotPassword: undefined;
  ResendGmailConfirm: undefined;
  GetProjectComment: undefined;
  OtherUserProfile: undefined;
  VerifyCode: undefined;
  AddReward: undefined;
  ViewProjectReward: undefined;
  ResetPassword: undefined;
  RewardDetail: undefined;
  RewardUpdate: undefined;
  CreateReport: undefined
  AddPlatform: undefined;
  AddCategory: undefined;
  AddFAQs: undefined;
  ViewFAQs: undefined;
  UpdateFAQs: undefined;
  ProjectPost: undefined
  ProjectPostDetail: undefined
  AddProjectPost: undefined
  ViewMyProjectPost: undefined
  UpdateProjectPost: undefined
  ViewProjectPostDetail: undefined

  Profile: undefined;
  UserPayment: undefined;
  Updateprofile: undefined;
  CreateProject: undefined
  PaymentFailed: undefined;
  PaymentSuccess: undefined;
  ProjectDetail: undefined;
  MyPledge: undefined;
  MyProjectDetail: undefined;
  MyProject: undefined;
  MyUpdateProject: undefined;
  MyReceivedPledge: undefined;
  MoneyHistory: undefined
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function MainNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Admin" component={Admin} />
      <Stack.Screen name="AdminUser" component={AdminUser} />
      <Stack.Screen name="AdminUserDetail" component={AdminUserDetail} />
      <Stack.Screen name="AdminPledge" component={AdminPledge} />
      <Stack.Screen name="AdminPledgeDetail" component={AdminPledgeDetail} />
      <Stack.Screen name="AdminCreateStaff" component={AdminCreateStaff} />
      
      <Stack.Screen name="Staff" component={Staff} />
      <Stack.Screen name="StaffGetProject" component={StaffGetProject} />
      <Stack.Screen name="StaffProjectDetail" component={StaffProjectDetail} options={{ headerShown: false }} />
      <Stack.Screen name="StaffReport" component={StaffReport} />
      <Stack.Screen name="StaffReward" component={StaffReward} />
      <Stack.Screen name="StaffRewardDetail" component={StaffRewardDetail} />
      <Stack.Screen name="StaffGetPost" component={StaffGetPost} />
      <Stack.Screen name="StaffGetComment" component={StaffGetComment} />
      <Stack.Screen name="StaffProjectApprove" component={StaffProjectApprove} />
      <Stack.Screen name="ApprovedProject" component = {ApprovedProject}/>

      <Stack.Screen name="Updateprofile" component={Updateprofile} options={{ headerShown: false }}/>
      <Stack.Screen name="ProjectDetail" component={ProjectDetail} options={{ headerShown: false }}/>
      <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }}/>
      <Stack.Screen name="CreateProject" component={CreateProject} options={{ headerShown: false }}/>
      <Stack.Screen name="UserPayment" component={UserPayment} options={{ headerShown: false }} />
      <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} options={{ headerShown: false }}/>
      <Stack.Screen name="PaymentFailed" component={PaymentFailed} options={{ headerShown: false }}/>
      <Stack.Screen name="MyPledge" component={MyPledge} options={{ headerShown: false }}/>
      <Stack.Screen name="MyProject" component={MyProject} options={{ headerShown: false }}/>
      <Stack.Screen name="MyProjectDetail" component={MyProjectDetail} options={{ headerShown: false }}/>
      <Stack.Screen name="MyUpdateProject" component={MyUpdateProject} options={{ headerShown: false }}/>
      <Stack.Screen name="MoneyHistory" component={MoneyHistory} options={{ headerShown: false }}/>
      <Stack.Screen name="Setting" component={Setting} options={{ headerShown: false }} />
      <Stack.Screen name="AddReward" component={AddReward} options={{ headerShown: false }} />
      <Stack.Screen name="RewardDetail" component={Rewardetail} options={{ headerShown: false }} />
      <Stack.Screen name="ViewProjectReward" component={ViewProjectReward} options={{ headerShown: false }} />
      <Stack.Screen name="RewardUpdate" component={RewardUpdate} options={{ headerShown: false }} />
      <Stack.Screen name="AddPlatform" component={AddPlatform} options={{ headerShown: false }} />
      <Stack.Screen name="AddCategory" component={AddCategory} options={{ headerShown: false }} />
      <Stack.Screen name="AddFAQs" component={AddFAQs} options={{ headerShown: false }} />
      <Stack.Screen name="ViewFAQs" component={ViewFAQs} options={{ headerShown: false }} />
      <Stack.Screen name="UpdateFAQs" component={UpdateFAQ} options={{ headerShown: false }} />
      <Stack.Screen name="ProjectPost" component={ProjectPost} options={{ headerShown: false }} />
      <Stack.Screen name="AddProjectPost" component={AddProjectPost} options={{ headerShown: false }} />
      <Stack.Screen name="ProjectPostDetail" component={ProjectPostDetail} options={{ headerShown: false }} />
      <Stack.Screen name="ViewMyProjectPost" component={ViewMyProjectPost} options={{ headerShown: false }} />
      <Stack.Screen name="ViewProjectPostDetail" component={ViewProjectPostDetail} options={{ headerShown: false }} />
      <Stack.Screen name="UpdateProjectPost" component={UpdateProjectPost} options={{ headerShown: false }} />

      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
      <Stack.Screen name="ForgotPassword" component={ForgetPassword} options={{ headerShown: false }} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ headerShown: false }} />
      <Stack.Screen name="ResendGmailConfirm" component={ResendGmailConfirm} options={{ headerShown: false }} />
      <Stack.Screen name="GetProjectComment" component={GetProjectComment} options={{ headerShown: false }} />
      <Stack.Screen name="OtherUserProfile" component={OtherUserProfile} options={{ headerShown: false }} />
      <Stack.Screen name="VerifyCode" component={VerifyCode} options={{ headerShown: false }} />
      <Stack.Screen name="CreateReport" component={CreateReport} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <AuthProvider>
          <NavigationContainer>
            <MainNavigator />
          </NavigationContainer>
        </AuthProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  </GestureHandlerRootView>
  );
}
