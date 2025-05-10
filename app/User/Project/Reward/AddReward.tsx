import React, { useState, useContext } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import HeaderLayout from '../../../../components/HeaderLayout';
import { AuthContext } from '../../../../context/authContext';

function AddReward({ navigation, route }: any) {
  const [amount, setAmount] = useState('');
  const [details, setDetails] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { projectId } = route.params;
  const { user } = useContext(AuthContext);

  useFocusEffect(
    React.useCallback(() => {
      console.log('Project ID:', projectId);
    }, [])
  );

  const handleAddReward = async () => {
    if (!amount || !details) {
      Alert.alert('Error', 'Please enter both amount and details');
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        'https://marvelous-gentleness-production.up.railway.app/api/Reward/AddReward',
        {
          'project-id': projectId,
          amount: parseInt(amount),
          details,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      Alert.alert('Success', 'Reward added successfully!');
      navigation.goBack();
    } catch (error: any) {
      console.log('Add reward error:', error?.response?.data || error);

      const responseData = error?.response?.data;

      if (responseData?.errors) {
        const errorMessages = Object.values(responseData.errors)
          .flat()
          .join('\n');

        Alert.alert('Validation Error', errorMessages);
      } else if (responseData?.title) {
        Alert.alert('Error', responseData.title);
      } else {
        Alert.alert('Error', 'Failed to add reward');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <HeaderLayout title="Add Reward" onBackPress={() => navigation.goBack()} />
      <View style={styles.container}>
        {/* Amount input */}
        <View style={styles.amountRow}>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="Enter amount"
            placeholderTextColor="#aaa"
          />
          <Text style={styles.dollar}>$</Text>
        </View>

        {/* Details input */}
        <TextInput
          value={details}
          onChangeText={setDetails}
          multiline
          placeholder="Reward Details"
          placeholderTextColor="#aaa"
          style={styles.detailsInput}
        />

        {/* Submit button */}
        <TouchableOpacity
          onPress={handleAddReward}
          disabled={isLoading}
          style={[styles.button, isLoading && { opacity: 0.6 }]}
        >
          {isLoading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.buttonText}>Add Reward</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderColor: '#d0d4d9',
    paddingBottom: 8,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  amountInput: {
    fontSize: 20,
    fontWeight: '500',
    flex: 1,
    marginRight: 10,
  },
  dollar: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  detailsInput: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#d0d4d9',
    borderRadius: 8,
    padding: 12,
    height: 120,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#E8D480',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 50,
  },
  buttonText: {
    fontWeight: '900',
    fontSize: 18,
  },
});

export default AddReward;
