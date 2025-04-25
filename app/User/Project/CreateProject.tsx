import React, { useState, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  StyleSheet,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
  ScrollView,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../../../context/authContext';
import { opacity } from 'react-native-reanimated/lib/typescript/Colors';
import NavbarLayout from '../../../components/NavbarLayout';
import HeaderLayout from '../../../components/HeaderLayout';

export default function CreateProject({ navigation }: any) {
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false)
  const [disable, setDisable] = useState(false)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [minimumAmount, setMinimumAmount] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState<'start' | 'end' | null>(null);
  const [image, setImage] = useState<any>(null);

  
  useFocusEffect(
      React.useCallback(() => {
        if (!user?.token) {
          Alert.alert(
            'You are not log in!',
            'Please sign in to continue!',
            [
              {
                text: 'OK',
                onPress: () =>
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  }),
              },
            ]
          );
          return;
        }
  
        if (user.role !== 'CUSTOMER') {
          Alert.alert(
            'Access denied!',
            'Your account does not have access to create project!',
            [
              {
                text: 'OK',
                onPress: () =>
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                  }),
              },
            ]
          );
        }
      }, [user])
    );

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleCreate = async () => {

    setIsLoading(true)
    setDisable(true)

    if (!title || !description || !minimumAmount) {
      Alert.alert('Warning', 'Please fill enough information !');
      setIsLoading(false);
      setDisable(false)
      return;
    }

    if (startDate >= endDate) {
      Alert.alert('Error', 'Created date must smaller than end date.');
      setIsLoading(false)
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('minimumAmount', parseFloat(minimumAmount).toString());
      formData.append('startDatetime', startDate.toISOString());
      formData.append('endDatetime', endDate.toISOString());

      const res = await axios.post(
        'https://marvelous-gentleness-production.up.railway.app/api/Project/CreateProject',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (res.data.success) {
        const projectId = res.data.data['project-id'];
        if (image) {
          const imgForm = new FormData();
          imgForm.append('file', {
            uri: image.uri,
            name: 'thumbnail.jpg',
            type: 'image/jpeg',
          } as any);

          await axios.put(
            `https://marvelous-gentleness-production.up.railway.app/api/Project/UpdateProjectThumbnail?projectId=${projectId}`,
            imgForm,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
        }

        Alert.alert('Success', 'Create project successfully !');
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', res.data.message || 'Can not create project');
      }
    } catch (err) {
      console.log(err);
      Alert.alert('Error', `You need to update your phone number and your payment account`);
    } finally {
      setIsLoading(false)
    }
  };

  const handleConfirm = (date: Date) => {
    if (showPicker === 'start') {
      setStartDate(date);
    } else if (showPicker === 'end') {
      setEndDate(date);
    }
    setShowPicker(null);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{flex: 1}}>
        <HeaderLayout title={'Create Project'} onBackPress={() => navigation.goBack()} />
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={{ padding: 10 }}>
            <Text style={styles.label}>Title:</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} />

            <Text style={styles.label}>Description:</Text>
            <TextInput style={styles.input} value={description} onChangeText={setDescription} />

            <Text style={styles.label}>Goal ($):</Text>
            <TextInput
              style={styles.input}
              value={minimumAmount}
              onChangeText={setMinimumAmount}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Time start:</Text>
            <TouchableOpacity onPress={() => setShowPicker('start')} style={styles.dateButton}>
              <Text>{startDate.toLocaleString()}</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Time end:</Text>
            <TouchableOpacity onPress={() => setShowPicker('end')} style={styles.dateButton}>
              <Text>{endDate.toLocaleString()}</Text>
            </TouchableOpacity>

            <View style={{ marginTop: 10 }}>
              <Text style={styles.label}>Thumbnail (Optional):</Text>

              {!image ? (
                <TouchableOpacity onPress={pickImage} style={styles.dateButton}>
                  <Text>Choose a picture from a library</Text>
                </TouchableOpacity>
              ) : (
                <View style={{ alignItems: 'center' }}>
                  <Image
                    source={{ uri: image.uri }}
                    style={{ width: '100%', height: 200, borderRadius: 10 }}
                  />
                  <View style={{ flexDirection: 'row', marginTop: 10, gap: 10 }}>
                    <TouchableOpacity
                      onPress={pickImage}
                      style={{
                        flex: 0.4,
                        backgroundColor: '#4089ff',
                        alignItems: 'center',
                        padding: 10,
                        borderRadius: 20,
                      }}
                    >
                      <Text style={{ color: '#fff', fontWeight: 'bold' }}>Change</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setImage(null)}
                      style={{
                        flex: 0.6,
                        alignItems: 'center',
                        backgroundColor: '#FF6B6B',
                        padding: 10,
                        borderRadius: 20,
                      }}
                    >
                      <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            <DateTimePickerModal
              isVisible={!!showPicker}
              mode="datetime"
              date={showPicker === 'start' ? startDate : endDate}
              onConfirm={handleConfirm}
              onCancel={() => setShowPicker(null)}
            />

            <TouchableOpacity
              style={[styles.createProjectButton, disable && { opacity: 0.5 }]}
              disabled={disable}
              onPress={handleCreate} >
              <Text
                style={{ color: 'white', fontWeight: 'bold' }}>Create Project</Text>
            </TouchableOpacity>

            {isLoading && (
              <View>
                <Text>Loading...</Text>
              </View>

            )}
          </ScrollView>
          <NavbarLayout currentScreen="CreateProject" />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  label: {
    fontWeight: 'bold',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
  dateButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
  },
  createProjectButton: {
    alignItems: 'center',
    padding: 10,
    marginTop: 10,
    borderRadius: 20,
    backgroundColor: '#1b7533'
  }
});
