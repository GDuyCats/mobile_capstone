import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../context/authContext';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { ScrollView } from 'react-native-gesture-handler';

export default function Updateprofile({ navigation }: any) {
    const { user, updateUser } = useContext(AuthContext);
    const [isUploading, setIsUploading] = useState(false);
    const [email, setEmail] = useState('');
    const [fullname, setFullname] = useState('');
    const [paymentAccount, setPaymentAccount] = useState('')
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [bio, setBio] = useState('');
    const [avatarUri, setAvatarUri] = useState<string | null>(user?.avatar || null);

    useEffect(() => {
        if (user) {
            setFullname(user.fullName || '');
            setEmail(user.email || '');
            setPhone(user.phone || '');
            setBio(user.bio || '');
            setPaymentAccount(user.paymentAccount || '')
        }
    }, [user]);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setAvatarUri(result.assets[0].uri);
        }
    };

    const uploadAvatar = async () => {
        setIsUploading(true)
        try {
            if (!avatarUri) {
                Alert.alert('Vui lòng chọn ảnh!');
                return;
            }

            const fileName = avatarUri.split('/').pop() || 'avatar.jpg';
            const fileType = fileName.split('.').pop();

            const formData = new FormData();
            formData.append('file', {
                uri: avatarUri.startsWith('file://') ? avatarUri : `file://${avatarUri}`,
                name: fileName,
                type: `image/${fileType === 'jpg' ? 'jpeg' : fileType}`,
            } as any);


            const res = await axios.put(
                'https://marvelous-gentleness-production.up.railway.app/api/User/avatar',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        'Content-Type': 'multipart/form-data',
                    },

                }
            );

            const imageUrl = res.data['image-url'];
            updateUser({ avatar: imageUrl });
            setAvatarUri(imageUrl);

            Alert.alert('Đổi avatar thành công!');
        } catch (error: any) {
            console.log(error.message);
            Alert.alert(error.message);
        } finally {
            setIsUploading(false)
        }
    };

    const handleUpdate = async () => {
        const formData = new FormData();

        if (fullname) formData.append('Fullname', fullname);
        if (email) formData.append('Email', email);
        if (password) formData.append('Password', password);
        if (phone) formData.append('Phone', phone);
        if (bio) formData.append('Bio', bio);
        if (paymentAccount) formData.append('PaymentAccount', paymentAccount);
        try {
            await axios.post(
                'https://marvelous-gentleness-production.up.railway.app/api/User/UpdateUser',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            updateUser({
                fullName: fullname,
                email,
                phone,
                bio,
                paymentAccount, 
            });

            Alert.alert('Cập nhật thành công');
            navigation.goBack();
        } catch (error: any) {
            console.log('Lỗi khi update:', error);
            Alert.alert('Lỗi', error?.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.label}>Họ tên</Text>
            <TextInput value={fullname} onChangeText={setFullname} style={styles.input} />

            <Text style={styles.label}>Email</Text>
            <TextInput value={email} onChangeText={setEmail} style={styles.input} />

            <Text style={styles.label}>Mật khẩu</Text>
            <TextInput value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />

            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput value={phone} onChangeText={setPhone} style={styles.input} />

            <Text style={styles.label}>Tài khoản thanh toán</Text>
            <TextInput value={paymentAccount} onChangeText={setPaymentAccount} style={styles.input} />

            <Text style={styles.label}>Giới thiệu</Text>
            <TextInput value={bio} onChangeText={setBio} style={styles.input} />

            <Text style={styles.label}>Avatar</Text>
            {avatarUri && (
                <Image source={{ uri: avatarUri }} style={styles.avatar} />
            )}
            {isUploading && (
                <View style={{ marginVertical: 10 }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text>Đang tải ảnh lên...</Text>
                </View>
            )}
            <Button title="Chọn ảnh" onPress={pickImage} />
            <Button title="Cập nhật Avatar" onPress={uploadAvatar} />
            <Button title="Cập nhật thông tin" onPress={handleUpdate} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingTop : 20,
        paddingBottom: 100,
        backgroundColor: '#fff',
        flex: 1,
    },
    label: {
        fontWeight: 'bold',
        marginTop: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 8,
        marginTop: 4,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginVertical: 10,
    },
});
