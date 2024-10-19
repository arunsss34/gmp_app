import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const QrOverlay: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.overlay}>
        <View style={styles.rectangle} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',

  },
  overlay: {
    width: '70%',
    height: '35%',
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rectangle: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
  },
  instructionText: {
    position: 'absolute',
    bottom: 10,
    color: 'white',
    textAlign: 'center',
  },
});

export default QrOverlay;
