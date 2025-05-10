// ViewMyProjectPost.tsx
import React, { useContext, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../../context/authContext';
import RenderHTML from 'react-native-render-html';
import HeaderLayout from '../../../components/HeaderLayout';

export default function ViewMyProjectPost({ route, navigation }: any) {
  const { user } = useContext(AuthContext);
  const { projectId } = route.params;
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://marvelous-gentleness-production.up.railway.app/api/Post/project?projectId=${projectId}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setPosts(res.data.data || []);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  const getPlainTextFromHTML = (html: string) => {
    return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  };
  
  const renderItem = ({ item }: any) => {
    const plainText = getPlainTextFromHTML(item.description);
    const previewText = plainText.length > 120 ? plainText.slice(0, 120) + '...' : plainText;
  
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate('ViewProjectPostDetail', { postId: item['post-id'] })
        }
      >
        <View style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
  
          <View style={styles.meta}>
            {item.user?.avatar && (
              <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.fullname}>{item.user?.fullname || 'Unknown'}</Text>
              <Text style={styles.date}>
                {new Date(item['created-datetime']).toLocaleString()}
              </Text>
            </View>
          </View>
  
          <Text style={styles.preview}>{previewText}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  
  

  return (
    <View style={styles.container}>
      <HeaderLayout title="Project Posts" onBackPress={() => navigation.goBack()} />

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#4da6ff" />
        </View>
      ) : posts.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.empty}>No posts found.</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(_, i) => i.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f4f7' },
  list: { padding: 16, paddingBottom: 32 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  empty: { fontStyle: 'italic', color: '#888' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  preview: {
    fontSize: 15,
    color: '#4a4a4a',
    lineHeight: 20,
    marginTop: 4,
  },
  
  title: { fontSize: 18, fontWeight: '700', color: '#1a1a1a', marginBottom: 8 },

  meta: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 8 },
  fullname: { fontSize: 16, fontWeight: '600', color: '#333' },
  date: { fontSize: 12, color: '#666', marginTop: 2 },

  description: { fontSize: 15, color: '#4a4a4a' },
});
