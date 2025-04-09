import React, { useContext, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../../context/authContext';

function MoneyHistory({ navigation, route }: any) {
  const { projectId } = route.params;
  const { user } = useContext(AuthContext);
  const [money, setMoney] = useState<any[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      const getMoney = async () => {
        try {
          const res = await axios.get(
            `https://marvelous-gentleness-production.up.railway.app/api/Pledge/GetBackerByUser/${projectId}`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          setMoney(res.data.data || []);
        } catch (error) {
          console.log('Lỗi khi lấy dữ liệu giao dịch:', error);
        }
      };

      getMoney();
    }, [projectId, user.token])
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>💰 Lịch sử giao dịch:</Text>

      {money.length > 0 ? (
        money.map((item: any, index: number) => (
          <View key={index} style={styles.card}>
            <Text style={styles.name}>🙋 Người ủng hộ: {item.backer_name}</Text>

            {item.backer_avatar ? (
              <Image source={{ uri: item.backer_avatar }} style={styles.avatar} />
            ) : (
              <Text style={styles.noAvatar}>Không có avatar</Text>
            )}

            <Text style={styles.text}>💵 Số tiền: {item.pledge.amount} VND</Text>

            {item.pledge['pledge-detail']?.map((detail: any, i: number) => (
              <View key={i} style={{ marginTop: 6 }}>
                <Text style={styles.text}>🧾 Mã thanh toán: {detail['payment-id']}</Text>
                <Text style={styles.text}>📌 Trạng thái: {detail.status}</Text>
              </View>
            ))}
          </View>
        ))
      ) : (
        <Text style={styles.noData}>Không có giao dịch nào.</Text>
      )}
    </ScrollView>
  );
}

export default MoneyHistory;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#00246B',
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
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  noAvatar: {
    color: 'gray',
    fontStyle: 'italic',
  },
  text: {
    color: '#333',
    marginTop: 4,
  },
  noData: {
    fontStyle: 'italic',
    color: 'gray',
    marginTop: 20,
  },
});
