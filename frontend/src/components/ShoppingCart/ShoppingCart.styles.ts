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
  stockLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  footer: {
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'right',
  },
  itemId: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontFamily: 'System',  // Or your app's default font
    textAlign: 'right',    // Since your app seems to use RTL layout
    direction: 'rtl'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center', // Centers vertically
    alignItems: 'center', // Centers horizontally
    padding: 20,
  },
  
  emptyCartText: {
    fontSize: 24, // Bigger text
    fontWeight: 'bold', // Bold text
    color: '#333', // Darker color
    textAlign: 'center', // Ensure it's centered properly
  },
  supplierSection: {
    backgroundColor: 'white',
    marginBottom: 12,
    marginHorizontal: 10,  // Add some spacing from the screen edges
    borderRadius: 8,       // Rounded corners for a more modern look
    shadowColor: '#000',   // Add some shadow to make sections pop
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,         // For Android shadow
  },
  supplierHeader: {
    padding: 10,
    backgroundColor: '#F1F1F1',  // Light background color for supplier header
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  supplierName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cartItemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  orderSummary: {
    marginTop: 12,
  },
  orderSummaryText: {
    fontSize: 14,
    color: '#4A90E2',
    marginBottom: 4,
  },
  returnSummaryText: {
    fontSize: 14,
    color: '#F44336',  // Red for return quantities
  },
  finalSubmitButton: {
    backgroundColor: '#4A90E2',
    padding: 14,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  finalSubmitButtonDisabled: {
    backgroundColor: '#B3D4FC',
  },
  finalSubmitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;
