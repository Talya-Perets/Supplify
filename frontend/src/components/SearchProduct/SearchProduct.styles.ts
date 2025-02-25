import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FC',
  },
  content: {
    flex: 1,
    flexDirection: 'row-reverse', // שינוי לימין לשמאל
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
    marginBottom: 12, // Adds space between title and first card
},
headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginRight: 16,
},
searchContainer: {
  flexDirection: 'row-reverse',
  alignItems: 'center',
  marginBottom: 20,
},
input: {
  flex: 0.85, // Reduce stretch
  height: 40,
  borderColor: '#ddd',
  borderWidth: 1,
  borderRadius: 8,
  paddingHorizontal: 10, // Balanced padding
  fontSize: 16,
  marginRight: 10,
},
searchButton: {
  marginRight: 12, // More space between input and button
  paddingVertical: 8,
  paddingHorizontal: 10, // More balanced padding
  backgroundColor: '#4A90E2',
  borderRadius: 8,
  justifyContent: 'center',
  alignItems: 'center',
},
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  productCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  productStock: {
    fontSize: 14,
    color: '#4A90E2',
    marginTop: 5,
  },
  noResultsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
  },
  successMessage: {
    backgroundColor: '#D4EDDA',
    padding: 10,
    borderRadius: 8,
    marginVertical: 8,
  },
  successMessageText: {
    color: '#155724',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default styles;
