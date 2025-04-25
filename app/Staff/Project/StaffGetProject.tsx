import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

function StaffGetProject({ navigation }: any) {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getProjects = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        'https://marvelous-gentleness-production.up.railway.app/api/Project/GetAllProject'
      );
      setProjects(res.data?.data || []);
    } catch (error) {
      console.log('Lỗi khi load project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getProjects();
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : projects.length === 0 ? (
        <Text style={styles.projectTitle}>There is no project</Text>
      ) : (
        projects.map((project: any) => (
          <TouchableOpacity
            key={project['project-id']}
            style={styles.card}
            onPress={() =>
              navigation.navigate('StaffProjectDetail', {
                projectId: project['project-id'],
              })
            }>
            <Text style={styles.projectTitle}>{project.title}</Text>

            <Text>
              <Text style={styles.label}>Creator: </Text>
              {project.creator}
            </Text>

            <Text>
              <Text style={styles.label}>Description: </Text>
              {project.description}
            </Text>

            <Text>
              <Text style={styles.label}>Status: </Text>
              {project.status}
            </Text>

            <Text>
              <Text style={styles.label}>Goal: </Text>
              {project['minimum-amount']}$
            </Text>

            {project.thumbnail ? (
              <Image source={{ uri: project.thumbnail }} style={styles.image} />
            ) : (
              <Text>
                <Text style={styles.label}>Thumbnail: </Text>
                No thumbnail
              </Text>
            )}
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

export default StaffGetProject;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
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
    marginBottom: 4,
  },
  label: {
    color: '#00246B',
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 8,
    borderRadius: 8,
  },
});
