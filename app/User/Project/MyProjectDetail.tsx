import React, { useContext, useEffect, useState } from 'react';
import { View, Alert, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Image, ScrollView } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../../context/authContext';
import { useFocusEffect } from '@react-navigation/native';
import HeaderLayout from '../../../components/HeaderLayout';
function MyProjectDetail({ route, navigation }: any) {
  const { user } = useContext(AuthContext);
  const { projectId } = route.params;
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  useFocusEffect(
    React.useCallback(() => {
      const fetchProject = async () => {
        try {
          const res = await axios.get(
            `https://marvelous-gentleness-production.up.railway.app/api/Project/GetProjectById?id=${projectId}`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          setProject(res.data.data);
        } catch (err) {
          console.error('Lỗi khi lấy chi tiết project:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchProject();
    }, [projectId, user.token]));

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

  if (!project) {
    return (
      <View>
        <Text style={styles.error}>Không tìm thấy dự án.</Text>
      </View>
    );
  }

  const handleDeleteProject = () => {
    Alert.alert(
      'Xác nhận xoá',
      'Bạn có chắc chắn muốn xoá dự án này không?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: async () => {
            setIsDisabled(true)
            try {
              const res = await axios.delete(
                `https://marvelous-gentleness-production.up.railway.app/api/Project/DeleteProject?id=${project["project-id"]}`,
                {
                  headers: {
                    Authorization: `Bearer ${user.token}`,
                  },
                }
              );

              if (res.status === 200) {
                Alert.alert('Thành công', 'Dự án đã được xoá');
                navigation.goBack();
              } else {
                Alert.alert('Lỗi', 'Không thể xoá dự án');
              }
            } catch (err) {
              console.error(err);
              Alert.alert('Lỗi', 'Đã có lỗi xảy ra khi xoá dự án');
            }
          },
        },
      ]
    );
  };
  return (
    <ScrollView>
      <HeaderLayout title={'My Project Detail'} onBackPress={() => navigation.goBack()} />
      <View style={{ padding: 20, backgroundColor: 'white' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#00246B' }}>{project.title}</Text>
        {project.thumbnail ? (
          <Image
            source={{ uri: project.thumbnail }}
            style={{ width: '100%', height: 200, borderRadius: 10 }}
            resizeMode="cover"
          />
        ) : (
          <Text>Không có ảnh</Text>
        )}
        <View>
          <Text style={styles.label}>Created by</Text>
          <Text style={{ fontWeight: 900, fontSize: 18 }}>{project.creator}</Text>
        </View>
        <View style={{ backgroundColor: '#F2F2F2', padding: 10, borderRadius: 10, marginTop: 10 }}>
          <Text style={{ fontWeight: '900', fontSize: 18 }}>Description</Text>
          <Text>{project.description}</Text>
        </View>

        <View style={{ backgroundColor: '#F2F2F2', padding: 10, borderRadius: 10, marginTop: 10 }}>
          <Text style={{ fontWeight: '900', fontSize: 18 }}>Story</Text>
          <Text>{project.story}</Text>
        </View>
        <View style={{ marginVertical: 10, padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 10 }}>
          {/* Thanh tiến trình màu xanh */}
          <View style={{ height: 5, backgroundColor: '#ddd', borderRadius: 5, marginBottom: 8 }}>
            <View
              style={{
                width: `${Math.min(Math.round((project['total-amount'] / project['minimum-amount']) * 100), 100)}%`,
                backgroundColor: 'green',
                height: '100%',
                borderRadius: 5,
              }}
            />
          </View>

          {/* Thông tin chi tiết */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={{ color: '#028760', fontWeight: 'bold' }}>
                {Math.round((project['total-amount'] / project['minimum-amount']) * 100)}%
              </Text>
              <Text style={{ fontWeight: 900, color: '#028760' }}>funded</Text>
            </View>

            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={{ fontWeight: 'bold' }}>{project.backers}</Text>
              <Text style={{ fontWeight: 900 }}>Backers</Text>
            </View>

            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={{ fontWeight: 'bold' }}>{project['minimum-amount']} $</Text>
              <Text style={{ fontWeight: 900 }}>Goal</Text>
            </View>

            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={{ fontWeight: 'bold' }}>{project['total-amount']} $</Text>
              <Text style={{ fontWeight: 900 }}>Gain</Text>
            </View>

            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={{ fontWeight: 'bold' }}>
                {
                  Math.max(
                    0,
                    Math.ceil(
                      (new Date(project['end-datetime']).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                    )
                  )
                }{' '}
                days
              </Text>
              <Text style={{ fontWeight: 900 }}> to go</Text>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#1A73E8',
              paddingVertical: 10,
              flex: 0.48,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 50
            }}
            onPress={() => {
              setIsDisabled(true)
              navigation.navigate('MyUpdateProject', { projectId: project["project-id"] })
            }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Update Project</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#951128',
              flex: 0.48,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 50
            }}
            disabled={isDisabled}
            onPress={handleDeleteProject}>
            <Text style={styles.deleteText}>Delete Project</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', marginTop: 5 }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#1A73E8',
              paddingVertical: 10,
              flex: 0.48,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 50
            }}
            onPress={() => {
              setIsDisabled(true)
              navigation.navigate('MyUpdateProject', { projectId: project["project-id"] })
            }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Add reward</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#951128',
              flex: 0.48,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 50
            }}
            disabled={isDisabled}
            onPress={handleDeleteProject}>
            <Text style={styles.deleteText}>Add FAQ</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.backerButton}
          onPress={() => {
            navigation.navigate('MoneyHistory', { projectId: project["project-id"] })
          }}>
          <Text style={styles.deleteText}>Backer History</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

export default MyProjectDetail;

const styles = StyleSheet.create({
  label: {
    marginTop: 10,
    fontWeight: '400',
    fontSize: 15,
    color: '#333',
  },
  error: {
    fontSize: 16,
    color: 'red',
  },
  backerButton: {
    backgroundColor: 'green',
    padding: 10,
    marginTop: 20,
    borderRadius: 50,
    alignItems: 'center',
  },

  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },


});
