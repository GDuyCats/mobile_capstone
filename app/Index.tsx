import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AppLayout from '../components/AppLayout'; // hoặc đường dẫn bạn đặt
import { useFocusEffect } from '@react-navigation/native';
export default function Home({ navigation }: any) {
  const [projects, setProjects] = useState([]);
  const [isUploading, setIsUploading] = useState(true);
  useFocusEffect(
    React.useCallback(() => {
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
  }, [projects]));
  return (
    <AppLayout navigation={navigation}>
      <ScrollView contentContainerStyle={styles.container}>
        {isUploading && (
          <View style={{ marginVertical: 10 }}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Đang tải thông tin lên ...</Text>
          </View>
        )}
        {projects.map((project: any) => {
          const progress = (project["total-amount"] / project["minimum-amount"]) * 100;
          const endDate = new Date(project["end-datetime"]);
          const now = new Date();
          const timeDiff = endDate.getTime() - now.getTime();
          const daysLeft = Math.max(0, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));
          return (
            <TouchableOpacity
              key={project["project-id"]}
              style={styles.card}
              onPress={() => navigation.navigate('ProjectDetail', { projectId: project["project-id"] })}
            >
              <View style={{ marginBottom: 10 }}>
                <Text style={styles.projectTitle}>{project.title}</Text>
              </View>

              {project.thumbnail ? (
                <Image source={{ uri: project.thumbnail }} style={styles.image} />
              ) : (
                <Text style={{ color: '#00246B', fontWeight: 'bold' }}>No thumbnail</Text>
              )}

              <View style={{ marginVertical: 10 }}>
                <Text><Text style={{ color: '#00246B', fontWeight: 'bold' }}>Creator: </Text>{project.creator}</Text>
              </View>

              <View>
                <Text><Text style={{ color: '#00246B', fontWeight: 'bold' }}>Description: </Text>{project.description}</Text>
              </View>

              <View style={{ marginVertical: 10 }}>
                <Text><Text style={{ color: '#00246B', fontWeight: 'bold' }}>Status: </Text>{project.status}</Text>
              </View>
              <View style={{ marginTop: 8 }}>
                <View style={{ height: 4, backgroundColor: '#ccc', borderRadius: 2, overflow: 'hidden' }}>
                  <View
                    style={{
                      height: '100%',
                      width: `${Math.min(progress, 100)}%`,
                      backgroundColor: '#028760',
                    }}
                  />
                </View>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 10 }}>

                <View style={{ marginTop: 4 }}>
                  <Text style={{ color: '#028760', fontWeight: '600' }}>
                    {Math.floor(progress)}% {'\n'}funded
                  </Text>
                </View>

                <View style={{ marginTop: 4, marginLeft: 10 }}>
                  <Text style={{ color: '#00246B', fontWeight: 'bold' }}>
                    <Text>{project.backers}{'\n'}
                    </Text>
                    Backers
                  </Text>
                </View>
                <View style={{ marginTop: 4, marginLeft: 10 }}>
                  <Text style={{ color: '#00246B', fontWeight: 'bold' }}>
                    <Text style={{ color: '#00246B', fontWeight: 'bold' }}>{daysLeft} {'\n'}{daysLeft === 1 ? 'day' : 'days'} </Text>
                    to go
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
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
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#c9d1d4',
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
