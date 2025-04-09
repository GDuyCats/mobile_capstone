import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { AuthContext } from '../../../context/authContext'
import { Text, View, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
function MyProject({ navigation }: any) {
    const { user } = useContext(AuthContext)
    const [project, setProject] = useState([])
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
                }
            }
            getMyProject()
        }, []))

    return (
        <ScrollView style={style.container}>
            {project.map((project: any) => (
                <TouchableOpacity
                    key={project['project-id']}
                    style={style.card}
                    onPress={() => {
                        navigation.navigate('MyProjectDetail', { projectId: project["project-id"] })
                    }}>
                    <View>
                        <Text><Text style={{ color: '#00246B', fontWeight: 'bold' }}>Title</Text>{project.title}</Text>
                    </View>
                    {project.thumbnail ? (
                        <Image
                            source={{ uri: project.thumbnail }}
                            style={{ width: '100%', height: 200, borderRadius: 10 }}
                            resizeMode="cover"
                        />
                    ) : (
                        <Text>Không có ảnh</Text>
                    )}
                    <View>
                        <Text><Text style={{ color: '#00246B', fontWeight: 'bold' }}>Status</Text>{project.status}</Text>
                    </View>
                    <View>
                        <Text><Text style={{ color: '#00246B', fontWeight: 'bold' }}>Total amount</Text>{project['total-amount']}</Text>
                    </View>
                    <View>
                        <Text><Text style={{ color: '#00246B', fontWeight: 'bold' }}>End time</Text>{project['end-datetime']}</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    )
}

export default MyProject

const style = StyleSheet.create({
    container: {
        flex: 1
    },

    card: {
        borderWidth: 1,
        borderColor: '#c9d1d4',
        borderRadius: 20,
        marginBottom: 5
    }
})