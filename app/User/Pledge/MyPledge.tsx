import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/authContext';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import HeaderLayout from '../../../components/HeaderLayout';

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
                                    projectTitle: projectRes.data?.data?.title || 'Unknown'
                                };
                            } catch (error) {
                                console.log('Error why getting the project ', error);
                                return {
                                    ...pledgeItem,
                                    projectTitle: 'Error while getting project name '
                                };
                            }
                        })
                    );

                    setPledge(updatedPledges);
                } catch (error) {
                    console.log('Error while get pledge', error);
                } finally {
                    setIsLoading(false);
                }
            };

            getPledgesWithProjects();
        }, [])
    );

    return (
        <ScrollView>
            <HeaderLayout title={'My pledge'} onBackPress={() => { navigation.goBack() }} />
            {loading ? (
                <View style={{ marginVertical: 10 }}>
                    <ActivityIndicator size="large" color="#0000ff" />

                </View>
            ) : (
                <View style={{ padding: 20 }}>
                    {pledge.length > 0 ? (
                        pledge.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={style.card}
                                onPress={() => {
                                    navigation.navigate('ProjectDetail', { projectId: item["project-id"] })
                                }}>
                                <Text style={style.title}>Project : <Text>{item.projectTitle}</Text></Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={style.amount}>Amount:</Text>
                                    <Text style={{ color: 'red', fontWeight: '700' }}>- {item['total-amount']}$</Text>
                                </View>
                                <Text style={{ fontSize: 15 }}>Detail:</Text>
                                {item["pledge-details"]?.map((detail: any, i: any) => (
                                    <View style={{ margin: 10 }} key={i}>
                                        <Text>• {detail["payment-id"]} - {detail.status}</Text>
                                        <Text>• {detail["invoice-id"]}</Text>
                                        <Text
                                            style={{ color: detail["invoice-url"] ? 'blue' : 'gray', textDecorationLine: detail["invoice-url"] ? 'underline' : 'none' }}
                                            onPress={() => {
                                                if (detail["invoice-url"]) {
                                                    Linking.openURL(detail["invoice-url"]);
                                                }
                                            }}
                                        >
                                            • {detail["invoice-url"] ? detail["invoice-url"] : 'N/A'}
                                        </Text>
                                    </View>

                                ))}
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View style={{ marginTop: 50, alignItems: 'center' }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>There is no pledge</Text>
                        </View>
                    )}
                </View>
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
