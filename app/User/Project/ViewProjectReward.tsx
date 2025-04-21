import { useFocusEffect } from '@react-navigation/native'
import React from 'react'
import { useCallback } from 'react'
import { View, Text } from 'react-native'
function ViewProjectReward({ navigation, route }: any) {
    const { projectId } = route.params
    useFocusEffect(
        React.useCallback(() => {
            console.log(projectId)
        }, [])
    )
    return (
        <View>
            <Text></Text>
        </View>
    )
}

export default ViewProjectReward
