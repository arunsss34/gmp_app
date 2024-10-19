import React, { useEffect, useRef, useState } from 'react';
import { AppState, Button, Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useDispatch } from 'react-redux';
import { setQrData } from './QrSlice';
import { useNavigation } from '@react-navigation/native';
import { AppNavigationProp } from './AppNavigationProp'; 
import QrOverlay from './Overlay';

const YourMainComponent: React.FC = () => {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const appState = useRef(AppState.currentState);
  const dispatch = useDispatch();
  const navigation = useNavigation<AppNavigationProp>(); 

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        setIsScanning(false); 
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (data && !isScanning) {
      setIsScanning(true);
      dispatch(setQrData(data));

      // Close the camera screen after a brief delay
      setTimeout(() => {
        setIsScanning(false);
        navigation.navigate('WeftIssue'); // Navigate to the WeftIssue screen
      }, 500);
    }
  };

  return (
    <View style={styles.container}>
      {Platform.OS === 'android' ? <StatusBar hidden /> : null}
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={handleBarcodeScanned}
      />
      <QrOverlay/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
});

export default YourMainComponent;
