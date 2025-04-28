import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'

const StaffReward = ({navigation}: any) => {
    const [rewards, setRewards] = useState([])
    const [isloading, setIsLoading] = useState(false)
    useEffect(() => {
        const getReward = async () => {
            setIsLoading(false)
            try {
                const res = await axios.get('https://marvelous-gentleness-production.up.railway.app/api/Reward/GetAllReward')
                console.log('Reward response:', res.data)
                const cleaned = res.data?.data?.map((item: any) => ({
                    rewardID: item["reward-id"],
                    projectID: item["project-id"],
                    ammount: item.amount,
                    details: item.details,
                    createdDatetime: item["created-datetime"]
                }))
                setRewards(cleaned)
            } catch (error) {
                console.error('Error while calling API', error)
            } finally {

            }
        }
        getReward()
    }, [])

    useEffect(() => {
        console.log(rewards)
    }, [rewards])

    return (
        <ScrollView>
            {isloading && (
                <View style={{ marginVertical: 10 }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}
            {rewards.map(item => (
                <TouchableOpacity 
                key={item.rewardId} 
                style={style.rewardCard}
                onPress={() => {navigation.navigate('StaffRewardDetail', {reward_id: item.rewardID})}}
                >
                    <Text>Reward ID :
                        <Text>{item.rewardID}</Text>
                    </Text>
                    <Text>project ID :
                        <Text>{item.projectID}</Text>
                    </Text>
                    <Text>Amount :
                        <Text>{item.amount}</Text>
                    </Text>
                    <Text>Reward ID :
                        <Text>{item.details}</Text>
                    </Text>
                    <Text>Created Date Time :
                        <Text>{item.createdDatetime}</Text>
                    </Text>
                </TouchableOpacity>

            ))}
        </ScrollView>
    )
}

export default StaffReward

const style = StyleSheet.create({
    rewardCard: {
        padding: 15,
        margin: 15,
        borderRadius: 10,
        backgroundColor: '#66A5AD',
    }
})
