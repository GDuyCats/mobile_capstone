import React, { useEffect, useState, useContext, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../context/authContext';
import { MaterialIcons } from '@expo/vector-icons';
import HeaderLayout from '../../components/HeaderLayout';

export default function GetCommentProjectScreen({ route, navigation }: any) {
  const { projectId } = route.params;
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<any>(null);
  const [replyContent, setReplyContent] = useState('');
  const [highlightedCommentId, setHighlightedCommentId] = useState<string | null>(null);
  const scrollRef = useRef<any>();
  const commentRefs = useRef<Record<string, any>>({});

  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `https://marvelous-gentleness-production.up.railway.app/api/Comment/GetCommentsByProjectId?projectId=${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setComments(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const scrollToAndHighlight = (commentId: number) => {
    setTimeout(() => {
      const target = commentRefs.current[commentId];
      target?.measureLayout?.(scrollRef.current, (x, y) => {
        scrollRef.current?.scrollTo({ y, animated: true });
      });
      setHighlightedCommentId(String(commentId));
      setTimeout(() => setHighlightedCommentId(null), 2000);
    }, 100);
  };

  const renderReplyButton = (comment: any) => (
    <TouchableOpacity
      onPress={() => {
        if (!user?.token) {
          alert('You have to login to comment !');
          return;
        }
        if (replyingTo?.['comment-id'] === comment['comment-id']) {
          setReplyingTo(null);
        } else {
          setReplyingTo(comment);
          scrollToAndHighlight(comment['comment-id']);
        }
      }}
    >
      <Text style={[styles.replyButton, { marginLeft: 50 }]}>Reply</Text>
    </TouchableOpacity>
  );
  const handleSendComment = async () => {
    if (!replyContent.trim()) return;

    if (!user?.token) {
      alert('You have to sign in to comment !');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('ProjectId', String(projectId));
      formData.append('Content', replyContent);
      if (replyingTo) {
        formData.append('ParentCommentId', String(replyingTo['comment-id']));
      }

      await axios.post(
        `https://marvelous-gentleness-production.up.railway.app/api/Comment/project`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setReplyContent('');
      setReplyingTo(null);
      Keyboard.dismiss();
      fetchComments();
    } catch (err) {
      console.error('Comment failed:', err);
      if (err?.response?.status === 403) {
        alert('You have to be a backer to comment on this project!');
      } 
      else if (err?.response?.status === 401 ) {
        alert('You have to sign in to comment on this project');
      }
      else {
        alert('Failed to send comment.');
      }
    }
  };


  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <HeaderLayout title={'Project comment'} onBackPress={() => navigation.goBack()}/>
      <ScrollView
        ref={scrollRef}
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.commentHeader}>Comments</Text>
        {loading ? (
          <ActivityIndicator size="small" color="#00246B" />
        ) : (
          comments.map((comment: any) => (
            <View
              key={comment['comment-id']}
              ref={(el) => {
                if (el) commentRefs.current[comment['comment-id']] = el;
              }}
              style={[
                styles.commentCard,
                highlightedCommentId === String(comment['comment-id']) && styles.highlighted,
              ]}
            >
              <View style={{ flexDirection: 'row' }}>
                {comment.user?.avatar ? (
                  <Image
                    source={{ uri: comment.user.avatar.replace('http://', 'https://') }}
                    style={{ width: 40, height: 40, borderRadius: 30, marginTop: 10 }}
                  />
                ) : (
                  <MaterialIcons name="account-circle" size={60} color="black" />
                )}
                <View style={{ marginTop: 10, marginLeft: 10 }}>
                  <Text style={styles.author}>{comment.user?.fullname || 'Unknown user'}</Text>
                  <Text style={styles.commentTime}>
                    {new Date(comment['created-datetime']).toLocaleString('vi-VN', {
                      timeZone: 'Asia/Ho_Chi_Minh',
                      hour12: false,
                    })}
                  </Text>
                </View>
              </View>
              <Text style={[styles.commentContent, { marginLeft: 50, marginTop: 5 }]}>
                {comment.content}
              </Text>

              {renderReplyButton(comment)}

              {comment.comments?.map((child: any) => (
                <View
                  key={child['comment-id']}
                  ref={(el) => {
                    if (el) commentRefs.current[child['comment-id']] = el;
                  }}
                  style={[
                    styles.commentCard,
                    styles.childComment,
                    highlightedCommentId === String(child['comment-id']) && styles.highlighted,
                  ]}
                >
                  <View style={{ flexDirection: 'row' }}>
                    {child.user?.avatar ? (
                      <Image
                        source={{ uri: child.user.avatar.replace('http://', 'https://') }}
                        style={{ width: 40, height: 40, borderRadius: 30, marginTop: 10 }}
                      />
                    ) : (
                      <MaterialIcons name="account-circle" size={60} color="black" />
                    )}
                    <View style={{ marginTop: 10, marginLeft: 10 }}>
                      <Text style={styles.author}>{child.user?.fullname || 'Unknown user'}</Text>
                      <Text style={styles.commentTime}>
                        {new Date(child['created-datetime']).toLocaleString('vi-VN', {
                          timeZone: 'Asia/Ho_Chi_Minh',
                          hour12: false,
                        })}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.commentContent, { marginLeft: 5, marginTop: 5 }]}>
                    {child.content}
                  </Text>
                  {renderReplyButton(comment)}
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>
      
      <View style={styles.replyBox}>
        {replyingTo && (
          <>
            <Text style={styles.replyLabel}>
              Replying to <Text style={{ fontWeight: 'bold' }}>{replyingTo?.user?.fullname}</Text>
            </Text>
            <Text
              numberOfLines={1}
              style={{ fontSize: 13, color: '#666', marginTop: 2, fontStyle: 'italic' }}
            >
              “{replyingTo?.content?.slice(0, 100)}”
            </Text>
          </>
        )}

        <TextInput
          value={replyContent}
          onChangeText={setReplyContent}
          placeholder="Write a comment..."
          style={styles.replyInput}
          multiline
        />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity style={[styles.sendButton, { flex: 1 }]} onPress={handleSendComment}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
          {replyingTo && (
            <TouchableOpacity
              style={[styles.sendButton, { flex: 1, backgroundColor: '#ccc' }]}
              onPress={() => {
                setReplyingTo(null);
                setReplyContent('');
              }}
            >
              <Text style={[styles.sendText, { color: '#000' }]}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );

}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 16 },
  commentHeader: { fontSize: 20, fontWeight: '600', color: '#00246B', marginBottom: 10 },
  commentCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  childComment: {
    marginTop: 10,
    marginLeft: 40,
    backgroundColor: '#f3f4f6',
  },
  author: { fontWeight: '600', color: '#00246B', marginBottom: 4 },
  commentContent: { fontSize: 15, color: '#333', marginBottom: 4 },
  commentTime: { fontSize: 12, color: '#888', textAlign: 'right' },
  replyButton: {
    marginTop: 4,
    color: '#007AFF',
    fontSize: 13,
  },
  replyBox: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  replyInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 8,
    minHeight: 60,
    textAlignVertical: 'top',
    backgroundColor: '#fafafa',
  },
  sendButton: {
    backgroundColor: '#00246B',
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  sendText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  replyLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  highlighted: {
    backgroundColor: '#FFF9C4',
  },
});
