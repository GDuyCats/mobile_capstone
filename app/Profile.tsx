import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/authContext';
import { View, Text, Image, StyleSheet, Button } from 'react-native';

interface ProfileData {
    avatar: string;
    email: string;
    ['full-name']: string;
    role: string;
    phone: string;
    bio: string;
    ['created-datetime']: string
}

export default function Profile({ navigation }: any) {
    const { user, logout, updateUser } = useContext(AuthContext);
    const [profile, setProfile] = useState<ProfileData | null>(null);

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await axios.get(
                    'https://marvelous-gentleness-production.up.railway.app/api/User/GetUserById',
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    }
                );
                const profileData = res.data.data;
                setProfile(profileData);
                updateUser({
                    fullName: profileData["full-name"],
                    email: profileData.email,
                    phone: profileData.phone,
                    role: profileData.role,
                  });
            } catch (error) {
                console.log('❌ Lỗi khi fetch user:', error);
            }
        };

        if (user?.token) {
            getUser();
        }

    }, []);

    return (

        <View style={styles.container}>
            {profile && (
                <>
                    {profile.avatar && (
                        <Image source={{ uri: profile.avatar }} style={styles.avatar} />
                    )}
                    <Text style={styles.name}>{profile['full-name']}</Text>
                    <Text>Email: {profile.email}</Text>
                    <Text>Phone: {profile.phone}</Text>
                    <Text>Role: {profile.role}</Text>
                    <Text>Bio: {profile.bio}</Text>
                    <Text>Create time : {profile['created-datetime']}</Text>
                    <Button title="Logout"
                        onPress={
                            () => {
                                logout();
                                navigation.navigate('Home')
                            }
                        } />
                </>
            )}
            <Button title='Update profile'
                onPress={
                    () => {
                        navigation.navigate('Updateprofile')
                    }
                } />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        alignItems: 'flex-start',
        flex: 1,
        backgroundColor: '#fff',
    },
    avatar: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginBottom: 16,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
});
