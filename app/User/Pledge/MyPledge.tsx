import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/authContext';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

function MyPledge({ navigation }: any) {
    const [pledge, setPledge] = useState([]);
    const [loading, setIsLoading] = useState(false);
    const { user } = useContext(AuthContext);

    useFocusEffect(
        React.useCallback(() => {
            const getPledgesWithProjects = async () => {
                setIsLoading(true);
                try {
                    const res = await axios.get(
                        'https://marvelous-gentleness-production.up.railway.app/api/Pledge/GetPledgeByUserId',
                        {
                            headers: {
                                Authorization: `Bearer ${user.token}`
                            }
                        }
                    );

                    const pledges = res.data?.data || [];

                    const updatedPledges = await Promise.all(
                        pledges.map(async (pledgeItem) => {
                            try {
                                const projectRes = await axios.get(
                                    `https://marvelous-gentleness-production.up.railway.app/api/Project/GetProjectById?id=${pledgeItem["project-id"]}`,
                                    {
                                        headers: {
                                            Authorization: `Bearer ${user.token}`
                                        }
                                    }
                                );
                                return {
                                    ...pledgeItem,
                                    projectTitle: projectRes.data?.data?.title || 'Không rõ'
                                };
                            } catch (error) {
                                console.log('Lỗi khi fetch project:', error);
                                return {
                                    ...pledgeItem,
                                    projectTitle: 'Lỗi tải tên project'
                                };
                            }
                        })
                    );

                    setPledge(updatedPledges);
                } catch (error) {
                    console.log('Lỗi khi fetch pledge:', error);
                } finally {
                    setIsLoading(false);
                }
            };

            getPledgesWithProjects();
        }, [])
    );

    return (
        <ScrollView contentContainerStyle={{ padding: 10 }}>
            {loading ? (
                <View style={{ marginVertical: 10 }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text>Đang tải thông tin lên ...</Text>
                </View>
            ) : (
                <>
                    {pledge.length > 0 ? (
                        pledge.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={style.card}
                                onPress={() => {
                                    navigation.navigate('ProjectDetail', {projectId : item["project-id"]})
                                }}>
                                <Text style={style.title}>Project : <Text>{item.projectTitle}</Text></Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={style.amount}>Amount:</Text>
                                    <Text style={{ color: 'red', fontWeight: '700' }}>- {item.amount}$</Text>
                                </View>
                                <Text style={{ fontSize: 15 }}>Detail:</Text>
                                {item["pledge-detail"]?.map((detail: any, i: any) => (
                                    <Text key={i}>• {detail["payment-id"]} - {detail.status}</Text>
                                ))}
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text>Không có pledge nào.</Text>
                    )}
                </>
            )}
        </ScrollView>
    );
}

export default MyPledge;

const style = StyleSheet.create({
    card: {
        marginVertical: 10,
        padding: 12,
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 8
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4
    },

    amount: {
        fontSize: 20,
        fontWeight: 600,
        marginRight: 0,

    }
});
