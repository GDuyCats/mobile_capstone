import React, { useContext, useState } from 'react'
import axios from 'axios'
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { AuthContext } from '../../../context/authContext'
import { Text, View, ScrollView, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'

import HeaderLayout from '../../../components/HeaderLayout'
function MyProject({ navigation }: any) {
    const { user } = useContext(AuthContext)
    const [project, setProject] = useState([])
    const [loading, setLoading] = useState(true);
    useFocusEffect(
        React.useCallback(() => {
            const getMyProject = async () => {
                try {
                    const res = await axios.get('https://marvelous-gentleness-production.up.railway.app/api/Project/GetProjectByUserId',
                        {
                            headers: {
                                Authorization: `Bearer ${user.token}`,
                            },
                        }
                    )
                    setProject(res.data?.data)
                    console.log(res.data?.data)
                } catch (error) {
                    console.log(error)
                } finally {
                    setLoading(false)
                }
            }
            getMyProject()
        }, []))

    if (loading) {
        return (
            <View>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading...</Text>
            </View>
        );
    }
    return (
        <ScrollView style={style.container}>
            <HeaderLayout title={'My projects'} onBackPress={() => navigation.goBack()} />
            <View style={{ padding: 10 }}>
                {project.map((project: any) => (
                    <TouchableOpacity
                        key={project['project-id']}
                        style={style.card}
                        onPress={() => {
                            navigation.navigate('MyProjectDetail', { projectId: project["project-id"] })
                        }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: 'black', fontWeight: '900', fontSize: 25 }}>You received</Text>
                            <Text style={{ color: 'green', fontWeight: '900', fontSize: 25 }}> {project['total-amount']}$</Text>
                        </View>

                        <View>
                            <Text style={{ fontWeight: 'bold', fontSize: 20, marginVertical: 10 }}>{project.title}</Text>
                        </View>
                        {project.thumbnail ? (
                            <Image
                                source={{ uri: project.thumbnail }}
                                style={{ width: '100%', height: 200, borderRadius: 10 }}
                                resizeMode="cover"
                            />
                        ) : (
                            null
                        )}

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20 }}>

                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: 900,
                                    color:
                                        project.status === 'DELETED' ? 'red'
                                            : project.status === 'VISIBLE' ? 'green'
                                                : 'black'
                                }}>
                                {project.status}
                            </Text>
                            {project.status === 'DELETED' ? (
                                <AntDesign name="closecircle" size={24} color="black" />
                            ) : project.status === 'VISIBLE' ? (
                                <AntDesign name="checkcircleo" size={24} color="black" />
                            ) :
                                <MaterialIcons name="pending" size={24} color="black" />
                            }
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <Text style={{fontSize: 20}}>Transaction status</Text>
                            <Text style={{fontSize: 20, fontWeight: 900}}>{project['transaction-status']}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

        </ScrollView>
    )
}

export default MyProject

const style = StyleSheet.create({
    container: {
        flex: 1,
    },

    card: {
        padding: 20,
        borderWidth: 1,
        borderColor: '#c9d1d4',
        borderRadius: 20,
        marginBottom: 20
    }
})