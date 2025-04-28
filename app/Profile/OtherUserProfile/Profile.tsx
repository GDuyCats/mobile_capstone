import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import Zocial from '@expo/vector-icons/Zocial';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import HeaderLayout from '../../../components/HeaderLayout';
interface ProfileData {
    avatar: string;
    email: string;
    ['full-name']: string;
    phone: string;
    bio: string;
}
function Profile({ route, navigation }: any) {
    const { userId } = route.params
    const [profile, setProfile] = useState<any>(null)
    const [isUploading, setisUploading] = useState(true)
    const fetchUser = async () => {
        try {
            const res = await axios.get(`https://marvelous-gentleness-production.up.railway.app/api/User/GetUserByUserId?userId=${userId}`)
            setProfile(res.data.data)
        } catch (error) {
            console.log(error)
        } finally {
            setisUploading(false)
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            fetchUser()
        }, [])
    )


    useEffect(() => {
        if (profile) {
            console.log(profile.email);
        }
    }, [profile]);


    return (
        <View style={styles.container}>
            <HeaderLayout title='Profile' onBackPress={() => navigation.goBack()} background="#0C1C33" fontColor="#fff" />
            {isUploading ? (
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color="#8e44ad" />

                </View>
            ) : (
                profile && (
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 0.1, backgroundColor: '#0C1C33' }}>
                        </View>
                        <View style={{ flex: 0.9, backgroundColor: 'white' }}>
                            <View style={{ marginTop: 100, paddingHorizontal: 20 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 }}>
                                    <Zocial name="persona" size={24} color="black" />
                                    <Text style={styles.name}>{profile['full-name']}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 }}>
                                    <MaterialCommunityIcons name="gmail" size={28} color="black" />
                                    <Text style={{ fontWeight: 300, fontSize: 20 }}>{profile.email}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 }}>
                                    <Feather name="phone" size={24} color="black" />
                                    <Text style={{ fontWeight: 300, fontSize: 20 }}>{profile.phone}</Text>
                                </View>
                                <View style={{ marginVertical: 10 }}>
                                    <FontAwesome name="sticky-note" size={24} color="black" />
                                    <Text style={{ fontWeight: 300, fontSize: 15 }}>{profile.bio}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.avatarWrapper}>
                            {profile?.avatar ? (
                                <Image
                                    source={{ uri: profile?.avatar }}
                                    style={styles.avatar} />
                            ) : (
                                <MaterialIcons name="account-circle" size={120} color="black" />
                            )}
                        </View>
                    </View>
                )
            )}
        </View>
    )
}

export default Profile
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f8',
    },
    loading: {
        alignItems: 'center',
    },
    card: {
        backgroundColor: 'white',
    },
    avatarWrapper: {
        position: 'absolute',
        top: 0,
        alignSelf: 'center',
        padding: 6,
        borderRadius: 100,
        backgroundColor: '#fff',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 100,
    },
    name: {
        fontSize: 24,
        fontWeight: 400,
        color: '#2c3e50',
    },
    info: {
        fontSize: 16,
        color: '#555',
        marginVertical: 2,
    },
    button: {
        marginTop: 16,
        backgroundColor: '#8e44ad',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
