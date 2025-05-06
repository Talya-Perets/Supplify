import { Platform, StyleSheet } from "react-native";

const styles = StyleSheet.create({
    sidebar: {
      width: 240,
      backgroundColor: 'white',
      borderRightWidth: 1,
      borderRightColor: '#E1E1E1',
      height: '100%',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    header: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#E1E1D1',
      alignItems: 'center',
    },
    logo: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#4A90E2',
    },
    menuItems: {
      display: 'flex',
      padding: 16,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    menuItem: {
      flexDirection: 'row-reverse',
      padding: 12,
      borderRadius: 8,
      marginBottom: 8,
      backgroundColor: 'transparent',
    },
    menuIcon: {
      marginLeft: 16,
    },
    menuText: {
      fontSize: 16,
      color: '#2E3A59',
      textAlign: 'right',
      flex: 1,
    },
  });

  export default styles