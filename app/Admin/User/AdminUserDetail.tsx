import React, { useEffect, useState, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../../context/authContext';

export default function AdminUserDetail({ route, navigation }: any) {
    const { userId } = route.params;
    const [userDetail, setUserDetail] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    const handleDelete = () => {
        Alert.alert(
            "Confirm delete",
            "Are you sure to delete user !",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await axios.delete(`https://marvelous-gentleness-production.up.railway.app/api/User/DeleteUser?UserDeleteId=${userId}`,
                                {
                                    headers: {
                                        Authorization: `Bearer ${user.token}`
                                    }
                                }
                            )
                            alert('Delete user successful!');
                            navigation.goBack()
                        } catch (error) {
                            console.log(error)
                        }
                    }
                }
            ]
        )
    }

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(
                    `https://marvelous-gentleness-production.up.railway.app/api/User/GetUserByUserId?userId=${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    }
                );
                setUserDetail(res.data.data);
            } catch (error) {
                console.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!userDetail) {
        return (
            <View style={styles.center}>
                <Text>There is no users.</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Text style={styles.backText}>← Go Back</Text>
            </TouchableOpacity>

            {userDetail.avatar && (
                <Image source={{ uri: userDetail.avatar }} style={styles.avatar} />
            )}

            <Text style={styles.label}>Full Name: <Text style={styles.value}>{userDetail['full-name']}</Text></Text>
            <Text style={styles.label}>Email: <Text style={styles.value}>{userDetail.email}</Text></Text>
            <Text style={styles.label}>Phone: <Text style={styles.value}>{userDetail.phone}</Text></Text>
            <Text style={styles.label}>Bio: <Text style={styles.value}>{userDetail.bio}</Text></Text>
            <Text style={styles.label}>Role: <Text style={styles.value}>{userDetail.role}</Text></Text>
            <Text style={styles.label}>Status: <Text style={styles.value}>{userDetail.status}</Text></Text>
            <Text style={styles.label}>Created At: <Text style={styles.value}>{new Date(userDetail['created-datetime']).toLocaleString()}</Text></Text>
            <TouchableOpacity onPress={handleDelete} style={styles.backButton}>
                <Text style={styles.backText}>Delete User</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButton: {
        marginBottom: 12,
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: '#cadcfc',
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    backText: {
        color: '#00246B',
        fontWeight: 'bold',
    },
    label: {
        fontWeight: 'bold',
        color: '#00246B',
        marginTop: 8,
    },
    value: {
        fontWeight: 'normal',
        color: '#000',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignSelf: 'center',
        marginBottom: 16,
    },
});
