import React, { useContext, useEffect } from 'react'
import { View, Text } from 'react-native'
import { AuthContext } from '../context/authContext';
function Admin({ navigation }: any) {
    const { user } = useContext(AuthContext)
    const role = user?.role
    return (
        <View>
            <Text>Admin</Text>
        </View>
    )
}

export default Admin
