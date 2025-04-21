import React, { useContext } from 'react'
import { AuthContext } from '../context/authContext'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import NavbarLayout from '../components/NavbarLayout';
function MyPersonal({ navigation }: any) {
    const { user, logout } = useContext(AuthContext)
    return (
        <ScrollView contentContainerStyle={{flex: 1}}>
            <View style={style.container}>
                <View style={style.header}>
                    <Text style={style.title}>Setting</Text>
                    <View style={{ flexDirection: 'row' }}>
                        {user?.avatar ? (
                            <Image
                                source={{ uri: user?.avatar }}
                                style={style.avatar} />
                        ) : (
                            <MaterialIcons style={style.avatar} name="account-circle" size={60} color="black" />
                        )}
                        <View style={{ marginLeft: 20, marginTop: 15 }}>
                            <Text style={{ color: '#464F64', fontSize: 20, fontWeight: 600 }}>Hello</Text>
                            <Text style={{ color: 'white', fontSize: 20, fontWeight: 700 }}>{user?.fullName ?? ''}</Text>
                        </View>
                        <Feather
                            name="edit"
                            size={24}
                            color="white"
                            onPress={() => { navigation.navigate('Updateprofile') }}
                            style={{ marginTop: 40, marginLeft: 60 }} />
                    </View>
                </View>

                {user?.role === "CUSTOMER" && (
                    <>
                        <View style={style.body}>
                            <TouchableOpacity
                                style={style.option}
                                onPress={() => { navigation.navigate('Home') }} >
                                <Text style={style.optionText}>Home</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[style.option, { marginBottom: 1 }]}
                                onPress={() => { navigation.navigate('Profile') }} >
                                <Text style={style.optionText}>My profile</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[style.option, { marginBottom: 1 }]}
                                onPress={() => { navigation.navigate('MyProject') }} >
                                <Text style={style.optionText}>My project</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[style.option, { marginBottom: 1 }]}
                                onPress={() => { navigation.navigate('CreateProject') }} >
                                <Text style={style.optionText}>Create new project</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[style.option, { marginBottom: 1 }]}
                                onPress={() => { navigation.navigate('MyPledge') }} >
                                <Text style={style.optionText}>View my pledge</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={style.option}
                                onPress={() => {
                                    logout();
                                    navigation.navigate('Home');
                                }} >
                                <Text style={[style.optionText, { color: 'red', fontWeight: 900 }]}>
                                    Log out
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}

                {user?.role === "STAFF" && (
                    <>
                        <View style={style.body}>
                            <TouchableOpacity
                                style={style.option}
                                onPress={() => { navigation.navigate('Home') }} >
                                <Text style={[style.optionText]}>Home</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[style.option, { marginBottom: 1 }]}
                                onPress={() => { navigation.navigate('Profile') }} >
                                <Text style={style.optionText}>My profile</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[style.option, { marginBottom: 1 }]}
                                onPress={() => { navigation.navigate('StaffGetProject') }} >
                                <Text style={style.optionText}>View all projects</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[style.option, { marginBottom: 1 }]}
                                onPress={() => { navigation.navigate('StaffProjectApprove') }} >
                                <Text style={style.optionText}>project need to approve</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[style.option, { marginBottom: 1 }]}
                                onPress={() => { navigation.navigate('StaffGetComment') }} >
                                <Text style={style.optionText}>View all comments</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[style.option, { marginBottom: 1 }]}
                                onPress={() => { navigation.navigate('StaffReward') }} >
                                <Text style={style.optionText}>View all reward</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[style.option, { marginBottom: 1 }]}
                                onPress={() => { navigation.navigate('StaffReport') }} >
                                <Text style={style.optionText}>View all reports</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={style.option}
                                onPress={() => { navigation.navigate('StaffGetPost') }} >
                                <Text style={style.optionText}>View all posts</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={style.option}
                                onPress={() => {
                                    logout();
                                    navigation.navigate('Home');
                                }} >
                                <Text style={[style.optionText, { color: 'red', fontWeight: 900 }]}>
                                    Log out
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}

                {user?.role === 'ADMIN' && (
                    <>
                        <View style={style.body}>
                            <TouchableOpacity
                                style={style.option}
                                onPress={() => { navigation.navigate('Home') }} >
                                <Text style={style.optionText}>Home</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[style.option, { marginBottom: 1 }]}
                                onPress={() => { navigation.navigate('Profile') }} >
                                <Text style={style.optionText}>My profile</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[style.option, { marginBottom: 1 }]}
                                onPress={() => { navigation.navigate('AdminUser') }} >
                                <Text style={style.optionText}>View all users</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[style.option, { marginBottom: 1 }]}
                                onPress={() => { navigation.navigate('AdminCreateStaff') }} >
                                <Text style={style.optionText}>Create new staff</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[style.option, { marginBottom: 1 }]}
                                onPress={() => { navigation.navigate('AdminPledge') }} >
                                <Text style={style.optionText}>View all pledges</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={style.option}
                                onPress={() => {
                                    logout();
                                    navigation.navigate('Home');
                                }} >
                                <Text style={[style.optionText, { color: 'red', fontWeight: 900 }]}>
                                    Log out
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </View>
            <NavbarLayout currentScreen="Setting"/>
        </ScrollView>
    )
}

export default MyPersonal

const style = StyleSheet.create({
    container: {
        flex: 1,
    },

    header: {
        backgroundColor: '#0C1C33',
        flex: 0.3
    },

    body: {
        backgroundColor: '#EEEEF0',
        flex: 0.7
    },

    title: {
        color: 'white',
        fontWeight: '900',
        fontSize: 30,
        marginTop: 40,
        marginLeft: 30
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 50,
        marginTop: 15,
        marginLeft: 30,
    },

    option: {
        height: 40,
        marginBottom: 5,
        justifyContent: 'center',
        backgroundColor: 'white',

    },

    optionText: {
        fontWeight: 500,
        fontSize: 15,
        marginLeft: 20
    }
})