import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row-reverse',
      backgroundColor: '#F6F7FC',
    },
    mainContent: {
      flex: 1,
    },
    header: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#E1E1E1',
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#4A90E2',
      marginRight: 16,
    },
    scrollViewContent: {
      flexGrow: 1,
      padding: 20,
    },
    inputContainer: {
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    input: {
      height: 50,
      borderWidth: 1,
      borderColor: '#D1D1D1',
      borderRadius: 8,
      paddingHorizontal: 16,
      marginBottom: 16,
      textAlign: 'right',
    },
    textArea: {
      height: 100,
      textAlignVertical: 'top',
    },
    button: {
      backgroundColor: '#4A90E2',
      height: 50,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 24,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    imagePickerButton: {
      backgroundColor: '#E1E1E1',
      padding: 10,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 16,
    },
    imagePickerText: {
      color: '#4A90E2',
      fontWeight: 'bold',
    },
    productImage: {
      width: '100%',
      height: 200,
      resizeMode: 'cover',
      borderRadius: 8,
      marginBottom: 16,
    },
    dropdownContainer: {
      backgroundColor: 'white',
      borderRadius: 8,
      paddingHorizontal: 16,
      height: 50,
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: '#D1D1D1',
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    placeholder: {
      fontSize: 16,
      color: '#999',
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    selectedText: {
      fontSize: 16,
      color: '#333',
      textAlign: 'right',
      writingDirection: 'rtl',
    },
  });

  export default styles;