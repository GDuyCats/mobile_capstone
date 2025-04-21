import React, { useContext, useEffect, useState } from 'react';
import { View, Alert, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Image, ScrollView } from 'react-native';
import axios from 'axios';
import AntDesign from '@expo/vector-icons/AntDesign';
import { AuthContext } from '../../../context/authContext';
import { useFocusEffect } from '@react-navigation/native';
import HeaderLayout from '../../../components/HeaderLayout';
import FooterLayout from '../../../components/NavbarLayout';
function MyProjectDetail({ route, navigation }: any) {
  const { user } = useContext(AuthContext);
  const { projectId } = route.params;
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDisabledUpDate, setIsDisabledUpdate] = useState(false);
  const [isDisabledDelete, setIsDisabledDelete] = useState(false);
  const [isDisabledBacker, setIsDisabledBacker] = useState(false);
  const [isDisabledReward, setIsDisabledReward] = useState(false);
  useFocusEffect(
    React.useCallback(() => {
      setIsDisabledUpdate(false);
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
    return (
      <View >
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!project) {
    return (
      <View>
        <Text style={styles.error}>Don't have any project</Text>
      </View>
    );
  }

  const handleDeleteProject = () => {
    setIsDisabledDelete(true)
    Alert.alert(
      'Are you sure ?',
      'Do you really want to delete this Project ?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: (() => setIsDisabledDelete(false))
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
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
                Alert.alert('Success', 'The project have been deleted !');
                navigation.goBack();
              } else {
                Alert.alert('Error', 'Can not delete the project !');
              }
            } catch (err) {
              console.error(err);
              Alert.alert('Error', 'There is something wrong white delete the project !');
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

        <View style={{flex: 1}}>
          <TouchableOpacity
            style={{
              paddingVertical: 10,
              flexDirection: 'row',
              alignItems:'center',
              justifyContent:'space-between',
              flex: 0.48,
              borderBottomWidth: 1,
              borderBottomColor: '#AAAAAB',
              marginBottom: 10
            }}
            disabled={isDisabledUpDate}
            onPress={() => {
              setIsDisabledUpdate(true)
              navigation.navigate('MyUpdateProject', { projectId: project["project-id"] })
            }}>
            <Text style={{ color: 'black', fontSize: 15 }}>Update Project</Text>
            <AntDesign name="right" style={{opacity: 0.5}} size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              paddingVertical: 10,
              flexDirection: 'row',
              alignItems:'center',
              justifyContent:'space-between',
              flex: 0.48,
              borderBottomWidth: 1,
              borderBottomColor: '#AAAAAB',
              marginBottom: 10
            }}
            disabled={isDisabledUpDate}
            onPress={() => {
              setIsDisabledReward(true)
              navigation.navigate('ViewProjectReward', { projectId: project["project-id"] })
            }}>
            <Text style={{ color: 'black', fontSize: 15 }}>View Reward</Text>
            <AntDesign name="right" style={{opacity: 0.5}}  size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              paddingVertical: 10,
              flexDirection: 'row',
              alignItems:'center',
              justifyContent:'space-between',
              flex: 0.48,
              borderBottomWidth: 1,
              borderBottomColor: '#AAAAAB',
              marginBottom: 10
            }}
            disabled={isDisabledUpDate}
            onPress={() => {
              setIsDisabledBacker(true)
              navigation.navigate('MoneyHistory', { projectId: project["project-id"] })
            }}>
            <Text style={{ color: 'black', fontSize: 15 }}>Backer History</Text>
            <AntDesign name="right" style={{opacity: 0.5}}  size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              paddingVertical: 10,
              flexDirection: 'row',
              alignItems:'center',
              justifyContent:'space-between',
              flex: 0.48,
              borderBottomWidth: 1,
              borderBottomColor: '#AAAAAB',
              marginBottom: 10
            }}
            disabled={isDisabledDelete}
            onPress={handleDeleteProject}>
            <Text style={{ color: 'black', fontSize: 15 }}>Delete Project</Text>
            <AntDesign style={{opacity: 0.5}} name="right" size={24} color="black" />
          </TouchableOpacity>
        </View>
        {/* <FooterLayout
          navigation={navigation}
          onUpdate={() => navigation.navigate('UpdateProject', { projectId })}
          onAddReward={() => navigation.navigate('AddReward', { projectId })}
          onAddFAQ={() => navigation.navigate('AddFAQ', { projectId })}
          onViewReward={() => navigation.navigate('ViewReward', { projectId })}
        /> */}
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
