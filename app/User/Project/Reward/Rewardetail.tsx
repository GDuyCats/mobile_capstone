import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../../../context/authContext';
import HeaderLayout from '../../../../components/HeaderLayout';

export default function RewardDetail({ navigation, route }: any) {
  const { rewardId } = route.params;
  const { user } = useContext(AuthContext);
  const [reward, setReward] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchReward = async () => {
      try {
        const res = await axios.get(
          `https://marvelous-gentleness-production.up.railway.app/api/Reward/GetRewardById`,
          {
            params: { rewardId },
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setReward(res.data.data);
      } catch (error) {
        console.log('Error while getting reward', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReward();
  }, [rewardId]);

  const handleDelete = async () => {
    Alert.alert('Confirm', 'Do you really want to delete this reward?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            setDeleting(true);
            await axios.delete(
              `https://marvelous-gentleness-production.up.railway.app/api/Reward/DeleteReward`,
              {
                params: { rewardId },
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              }
            );
            Alert.alert('Success', 'Reward has been deleted!');
            navigation.goBack();
          } catch (error) {
            console.log('Error while deleting reward:', error);
            Alert.alert('Error', 'Cannot delete the reward!');
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);
  };

  const handleNavigateUpdate = () => {
    navigation.navigate('RewardUpdate', {
      rewardId: reward['reward-id'],
      currentAmount: reward.amount,
      currentDetails: reward.details,
    });
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#4da6ff" />;
  }

  if (!reward) {
    return (
      <View style={styles.container}>
        <Text>This project has no reward</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <HeaderLayout title={'Reward Detail'} onBackPress={() => navigation.goBack()} />
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.label}>ID:</Text>
          <Text style={styles.value}>{reward['reward-id']}</Text>

          <Text style={styles.label}>Project ID:</Text>
          <Text style={styles.value}>{reward['project-id']}</Text>

          <Text style={styles.label}>Amount:</Text>
          <Text style={styles.value}>${reward.amount}</Text>

          <Text style={styles.label}>Details:</Text>
          <Text style={styles.value}>{reward.details}</Text>

          <Text style={styles.label}>Created Date:</Text>
          <Text style={styles.value}>{reward['created-datetime']}</Text>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, styles.updateButton]}
            onPress={handleNavigateUpdate}
            disabled={deleting}
          >
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.deleteButton, deleting && { opacity: 0.6 }]}
            onPress={handleDelete}
            disabled={deleting}
          >
            <Text style={styles.buttonText}>{deleting ? 'Deleting...' : 'Delete'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f8f8',
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  label: {
    fontWeight: '600',
    fontSize: 15,
    color: '#444',
    marginTop: 10,
  },
  value: {
    fontSize: 15,
    color: '#333',
    marginTop: 2,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  updateButton: {
    backgroundColor: '#4da6ff',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
