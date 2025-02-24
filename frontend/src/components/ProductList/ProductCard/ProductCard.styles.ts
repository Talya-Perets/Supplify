import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row-reverse',
    backgroundColor: '#F5F5F5',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
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
  scrollViewContent: {
    paddingBottom: 20,
  },
  productList: {
    flexGrow: 1,
    flexDirection: 'column',
    gap: 15, // Increased spacing between cards
  },
  productCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  firstCard: {
    marginTop: 20, // Adds extra spacing for the first card
  },
  cardContent: {
    flexDirection: 'row-reverse',
    
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    marginLeft: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  detailsSection: {
    flex: 8,
    alignItems: 'flex-end'
  },
  priceText: {
    fontWeight: 'bold',
    fontSize: 14, // Adjust size if needed
    marginBottom: 4, // Space above quantity controls
  },
  productInfo: {
    marginBottom: 8,
    alignItems: 'flex-end'
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
  },
  actionsSection: {
    flex:7,
    alignItems: 'center', // Align to the left
  justifyContent: 'flex-end',
  marginTop: 10,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6, // Reduce spacing
  transform: [{ scale: 0.8 }], // Make smaller
  },
  quantityButton: {
    backgroundColor: '#E0E0E0',
    padding: 8,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    minWidth: 24,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A90E2',
    paddingVertical: 6,
    borderRadius: 5,
    width: '90%', // Adjust width
  transform: [{ scale: 0.9 }], // Slightly smaller
  },
  addToCartText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#777',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 10,
    color: '#777',
  },
  productDetail: {
    fontSize: 12, // Reduce font size for a smoother look
  color: '#888', // Slightly lighter color for subtle contrast
  marginTop: 1, // Reduce spacing for a compact feel
  lineHeight: 16, // Adjust line spacing for better readability
  },
  divider: {
    width: 1,
    backgroundColor: '#DDD',
    marginHorizontal: 8,
  },
  removeFromCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E24A4A', // Red color for removal
    paddingVertical: 6,
    borderRadius: 5,
    width: '90%', // Adjust width
    transform: [{ scale: 0.9 }], // Slightly smaller
  },
  removeFromCartText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  
  
});

export default styles;
