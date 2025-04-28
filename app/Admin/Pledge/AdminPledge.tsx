import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { AuthContext } from '../../../context/authContext';
import axios from 'axios';

function AdminPledge({ navigation }: any) {
  const [pledge, setPledge] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const getPledge = async () => {
      try {
        const res = await axios.get(
          'https://marvelous-gentleness-production.up.railway.app/api/Pledge/GetAllPledges',
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setPledge(res.data.data || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getPledge();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Pledge</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : pledge.length === 0 ? (
        <View style={{ marginTop: 50, alignItems: 'center' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>There is no Pledge</Text>
        </View>
      ) : (
        pledge.map((p: any, index: number) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => navigation.navigate('AdminPledgeDetail', { pledgeId: p['pledge-id'] })}>
            <Text style={styles.label}>Pledge ID: <Text style={styles.value}>{p['pledge-id']}</Text></Text>
            <Text style={styles.label}>User ID: <Text style={styles.value}>{p['user-id']}</Text></Text>
            <Text style={styles.label}>Project ID: <Text style={styles.value}>{p['project-id']}</Text></Text>
            <Text style={styles.label}>Amount: <Text style={styles.value}>{p.amount}$</Text></Text>

            <Text style={[styles.label, { marginTop: 8 }]}>Pledge Details:</Text>
            {p['pledge-detail']?.map((d: any, i: number) => (
              <View key={i} style={styles.detail}>
                <Text style={styles.detailText}>• Payment ID: {d['payment-id']}</Text>
                <Text style={styles.detailText}>  Status: {d.status}</Text>
              </View>
            ))}
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

export default AdminPledge;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00246B',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#e6f0ff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
    color: '#00246B',
  },
  value: {
    fontWeight: 'normal',
    color: '#000',
  },
  detail: {
    backgroundColor: '#ffffff',
    padding: 8,
    marginTop: 4,
    borderRadius: 6,
  },
  detailText: {
    color: '#333',
  },
});
