import React from 'react';
import {View} from 'react-native';
import CaptureImage from './src/CaptureImages';
import {ModalPortal} from 'react-native-modals';
export default function App() {
  return (
    <View style={{flex: 1}}>
      <ModalPortal />
      <CaptureImage />
    </View>
  );
}
