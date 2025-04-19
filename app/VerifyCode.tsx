import axios from 'axios'
import { useFocusEffect } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { View, Text, Alert, TextInput, Button, StyleSheet } from 'react-native'

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
                navigation.navigate('ResetPassword', {email})
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
        <View style={styles.container}>
            <Text style={styles.label}>Mã xác nhận:</Text>
            <TextInput
                style={styles.input}
                placeholder="Nhập mã xác nhận"
                value={code}
                onChangeText={setCode}
                keyboardType="numeric"
            />
            <Button title="Xác minh" onPress={handleVerifyCode} />
        </View>
    );
}

export default VerifyCode
const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        justifyContent: 'center',
    },
    label: {
        marginBottom: 5,
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderColor: '#aaa',
        padding: 10,
        borderRadius: 6,
        marginBottom: 20,
    },
});