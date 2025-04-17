import React from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';

export default function PaymentSuccess({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <AntDesign name="exclamationcircle" size={24} color="black" />
        <Text
          style={{
            fontWeight: 900,
            fontSize: 20,
            marginVertical: 10
          }}>Payment Failed</Text>
        <Text
          style={{
            fontWeight: 500
          }}>Hey there. We try to charge your card but something went wrong.
          Please update your payment method below to continue.
        </Text>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={{
              marginVertical: 10,
              padding: 15,
              borderRadius: 20,
              backgroundColor: 'black'
            }}
            onPress={() => { navigation.navigate('Updateprofile') }}>
            <View>
              <Text
                style={{
                  color: 'white',
                  fontWeight: 900
                }}>
                Update Payment Method
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 40,
    paddingVertical: 100,
    alignItems: 'center',
    backgroundColor: '#f05972',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'green',
  },

  card: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 20,
    borderRadius: 20,
  }
});
// #DF3935