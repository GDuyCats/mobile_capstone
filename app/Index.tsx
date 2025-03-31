import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Touchable, TouchableOpacity, Button } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { AuthContext } from '../context/authContext';

export default function Home({ navigation }: any) {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [showMoreProfileOption, setShowMoreProfileOption] = useState(false)
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('https://marvelous-gentleness-production.up.railway.app/api/Project/GetAllProject');
        setProjects(res.data.data);

      } catch (error) {
        console.log('Lỗi fetch project:', error);
      }
    };

    fetchProjects();
  }, []);

  const handleNavigateLogin = () => {
    navigation.navigate('Login')
  }

  return (
    <View style={{ flex: 1 }}>
      <View
        style={styles.headerBox}>
        <Text style={styles.title}>GameMKt</Text>
        <TouchableOpacity onPress={() => setShowMoreProfileOption(prev => !prev)}>
          {!user?.avatar ? (
            <MaterialIcons style={{ marginTop:15, marginLeft: 100 }} name="account-circle" size={40} color="black" />
          ) : (
            <Image 
            source={{uri : user?.avatar}}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              marginTop: 15,
              marginLeft: 100
            }}
            />
            
          )
          }
        </TouchableOpacity>
      </View>

      {showMoreProfileOption && (
        user ? (
            <Button title='Profile' onPress={() => { navigation.navigate('Profile'); }} />    
        ) : (
          <Button title="Log in" onPress={handleNavigateLogin} />
        )
      )}

      <ScrollView contentContainerStyle={styles.container}>
        {projects.map((project: any) => (
          <View key={project["project-id"]} style={styles.card}>
            <Text style={styles.projectTitle}>{project.title}</Text>
            <Text>Creator: {project.creator}</Text>
            <Text>Description: {project.description}</Text>
            <Text>Status: {project.status}</Text>
            <Text>Goal: {project["minimum-amount"]} VND</Text>

            {project.thumbnail ? (
              <Image source={{ uri: project.thumbnail }} style={styles.image} />
            ) : (
              <Text>No thumbnail</Text>
            )}
          </View>
        ))}
      </ScrollView>
    </View>

  );
}

const styles = StyleSheet.create({
  headerBox: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: 'transparent',
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    height: 80,
    paddingTop: 10,
    paddingLeft: 20
  },

  title: {
    marginTop: 5,
    fontSize: 40,
    fontWeight: 'bold',
    color: 'green'
  },

  container: {
    padding: 16,
    alignItems: 'center',
  },

  card: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  projectTitle: {
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
