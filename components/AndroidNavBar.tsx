import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const AndroidNavBar = ({ className, ...props }: any) => (
  <View style={[styles.container, className]} {...props}>
    <Text>Android Nav Bar</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 50,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
