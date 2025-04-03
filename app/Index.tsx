import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AppLayout from '../components/AppLayout'; // hoặc đường dẫn bạn đặt

export default function Home({ navigation }: any) {
  const [projects, setProjects] = useState([]);
  const [isUploading, setIsUploading] = useState(true);
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('https://marvelous-gentleness-production.up.railway.app/api/Project/GetAllProject');
        setProjects(res.data.data);
      } catch (error) {
        console.log('Lỗi fetch project:', error);
      } finally {
        setIsUploading(false)
      }
    };

    fetchProjects();
  }, []);

  return (
    <AppLayout navigation={navigation}>
      <ScrollView contentContainerStyle={styles.container}>
        {isUploading && (
          <View style={{ marginVertical: 10 }}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Đang tải thông tin lên ...</Text>
          </View>
        )}
        {projects.map((project: any) => (
          <TouchableOpacity
            key={project["project-id"]}
            style={styles.card}
            onPress={() => navigation.navigate('ProjectDetail', { projectId: project["project-id"] })}
          >
            <Text style={styles.projectTitle}>{project.title}</Text>

            <Text>
              <Text style={{ color: '#00246B', fontWeight: 'bold' }}>Creator: </Text>
              {project.creator}
            </Text>

            <Text>
              <Text style={{ color: '#00246B', fontWeight: 'bold' }}>Description: </Text>
              {project.description}
            </Text>

            <Text>
              <Text style={{ color: '#00246B', fontWeight: 'bold' }}>Status: </Text>
              {project.status}
            </Text>

            <Text>
              <Text style={{ color: '#00246B', fontWeight: 'bold' }}>Goal: </Text>
              {project["minimum-amount"]} VND
            </Text>

            {project.thumbnail ? (
              <Image source={{ uri: project.thumbnail }} style={styles.image} />
            ) : (
              <Text>
                <Text style={{ color: '#00246B', fontWeight: 'bold' }}>Thumbnail: </Text>
                No thumbnail
              </Text>
            )}
          </TouchableOpacity>

        ))}
      </ScrollView>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#cadcfc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  projectTitle: {
    color: '#00246B',
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 8,
    borderRadius: 8,
  },
});
