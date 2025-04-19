import React, { useEffect, useState, useContext, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Keyboard,
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../context/authContext';
import { formatDistanceToNow } from 'date-fns';
import HeaderLayout from '../../components/HeaderLayout';
import { Feather } from '@expo/vector-icons';

export default function GetComments({ navigation, route }: any) {
  const { projectId } = route.params;
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedComments, setExpandedComments] = useState<number[]>([]);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [newComment, setNewComment] = useState('');

  const flatListRef = useRef<any>(null);

  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `https://marvelous-gentleness-production.up.railway.app/api/Comment/GetCommentsByProjectId`,
        {
          params: { projectId },
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setComments(res.data.data || []);
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [projectId]);

  const toggleReplies = (commentId: number) => {
    setExpandedComments((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId]
    );
  };

  const handleReplySubmit = async () => {
    if (!user || !user.token) {
      Alert.alert('Thông báo', 'Bạn phải đăng nhập để bình luận.');
      navigation.navigate('Login');
      return;
    }

    if (!replyContent.trim()) return;

    const formData = new FormData();
    formData.append('projectId', projectId.toString());
    formData.append('parentCommentId', replyingTo?.toString() || '');
    formData.append('content', replyContent);

    try {
      await axios.post(
        'https://marvelous-gentleness-production.up.railway.app/api/Comment/project',
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setReplyContent('');
      setReplyingTo(null);
      Keyboard.dismiss();
      await fetchComments();
    } catch (err) {
      console.error('Error submitting reply:', err);
    }
  };

  const handleRootCommentSubmit = async () => {
    if (!user || !user.token) {
      Alert.alert('Thông báo', 'Bạn phải đăng nhập để bình luận.');
      navigation.navigate('Login');
      return;
    }

    if (!newComment.trim()) return;

    const formData = new FormData();
    formData.append('projectId', projectId.toString());
    formData.append('content', newComment);

    try {
      await axios.post(
        'https://marvelous-gentleness-production.up.railway.app/api/Comment/project',
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setNewComment('');
      Keyboard.dismiss();
      await fetchComments();

      setTimeout(() => {
        if (flatListRef.current) {
          flatListRef.current.scrollToEnd({ animated: true });
        }
      }, 300);
    } catch (err) {
      console.error('Error submitting comment:', err);
    }
  };

  

  const renderComment = (item: any, level = 0) => {
    const isExpanded = expandedComments.includes(item['comment-id']);

    return (
      <View key={item['comment-id']} style={{ marginLeft: level * 20, borderBottomWidth: level === 0 ? 1 : 0, borderColor: '#AAAAAB' }}>
        <View style={styles.commentBox}>
          <TouchableOpacity
            style={styles.userRow}
            onPress={() => navigation.navigate('OtherUserProfile', { userId: item['user-id'] })}
          >
            <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
            <View>
              <Text style={styles.username}>{item.user.fullname}</Text>
              <Text style={styles.time}>
                {formatDistanceToNow(new Date(item['created-datetime']), { addSuffix: true })}
              </Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.content}>{item.content}</Text>

          <TouchableOpacity
            onPress={() => {
              if (!user || !user.token) {
                Alert.alert('Thông báo', 'Bạn phải đăng nhập để bình luận.');
                navigation.navigate('Login');
                return;
              }
              setReplyingTo(item['comment-id']);
              const flatIndex = comments.findIndex((c) => c['comment-id'] === item['comment-id']);
              if (flatListRef.current && flatIndex !== -1) {
                flatListRef.current.scrollToIndex({ index: flatIndex, animated: true });
              }
            }}
          >
            <Text style={styles.replyText}>Reply</Text>
          </TouchableOpacity>

          {replyingTo === item['comment-id'] && (
            <View style={styles.replyInputBox}>
              <TextInput
                placeholder="Write your reply..."
                value={replyContent}
                onChangeText={setReplyContent}
                style={styles.replyInput}
              />
              <TouchableOpacity
                onPress={handleReplySubmit}
                style={[styles.replyButton, !replyContent.trim() && { backgroundColor: '#ccc' }]}
                disabled={!replyContent.trim()}
              >
                <Feather name="send" size={20} color="white" />
              </TouchableOpacity>
            </View>
          )}

          {item.comments && item.comments.length > 0 && (
            <>
              {!isExpanded && (
                <TouchableOpacity onPress={() => toggleReplies(item['comment-id'])}>
                  <Text style={styles.replyText}>
                    View {item.comments.length} repl{item.comments.length > 1 ? 'ies' : 'y'}
                  </Text>
                </TouchableOpacity>
              )}
              {isExpanded && (
                <>
                  <TouchableOpacity onPress={() => toggleReplies(item['comment-id'])}>
                    <Text style={styles.replyText}>Hide replies</Text>
                  </TouchableOpacity>
                  {item.comments.map((child: any) => renderComment(child, level + 1))}
                </>
              )}
            </>
          )}
        </View>
      </View>
    );
  };

  const renderItem = ({ item }: any) => renderComment(item);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading comments...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <HeaderLayout title={'Comment'} onBackPress={() => navigation.goBack()} />
      <FlatList
        ref={flatListRef}
        data={comments}
        keyExtractor={(item) => item['comment-id'].toString()}
        renderItem={renderItem}
        extraData={{ replyingTo, replyContent, expandedComments }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 100 }}
        getItemLayout={(data, index) => ({
          length: 150,
          offset: 150 * index,
          index,
        })}
      />
      <View style={styles.rootInputWrapper}>
        <TextInput
          placeholder="Write a comment..."
          value={newComment}
          onChangeText={setNewComment}
          style={styles.replyInput}
        />
        <TouchableOpacity
          onPress={handleRootCommentSubmit}
          style={[styles.replyButton, !newComment.trim() && { backgroundColor: '#ccc' }]}
          disabled={!newComment.trim()}
        >
          <Feather name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentBox: {
    padding: 10,
    backgroundColor: '#f1f1f1',
  },
  userRow: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  content: {
    borderRadius: 10,
    fontSize: 14,
    color: 'black',
    padding: 5,
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: '#888',
  },
  replyText: {
    color: '#007BFF',
    marginTop: 4,
    fontSize: 14,
  },
  replyInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  replyInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginRight: 8,
  },
  replyButton: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  rootInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
});
