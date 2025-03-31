import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/authContext';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

export default function Updateprofile({ navigation }: any) {
    const { user, updateUser } = useContext(AuthContext);

    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
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
        try {
            if (!avatarUri) {
                Alert.alert('Vui lòng chọn ảnh!');
                return;
            }

            const fileName = avatarUri.split('/').pop() || 'avatar.jpg';
            const fileType = fileName.split('.').pop();

            const formData = new FormData();
            formData.append('avatar', {
                uri: avatarUri,
                name: fileName,
                type: `image/${fileType === 'jpg' ? 'jpeg' : fileType}`,
            } as any);

            const res = await axios.put(
                'https://marvelous-gentleness-production.up.railway.app/api/User/avatar',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );

            const imageUrl = res.data['image-url'];
            updateUser({ avatar: imageUrl });
            setAvatarUri(imageUrl);

            Alert.alert('✅ Đổi avatar thành công!');
        } catch (error: any) {
            console.log('❌ Upload thất bại:', error?.response?.data || error.message);
            Alert.alert('Lỗi upload avatar', error?.response?.data?.message || 'Upload thất bại');
        }
    };

    const handleUpdate = async () => {
        const formData = new FormData();

        if (fullname) formData.append('Fullname', fullname);
        if (email) formData.append('Email', email);
        if (password) formData.append('Password', password);
        if (phone) formData.append('Phone', phone);
        if (bio) formData.append('Bio', bio);

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
            });

            Alert.alert('✅ Cập nhật thành công');
            navigation.goBack();
        } catch (error: any) {
            console.log('❌ Lỗi khi update:', error);
            Alert.alert('Lỗi', error?.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Họ tên</Text>
            <TextInput value={fullname} onChangeText={setFullname} style={styles.input} />

            <Text style={styles.label}>Email</Text>
            <TextInput value={email} onChangeText={setEmail} style={styles.input} />

            <Text style={styles.label}>Mật khẩu</Text>
            <TextInput value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />

            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput value={phone} onChangeText={setPhone} style={styles.input} />

            <Text style={styles.label}>Giới thiệu</Text>
            <TextInput value={bio} onChangeText={setBio} style={styles.input} />

            <Text style={styles.label}>Avatar</Text>
            {avatarUri && (
                <Image source={{ uri: avatarUri }} style={styles.avatar} />
            )}
            <Button title="Chọn ảnh" onPress={pickImage} />
            <Button title="Cập nhật Avatar" onPress={uploadAvatar} />

            <View style={{ marginTop: 20 }}>
                <Button title="Cập nhật thông tin" onPress={handleUpdate} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
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
