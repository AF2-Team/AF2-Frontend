import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const AndroidStatusBar = ({ className, ...props }: any) => (
  <View style={[styles.container, className]} {...props}>
    <Text>Android Status Bar</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 24,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
