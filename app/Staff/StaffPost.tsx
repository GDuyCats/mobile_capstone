import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
function AdminPost({ navigation }: any) {
    return (
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text >← Quay lại</Text>
        </TouchableOpacity>
    )
}

export default AdminPost
