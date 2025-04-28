import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/authContext';
import { useRoute, useNavigation } from '@react-navigation/native'; 

export default function Reward() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>(); 
  const { projectId } = route.params;
  const { user } = useContext(AuthContext);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const res = await axios.get(
          `https://marvelous-gentleness-production.up.railway.app/api/Reward/GetRewardByProjectId`,
          {
            params: { projectId },
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        const sortedRewards = (res.data.data || []).sort((a, b) => a.amount - b.amount);
        setRewards(sortedRewards);
      } catch (err) {
        console.log('Error', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, [projectId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (rewards.length === 0) {
    return (
      <View style={{ marginTop: 50, alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>There is no Reward</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prize list</Text>
      <FlatList
        data={rewards}
        keyExtractor={(item) => item['reward-id'].toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('UserPayment', { projectId, amount: item.amount })}
          >
            <View style={styles.item}>
              <Text style={styles.amount}>{item.amount}$</Text>
              <Text style={styles.details}>{item.details}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#00246B',
  },
  item: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    backgroundColor: 'white',
  },
  amount: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
    color: '#1b7533',
  },
  details: {
    fontSize: 15,
    color: '#333',
    fontWeight: 500,
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    color: '#666',
  },
});
