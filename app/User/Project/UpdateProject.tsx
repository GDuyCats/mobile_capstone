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
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
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

  const [showPicker, setShowPicker] = useState<'start' | 'end' | null>(null);
  const [loading, setLoading] = useState(true);

  // Load dữ liệu project ban đầu
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

      if (res.data.success) {
        Alert.alert('Thành công', 'Cập nhật dự án thành công!');
        navigation.goBack();
      } else {
        Alert.alert('Thất bại', res.data.message || 'Không thể cập nhật dự án.');
      }
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

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tên dự án:</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

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
