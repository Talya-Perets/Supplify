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
      maxWidth: 400,
      backgroundColor: 'white',
      padding: 32,
      borderRadius: 16,
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowOffset: {width: 0, height: 10},
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
      borderTopWidth: 4,
      borderTopColor: '#4A90E2',
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#4A90E2',
      textAlign: 'center',
      marginBottom: 24,
    },
    inputContainer: {
      position: 'relative',
      marginBottom: 16,
    },
    icon: {
      position: 'absolute',
      top: '50%',
      left: 10,
      transform: [{translateY: -12}],
    },
    input: {
      width: '100%',
      paddingHorizontal: 40,
      paddingVertical: 12,
      borderWidth: 1,
      borderRadius: 8,
      borderColor: '#D1D1D1',
      backgroundColor: '#F9F9F9',
      fontSize: 16,
      color: '#333',
    },
    button: {
      backgroundColor: '#4A90E2',
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      marginVertical: 16,
    },
    buttonDisabled: {
      backgroundColor: '#A0A0A0',
    },
    buttonIcon: {
      marginRight: 10,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    linkContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    link: {
      color: '#4A90E2',
      fontSize: 14,
      fontWeight: '600',
    },
  });
  
  export default styles;