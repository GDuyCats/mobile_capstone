import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../../../context/authContext';
import HeaderLayout from '../../../../components/HeaderLayout';

export default function UpdateReward({ navigation, route }: any) {
  const { rewardId, currentAmount, currentDetails } = route.params;
  const { user } = useContext(AuthContext);

  const [amount, setAmount] = useState(currentAmount?.toString() || '');
  const [details, setDetails] = useState(currentDetails || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!amount || !details) {
      Alert.alert('Error', 'Please fill in enough information !');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('amount', parseFloat(amount).toString());
      formData.append('details', details);

      await axios.put(
        'https://marvelous-gentleness-production.up.railway.app/api/Reward/UpdateReward',
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data',
          },
          params: {
            rewardId: rewardId,
          },
        }
      );

      Alert.alert('Success', 'Reward update successfully !');
      navigation.goBack();
    } catch (error: any) {
      console.log('Error updating reward:', error?.response?.data || error);
    
      const response = error?.response?.data;
    
      if (response?.errors) {
        const errorMessages = Object.values(response.errors)
          .flat()
          .join('\n');
        Alert.alert('Validation Error', errorMessages);
      } else if (response?.title) {
        Alert.alert('Error', response.title);
      } else {
        Alert.alert('Error', 'Unexpected error while updating reward.');
      }
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <HeaderLayout title="Update Reward" onBackPress={() => navigation.goBack()} />
      <View style={styles.container}>
        <Text style={styles.label}>Amount ($)</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Details</Text>
        <TextInput
          style={[styles.input, { height: 100, marginBottom: 10 }]}
          multiline
          value={details}
          onChangeText={setDetails}
        />
        <Button
          title={loading ? 'Updating' : 'Update Reward'}
          onPress={handleUpdate}
          disabled={loading}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
});
