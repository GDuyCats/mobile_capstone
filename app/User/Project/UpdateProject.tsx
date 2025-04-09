import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Button,
  ActivityIndicator,
  Image,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { AuthContext } from '../../../context/authContext';

export default function UpdateProject({ route, navigation }: any) {
  const { projectId } = route.params;
  const { user } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [minimumAmount, setMinimumAmount] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [story, setStory] = useState('');
  const [image, setImage] = useState<any>(null);

  const [showPicker, setShowPicker] = useState<'start' | 'end' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(
          `https://marvelous-gentleness-production.up.railway.app/api/Project/GetProjectById?id=${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        const data = res.data.data;
        setName(data.name || data.title || '');
        setDescription(data.description || '');
        setMinimumAmount(String(data['minimum-amount'] || ''));
        setStartDate(new Date(data['start-datetime']));
        setEndDate(new Date(data['end-datetime']));
        setStory(data.story || '');
      } catch (err) {
        console.log('Lỗi load project:', err);
        Alert.alert('Lỗi', 'Không lấy được thông tin dự án.');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, []);

  const handleUpdate = async () => {
    if (!name || !description || !minimumAmount) {
      return Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
    }

    const formData = new FormData();
    formData.append('Name', name);
    formData.append('Description', description);
    formData.append('MinimumAmount', parseFloat(minimumAmount).toString());
    formData.append('StartDatetime', startDate.toISOString());
    formData.append('EndDatetime', endDate.toISOString());

    try {
      // Update project
      const res = await axios.put(
        `https://marvelous-gentleness-production.up.railway.app/api/Project/UpdateProject?projectId=${projectId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      // Update thumbnail nếu có ảnh
      if (image) {
        const imageForm = new FormData();
        imageForm.append('file', {
          uri: image.uri,
          name: 'thumbnail.jpg',
          type: 'image/jpeg',
        } as any);

        await axios.put(
          `https://marvelous-gentleness-production.up.railway.app/api/Project/UpdateProjectThumbnail?projectId=${projectId}`,
          imageForm,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
      }

      // Update story nếu có
      if (story) {
        await axios.put(
          `https://marvelous-gentleness-production.up.railway.app/api/Project/UpdateProjectStory?projectId=${projectId}&story=${encodeURIComponent(story)}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
      }

      Alert.alert('Thành công', 'Cập nhật dự án thành công!');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Lỗi', 'Có lỗi khi gửi dữ liệu cập nhật.');
    }
  };

  const handleConfirm = (date: Date) => {
    if (showPicker === 'start') {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
    setShowPicker(null);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tên dự án:</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Mô tả:</Text>
      <TextInput style={styles.input} value={description} onChangeText={setDescription} />

      <Text style={styles.label}>Câu chuyện (Story):</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={story}
        onChangeText={setStory}
        multiline
      />

      <Text style={styles.label}>Số tiền cần (VND):</Text>
      <TextInput
        style={styles.input}
        value={minimumAmount}
        onChangeText={setMinimumAmount}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Ngày bắt đầu:</Text>
      <TouchableOpacity onPress={() => setShowPicker('start')} style={styles.dateBtn}>
        <Text>{startDate.toLocaleString()}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Ngày kết thúc:</Text>
      <TouchableOpacity onPress={() => setShowPicker('end')} style={styles.dateBtn}>
        <Text>{endDate.toLocaleString()}</Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={!!showPicker}
        mode="datetime"
        date={showPicker === 'start' ? startDate : endDate}
        onConfirm={handleConfirm}
        onCancel={() => setShowPicker(null)}
      />

      <View style={{ marginTop: 10 }}>
        <Text style={styles.label}>Ảnh Thumbnail (tuỳ chọn):</Text>
        {!image ? (
          <TouchableOpacity onPress={pickImage} style={styles.dateBtn}>
            <Text>Chọn ảnh từ thư viện</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ alignItems: 'center' }}>
            <Image
              source={{ uri: image.uri }}
              style={{ width: '100%', height: 200, borderRadius: 10 }}
            />
            <View style={{ flexDirection: 'row', marginTop: 10, gap: 10 }}>
              <TouchableOpacity
                onPress={pickImage}
                style={{
                  backgroundColor: '#4E9F3D',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 6,
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Đổi ảnh</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setImage(null)}
                style={{
                  backgroundColor: '#FF6B6B',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 6,
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Huỷ chọn ảnh</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <Button title="Cập nhật dự án" onPress={handleUpdate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
  dateBtn: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 10,
    backgroundColor: '#f2f2f2',
  },
});
