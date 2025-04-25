import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../../context/authContext';
import HeaderLayout from '../../../components/HeaderLayout';

function AddPlatformToProject({ navigation, route }: any) {
  const { projectId, projectPlatforms } = route.params;
  const { user } = useContext(AuthContext);

  const [allPlatforms, setAllPlatforms] = useState([]);
  const [projectPlatformIds, setProjectPlatformIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const res = await axios.get(
          'https://marvelous-gentleness-production.up.railway.app/api/Platform/Platform/GetAll',
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setAllPlatforms(Array.isArray(res.data.data) ? res.data.data : []);
        const ids = projectPlatforms?.map((p: any) => p['platform-id']) || [];
        setProjectPlatformIds(ids);
      } catch (err) {
        console.log('Error fetching platform:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlatforms();
  }, []);

  const handleAddPlatform = async (platformId: number) => {
    try {
      const form = new FormData();
      form.append('PlatformId', platformId.toString());
      form.append('ProjectId', projectId.toString());

      await axios.post(
        'https://marvelous-gentleness-production.up.railway.app/api/Platform/project/add',
        form,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      Alert.alert('Success', 'Platform added!');
      setProjectPlatformIds(prev => [...prev, platformId]);
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Failed to add platform.');
    }
  };

  const handleDeletePlatform = async (platformId: number) => {
    try {
      const form = new FormData();
      form.append('PlatformId', platformId.toString());
      form.append('ProjectId', projectId.toString());

      await axios.delete(
        'https://marvelous-gentleness-production.up.railway.app/api/Platform/project/delete',
        {
          data: form,
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      Alert.alert('Success', 'Platform removed!');
      setProjectPlatformIds(prev => prev.filter(id => id !== platformId));
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Failed to remove platform.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fefefe' }}>
      <HeaderLayout title={'Manage Platforms'} onBackPress={() => navigation.goBack()} />
      {loading ? (
        <ActivityIndicator size="large" color="#3366FF" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          {allPlatforms.map((platform: any) => {
            const isAdded = projectPlatformIds.includes(platform['platform-id']);

            return (
              <View
                key={platform['platform-id']}
                style={[
                  styles.card,
                  isAdded && { backgroundColor: '#f0f9ff' },
                ]}
              >
                <Text style={styles.name}>{platform.name}</Text>
                <Text style={styles.description}>{platform.description}</Text>

                <TouchableOpacity
                  onPress={() =>
                    isAdded
                      ? handleDeletePlatform(platform['platform-id'])
                      : handleAddPlatform(platform['platform-id'])
                  }
                  style={[
                    styles.actionButton,
                    { backgroundColor: isAdded ? '#FF5C5C' : '#3366FF' },
                  ]}
                >
                  <Text style={styles.actionText}>{isAdded ? 'Remove' : 'Add'}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 6,
    borderLeftColor: '#3366FF',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    color: '#00246B',
  },
  description: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  actionButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AddPlatformToProject;
