import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView, Platform,
  Button,
  ActivityIndicator,
  Image,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { AuthContext } from '../../../context/authContext';
import HeaderLayout from '../../../components/HeaderLayout';

export default function UpdateProject({ route, navigation }: any) {
  const { projectId } = route.params;
  const { user } = useContext(AuthContext);
  const [isDisabled, setIsDisabled] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [minimumAmount, setMinimumAmount] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [story, setStory] = useState('');
  const [image, setImage] = useState<any>(null);
  const [storyHeight, setStoryHeight] = useState(80);
  const [showPicker, setShowPicker] = useState<'start' | 'end' | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPicking, setIsPicking] = useState(false);
  useEffect(() => {
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
        const data = res.data.data;
        setName(data.name || data.title || '');
        setDescription(data.description || '');
        setMinimumAmount(String(data['minimum-amount'] || ''));
        setStartDate(new Date(data['start-datetime']));
        setEndDate(new Date(data['end-datetime']));
        setStory(data.story || '');
      } catch (err) {
        console.log('Error', err);
        Alert.alert('Error', 'Can not get the project information');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, []);

  const handleUpdate = async () => {
    setIsDisabled(true)
    if (!name || !description || !minimumAmount) {
      return Alert.alert('Error', 'Please fill enough information');
    }

    const formData = new FormData();
    formData.append('Name', name);
    formData.append('Description', description);
    formData.append('MinimumAmount', parseFloat(minimumAmount).toString());
    formData.append('StartDatetime', startDate.toISOString());
    formData.append('EndDatetime', endDate.toISOString());

    try {
      const res = await axios.put(
        `https://marvelous-gentleness-production.up.railway.app/api/Project/UpdateProject?projectId=${projectId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (image) {
        const imageForm = new FormData();
        imageForm.append('file', {
          uri: image.uri,
          name: 'thumbnail.jpg',
          type: 'image/jpeg',
        } as any);

        await axios.put(
          `https://marvelous-gentleness-production.up.railway.app/api/Project/UpdateProjectThumbnail?projectId=${projectId}`,
          imageForm,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
      }
      if (story) {
        await axios.put(
          `https://marvelous-gentleness-production.up.railway.app/api/Project/UpdateProjectStory?projectId=${projectId}&story=${encodeURIComponent(story)}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
      }

      Alert.alert('Success', 'Project update successfully');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'There is something wrong while update the project');
    }
  };

  const handleConfirm = (date: Date) => {
    if (showPicker === 'start') {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
    setShowPicker(null);
  };

  const pickImage = async () => {
    if (isPicking) return;
    setIsPicking(true);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0]);
      }
    } catch (error) {
      console.warn('Error picking image:', error);
    } finally {
      setIsPicking(false);
    }
  };


  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <HeaderLayout title={'Update Project'} onBackPress={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 0 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text style={styles.label}>Project Title</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            multiline={true}
            textAlignVertical="top" />

          <Text style={styles.label}>Story (Game's story)</Text>
          <TextInput
            value={story}
            onChangeText={setStory}
            multiline
            onContentSizeChange={(e) =>
              setStoryHeight(e.nativeEvent.contentSize.height)
            }
            style={[styles.input, { height: Math.max(80, storyHeight) }]}
            placeholder="Enter game story..."
          />

          <Text style={styles.label}>Goal ($):</Text>
          <TextInput
            style={styles.input}
            value={minimumAmount}
            onChangeText={setMinimumAmount}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Time Start:</Text>
          <TouchableOpacity onPress={() => setShowPicker('start')} style={styles.dateBtn}>
            <Text>{startDate.toLocaleString()}</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Time end:</Text>
          <TouchableOpacity onPress={() => setShowPicker('end')} style={styles.dateBtn}>
            <Text>{endDate.toLocaleString()}</Text>
          </TouchableOpacity>

          <DateTimePickerModal
            isVisible={!!showPicker}
            mode="datetime"
            date={showPicker === 'start' ? startDate : endDate}
            onConfirm={handleConfirm}
            onCancel={() => setShowPicker(null)}
          />

          <View style={{ marginTop: 10 }}>
            <Text style={styles.label}>Thumbnail (Optional):</Text>
            {!image ? (
              <TouchableOpacity
                onPress={pickImage}
                disabled={isPicking}
                style={[
                  styles.dateBtn,
                  isPicking && { backgroundColor: '#ccc' },
                ]}
              >
                <Text style={{ color: isPicking ? '#999' : '#000' }}>
                  {isPicking ? 'Loading...' : 'Choose thumbnail from the library'}
                </Text>
              </TouchableOpacity>

            ) : (
              <View style={{ alignItems: 'center' }}>
                <Image
                  source={{ uri: image.uri }}
                  style={{ width: '100%', height: 180, borderRadius: 10, resizeMode: 'cover' }}
                />
                <View style={{ flexDirection: 'row', marginTop: 10, gap: 10 }}>

                  <TouchableOpacity
                    onPress={pickImage}
                    disabled={isPicking || isDisabled}
                    style={{
                      backgroundColor: (isPicking || isDisabled) ? '#a5d6a7' : '#4E9F3D',
                      paddingVertical: 12,
                      borderRadius: 12,
                      flex: 1,
                      alignItems: 'center',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 3,
                    }}
                  >
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                      {(isPicking || isDisabled) ? 'Please wait...' : 'Change Thumbnail'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setImage(null)}
                    disabled={isPicking || isDisabled}
                    style={{
                      backgroundColor: (isPicking || isDisabled) ? '#ffc1c1' : '#FF6B6B',
                      paddingVertical: 12,
                      borderRadius: 12,
                      flex: 1,
                      alignItems: 'center',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 3,
                    }}
                  >
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cancel Choose</Text>
                  </TouchableOpacity>
                  
                </View>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={{
              padding: 20,
              backgroundColor: '#036ba3',
              margin: 10,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 50,
              opacity: isDisabled ? 0.5 : 1
            }}
            onPress={handleUpdate}
            disabled={isDisabled}>
            <Text style={{ fontWeight: '900', color: 'white' }}>Update Project</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    fontSize: 15,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
  dateBtn: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 10,
    backgroundColor: '#f2f2f2',
  },
});
