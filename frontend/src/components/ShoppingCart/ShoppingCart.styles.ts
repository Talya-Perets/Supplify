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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
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
  },
  content: {
    flex: 1,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  supplierSection: {
    backgroundColor: 'white',
    marginBottom: 12,
    borderRadius: 8,
    marginTop: 16, 
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemControls: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 16,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemDetails: {
    alignItems: 'flex-end',
  },
  itemName: {
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
});
export default styles;
