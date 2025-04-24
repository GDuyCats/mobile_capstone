import React, { useState } from 'react'
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import axios from 'axios'
import { useFocusEffect } from '@react-navigation/native'
import HeaderLayout from '../../../../components/HeaderLayout'
function AddReward({ navigation, route }: any) {
    const [amount, setAmount] = useState('');
    const [details, setDetails] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    const { projectId } = route.params

    useFocusEffect(
        React.useCallback(() => {
            console.log(projectId)
        }, [])
    )

    const handleAddReward = async () => {
        if (!amount || !details) {
            Alert.alert('Error', 'Please enter both amounts and details');
            return;
        }
        setIsLoading(true)
        try {
            const res = await axios.post('https://marvelous-gentleness-production.up.railway.app/api/Reward/AddReward',
                {
                    'project-id': projectId,
                    amount: parseInt(amount),
                    details,

                }
            )
            Alert.alert('Success', 'Reward added successfully!');
            navigation.goBack();
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Failed to add reward');
        } finally {
            setIsLoading(false)
        }
    }



    return (
        <ScrollView contentContainerStyle={{ flex: 1 }}>
            <HeaderLayout title={'Add Reward'} onBackPress={() => navigation.goBack()} />
            <View style={{ padding: 20 }}>
                <View style={{
                    borderBottomColor: '#d0d4d9',
                    flexDirection: 'row', 
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 20
                    }}>
                    <TextInput
                        style={{fontSize: 20, fontWeight: 500}}
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="numeric"
                        placeholder='Enter amount'
                    />
                    <Text style={{fontSize: 20}}>$</Text>
                </View>

                <TextInput
                    value={details}
                    style={{fontSize: 20, fontWeight: 500}}
                    onChangeText={setDetails}
                    multiline
                    placeholder='Reward Details'
                />
                <TouchableOpacity
                    onPress={handleAddReward}
                    disabled={isLoading}
                    style={{
                        backgroundColor: '#E8D480',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingVertical: 20,
                        paddingHorizontal: 40,
                        borderRadius: 50,
                        marginTop: 20
                    }}
                >
                    <Text style={{
                        fontWeight: 900,
                        fontSize: 20
                    }}>Add Reward</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>

    )
}

export default AddReward
