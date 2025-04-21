import React from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { CommonActions, useNavigation, useRoute } from '@react-navigation/native';


import { TouchableOpacity, View } from 'react-native'

interface Props {
  currentScreen: string;
  searchToggle?: boolean;
  onSearchPress?: () => void;
}

function NavbarLayout({ currentScreen, searchToggle, onSearchPress }: Props) {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const iconColor = (routeName: string) =>
    currentScreen === routeName ? 'green' : 'gray';
  return (
    <View style={{
      flexDirection: 'row',
      backgroundColor: 'white',
      padding: 10,
      elevation: 5,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      justifyContent: 'space-around'
    }}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <AntDesign name="home" size={30} color={iconColor('Home')} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          if (route.name === 'Home') {
            navigation.setParams({ toggleSearch: true }); // 👈 gửi tín hiệu toggle
          } else {
            navigation.navigate('Home', { startSearch: true });
          }
        }}
      >
        <FontAwesome6
          name="magnifying-glass"
          size={24}
          color={route.name === 'Home' ? '#00246B' : 'gray'}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('CreateProject')}>
        <AntDesign name="pluscircle" size={30} color={iconColor('CreateProject')} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
        <Ionicons name="person-outline" size={30} color={iconColor('Setting')}  />
      </TouchableOpacity>
    </View>
  )
}

export default NavbarLayout