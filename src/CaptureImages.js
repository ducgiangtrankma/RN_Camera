import React, {useRef, useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Dimensions,
  StatusBar,
  PermissionsAndroid,
  Alert,
  Platform,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import CameraRoll from '@react-native-community/cameraroll';
import ModalPreview from './ModalPreview';
export default function CaptureImage(props) {
  const camera = useRef(null);
  const scrollViewRef = useRef();
  const [images, setimages] = useState([]);
  const [imagePreview, setimagePreview] = useState(null);
  const [flash, setFlash] = useState(RNCamera.Constants.FlashMode.off);
  const [type, setType] = useState(RNCamera.Constants.Type.back);
  //Modal state
  const [isVisibleModal, setisVisibleModal] = useState(false);
  const getPermissionAndroid = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Image Download Permission',
          message: 'Your permission is required to save images to your device',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      }
      Alert.alert(
        'Save remote Image',
        'Grant Me Permission to save Image',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    } catch (err) {
      Alert.alert(
        'Save remote Image',
        'Failed to save Image: ' + err.message,
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    }
  };
  const changeType = () => {
    type === 0
      ? setType(RNCamera.Constants.Type.front)
      : setType(RNCamera.Constants.Type.back);
  };
  const capture = async () => {
    console.log(RNCamera.Constants.FlashMode);
    const options = {quality: 0.5, base64: false};
    const data = await camera.current.takePictureAsync(options);
    if (Platform.OS === 'android') {
      const granted = await getPermissionAndroid();
      if (granted) {
        CameraRoll.save(data.uri, {
          type: 'photo', // optional
          album: 'CameraApp', // optional
        })
          .then((res) => console.log(res))
          .catch((err) => console.log(err));
      }
    } else {
      CameraRoll.save(data.uri, {
        type: 'photo',
        album: 'CameraApp',
      })
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    }
    setimages([...images, data.uri]);
    console.log('Debug', data);
  };
  const onChangeFlashMode = (value) => {
    switch (value) {
      case 0:
        setFlash(1);
        break;
      case 1:
        setFlash(2);
        break;
      case 2:
        setFlash(0);
        break;
      default:
        break;
    }
  };
  const removeImage = (image) => {
    const temp = images.filter((e) => e !== image);
    setimages(temp);
  };
  const previewImgae = (image) => {
    setimagePreview(image);
    setisVisibleModal(true);
  };
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <RNCamera
        ref={camera}
        style={styles.preview}
        type={type} // back : sau - front : truoc
        flashMode={flash}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        androidRecordAudioPermissionOptions={{
          title: 'Permission to use audio recording',
          message: 'We need your permission to use your audio',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}>
        <View style={styles.menuCamera}>
          <TouchableOpacity
            onPress={() => onChangeFlashMode(flash)}
            style={styles.btnFlashControl}>
            {flash === 0 ? (
              <Image
                style={styles.flashIcon}
                source={require('../src/assets/flashOff1.png')}
              />
            ) : flash === 1 ? (
              <Image
                style={styles.flashIcon}
                source={require('../src/assets/flashOn.png')}
              />
            ) : (
              <Image
                style={styles.flashIcon}
                source={require('../src/assets/flashAuto.png')}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnFlip} onPress={changeType}>
            <Image
              style={styles.flashIcon}
              source={require('../src/assets/flipCamera.png')}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.btnCapture} onPress={() => capture()}>
          <Image
            style={styles.captureIcon}
            source={require('../src/assets/capture.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnCancel}>
          <Text style={styles.txtCancel}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnDone}>
          <Text style={styles.txtCancel}>Done</Text>
        </TouchableOpacity>
      </RNCamera>

      <View style={styles.previewPhoto}>
        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current.scrollToEnd({animated: true})
          }
          showsHorizontalScrollIndicator={false}
          horizontal>
          {images.map((e, index) => (
            <View key={index}>
              <TouchableOpacity onPress={() => previewImgae(e)}>
                <Image style={styles.imgPreview} source={{uri: e}} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnCleanImage}
                onPress={() => removeImage(e)}>
                <Image source={require('../src/assets/x.png')} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
      <ModalPreview
        isVisible={isVisibleModal}
        onBackdropPress={() => {
          setisVisibleModal(false);
        }}
        imagePreview={imagePreview}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 4,
  },
  btnCapture: {position: 'absolute', bottom: 0, alignSelf: 'center'},
  btnFlashControl: {
    marginTop: 5,
    marginLeft: 15,
  },
  previewPhoto: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  btnCancel: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    alignSelf: 'flex-start',
  },
  txtCancel: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  btnDone: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    alignSelf: 'flex-end',
  },
  btnFlip: {
    marginTop: 5,
    marginLeft: Dimensions.get('screen').width - 80,
  },
  flashIcon: {height: 25, width: 25, marginBottom: 5},
  captureIcon: {height: 40, width: 40, marginBottom: 5},
  imgPreview: {height: 100, width: 100, marginRight: 5, borderRadius: 5},
  menuCamera: {
    flexDirection: 'row',
    marginTop: 15,
  },
  btnCleanImage: {
    position: 'absolute',
    top: 5,
    left: 5,
  },
});
