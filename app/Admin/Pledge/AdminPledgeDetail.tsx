import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../../context/authContext';

function AdminPledgeDetail({ route, navigation }: any) {
  const { pledgeId } = route.params;
  const { user } = useContext(AuthContext);
  const [pledge, setPledge] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPledge = async () => {
      try {
        const res = await axios.get(
          `https://marvelous-gentleness-production.up.railway.app/api/Pledge/GetPledgeById?pledgeId=${pledgeId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setPledge(res.data?.data);
      } catch (error) {
        console.log('Error while getting pledge', error);
      } finally {
        setLoading(false);
      }
    };
    getPledge();
  }, [pledgeId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading....</Text>
      </View>
    );
  }

  if (!pledge) {
    return (
      <View style={styles.center}>
        <Text>There is no pledge</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Detail Pledge</Text>

      <Text style={styles.label}>Pledge ID: <Text style={styles.value}>{pledge['pledge-id']}</Text></Text>
      <Text style={styles.label}>User ID: <Text style={styles.value}>{pledge['user-id']}</Text></Text>
      <Text style={styles.label}>Project ID: <Text style={styles.value}>{pledge['project-id']}</Text></Text>
      <Text style={styles.label}>Amount: <Text style={styles.value}>{pledge.amount} $</Text></Text>

      <Text style={[styles.label, { marginTop: 12 }]}>Pledge Details:</Text>
      {pledge['pledge-detail']?.map((d: any, index: number) => (
        <View key={index} style={styles.detailBox}>
          <Text style={styles.detailText}>• Payment ID: {d['payment-id']}</Text>
          <Text style={styles.detailText}>  Status: {d.status}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

export default AdminPledgeDetail;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00246B',
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
    color: '#00246B',
    marginTop: 4,
  },
  value: {
    fontWeight: 'normal',
    color: '#000',
  },
  detailBox: {
    backgroundColor: '#f1f1f1',
    borderRadius: 6,
    padding: 8,
    marginTop: 6,
  },
  detailText: {
    color: '#333',
  },
});
