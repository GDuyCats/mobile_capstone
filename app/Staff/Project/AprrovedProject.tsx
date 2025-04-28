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
        setStatus(res.data.data.status);
      } catch (error) {
        console.log('Error', error);
        Alert.alert('Error', 'Can not get the projects');
      }
    };
    fetchProject();
  }, []);

  const handleApprove = async () => {
    if (!status) {
      Alert.alert('Error', 'Please choose a new status');
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
        Alert.alert('Success', 'The project have been updated');
        navigation.goBack();
      } else {
        Alert.alert('Error', res.data.message || 'Error happened');
      }
    } catch (err: any) {
      console.log('Error', err?.response?.data || err.message);
      Alert.alert('Error', err?.response?.data?.message || 'Can not update the project');
    } finally {
      setLoading(false);
    }
  };

  if (!project) {
    return <ActivityIndicator style={{ marginTop: 40 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Current Status :</Text>
      <Text>{project.status}</Text>

      <Text style={styles.label}>New Status:</Text>
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
        placeholder="Reason"
        value={reason}
        onChangeText={setReason}
        style={styles.input}
      />

      <Button title="Update status" onPress={handleApprove} disabled={loading} />
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
