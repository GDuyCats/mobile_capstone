import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import HeaderLayout from '../components/HeaderLayout';
import ProjectTabs from '../components/TabView';

export default function ProjectDetail({ route, navigation }: any) {
  const { projectId } = route.params;
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(
          `https://marvelous-gentleness-production.up.railway.app/api/Project/GetProjectById?id=${projectId}`
        );
        setProject(res.data.data);
      } catch (error) {
        console.log('Error while get the project', error);
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
        <Text style={{ fontSize: 10 }}>Please wait</Text>
        <Text style={{ fontSize: 20 }}>Loading...</Text>
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
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <HeaderLayout title="Project" onBackPress={() => navigation.goBack()} />
        {project.thumbnail && (
          <Image source={{ uri: project.thumbnail }} style={styles.image} />
        )}
        <ProjectTabs
          route={route}
          navigation={navigation}
          project={project}
          projectId={projectId}
        />
      </ScrollView>
      <View style={styles.donateContainer}>
        <TouchableOpacity
          style={styles.donateButton}
          onPress={() =>
            navigation.navigate('UserPayment', {
              projectId: project['project-id'],
            })
          }
        >
          <Text style={styles.donateText}>Back this Project</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 12,
  },
  donateContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 15,
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  donateButton: {
    backgroundColor: '#0ba35a',
    borderRadius: 50,
    paddingVertical: 15,
    alignItems: 'center',
  },
  donateText: {
    fontWeight: '600',
    fontSize: 15,
    color: 'white',
    paddingHorizontal: 40,
  },
});
