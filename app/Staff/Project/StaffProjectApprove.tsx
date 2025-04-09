import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Text, View, ScrollView, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AuthContext } from '../../../context/authContext';
import { useFocusEffect } from '@react-navigation/native';

function StaffProjectApprove({ navigation }: any) {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true; // để tránh memory leak
  
      const getApproveProject = async () => {
        try {
          const res = await axios.get(
            'https://marvelous-gentleness-production.up.railway.app/api/Project/GetAllProjectByMonitor',
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          if (isActive) {
            setProjects(res.data.data || []);
          }
        } catch (error) {
          console.log('Lỗi khi lấy danh sách project:', error);
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      };
  
      getApproveProject();
  
      return () => {
        isActive = false;
      };
    }, [user.token])
  );

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#0000ff" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {projects.length === 0 ? (
        <Text style={styles.emptyText}>Không có dự án nào.</Text>
      ) : (
        projects.map((project) => (
          <TouchableOpacity
            key={project['project-id']}
            style={styles.card}
            onPress={() =>
              navigation.navigate('ApprovedProject', {
                projectId: project['project-id'],
              })
            }
          >
            <Text style={styles.title}>{project.title}</Text>
            {project.thumbnail && project.thumbnail !== 'null' ? (
              <Image source={{ uri: project.thumbnail }} style={styles.image} />
            ) : (
              <Text style={{ color: 'gray' }}>Không có ảnh</Text>
            )}
            <Text style={styles.desc}>{project.description}</Text>
            <Text style={styles.status}>Trạng thái: {project.status}</Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

export default StaffProjectApprove;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
    color: '#00246B',
  },
  image: {
    height: 180,
    width: '100%',
    borderRadius: 8,
    marginBottom: 10,
  },
  desc: {
    color: '#333',
    marginBottom: 4,
  },
  status: {
    fontStyle: 'italic',
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: 'gray',
  },
});
