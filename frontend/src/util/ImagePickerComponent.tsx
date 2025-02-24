import React, {useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
  StyleSheet,
} from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  MediaType,
} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Feather';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';

interface ImagePickerComponentProps {
  onImageSelected: (imageUri: string, imageData: any) => void;
}

const ImagePickerComponent: React.FC<ImagePickerComponentProps> = ({
  onImageSelected,
}) => {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const requestCameraPermission = async () => {
    const permission =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.CAMERA
        : PERMISSIONS.IOS.CAMERA;
    const result = await request(permission);

    if (result === RESULTS.GRANTED) {
      return true;
    } else {
      Alert.alert(
        'Permission Denied',
        'Camera access is required to take photos.',
      );
      return false;
    }
  };

  const requestGalleryPermission = async () => {
    const permission =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
        : PERMISSIONS.IOS.PHOTO_LIBRARY;
    const result = await request(permission);

    if (result === RESULTS.GRANTED) {
      return true;
    } else {
      Alert.alert(
        'Permission Denied',
        'Gallery access is required to pick images.',
      );
      return false;
    }
  };

  const handleImagePick = async () => {
    const hasGalleryPermission = await requestGalleryPermission();
    if (!hasGalleryPermission) return;

    const options = {mediaType: 'photo' as MediaType, includeBase64: false};

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        Alert.alert('Cancelled', 'Image selection was cancelled.');
      } else if (response.errorMessage) {
        Alert.alert('Error', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        if (uri) {
          setImageUri(uri);
          onImageSelected(uri, response.assets[0]);
        } else {
          Alert.alert('Error', 'Image URI is undefined.');
        }
      } else {
        Alert.alert('Error', 'No image selected.');
      }
    });
  };

  const handleCameraCapture = async () => {
    const hasCameraPermission = await requestCameraPermission();
    if (!hasCameraPermission) return;

    const options = {mediaType: 'photo' as MediaType, includeBase64: false};

    launchCamera(options, response => {
      if (response.didCancel) {
        Alert.alert('Cancelled', 'Image capture was cancelled.');
      } else if (response.errorMessage) {
        Alert.alert('Error', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        if (uri) {
          setImageUri(uri);
          onImageSelected(uri, response.assets[0]);
        } else {
          Alert.alert('Error', 'Image URI is undefined.');
        }
      } else {
        Alert.alert('Error', 'No image captured.');
      }
    });
  };

  const handleRemoveImage = () => {
    setImageUri(null);
  };

  return (
    <View style={styles.container}>
      {/* Show buttons only if no image is selected */}
      {!imageUri ? (
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleImagePick} style={styles.button}>
            <Icon name="image" size={40} color="#4A90E2" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleCameraCapture} style={styles.button}>
            <Icon name="camera" size={40} color="red" />
          </TouchableOpacity>
        </View>
      ) : (
        // Image preview with trash icon when an image is selected
        <View style={styles.imageContainer}>
          <Image source={{uri: imageUri}} style={styles.imagePreview} />
          <TouchableOpacity
            onPress={handleRemoveImage}
            style={styles.trashButton}>
            <Icon name="trash" size={30} color="gray" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  buttonContainer: {
    flexDirection: 'row', // Aligns buttons side by side
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20, // Spacing between buttons
    marginVertical: 10,
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 15,
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4A90E2',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  trashButton: {
    marginTop: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});

export default ImagePickerComponent;
