import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../../../context/authContext';
import HeaderLayout from '../../../../components/HeaderLayout';
import { Feather } from '@expo/vector-icons'; // icon nút cộng
import { useFocusEffect } from '@react-navigation/native';

export default function ViewProjectReward({ navigation, route }) {
  const { projectId } = route.params;
  const { user } = useContext(AuthContext);

  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const fetchRewards = async () => {
        try {
          const response = await axios.get(
            `https://marvelous-gentleness-production.up.railway.app/api/Reward/GetRewardByProjectId?projectId=${projectId}`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          setRewards(response.data.data);
        } catch (error) {
          console.error('Failed to fetch rewards:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchRewards();
    }, [projectId, user.token])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4da6ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <HeaderLayout title="Project Rewards" onBackPress={() => navigation.goBack()} />

      <ScrollView style={styles.container}>
        {rewards.length > 0 ? (
          rewards.map((reward) => (
            <TouchableOpacity
              key={reward['reward-id']}
              onPress={() =>
                navigation.navigate('RewardDetail', {
                  rewardId: reward['reward-id'],
                })
              }
            >
              <View style={styles.rewardCard}>
                <Text style={styles.rewardAmount}>💰 Amount: ${reward.amount}</Text>
                <Text style={styles.rewardDetail}>🎁 {reward.details}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noRewardsText}>No rewards found.</Text>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.floatingAddButton}
        onPress={() => navigation.navigate('AddReward', { projectId })}
      >
        <Feather name="plus" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rewardCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  rewardAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  rewardDetail: {
    fontSize: 14,
    color: '#555',
    marginTop: 6,
  },
  noRewardsText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
    color: '#888',
  },
  floatingAddButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#43a9f5',
    borderRadius: 50,
    padding: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
});
