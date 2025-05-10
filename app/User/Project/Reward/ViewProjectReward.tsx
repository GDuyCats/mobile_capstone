import React, { useEffect, useState, useContext, useCallback } from 'react';
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
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

export default function ViewProjectReward({ navigation, route }) {
  const { projectId } = route.params;
  const { user } = useContext(AuthContext);

  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRewards = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://marvelous-gentleness-production.up.railway.app/api/Reward/GetRewardByProjectId?projectId=${projectId}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setRewards(response.data.data);
    } catch (error) {
      console.error('Failed to fetch rewards:', error);
    } finally {
      setLoading(false);
    }
  }, [projectId, user.token]);

  // useEffect(() => { fetchRewards(); }, [fetchRewards]);
  useFocusEffect(React.useCallback(() => { fetchRewards(); }, [fetchRewards]));

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498DB" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <HeaderLayout title="Project Rewards" onBackPress={() => navigation.goBack()} />

      <ScrollView style={styles.container}>
        {rewards.length > 0 ? (
          rewards.map((reward) => (
            <TouchableOpacity
              key={reward['reward-id']}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate('RewardDetail', { rewardId: reward['reward-id'] })
              }
            >
              <View style={styles.rewardCard}>
                <Text style={styles.rewardAmount}>💰 ${reward.amount.toFixed(2)}</Text>
                <Text style={styles.rewardDetail}>{reward.details}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noRewardsText}>No rewards found.</Text>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.floatingAddButton}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('AddReward', { projectId })}
      >
        <Feather name="plus" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F2F5F8',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rewardCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginVertical: 8,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    // Android elevation
    elevation: 4,
  },
  rewardAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#27AE60',
    marginBottom: 6,
  },
  rewardDetail: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  noRewardsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 40,
  },
  floatingAddButton: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 60,
    height: 60,
    backgroundColor: '#3498DB',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    // Android elevation
    elevation: 6,
  },
});
