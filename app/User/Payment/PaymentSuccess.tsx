import React, { useEffect } from 'react';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';

export default function PaymentSuccess({ navigation }: any) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.navigate('Home')
    }, 3000)
  })
  
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <FontAwesome6 name="circle-check" size={24} color="black" />
        <Text
          style={{
            fontWeight: 900,
            fontSize: 20,
            marginVertical: 10
          }}>Thank you</Text>
        <Text
          style={{
            fontWeight: 500,
            fontSize: 17,
            marginBottom: 10
          }}>
          Payment done Successfully
        </Text>
        <Text
          style={{
            fontWeight: 500
          }}>
          You will be redirected to the home page shortly or click here to return to home page
        </Text>
        <TouchableOpacity
          style={{
            marginVertical: 10,
            width: 150,
            padding: 15,
            borderRadius: 40,
            alignContent:'center',
            backgroundColor: 'black'
          }}
          onPress={() => { navigation.navigate('Home') }}>
          <View>
            <Text
              style={{
                marginHorizontal: 'auto',
                color: 'white',
                fontWeight: 900
              }}>
              Home
            </Text>
          </View>
        </TouchableOpacity>
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
    backgroundColor: '#E8F5E9',
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