import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Alert,
    useWindowDimensions
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../../context/authContext';
import { Picker } from '@react-native-picker/picker';
import RenderHtml from 'react-native-render-html';
import HeaderLayout from '../../../components/HeaderLayout';

export default function AddProjectPost({ route, navigation }) {
    const { user } = useContext(AuthContext);
    const { projectId } = route.params;
    const { width } = useWindowDimensions();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('EXCLUSIVE');
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!user?.token) {
            Alert.alert('Authentication Required', 'Please log in to create a post.');
            return;
        }
        if (!title.trim() || !description.trim()) {
            Alert.alert('Validation Error', 'Title and description cannot be empty.');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('ProjectId', String(projectId));
            formData.append('Title', title);
            formData.append('Description', description);
            formData.append('Status', status);

            await axios.post(
                'https://marvelous-gentleness-production.up.railway.app/api/Post',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            Alert.alert('Success', 'Post has been created successfully!');
            navigation.goBack();
        } catch (err) {
            console.error(err);
            Alert.alert('Error', err.response?.data?.message || 'Failed to create post.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{flex: 1}}>
            <HeaderLayout title={"Create project post"} onBackPress={() => navigation.goBack()}/>
            <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.label}>Project ID</Text>
                    <TextInput
                        style={[styles.input, styles.disabledInput]}
                        value={String(projectId)}
                        editable={false}
                    />

                    <Text style={styles.label}>Title</Text>
                    <TextInput
                        style={styles.input}
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Enter post title"
                    />

                    <Text style={styles.label}>Description (HTML)</Text>
                    <TextInput
                        style={[styles.input, { height: 120 }]}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="<p><strong>Example HTML content</strong></p>"
                        multiline
                    />

                    <Text style={[styles.label, { marginTop: 12 }]}>Preview</Text>
                    <View style={styles.preview}>
                        <RenderHtml contentWidth={width - 64} source={{ html: description }} />
                    </View>

                    <Text style={styles.label}>Status</Text>
                    <View style={styles.pickerWrapper}>
                        <Picker selectedValue={status} onValueChange={setStatus}>
                            <Picker.Item label="EXCLUSIVE" value="EXCLUSIVE" />
                            <Picker.Item label="PUBLIC" value="PUBLIC" />
                            <Picker.Item label="PRIVATE" value="PRIVATE" />
                            <Picker.Item label="DELETED" value="DELETED" />
                        </Picker>
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleCreate}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Create Post</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: '#f5f7fa',
    },
    container: {
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: '700',
        color: '#4A90E2',
        textAlign: 'center',
        marginVertical: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 12,
        backgroundColor: '#fafafa',
        marginBottom: 16,
    },
    disabledInput: {
        backgroundColor: '#e9ecef',
        color: '#6c757d',
    },
    preview: {
        backgroundColor: '#fafafa',
        borderRadius: 6,
        padding: 12,
        minHeight: 80,
        marginBottom: 16,
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#4A90E2',
        paddingVertical: 14,
        borderRadius: 6,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
