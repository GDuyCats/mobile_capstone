import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../context/authContext'
import { View, Text, ScrollView } from 'react-native'
import axios from 'axios'
import { TouchableOpacity } from 'react-native-gesture-handler'
function MyPledge() {
    const [pledge, setPledge] = useState([])
    const { user } = useContext(AuthContext)
    useEffect(() => {
        const getPledge = async () => {
            try {
                const res = await axios.get(`https://marvelous-gentleness-production.up.railway.app/api/Pledge/GetPledgeByUserId`,
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`
                        }
                    }
                )
                setPledge(res.data?.data)
            } catch (error) {
                console.log(error)
            }
        }
        getPledge()
    }, [])

    useEffect(() => {
        console.log(pledge)
    }, [pledge])
    return (
        <View>
            <Text>Pledges:</Text>
            {pledge.length > 0 ? (
                pledge.map((item, index) => (
                    <View key={index} style={{ marginVertical: 10 }}>
                        <Text>Pledge ID: {item["pledge-id"]}</Text>
                        <Text>Amount: {item.amount}</Text>
                        <Text>Project ID: {item["project-id"]}</Text>
                        <Text>Details:</Text>
                        {item["pledge-detail"]?.map((detail, i) => (
                            <Text key={i}>• {detail["payment-id"]} - {detail.status}</Text>
                        ))}
                    </View>
                ))
            ) : (
                <Text>Không có pledge nào.</Text>
            )}
        </View>
    )
}

export default MyPledge
