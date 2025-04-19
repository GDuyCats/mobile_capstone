import axios from 'axios'
import { useFocusEffect } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { View, Text, Alert, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native'
import HeaderLayout from '../components/HeaderLayout'
import { LinearGradient } from 'expo-linear-gradient';
function VerifyCode({ navigation, route }: any) {
    const { email } = route.params
    const [code, setCode] = useState('')
    const [isLoading, setisLoading] = useState(false)
    const handleVerifyCode = async () => {
        if (!code || !email) {
            Alert.alert('Error', 'Please insert your email and verify code !')
            return
        }
        setisLoading(true)
        try {
            const res = await axios.get
                (`https://marvelous-gentleness-production.up.railway.app/api/ForgotPassword/Verify-Code?code=${code}&email=${encodeURIComponent(email)}`);

            if (res.data.success && res.data.success === true) {
                Alert.alert('Success', `${res.data.message}`)
                navigation.navigate('ResetPassword', { email })
            } else {
                Alert.alert('Error', `${res.data.message}`)
            }


        } catch (error) {
            Alert.alert('Error', error.message)
            console.log(error.data)
        } finally {
            setisLoading(false)
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <HeaderLayout title="Forgot Password" onBackPress={() => navigation.goBack()} />
            <View style={styles.container}>
                <View style={{ alignSelf: 'center' }}>
                    <Text style={{
                        fontSize: 18,
                        textAlign: 'center'
                    }}>
                        Enter the code that was send to{' '}
                        <Text style={{
                            color: 'green',
                            fontWeight: '700',
                        }}>
                            {email}
                        </Text>
                    </Text>
                </View>
                <TextInput
                    style={styles.input}
                    value={code}
                    onChangeText={setCode}
                    keyboardType="numeric"
                />
                <TouchableOpacity
                    onPress={handleVerifyCode}>
                    <LinearGradient
                        colors={['#19c213', '#7cf578']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ paddingVertical: 20, paddingHorizontal: 40, borderRadius: 50 }}
                    >
                        <Text
                            style={
                                {
                                    marginHorizontal: 'auto',
                                    color: 'white',
                                    fontWeight: 500,
                                    fontSize: 15,
                                }}>
                            {isLoading ? 'CONTINUE...' : 'CONTINUE'}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>

    );
}

export default VerifyCode
const styles = StyleSheet.create({
    container: {
        padding: 40,
        marginTop: 50,
        alignItems: 'center',
        flex: 1,
    },
    label: {
        marginBottom: 5,
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderColor: '#aaa',
        padding: 10,
        width: 200,
        borderRadius: 50,
        marginVertical: 20,
    },
});