import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../../context/authContext';
import HeaderLayout from '../../../components/HeaderLayout';

function MoneyHistory({ navigation, route }: any) {
  const { projectId } = route.params;
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true)
  const [money, setMoney] = useState<any[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      const getMoney = async () => {
        try {
          const res = await axios.get(
            `https://marvelous-gentleness-production.up.railway.app/api/Pledge/GetBacker/${projectId}`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          setMoney(res.data.data || []);
        } catch (error) {
          console.log('Lỗi khi lấy dữ liệu giao dịch:', error);
        } finally {
          setIsLoading(false)
        }
      };

      getMoney();
    }, [projectId, user.token])
  );

  return (
    <ScrollView style={{ backgroundColor: 'white' }}>
      <HeaderLayout
        title={'My backer history'}
        onBackPress={() => {
          navigation.goBack();
        }}
      />
      <View style={styles.container}>
        {isLoading ? (
          <View style={{ alignItems: 'center', marginVertical: 20 }}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={{ marginTop: 10 }}>Loading...</Text>
          </View>
        ) : money.length > 0 ? (
          money.map((item: any, index: number) => (
            <View key={index} style={styles.card}>
              <Text style={styles.name}>{item['backer-name']}</Text>

              {item['backer-avatar'] ? (
                <Image source={{ uri: item['backer-avatar'] }} style={styles.avatar} />
              ) : (
                <Text style={styles.noAvatar}>No avatar</Text>
              )}

              <Text style={styles.amount}>
                Total Amount: {item['total-amount'].toLocaleString()} $
              </Text>

              {item['project-backer-details']?.map((detail: any, i: number) => (
                <View key={i} style={styles.detailBox}>
                  <Text style={styles.status}>
                    Status:{' '}
                    <Text
                      style={{
                        color: detail.status === 'PLEDGED' ? 'green' : 'red',
                        fontWeight: 'bold',
                      }}
                    >
                      {detail.status}
                    </Text>
                  </Text>
                  <Text style={styles.text}>
                    Time: {new Date(detail['created-datetime']).toLocaleString()}
                  </Text>
                  <Text style={styles.text}>
                    Amount: {detail.amount.toLocaleString()} $
                  </Text>
                </View>
              ))}
            </View>
          ))
        ) : (
          <Text style={styles.noData}>There is no backer history</Text>
        )}
      </View>
    </ScrollView>
  );
}

export default MoneyHistory;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  name: {
    fontWeight: 'bold',
    color: '#00246B',
    marginBottom: 6,
    fontSize: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
    alignSelf: 'center',
  },
  noAvatar: {
    color: 'gray',
    fontStyle: 'italic',
    alignSelf: 'center',
    marginBottom: 8,
  },
  amount: {
    color: '#333',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 6,
  },
  detailBox: {
    marginTop: 6,
    paddingLeft: 10,
  },
  status: {
    marginTop: 4,
    fontSize: 14,
  },
  text: {
    color: '#333',
    fontSize: 14,
    marginTop: 2,
  },
  noData: {
    fontStyle: 'italic',
    color: 'gray',
    marginTop: 20,
    textAlign: 'center',
  },
});