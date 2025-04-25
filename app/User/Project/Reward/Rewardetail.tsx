import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, Button, Alert } from 'react-native';
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
        console.log('Lỗi khi fetch reward:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReward();
  }, [rewardId]);

  const handleDelete = async () => {
    Alert.alert('Confirm', 'Do you really want to delete this reward', [
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
            Alert.alert('Success', 'Reward have been deleted !');
            navigation.goBack();
          } catch (error) {
            console.log('Error while delete Reward:', error);
            Alert.alert('Error', 'Can not delete the reward !');
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
    return <ActivityIndicator style={{ marginTop: 50 }} />;
  }

  if (!reward) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>This project have no reward</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <HeaderLayout title={'Reward Detail'} onBackPress={() => navigation.goBack()} />
      <View style={styles.container}>
        <Text style={styles.text}>ID: {reward['reward-id']}</Text>
        <Text style={styles.text}>Project ID: {reward['project-id']}</Text>
        <Text style={styles.text}>Amount: ${reward.amount}</Text>
        <Text style={styles.text}>Details: {reward.details}</Text>
        <Text style={styles.text}>Created Date: {reward['created-datetime']}</Text>

        <View style={styles.buttonGroup}>
          <View style={styles.button}>
            <Button title="Update" onPress={handleNavigateUpdate} color="#007AFF" />
          </View>
          <View style={styles.button}>
            <Button title={deleting ? 'Deleting...' : 'Delete'} onPress={handleDelete} color="#FF3B30" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonGroup: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});
