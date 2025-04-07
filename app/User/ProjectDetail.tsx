import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import RenderHTML from 'react-native-render-html';

export default function ProjectDetail({ route, navigation }: any) {
  const { projectId } = route.params;
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(
          `https://marvelous-gentleness-production.up.railway.app/api/Project/GetProjectById?id=${projectId}`
        );
        setProject(res.data.data);
      } catch (error) {
        console.log('Lỗi khi fetch chi tiết project:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Đang tải thông tin...</Text>
      </View>
    );
  }

  if (!project) {
    return (
      <View style={styles.center}>
        <Text>Không tìm thấy project.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Nút Quay Lại */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>← Quay lại</Text>
      </TouchableOpacity>

      <TouchableOpacity 
      style={styles.backButton} 
      onPress={() => navigation.navigate('UserPayment', {
        projectId: project['project-id'],
      })}>
        <Text style={styles.backText}>Pledge Project</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{project.title}</Text>

      {project.thumbnail && (
        <Image source={{ uri: project.thumbnail }} style={styles.image} />
      )}

      <Text style={styles.label}>
        Creator: <Text style={styles.value}>{project.creator}</Text>
      </Text>

      <Text style={styles.label}>
        Description: <Text style={styles.value}>{project.description}</Text>
      </Text>

      <Text style={styles.label}>
        Status: <Text style={styles.value}>{project.status}</Text>
      </Text>

      <Text style={styles.label}>
        Goal:{' '}
        <Text style={styles.value}>
          {project['minimum-amount'].toLocaleString()} VND
        </Text>
      </Text>

      <Text style={styles.label}>
        Total Raised:{' '}
        <Text style={styles.value}>
          {project['total-amount'].toLocaleString()} VND
        </Text>
      </Text>

      <Text style={styles.label}>
        Start:{' '}
        <Text style={styles.value}>
          {new Date(project['start-datetime']).toLocaleString()}
        </Text>
      </Text>

      <Text style={styles.label}>
        End:{' '}
        <Text style={styles.value}>
          {new Date(project['end-datetime']).toLocaleString()}
        </Text>
      </Text>

      <Text style={styles.storyLabel}>Story:</Text>

      <RenderHTML
        contentWidth={width}
        source={{ html: project.story }}
        renderersProps={{
          img: {
            enableExperimentalPercentWidth: true,
          },
        }}
        tagsStyles={{
          img: {
            maxWidth: '100%',
            height: 'auto',
          },
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00246B',
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
    color: '#00246B',
    marginTop: 8,
  },
  value: {
    fontWeight: 'normal',
    color: '#000',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 12,
    borderRadius: 8,
  },
  storyLabel: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00246B',
  },
  backButton: {
    marginBottom: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#cadcfc',
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  backText: {
    color: '#00246B',
    fontWeight: 'bold',
  },
});
