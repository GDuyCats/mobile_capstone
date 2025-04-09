import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../../context/authContext';
import { useFocusEffect } from '@react-navigation/native';
function MyProjectDetail({ route, navigation }: any) {
  const { user } = useContext(AuthContext);
  const { projectId } = route.params;
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
  React.useCallback(() => {
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
      } catch (err) {
        console.error('Lỗi khi lấy chi tiết project:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, user.token]));

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

  if (!project) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Không tìm thấy dự án.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>📌 Tên dự án:</Text>
      <Text>{project.title}</Text>

      <Text style={styles.label}>🧑‍💼 Người tạo:</Text>
      <Text>{project.creator}</Text>

      <Text style={styles.label}>📖 Mô tả:</Text>
      <Text>{project.description}</Text>

      <Text style={styles.label}>📅 Bắt đầu:</Text>
      <Text>{new Date(project['start-datetime']).toLocaleString()}</Text>

      <Text style={styles.label}>📅 Kết thúc:</Text>
      <Text>{new Date(project['end-datetime']).toLocaleString()}</Text>

      <Text style={styles.label}>💰 Mức cần:</Text>
      <Text>{project['minimum-amount']} VND</Text>

      <Text style={styles.label}>💵 Đã nhận:</Text>
      <Text>{project['total-amount']} $</Text>

      <Text style={styles.label}>🔒 Trạng thái:</Text>
      <Text>{project.status}</Text>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('MyUpdateProject',  { projectId: project["project-id"] })
        }}>
        <Text>Update Project</Text>
      </TouchableOpacity>
      <View>
        <Text>Delete Project</Text>
      </View>
    </View>
  );
}

export default MyProjectDetail;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    marginTop: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  error: {
    fontSize: 16,
    color: 'red',
  },
});
