import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
import axios from 'axios';
import { AuthContext } from '../../../context/authContext';

function StaffRewardDetail({ route }: any) {
    const { reward_id } = route.params;
    const [reward, setReward] = useState<any>(null)
    const [isloading, setIsLoading] = useState(false)
    useEffect(() => {
        const getRewardDetail = async () => {
            setIsLoading(true)
            try {
                const res = await axios.get(`https://marvelous-gentleness-production.up.railway.app/api/Reward/GetRewardById?rewardId=${reward_id}`)
                const data = res.data?.data
                const clean = {
                    rewardID: data["reward-id"],
                    projectID: data["project-id"],
                    amount: data.amount,
                    details: data.details,
                    createdTime: data["created-datetime"]
                }
                setReward(clean)
            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false)
            }
        }
        getRewardDetail()
    }, [])
    return (
        <ScrollView>
            {reward && (
                <>
                    <Text>
                        Reward
                        <Text>{reward.rewardID}</Text>
                    </Text>
                    <Text>
                        Project
                        <Text>{reward.projectID}</Text>
                    </Text>
                    <Text>
                        Amount
                        <Text>
                            {reward.details}
                        </Text>
                    </Text>
                    <Text>
                        Created time
                        <Text>
                            {reward.createdTime}
                        </Text>
                    </Text>
                </>
            )}

        </ScrollView>
    )
}

export default StaffRewardDetail
