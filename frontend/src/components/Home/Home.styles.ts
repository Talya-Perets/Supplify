import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FC',
  },
  content: {
    flex: 1,
    flexDirection: 'row-reverse', // RTL layout
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
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginRight: 16,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationContainer: {
    marginLeft: 16,
    position: 'relative',
  },
  cartButton: {
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scrollView: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 16,
    textAlign: 'right',
  },
  orderItem: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  orderInfo: {
    flex: 1,
    marginRight: 12,
  },
  orderDescription: {
    fontSize: 14,
    color: '#2E3A59',
    textAlign: 'right',
  },
  orderDate: {
    fontSize: 12,
    color: '#8F9BB3',
    textAlign: 'right',
    marginTop: 4,
  },
  approveButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  approveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  quickActionsContainer: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  quickActionButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: 16,
  },
  quickActionText: {
    marginTop: 8,
    fontSize: 14,
    color: '#2E3A59',
    textAlign: 'center',
  },
  showMoreButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    padding: 8,
  },
  showMoreText: {
    color: '#4A90E2',
    fontSize: 14,
    marginLeft: 5,
  },
});

export default styles;