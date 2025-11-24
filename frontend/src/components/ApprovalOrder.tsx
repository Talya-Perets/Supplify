import React, { useState, useEffect, useContext } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { StackNavigationProp } from '@react-navigation/stack';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/models';
import { LoginContext } from '../contexts/LoginContext';
import { LoginContextType } from '../contexts/UserContext';
import { doGet, doPost } from '../util/HTTPRequests';
import { globals } from '../util/Globals';
import Sidebar from '../components/Sidebar/sidebar';
import ShoppingCartIcon from '../contexts/ShoppingCartIcon';
import styles from './ApprovalOrder.styles';


type ApprovalOrderScreenRouteProp = RouteProp<RootStackParamList, 'ApprovalOrder'>;
type ApprovalOrderScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ApprovalOrder'>;

interface OrderProductDetails {
  productId: number | string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  barcode?: string;
  imageUrl?: string;
  returnQuantity?: number;
  status?: string;
  userName?: string;
  supplierName?: string;
  
}

interface OrderDetails {
  id: number;
  items: OrderProductDetails[];
  totalAmount: number;
  status: string;
  orderDate: string;
  userName: string;
  supplierName: string;
  supplierId?: number;
  supplierPhone?: string; 
}

const ApprovalOrderScreen = ({ navigation }: { navigation: ApprovalOrderScreenNavigationProp }) => {
  const route = useRoute<ApprovalOrderScreenRouteProp>();
  const { orderId } = route.params as { orderId: number };
  const { userInfo } = useContext(LoginContext) as LoginContextType;
  
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [showSendOptions, setShowSendOptions] = useState(false);

  useEffect(() => {
    if (!orderId) {
      navigation.goBack();
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await doGet(`${globals.ORDER.getOrderInfo}?orderId=${orderId}`);
        const orderItems = response?.data || [];

        console.log("📦 Order details received from the server:");
        console.log("🆔 Order ID:", orderId);
        console.log("🛒 Products in this order:", orderItems);

        if (!Array.isArray(orderItems) || orderItems.length === 0) {
          throw new Error('Invalid order data received');
        }

        // הכנה של אובייקט OrderDetails מתוך הנתונים שחזרו מהשרת
        const formattedOrder: OrderDetails = {
          id: orderId,
          userName: orderItems[0]?.userName || 'אין שם',
          supplierName: orderItems[0]?.supplierName || 'אין שם ספק',
          items: orderItems,
          totalAmount: Array.isArray(orderItems)
            ? orderItems.reduce((sum, item) => sum + item.subtotal, 0)
            : 0,
          status: orderItems[0]?.status || 'ממתין לאישור',
          orderDate: new Date().toISOString(),
        };

        setOrderDetails(formattedOrder);
      } catch (err) {
        setError('שגיאה בטעינת פרטי ההזמנה');
        console.error('❌ Error fetching order details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, navigation]);

  const handleSendOrder = async () => {
    if (!orderDetails) return;

    try {
      setSubmitting(true);
      setStatusMessage(null);

      // הכנת נתוני ההזמנה לשליחה
      const orderData = {
        orderId: orderDetails.id,
        businessId: userInfo.businessId,
        products: orderDetails.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        })),
        totalAmount: orderDetails.totalAmount
      };

      // משתמשים ב-OrderConfirm במקום sendOrderToSupplier, שלא קיים
      const response = await doPost(`${globals.ORDER.OrderConfirm}`, orderData);

      if (response.status === 200) {
        setStatusMessage('ההזמנה נשלחה לספק בהצלחה');
        setTimeout(() => {
          navigation.navigate('Home');
        }, 1500);
      } else {
        throw new Error('Failed to send order');
      }
    } catch (error) {
      console.error('Error sending order:', error);
      setStatusMessage('שליחת ההזמנה נכשלה, אנא נסה שנית');
      Alert.alert('שגיאה', 'שליחת ההזמנה נכשלה, אנא נסה שנית');
    } finally {
      setSubmitting(false);
    }
  };

  // פונקציה לשליחה בווטסאפ
  const sendViaWhatsApp = () => {
    if (!orderDetails) return;
    
    const supplierPhone = ''; // יש למלא מספר טלפון של הספק אם יש
    
    let message = `הזמנה מספר ${orderDetails.id} מתאריך ${new Date(orderDetails.orderDate).toLocaleDateString('he-IL')}\n\n`;
    message += `מזמין: ${orderDetails.userName}\n`;
    message += `ספק: ${orderDetails.supplierName}\n\n`;
    message += `פירוט ההזמנה:\n`;
    
    orderDetails.items.forEach((item, index) => {
      message += `${index + 1}. ${item.productName} - ${item.quantity} יחידות, ₪${item.unitPrice.toFixed(2)} ליחידה, סה"כ: ₪${item.subtotal.toFixed(2)}\n`;
    });
    
    message += `\nסה"כ לתשלום: ₪${orderDetails.totalAmount.toFixed(2)}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `whatsapp://send?text=${encodedMessage}`;
    
    Linking.canOpenURL(whatsappUrl)
      .then(supported => {
        if (supported) {
          return Linking.openURL(whatsappUrl);
        } else {
          Alert.alert('שגיאה', 'WhatsApp אינו מותקן במכשיר זה');
        }
      })
      .catch(err => {
        console.error('שגיאה בפתיחת WhatsApp:', err);
        Alert.alert('שגיאה', 'אירעה שגיאה בפתיחת WhatsApp');
      });
  };

  // פונקציה לשליחה במייל
  const sendViaEmail = () => {
    if (!orderDetails) return;
    
    const supplierEmail = ''; // יש למלא כתובת מייל של הספק אם יש
    
    let subject = `הזמנה מספר ${orderDetails.id} מתאריך ${new Date(orderDetails.orderDate).toLocaleDateString('he-IL')}`;
    
    let body = `הזמנה מספר ${orderDetails.id} מתאריך ${new Date(orderDetails.orderDate).toLocaleDateString('he-IL')}\n\n`;
    body += `מזמין: ${orderDetails.userName}\n`;
    body += `ספק: ${orderDetails.supplierName}\n\n`;
    body += `פירוט ההזמנה:\n`;
    
    orderDetails.items.forEach((item, index) => {
      body += `${index + 1}. ${item.productName} - ${item.quantity} יחידות, ₪${item.unitPrice.toFixed(2)} ליחידה, סה"כ: ₪${item.subtotal.toFixed(2)}\n`;
    });
    
    body += `\nסה"כ לתשלום: ₪${orderDetails.totalAmount.toFixed(2)}`;
    
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    const emailUrl = `mailto:${supplierEmail}?subject=${encodedSubject}&body=${encodedBody}`;
    
    Linking.canOpenURL(emailUrl)
      .then(supported => {
        if (supported) {
          return Linking.openURL(emailUrl);
        } else {
          Alert.alert('שגיאה', 'לא ניתן לפתוח את יישום הדואר');
        }
      })
      .catch(err => {
        console.error('שגיאה בפתיחת אפליקציית המייל:', err);
        Alert.alert('שגיאה', 'אירעה שגיאה בפתיחת אפליקציית המייל');
      });
  };

  // פונקציה לדחיית ההזמנה
  const handleRejectOrder = async () => {
    Alert.alert(
      'דחיית הזמנה',
      'האם אתה בטוח שברצונך לדחות את ההזמנה?',
      [
        {
          text: 'ביטול',
          style: 'cancel',
        },
        {
          text: 'דחה הזמנה',
          style: 'destructive',
          onPress: async () => {
            try {
              setSubmitting(true);
              
              // קריאה ל-API כדי לדחות את ההזמנה
              const response = await doPost(`${globals.ORDER.OrderConfirm}`, {
                orderId: orderId,
                businessId: userInfo.businessId,
                status: 'rejected' // פרמטר שמציין שההזמנה נדחתה
              });
              
              if (response.status === 200) {
                setStatusMessage('ההזמנה נדחתה');
                setTimeout(() => {
                  navigation.navigate('Home');
                }, 1500);
              } else {
                throw new Error('Failed to reject order');
              }
            } catch (error) {
              console.error('Error rejecting order:', error);
              setStatusMessage('דחיית ההזמנה נכשלה, אנא נסה שנית');
            } finally {
              setSubmitting(false);
            }
          },
        },
      ]
    );
  };

  // פונקציה לניווט לסל הקניות
  const navigateToShoppingCart = () => {
    navigation.navigate('ShoppingCart');
  };

  if (!orderId) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {isSidebarVisible && <Sidebar />}
        <View style={styles.mainContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setIsSidebarVisible(!isSidebarVisible)}>
              <Icon name={isSidebarVisible ? 'x' : 'menu'} size={24} color="#4A90E2" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>אישור ושליחת הזמנה</Text>
            <View style={{flex: 1}} />
            <ShoppingCartIcon onPress={navigateToShoppingCart} />
          </View>

          {loading ? (
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" color="#4A90E2" />
              <Text style={styles.loadingText}>טוען פרטי הזמנה...</Text>
            </View>
          ) : error ? (
            <View style={styles.centerContent}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>חזור</Text>
              </TouchableOpacity>
            </View>
          ) : orderDetails ? (
            <>
              <ScrollView style={styles.scrollView}>
                <View style={styles.orderInfoCard}>
                  <Text style={styles.orderInfoTitle}>פרטי הזמנה #{orderDetails.id}</Text>
                  <View style={styles.orderInfoRow}>
                    <Text style={styles.orderInfoLabel}>תאריך:</Text>
                    <Text style={styles.orderInfoValue}>
                      {new Date(orderDetails.orderDate).toLocaleDateString('he-IL')}
                    </Text>
                  </View>
                  <View style={styles.orderInfoRow}>
                    <Text style={styles.orderInfoLabel}>מזמין:</Text>
                    <Text style={styles.orderInfoValue}>{orderDetails.userName}</Text>
                  </View>
                  <View style={styles.orderInfoRow}>
                    <Text style={styles.orderInfoLabel}>ספק:</Text>
                    <Text style={styles.orderInfoValue}>{orderDetails.supplierName}</Text>
                  </View>
                  <View style={styles.orderInfoRow}>
                    <Text style={styles.orderInfoLabel}>סטטוס:</Text>
                    <Text style={styles.orderInfoStatus}>{orderDetails.status}</Text>
                  </View>
                </View>

                {/* רשימת המוצרים */}
                <View style={styles.supplierSection}>
                  <View style={styles.supplierHeader}>
                    <Text style={styles.supplierName}>{orderDetails.supplierName}</Text>
                  </View>
                  {orderDetails.items.map((item, index) => (
                    <View key={index} style={styles.cartItemContainer}>
                      <View style={styles.productHeader}>
                        <Text style={styles.productName}>{item.productName}</Text>
                        {item.barcode && (
                          <Text style={styles.productBarcode}>ברקוד: {item.barcode}</Text>
                        )}
                      </View>
                      
                      <View style={styles.itemDetails}>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>כמות:</Text>
                          <Text style={styles.detailValue}>{item.quantity}</Text>
                        </View>
                        
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>מחיר ליחידה:</Text>
                          <Text style={styles.detailValue}>₪{item.unitPrice.toFixed(2)}</Text>
                        </View>
                        
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>סה"כ:</Text>
                          <Text style={styles.detailTotal}>₪{item.subtotal.toFixed(2)}</Text>
                        </View>

                        {item.returnQuantity && item.returnQuantity > 0 && (
                          <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>החזרה:</Text>
                            <Text style={styles.detailReturn}>{item.returnQuantity} יחידות</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              </ScrollView>

              {/* סיכום ההזמנה וכפתורי פעולה */}
              <View style={styles.footer}>
                <Text style={styles.totalAmount}>סה"כ לתשלום: ₪{orderDetails.totalAmount.toFixed(2)}</Text>
                
                {/* כפתור שליחת הזמנה - פותח תפריט אפשרויות */}
                <TouchableOpacity 
                  style={styles.sendButton}
                  onPress={() => setShowSendOptions(!showSendOptions)}>
                  <FontAwesome name="send" size={20} color="white" style={styles.buttonIcon} />
                  <Text style={styles.sendButtonText}>שלח הזמנה</Text>
                  <FontAwesome 
                    name={showSendOptions ? "chevron-up" : "chevron-down"} 
                    size={16} 
                    color="white" 
                    style={{marginRight: 10}} 
                  />
                </TouchableOpacity>
                
                {/* תפריט אפשרויות שנפתח כשלוחצים על כפתור השליחה */}
                {showSendOptions && (
                  <View style={styles.sendOptionsContainer}>
                    <TouchableOpacity 
                      style={styles.optionButton}
                      onPress={sendViaWhatsApp}>
                      <FontAwesome name="whatsapp" size={20} color="#25D366" style={styles.optionIcon} />
                      <Text style={styles.optionText}>שלח בוואטסאפ</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.optionButton}
                      onPress={sendViaEmail}>
                      <FontAwesome name="envelope" size={20} color="#4A90E2" style={styles.optionIcon} />
                      <Text style={styles.optionText}>שלח במייל</Text>
                    </TouchableOpacity>
                  </View>
                )}
                
                {/* כפתור ביטול הזמנה */}
                <TouchableOpacity 
                  style={styles.rejectButton}
                  onPress={handleRejectOrder}>
                  <FontAwesome name="times" size={20} color="white" style={styles.buttonIcon} />
                  <Text style={styles.rejectButtonText}>ביטול הזמנה</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.centerContent}>
              <Text style={styles.errorText}>לא נמצאו פרטי הזמנה</Text>
            </View>
          )}

          {statusMessage && (
            <View style={styles.statusMessageContainer}>
              <Text style={styles.statusMessage}>{statusMessage}</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ApprovalOrderScreen;