import React, {Component, useEffect, useRef, useState} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  View,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';

export default function QRCode(props) {
  const scanner = useRef(null);
  const [scan, setScan] = useState(false);
  const [result, setResult] = useState(null);
  useEffect(() => {
    setResult(null);
  }, [result]);
  const onSuccess = (e) => {
    console.log('Data', e);
    setResult(e);
    setScan(false);
    if (e.data.substring(0, 4) === 'http') {
      alert(e.data);
    }
  };
  return !scan ? (
    <View style={styles.container}>
      {result && <Text>{JSON.stringify(result, null, 2)}</Text>}
      <TouchableOpacity
        style={styles.btn}
        onPress={() => {
          setScan(true);
        }}>
        <Text>Start Scan</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <QRCodeScanner
      onRead={onSuccess}
      ref={scanner}
      reactivate={true}
      showMarker={true}
      bottomContent={
        <>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              scanner.current.reactivate;
            }}>
            <Text>Ok.Go it</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              setScan(false);
            }}>
            <Text>Stop scan</Text>
          </TouchableOpacity>
        </>
      }
    />
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {},
});
