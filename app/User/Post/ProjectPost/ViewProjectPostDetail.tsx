import React, { useEffect, useState, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { RefreshControl } from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../../../context/authContext';
import HeaderLayout from '../../../../components/HeaderLayout';
import RenderHTML from 'react-native-render-html';

export default function ViewProjectPostDetail({ route, navigation }: any) {
  const { postId } = route.params;
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();
  const [refreshing, setRefreshing] = useState(false);

  const handleDelete = () => {
    Alert.alert('Confirm', 'Do you really want to delete this post?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(
              `https://marvelous-gentleness-production.up.railway.app/api/Post/DeletePost`,
              {
                params: { postId },
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              }
            );
            Alert.alert('Success', 'Post has been deleted!');
            navigation.goBack();
          } catch (err) {
            console.error('Error deleting post:', err);
            Alert.alert('Error', 'Failed to delete post');
          }
        },
      },
    ]);
  };
  const fetchPost = async () => {
    try {
      const res = await axios.get(
        `https://marvelous-gentleness-production.up.railway.app/api/Post/GetPost`,
        {
          params: { postId },
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log('Post detail reloaded:', res.data);
      setPost(res.data.data);
    } catch (err) {
      console.error('Failed to fetch post', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchPost();
    }, [postId])
  );

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#4da6ff" />;
  }

  if (!post) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Post not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => {
          setRefreshing(true);
          fetchPost();
        }} />
      }
    >
      <HeaderLayout title="Post Detail" onBackPress={() => navigation.goBack()} />

      <View style={styles.card}>
        <Text style={styles.title}>{post.title}</Text>

        <View style={styles.meta}>
          {post.user?.avatar && (
            <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
          )}
          <View>
            <Text style={styles.fullname}>{post.user?.fullname || 'Unknown'}</Text>
            <Text style={styles.date}>
              {new Date(post['created-datetime']).toLocaleString()}
            </Text>
          </View>
        </View>

        <RenderHTML
          contentWidth={width - 48}
          source={{ html: post.description }}
          baseStyle={styles.description}
          tagsStyles={{
            p: { marginVertical: 8, lineHeight: 22 },
            h1: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
            strong: { fontWeight: 'bold' },
          }}
        />
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.updateButton]}
          onPress={() =>
            navigation.navigate('UpdateProjectPost', {
              postId: post['post-id'],
              currentTitle: post.title,
              currentDescription: post.description,
              currentStatus: post.status,
            })
          }
        >
          <Text style={styles.actionText}> Update</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Text style={styles.actionText}> Delete</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f4f7',
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    marginBottom: 12,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 12,
  },
  fullname: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  date: {
    fontSize: 13,
    color: '#888',
  },
  description: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    padding: 20,
    marginTop: 24,
    justifyContent: 'space-between',
  },

  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },

  updateButton: {
    backgroundColor: '#3498DB',
  },

  deleteButton: {
    backgroundColor: '#E74C3C',
  },

  actionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },


});
