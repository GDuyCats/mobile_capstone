import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../../context/authContext';
import moment from 'moment';
import HeaderLayout from '../../../components/HeaderLayout';

export default function ProjectPost({ navigation, route }: any) {
  const { projectId } = route.params;
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const extractImageUrl = (html: string) => {
    const match = html.match(/<img[^>]+src="([^">]+)"/);
    return match ? match[1] : null;
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get(
        `https://marvelous-gentleness-production.up.railway.app/api/Post/project?projectId=${projectId}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setPosts(res.data.data);
    } catch (err) {
      console.error('Error fetching posts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const renderItem = ({ item }: any) => {

    const imageUrl = item['image-url'] || extractImageUrl(item.description);

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('ProjectPostDetail', { postId: item['post-id'] })}
      >
        <View style={styles.card}>
          {imageUrl && (
            <Image
              source={{ uri: imageUrl }}
              style={styles.postImage}
              resizeMode="cover"
            />
          )}
          <Text style={styles.title}>{item.title}</Text>
          <Text
            style={styles.description}
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            {item.description.replace(/<[^>]*>?/gm, '')}
          </Text>
          <View style={styles.meta}>
            <Text style={styles.author}>By: {item.user.fullname}</Text>
            <Text style={styles.date}>
              {moment(item['created-datetime']).format('DD/MM/YYYY')}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F6F8' }}>
      <HeaderLayout title="Project Post" onBackPress={() => navigation.goBack()} />
      <FlatList
        contentContainerStyle={styles.listContent}
        data={posts}
        keyExtractor={(item) => item['post-id'].toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: '#666', fontSize: 16 }}>There is no post</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
    lineHeight: 20,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  author: {
    fontSize: 12,
    color: '#777',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
});
