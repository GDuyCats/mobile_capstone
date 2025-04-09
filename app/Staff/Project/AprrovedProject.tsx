import React, { useContext, useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../../context/authContext';

const statusOptions = ['ONGOING', 'HALTED', 'INVISIBLE', 'DELETED'];

export default function ApproveProject({ route, navigation }: any) {
  const { projectId } = route.params;
  const { user } = useContext(AuthContext);

  const [status, setStatus] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<any>(null);

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
        setProject(res.data.data);
        setStatus(res.data.data.status); // default chọn trạng thái hiện tại
      } catch (error) {
        console.log('Lỗi load project:', error);
        Alert.alert('Lỗi', 'Không thể lấy dữ liệu dự án.');
      }
    };
    fetchProject();
  }, []);

  const handleApprove = async () => {
    if (!status) {
      Alert.alert('Lỗi', 'Vui lòng chọn trạng thái mới');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(
        'https://marvelous-gentleness-production.up.railway.app/api/Project/StaffApproveProject',
        {},
        {
          params: {
            projectId,
            status,
            reason,
          },
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (res.data.success) {
        Alert.alert('✅ Thành công', 'Dự án đã được cập nhật!');
        navigation.goBack();
      } else {
        Alert.alert('❌ Thất bại', res.data.message || 'Có lỗi xảy ra.');
      }
    } catch (err: any) {
      console.log('❌ Lỗi gọi API:', err?.response?.data || err.message);
      Alert.alert('Lỗi', err?.response?.data?.message || 'Không thể cập nhật dự án.');
    } finally {
      setLoading(false);
    }
  };

  if (!project) {
    return <ActivityIndicator style={{ marginTop: 40 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Trạng thái hiện tại:</Text>
      <Text>{project.status}</Text>

      <Text style={styles.label}>Chọn trạng thái mới:</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={status}
          onValueChange={(itemValue) => setStatus(itemValue)}
        >
          {statusOptions.map((s) => (
            <Picker.Item label={s} value={s} key={s} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Lý do:</Text>
      <TextInput
        placeholder="Nhập lý do (nếu có)..."
        value={reason}
        onChangeText={setReason}
        style={styles.input}
      />

      <Button title="Cập nhật trạng thái" onPress={handleApprove} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  label: {
    marginTop: 15,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 10,
  },
});
