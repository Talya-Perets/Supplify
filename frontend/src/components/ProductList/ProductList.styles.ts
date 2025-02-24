import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row-reverse',
    backgroundColor: '#F6F7FC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4A90E2',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#777',
  },
  mainContent: {
    flex: 1,
    padding: 10,
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
  productList: {
    marginTop: 10,
  },
  productCard: {
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
  cardContent: {
    flexDirection: 'row-reverse',
    padding: 10,
  },
  imageContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#f1f1f1',
    marginLeft: 10,
  },
  detailsSection: {
    flex: 1,
  },
  productInfo: {
    marginBottom: 10,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    flexDirection: 'row-reverse',
  },
  actionsSection: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    padding: 8,
    borderRadius: 4,
  },
  addToCartText: {
    color: 'white',
    marginLeft: 5,
  },
    successMessage: {
      backgroundColor: '#4CAF50', // Green background
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 20,
      marginTop: 10,
    },
    successMessageText: {
      color: 'white',
      fontSize: 16,
    },
    image: {
      width: "100%",
      height: "100%",
      resizeMode: "cover", 
  },
  
});
export default styles;
