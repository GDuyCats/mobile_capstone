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

function AddCategoryToProject({ navigation, route }: any) {
  const { projectId, projectCategories } = route.params;
  const { user } = useContext(AuthContext);

  const [categories, setCategories] = useState([]);
  const [projectCategoryIds, setProjectCategoryIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          'https://marvelous-gentleness-production.up.railway.app/api/Category/GetAllCategory',
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setCategories(res.data.data);

        const ids = projectCategories?.map((cat: any) => cat['category-id']) || [];
        setProjectCategoryIds(ids);
      } catch (error) {
        console.log('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleAddCategory = async (categoryId: number) => {
    try {
      const form = new FormData();
      form.append('CategoryId', categoryId.toString());
      form.append('ProjectId', projectId.toString());

      await axios.post(
        'https://marvelous-gentleness-production.up.railway.app/api/Project/AddCategoryToProject',
        form,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      Alert.alert('Success', 'Category added to project!');
      setProjectCategoryIds(prev => [...prev, categoryId]);
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Failed to add category.');
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    try {
      await axios.delete(
        `https://marvelous-gentleness-production.up.railway.app/api/Category/DeleteCategoryFromProject?projectId=${projectId}&categoryId=${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      Alert.alert('Success', 'Category removed from project!');
      setProjectCategoryIds(prev => prev.filter(id => id !== categoryId));
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Failed to remove category.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fefefe' }}>
      <HeaderLayout
        title={'Manage Categories'}
        onBackPress={() => navigation.goBack()}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#3366FF" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          {categories.map((cat: any) => {
            const isAdded = projectCategoryIds.includes(cat['category-id']);

            return (
              <View
                key={cat['category-id']}
                style={[
                  styles.card,
                  isAdded && { backgroundColor: '#f0f9ff' },
                ]}
              >
                <Text style={styles.name}>{cat.name}</Text>
                <Text style={styles.description}>{cat.description}</Text>

                <TouchableOpacity
                  onPress={() =>
                    isAdded
                      ? handleDeleteCategory(cat['category-id'])
                      : handleAddCategory(cat['category-id'])
                  }
                  style={[
                    styles.actionButton,
                    { backgroundColor: isAdded ? '#FF5C5C' : '#3366FF' },
                  ]}
                >
                  <Text style={styles.actionText}>
                    {isAdded ? 'Remove' : 'Add'}
                  </Text>
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

export default AddCategoryToProject;
