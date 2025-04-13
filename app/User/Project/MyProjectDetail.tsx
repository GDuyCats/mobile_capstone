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
  const [isDisabled, setIsDisabled] = useState(false);
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
            setIsDisabled(true)
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
      <Text style={styles.label}>📌 Project's title:</Text>
      <Text>{project.title}</Text>

      <Text style={styles.label}>🧑‍💼 Creator:</Text>
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
      <Text style={styles.label}>📖 Description</Text>
      <Text>{project.description}</Text>

      <Text style={styles.label}>Game Story</Text>
      <Text>{project.story}</Text>

      <Text style={styles.label}>📅 Start time</Text>
      <Text>{new Date(project['start-datetime']).toLocaleString()}</Text>

      <Text style={styles.label}>📅 End time</Text>
      <Text>{new Date(project['end-datetime']).toLocaleString()}</Text>

      <Text style={styles.label}>💰 Goal</Text>
      <Text>{project['minimum-amount']} $</Text>

      <Text style={styles.label}>💵 Received</Text>
      <Text>{project['total-amount']} $</Text>

      <Text style={styles.label}>🔒 Status</Text>
      <Text>{project.status}</Text>
      <TouchableOpacity
        
        style={styles.updateButton}
        onPress={() => {
          setIsDisabled(true)
          navigation.navigate('MyUpdateProject', { projectId: project["project-id"] })
        }}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Update Project</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        disabled={isDisabled}
        onPress={handleDeleteProject}>
        <Text style={styles.deleteText}>Delete Project</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.backerButton}
        onPress={() => {
          navigation.navigate('MoneyHistory', { projectId: project["project-id"] })
        }}>
        <Text style={styles.deleteText}>Backer History</Text>
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
  backerButton: {
    backgroundColor: 'green',
    padding: 10,
    marginTop: 20,
    borderRadius: 6,
    alignItems: 'center',
  },

  updateButton: {
    backgroundColor: 'blue',
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
