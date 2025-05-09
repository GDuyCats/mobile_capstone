import React, { useState, useRef, useEffect } from 'react';
import {
  ScrollView, View, Text, Image, StyleSheet, Animated,
  ActivityIndicator, TouchableOpacity, TextInput, Keyboard,
  RefreshControl,
  FlatList
} from 'react-native';
import NavbarLayout from '../components/NavbarLayout';
// import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AppLayout from '../components/AppLayout';
import { useFocusEffect } from '@react-navigation/native';

export default function Home({ navigation, route }: any) {
  const [projects, setProjects] = useState([]);
  const [isUploading, setIsUploading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [status, setStatus] = useState('');
  const [isSearching, setIsSearching] = useState(false)
  const [platforms, setPlatforms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const inputOpacity = useRef(new Animated.Value(0)).current;
  const inputTranslateY = useRef(new Animated.Value(-20)).current;
  const fetchProjects = async (title = '', selectedStatus = '') => {
    setIsUploading(true);
    const params: any = {};
    if (title.trim() !== '') params.title = title;
    if (selectedStatus !== '') params.status = selectedStatus;

    try {
      const res = await axios.get(
        'https://marvelous-gentleness-production.up.railway.app/api/Project/GetAllProject',
        { params }
      );
      setProjects(res.data.data);
    } catch (error) {
      console.log('Error while getting project', error.response?.data || error.message);
    } finally {
      setIsUploading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchProjects();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProjects();
    setRefreshing(false);
  };

  useEffect(() => {
    if (route.params?.startSearch) {
      setIsSearching(true);
      navigation.setParams({ startSearch: false });
    }

    if (route.params?.toggleSearch) {
      setIsSearching(prev => !prev);
      navigation.setParams({ toggleSearch: false });
    }
  }, [route.params]);

  useEffect(() => {
    if (isSearching) {
      Animated.parallel([
        Animated.timing(inputOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(inputTranslateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(inputOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(inputTranslateY, {
          toValue: -20,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isSearching]);

  return (
    <AppLayout navigation={navigation}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {isSearching && (
          <Animated.View
            style={{
              opacity: inputOpacity,
              transform: [{ translateY: inputTranslateY }],
              width: '100%',
            }}
          >
            <TextInput
              style={[styles.searchInput, { width: '100%' }]}
              placeholder="Search by project title..."
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={() => {
                fetchProjects(searchText, status);
                Keyboard.dismiss();
              }}
              returnKeyType="search"
            />
          </Animated.View>
        )}


        {isUploading && (
          <View style={{ marginVertical: 10, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}

        {projects.map((project: any) => {
          const progress = (project["total-amount"] / project["minimum-amount"]) * 100;
          const endDate = new Date(project["end-datetime"]);
          const now = new Date();
          const timeDiff = endDate.getTime() - now.getTime();
          const daysLeft = Math.max(0, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));

          return (
            <TouchableOpacity
              key={project["project-id"]}
              style={styles.card}
              onPress={() => navigation.navigate('ProjectDetail', { projectId: project["project-id"] })}
            >
              <View style={{ marginBottom: 10 }}>
                <Text style={styles.projectTitle}>{project.title}</Text>
              </View>

              {project.thumbnail ? (
                <Image source={{ uri: project.thumbnail }} style={styles.image} />
              ) : (
                <Text style={{ color: '#00246B', fontWeight: 'bold' }}>No thumbnail</Text>
              )}

              <View style={{ marginVertical: 10 }}>
                <Text style={{ fontWeight: 900, fontSize: 18 }}>
                  <Text style={{ fontWeight: 400, fontSize: 15 }}>
                    Created by {'\n'}
                  </Text >
                  {project.creator}
                </Text>
              </View>

              <View>
                <Text style={{ fontWeight: 300 }}>
                  {project.description}
                </Text>
              </View>
              <View style={{ marginTop: 8 }}>
                <View style={{ height: 4, backgroundColor: '#ccc', borderRadius: 2, overflow: 'hidden' }}>
                  <View
                    style={{
                      height: '100%',
                      width: `${Math.min(progress, 100)}%`,
                      backgroundColor: '#028760',
                    }}
                  />
                </View>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <View style={{ marginTop: 4 }}>
                  <Text style={{ color: '#028760', fontWeight: '600' }}>
                    {Math.floor(progress)}% {'\n'}funded
                  </Text>
                </View>

                <View style={{ marginTop: 4, marginLeft: 10 }}>
                  <Text style={{ color: '#00246B', fontWeight: 'bold' }}>
                    <Text>{project.backers || 0}{'\n'}</Text>
                    {(project.backers || 0) <= 1 ? 'Backer' : 'Backers'}
                  </Text>
                </View>

                <View style={{ marginTop: 4, marginLeft: 10 }}>
                  <Text style={{ color: '#00246B', fontWeight: 'bold' }}>
                    <Text>{project['minimum-amount']} ${'\n'}</Text>Goal
                  </Text>
                </View>

                <View style={{ marginTop: 4, marginLeft: 10 }}>
                  <Text style={{ color: '#00246B', fontWeight: 'bold' }}>
                    <Text>{project['total-amount']} ${'\n'}</Text>Gain
                  </Text>
                </View>

                <View style={{ marginTop: 4, marginLeft: 10 }}>
                  <Text style={{ color: '#00246B', fontWeight: 'bold' }}>
                    <Text>{daysLeft} {'\n'}</Text>
                    {daysLeft === 1 ? 'day' : 'days'} to go
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
                {project.platforms.map((item: any) => (
                  <View
                    key={item['platform-id']}
                    style={{
                      backgroundColor: '#256eff',
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 20,
                      marginRight: 8,
                      marginBottom: 8,
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: 14, fontWeight: 900 }}>{item.name}</Text>
                  </View>
                ))}
              </View>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
                {project.categories?.length > 0 ? (
                  project.categories.map((item: any, index: number) => (
                    <View
                      key={index}
                      style={{
                        backgroundColor: '#00246B',
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 20,
                        marginRight: 8,
                        marginBottom: 8,
                      }}
                    >
                      <Text style={{ color: 'white', fontSize: 14, fontWeight: 900 }}>{item.name}</Text>
                    </View>
                  ))
                ) : (
                  null
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <NavbarLayout
        currentScreen="Home"
        searchToggle={isSearching}
        onSearchPress={() => setIsSearching(prev => !prev)} />
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  animatedInput: {
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  container: {
    padding: 16,
    alignItems: 'center',
  },
  searchInput: {
    width: '100%',
    height: 40,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  pickerContainer: {
    marginRight: 0,
    marginLeft: 'auto',
    width: '50%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
  },
  picker: {
    height: 'auto',
    width: '100%',
  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#c9d1d4',
    marginBottom: 16,
  },
  projectTitle: {
    color: '#00246B',
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 8,
    borderRadius: 8,
  },
});
{/* <View style={styles.pickerContainer}>
          <Picker
            selectedValue={status}
            onValueChange={(itemValue) => {
              setStatus(itemValue);
              fetchProjects(searchText, itemValue);
            }}
            style={styles.picker}
          >
            <Picker.Item label="-- Status --" value="" />
            <Picker.Item label="VISIBLE" value="VISIBLE" />
            <Picker.Item label="DELETED" value="DELETED" />
          </Picker>
        </View> */}
