import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  StyleSheet,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../../../context/authContext';

export default function CreateProject({ navigation }: any) {
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [minimumAmount, setMinimumAmount] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState<'start' | 'end' | null>(null);
  const [image, setImage] = useState<any>(null); // Optional

  // 👉 Chọn ảnh thumbnail từ thư viện
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

  // 👉 Xử lý khi nhấn "Tạo dự án"
  const handleCreate = async () => {
    if (!title || !description || !minimumAmount) {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin!');
      return;
    }

    if (startDate >= endDate) {
      Alert.alert('Lỗi', 'Ngày bắt đầu phải nhỏ hơn ngày kết thúc.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('minimumAmount', parseFloat(minimumAmount).toString());
      formData.append('startDatetime', startDate.toISOString());
      formData.append('endDatetime', endDate.toISOString());

      // Gửi API tạo project
      const res = await axios.post(
        'https://marvelous-gentleness-production.up.railway.app/api/Project/CreateProject',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (res.data.success) {
        const projectId = res.data.data['project-id'];

        // ✅ Nếu có ảnh thì upload thêm thumbnail
        if (image) {
          const imgForm = new FormData();
          imgForm.append('file', {
            uri: image.uri,
            name: 'thumbnail.jpg',
            type: 'image/jpeg',
          } as any);

          await axios.put(
            `https://marvelous-gentleness-production.up.railway.app/api/Project/UpdateProjectThumbnail?projectId=${projectId}`,
            imgForm,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
        }

        Alert.alert('Thành công', 'Tạo dự án thành công!');
        navigation.navigate('Home');
      } else {
        Alert.alert('Lỗi', res.data.message || 'Không tạo được dự án');
      }
    } catch (err) {
      console.log(err);
      Alert.alert('Lỗi', 'Đã có lỗi xảy ra khi tạo dự án.');
    }
  };

  const handleConfirm = (date: Date) => {
    if (showPicker === 'start') {
      setStartDate(date);
    } else if (showPicker === 'end') {
      setEndDate(date);
    }
    setShowPicker(null);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={styles.label}>Tiêu đề:</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} />

        <Text style={styles.label}>Mô tả:</Text>
        <TextInput style={styles.input} value={description} onChangeText={setDescription} />

        <Text style={styles.label}>Số tiền cần (VND):</Text>
        <TextInput
          style={styles.input}
          value={minimumAmount}
          onChangeText={setMinimumAmount}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Ngày bắt đầu:</Text>
        <TouchableOpacity onPress={() => setShowPicker('start')} style={styles.dateButton}>
          <Text>{startDate.toLocaleString()}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Ngày kết thúc:</Text>
        <TouchableOpacity onPress={() => setShowPicker('end')} style={styles.dateButton}>
          <Text>{endDate.toLocaleString()}</Text>
        </TouchableOpacity>

        <View style={{ marginTop: 10 }}>
          <Text style={styles.label}>Ảnh Thumbnail (tuỳ chọn):</Text>

          {!image ? (
            <TouchableOpacity onPress={pickImage} style={styles.dateButton}>
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


        <DateTimePickerModal
          isVisible={!!showPicker}
          mode="datetime"
          date={showPicker === 'start' ? startDate : endDate}
          onConfirm={handleConfirm}
          onCancel={() => setShowPicker(null)}
        />

        <Button title="Tạo dự án" onPress={handleCreate} />
      </View>
    </TouchableWithoutFeedback>
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
  dateButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
  },
});
