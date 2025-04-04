import React, { useContext, useEffect } from 'react'
import { View, Text, Button } from 'react-native'
import { AuthContext } from '../../context/authContext';
function Admin({ navigation }: any) {
    const { user } = useContext(AuthContext)
    const role = user?.role
    return (
        <View>
            <Button title='Project' onPress={() => { navigation.navigate('StaffProject') }} />
            <Button title='Report' onPress={() => { navigation.navigate('StaffReport') }} />
        </View>
    )
}

export default Admin
