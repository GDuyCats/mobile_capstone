import React, { useEffect, useState, useContext, useRef } from 'react';
import {
  View,
  useWindowDimensions,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView, Platform
} from 'react-native';
import axios from 'axios';
import RenderHtml from 'react-native-render-html';
import { AuthContext } from '../../../context/authContext';
import { MaterialIcons } from '@expo/vector-icons';
import HeaderLayout from '../../../components/HeaderLayout';
export default function PostDetailScreen({ route, navigation }: any) {
  const { postId } = route.params;
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState([]);
  const [loadingPost, setLoadingPost] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [replyingTo, setReplyingTo] = useState<any>(null);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [highlightedCommentId, setHighlightedCommentId] = useState<string | null>(null);
  const scrollRef = useRef<any>();
  const commentRefs = useRef<Record<string, any>>({});
  const { width } = useWindowDimensions();
  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [postId]);

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

  const fetchPost = async () => {
    try {
      const res = await axios.get(
        `https://marvelous-gentleness-production.up.railway.app/api/Post/GetPost?postId=${postId}`,
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );
      setPost(res.data.data);
    } catch (err) {
      console.error('Failed to fetch post:', err);
    } finally {
      setLoadingPost(false);
    }
  };

  const findRootComment = (commentId: number, commentsList: any[]): any => {
    for (const c of commentsList) {
      if (c['comment-id'] === commentId) return c;
      for (const child of c.comments || []) {
        if (child['comment-id'] === commentId) return c;
        for (const grand of child.comments || []) {
          if (grand['comment-id'] === commentId) return c;
        }
      }
    }
    return null;
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `https://marvelous-gentleness-production.up.railway.app/api/Comment/GetComment?postId=${postId}`,
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );
      setComments(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleReply = async () => {
    if (!replyContent.trim()) return;

    try {
      const formData = new FormData();
      formData.append('PostId', String(postId));
      formData.append('Content', replyContent);
      formData.append('ParentCommentId', String(replyingTo));

      await axios.post(
        'https://marvelous-gentleness-production.up.railway.app/api/Comment/post',
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
      console.error('Failed to send reply:', err);
    }
  };


  const handleSendComment = async () => {
    if (!replyContent.trim()) return;

    try {
      const formData = new FormData();
      formData.append('PostId', String(postId));
      formData.append('Content', replyContent);
      if (replyingTo) {
        formData.append('ParentCommentId', String(replyingTo['comment-id']));
      }

      await axios.post(
        'https://marvelous-gentleness-production.up.railway.app/api/Comment/post',
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
    } catch (err: any) {
      console.error('Comment failed:', err);
      if (err?.response?.status === 403) {
        alert('You have to be a backer to comment on this post!');
      } else if (err?.response?.status === 401) {
        alert('You have to sign in to comment on this post');
      } else {
        alert('Failed to send comment.');
      }
    }
  };

  if (loadingPost) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00246B" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <View style={{ flex: 1 }}>
        <HeaderLayout title={'Project Post'} onBackPress={() => navigation.goBack()} />
        <ScrollView
          ref={scrollRef}
          style={styles.container}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Post content */}
          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.meta}>
            Created at: {new Date(post['created-datetime']).toLocaleString()}
          </Text>
          <View style={styles.body}>
            <RenderHtml
              contentWidth={width}
              source={{ html: post.description }}
              tagsStyles={{
                img: {
                  width: width * 0.9,
                  height: undefined,
                  aspectRatio: 1.5,
          
                }
              }}
            />
          </View>

          {/* Comments */}
          <Text style={styles.commentHeader}>Comments</Text>
          {loadingComments ? (
            <ActivityIndicator size="small" color="#00246B" />
          ) : (
            comments.map((comment: any) => (
              <View
                ref={(el) => {
                  if (el) commentRefs.current[comment['comment-id']] = el;
                }}
                key={comment['comment-id']}
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
                      onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
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
                <Text style={[styles.commentContent, { marginLeft: 50, marginTop: 5 }]}>{comment.content}</Text>

                <TouchableOpacity
                  onPress={() => {
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

                {comment.comments?.length > 0 &&
                  comment.comments.map((child: any) => (
                    <View
                      ref={(el) => {
                        if (el) commentRefs.current[child['comment-id']] = el;
                      }}
                      key={child['comment-id']}
                      style={[
                        styles.commentCard,
                        styles.childComment,
                        highlightedCommentId === String(child['comment-id']) && styles.highlighted,
                      ]}
                    >

                      <View style={{ flexDirection: 'row' }}>
                        {comment.user?.avatar ? (
                          <Image
                            source={{ uri: comment.user.avatar.replace('http://', 'https://') }}
                            style={{ width: 40, height: 40, borderRadius: 30, marginTop: 10 }}
                            onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
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
                      <Text style={[styles.commentContent, { marginLeft: 5, marginTop: 5 }]}>{child.content}</Text>
                      {/* <Text style={styles.commentTime}>
                        {new Date(child['created-datetime']).toLocaleString()}
                      </Text> */}
                      <TouchableOpacity
                        onPress={() => {
                          const root = findRootComment(child['comment-id'], comments);
                          if (!root) return;

                          if (replyingTo?.['comment-id'] === root['comment-id']) {
                            setReplyingTo(null);
                          } else {
                            setReplyingTo(root);
                            scrollToAndHighlight(root['comment-id']);
                          }
                        }}
                      >
                        <Text style={[styles.replyButton, { marginLeft: 5 }]}>Reply</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
              </View>
            ))
          )}
        </ScrollView>

        {/* Fixed comment input */}
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
      </View>
    </KeyboardAvoidingView>
  );


}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', color: '#00246B', marginBottom: 10 },
  meta: { fontSize: 14, color: '#666', marginBottom: 16 },
  body: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  replyBox: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  desc: { fontSize: 16, color: '#333', lineHeight: 22 },
  commentHeader: {
    marginTop: 24,
    fontSize: 20,
    fontWeight: '600',
    color: '#00246B',
  },
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

  replyLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
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
  highlighted: {
    backgroundColor: '#FFF9C4',
  },
});
