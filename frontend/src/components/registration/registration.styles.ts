import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#E6F1FB',
      padding: 16,
    },
    card: {
      width: '100%',
      backgroundColor: 'white',
      padding: 24,
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#4A90E2',
      textAlign: 'center',
      marginBottom: 24,
    },
    inputRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    halfInput: {
      width: '48%',
      height: 50,
      borderWidth: 1,
      borderColor: '#D1D1D1',
      borderRadius: 8,
      paddingHorizontal: 16,
      textAlign: 'right',
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
    button: {
      backgroundColor: '#4A90E2',
      height: 50,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonDisabled: {
      backgroundColor: '#A0A0A0',
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  export default styles;