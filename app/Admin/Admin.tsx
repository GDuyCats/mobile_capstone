import React from 'react'
import { View, Text, Button } from 'react-native'

function Admin({ navigation }: any) {
  return (
    <View>
        <Button title='User Management' onPress={() => {
          navigation.navigate('AdminUser')
        }}/>
        <Button title='Pledge Management' onPress={() => {
          navigation.navigate('AdminPledge')
        }}/>
        <Button title='Create new Staff' onPress={() => {
          navigation.navigate('AdminCreateStaff')
        }}/>
    </View>
  )
}

export default Admin
