import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FC', // הסגנון כמו בבית
  },
  content: {
    flex: 1,
    flexDirection: 'row-reverse', // RTL layout - בדיוק כמו בבית
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
    marginBottom: 12, // כמו בבית
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginRight: 16,
  },
  scrollView: {
    padding: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#4A90E2',
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  backButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Order Info Card
  orderInfoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 16,
    textAlign: 'right',
  },
  orderInfoRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
    paddingBottom: 10,
  },
  orderInfoLabel: {
    fontSize: 16,
    color: '#8F9BB3',
    fontWeight: '500',
  },
  orderInfoValue: {
    fontSize: 16,
    color: '#2E3A59',
    fontWeight: '500',
    textAlign: 'left',
  },
  orderInfoStatus: {
    fontSize: 16,
    color: '#F0A500', // Amber for pending
    fontWeight: 'bold',
    textAlign: 'left',
  },
  
  // Supplier Section (similar to ShoppingCart.styles)
  supplierSection: {
    backgroundColor: 'white',
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  supplierHeader: {
    padding: 10,
    backgroundColor: '#F1F1F1',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  supplierName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
  },
  cartItemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  productHeader: {
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E3A59',
    textAlign: 'right',
  },
  productBarcode: {
    fontSize: 14,
    color: '#8F9BB3',
    textAlign: 'right',
    marginTop: 4,
  },
  itemDetails: {
    backgroundColor: '#F8F9FF',
    borderRadius: 8,
    padding: 12,
  },
  detailRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#8F9BB3',
  },
  detailValue: {
    fontSize: 14,
    color: '#2E3A59',
    fontWeight: '500',
  },
  detailTotal: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  detailReturn: {
    fontSize: 14,
    color: '#FF6B6B', // Red for returns
    fontWeight: '500',
  },
  
  // Footer
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
  
  // Actions
  sendButton: {
    backgroundColor: '#4CAF50', // Green
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 10,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  rejectButton: {
    backgroundColor: '#FF6B6B', // Red
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  rejectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginLeft: 8,
  },
  
  // Options for the dropdown menu
  sendOptionsContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  optionButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
  },
  optionIcon: {
    marginLeft: 12,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  
  // Status Message
  statusMessageContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(74, 144, 226, 0.9)',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusMessage: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default styles;