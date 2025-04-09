import React, { useContext, useEffect, useState } from 'react';
import { View, Alert, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
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

  const handleDeleteProject = () => {
    Alert.alert(
      'Xác nhận xoá',
      'Bạn có chắc chắn muốn xoá dự án này không?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await axios.delete(
                `https://marvelous-gentleness-production.up.railway.app/api/Project/DeleteProject?id=${project["project-id"]}`,
                {
                  headers: {
                    Authorization: `Bearer ${user.token}`,
                  },
                }
              );

              if (res.status === 200) {
                Alert.alert('Thành công', 'Dự án đã được xoá');
                navigation.goBack();
              } else {
                Alert.alert('Lỗi', 'Không thể xoá dự án');
              }
            } catch (err) {
              console.error(err);
              Alert.alert('Lỗi', 'Đã có lỗi xảy ra khi xoá dự án');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>📌 Tên dự án:</Text>
      <Text>{project.title}</Text>

      <Text style={styles.label}>🧑‍💼 Người tạo:</Text>
      <Text>{project.creator}</Text>
      {project.thumbnail ? (
        <Image
          source={{ uri: project.thumbnail }}
          style={{ width: '100%', height: 200, borderRadius: 10 }}
          resizeMode="cover"
        />
      ) : (
        <Text>Không có ảnh</Text>
      )}
      <Text style={styles.label}>📖 Mô tả:</Text>
      <Text>{project.description}</Text>

      <Text style={styles.label}>STORY:</Text>
      <Text>{project.story}</Text>

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
          navigation.navigate('MyUpdateProject', { projectId: project["project-id"] })
        }}>
        <Text>Update Project</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteProject}>
        <Text style={styles.deleteText}>❌ Delete Project</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => { 
          navigation.navigate('MoneyHistory', {projectId: project["project-id"]})
        }}>
        <Text style={styles.deleteText}>❌ Backer History</Text>
      </TouchableOpacity>
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
  deleteButton: {
    backgroundColor: '#ff4d4f',
    padding: 10,
    marginTop: 20,
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
