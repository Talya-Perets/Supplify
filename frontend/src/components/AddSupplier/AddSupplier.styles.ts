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
      shadowOffset: {width: 0, height: 2},
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
  });

  export default styles;