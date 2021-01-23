import React from 'react';
import {
  View,
  Dimensions,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
} from 'react-native';
import Modal from 'react-native-modal';
const scHeight = Dimensions.get('screen').height;
const scWidth = Dimensions.get('screen').width;
export default function ModalPreview(props) {
  const {isVisible, onBackdropPress, imagePreview} = props;
  return (
    <Modal
      style={styles.modal}
      isVisible={isVisible}
      customBackdrop={
        <TouchableWithoutFeedback onPress={onBackdropPress}>
          <View>
            <View />
            <View style={styles.backDropModal} />
          </View>
        </TouchableWithoutFeedback>
      }>
      <View style={styles.viewModal}>
        <Image
          resizeMode="cover"
          style={styles.imageBigPreview}
          source={{uri: imagePreview}}
        />
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  modal: {
    alignSelf: 'center',
  },
  backDropModal: {
    height: scHeight,
    width: scWidth,
    backgroundColor: 'rgba(112, 112, 112, 1)',
  },
  viewModal: {
    height: scHeight * 0.5,
    width: scWidth * 0.95,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  imageBigPreview: {
    height: '100%',
    width: '100%',
    borderRadius: 10,
  },
});
