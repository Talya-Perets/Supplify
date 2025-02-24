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
    borderRadius: 12,  // More rounded corners for a modern look
    padding: 8,  // Some internal padding to separate the supplier title from the products
    marginTop: 16,
  
    // Shadow for floating effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,  // Android-specific shadow
  },
  supplierHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  supplierName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  approveButton: {
    backgroundColor: '#E6F2FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  approveButtonText: {
    color: '#4A90E2',
    fontSize: 14,
  },
  itemRow: {
    flexDirection: 'row-reverse',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemControls: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  quantityControls: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  quantityButton: {
    padding: 5,
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 10,
    fontWeight: 'bold',
  },
  itemDetails: {
    flex: 1,
  },
  itemInfo: {
    flex: 1,
    marginBottom: 10,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  itemName: {
    flexDirection: 'row-reverse',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  itemStats: {
    alignItems: 'flex-end',
  },
  itemStatLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  finalSubmitButton: {
    backgroundColor: '#4A90E2',
    padding: 16,
    alignItems: 'center',
  },
  finalSubmitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#f1f1f1',
    marginLeft: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover", 
},
});
export default styles;
