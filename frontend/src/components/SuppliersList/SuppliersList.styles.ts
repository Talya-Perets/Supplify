import {StyleSheet} from 'react-native';

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
      justifyContent: 'space-between',
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
    addButton: {
      padding: 8,
    },
    listContent: {
      padding: 16,
    },
    supplierCard: {
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    supplierHeader: {
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    supplierName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
    actionButtons: {
      flexDirection: 'row-reverse',
    },
    actionButton: {
      marginLeft: 16,
      padding: 4,
    },
    supplierDetails: {
      gap: 8,
      textAlign: 'right',
    },
    detailRow: {
      flexDirection: 'row-reverse',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    detailLabel: {
      fontSize: 14,
      color: '#666',
      marginLeft: 0,
      width: 50,
      textAlign: 'right',
    },
    detailText: {
      fontSize: 14,
      color: '#333',
      textAlign: 'right',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    input: {
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: '#E1E1E1',
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 12,
      fontSize: 14,
      color: '#333',
      textAlign: 'right', 
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2, 
    },
  });  

  export default styles;