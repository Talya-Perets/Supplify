import React, { useState, useEffect, useContext } from 'react';
import { 
  SafeAreaView, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { styles } from './ConfirmOrder.styls';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../App';
import { useRoute, RouteProp } from '@react-navigation/native';
import { LoginContext } from '../../contexts/LoginContext';
import { LoginContextType } from '../../contexts/UserContext';
import { doPost } from '../../util/HTTPRequests';
import { globals } from '../../util/Globals';
import Icon from 'react-native-vector-icons/Feather';

type ConfirmOrderScreenRouteProp = RouteProp<RootStackParamList, 'ConfirmOrder'>;
type ConfirmOrderScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ConfirmOrder'>;

interface OrderProductDetails {
  productName: string;
  barcode: string;
  imageUrl: string;
  orderedQuantity: number;
  deliveredQuantity: number;
  unitPrice: number;
  subtotal: number;
  productId?: number;
  return_requested: number;
  return_approved:number;
}

interface OrderProductUpdateDTO {
  productId: number;
  deliveredQuantity: number;
  unitPrice: number;
}


const ConfirmOrderScreen = ({ navigation }: { navigation: ConfirmOrderScreenNavigationProp }) => {
  const route = useRoute<ConfirmOrderScreenRouteProp>();
  const { orderDetails, orderId } = route.params;
  const { userInfo } = useContext(LoginContext) as LoginContextType;

  const [items, setItems] = useState<OrderProductDetails[]>(orderDetails || []);
  const [totalAmount, setTotalAmount] = useState<string>('0.00');
  const [hasInvoice, setHasInvoice] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // חישוב סכום כולל כשהפריטים משתנים
  useEffect(() => {
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    setTotalAmount(total.toFixed(2));
  }, [items]);

  // פונקציה לשינוי כמות שהגיעה
  const handleDeliveredQuantityChange = (index: number, value: string) => {
    const updatedItems = [...items]; // יצירת עותק של רשימת הפריטים
    const deliveredQuantity = value === '' ? 0 : parseInt(value);

    if (!isNaN(deliveredQuantity)) {
      const updatedItem = { ...updatedItems[index] }; // יצירת עותק של הפריט
      updatedItem.deliveredQuantity = deliveredQuantity; // עדכון הכמות שהגיעה
      updatedItem.subtotal = updatedItem.deliveredQuantity * updatedItem.unitPrice; // חישוב סכום כולל מחדש
      updatedItems[index] = updatedItem; // עדכון הפריט ברשימה
      setItems(updatedItems); // עדכון הרשימה כולה
    }
    console.log("startbarchcode "+ items.at(0)?.barcode+ "id    "+items.at(0)?.productId+ "name  !!"+ items.at(0)?.productName);
  };

  // פונקציה לשינוי מחיר ליחידה
  const handleUnitPriceChange = (index: number, value: string) => {
    const updatedItems = [...items]; // יצירת עותק של רשימת הפריטים
    const unitPrice = value === '' ? 0 : parseFloat(value);

    if (!isNaN(unitPrice)) {
      const updatedItem = { ...updatedItems[index] }; // יצירת עותק של הפריט
      updatedItem.unitPrice = unitPrice; // עדכון המחיר ליחידה
      updatedItem.subtotal = updatedItem.deliveredQuantity * updatedItem.unitPrice; // חישוב סכום כולל מחדש
      updatedItems[index] = updatedItem; // עדכון הפריט ברשימה
      setItems(updatedItems); // עדכון הרשימה כולה
    }
  };

  // פונקציה לשינוי סכום כללי
  const handleTotalAmountChange = (value: string) => {
    if (value === '' || !isNaN(parseFloat(value))) {
      setTotalAmount(value);
    }
  };

  // שינוי מצב קיומה של חשבונית
  const toggleInvoice = () => {
    setHasInvoice(!hasInvoice);
  };

  // פונקציה לאישור הזמנה ושליחה לשרת
  const handleConfirmOrder = async () => {
    if (!orderId) {
      Alert.alert('שגיאה', 'מזהה הזמנה חסר');
      return;
    }

    try {
      setIsSubmitting(true);
      setStatusMessage(null);

      const receivedProducts = items.map(item => ({
        productId: item.barcode, 
        orderedQuantity: item.orderedQuantity,
        actualQuantity: item.deliveredQuantity,
        unitPrice: item.unitPrice
      }));
      console.log("len recive " + receivedProducts.length);

      for (let i = 0; i < receivedProducts.length; i++) {
        console.log("idprod " + receivedProducts[i]?.productId + 
          " actualQuantity " + receivedProducts.at(i)?.actualQuantity + 
          " orderedQuantity " + receivedProducts.at(i)?.orderedQuantity);
      }
      


      const orderConfirmation = {
        orderId: orderId,  // מזהה הזמנה
        receivedProducts: receivedProducts,  // המוצרים שהגיעו
        totalPaid: parseFloat(totalAmount),  // הסכום ששולם
        invoiceImage: hasInvoice ? 'image_data_or_url' : ""  // אם יש חשבונית, אז תמונה או URL
      };
      console.log( "send reqqq   " + "id"+orderConfirmation.orderId+ " "+orderConfirmation.receivedProducts+ "  " +orderConfirmation.totalPaid+" "+orderConfirmation.invoiceImage);
      const response = await doPost(
        `${globals.ORDER.updateOrderReceived}`,
        orderConfirmation

      );
      

      if (response.status === 200) {
        setStatusMessage('הזמנה עודכנה בהצלחה');
        setTimeout(() => navigation.goBack(), 1500);
      } else {
        setStatusMessage('עדכון הזמנה נכשל, אנא נסה שנית');
      }
    } catch (error) {
      console.error('Error confirming order:', error);
      setStatusMessage('עדכון הזמנה נכשל, אנא נסה שנית');
    } finally {
      setIsSubmitting(false);
      if (statusMessage) {
        setTimeout(() => setStatusMessage(null), 3000);
      }
    }

  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-right" size={24} color="#4A90E2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>אישור הזמנה</Text>
        <View style={styles.placeholder}></View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {items.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemName}>{item.productName}</Text>
              <Text style={styles.barcodeText}>ברקוד: {item.barcode}</Text>
            </View>
            
            <View style={styles.contentRow}>
              <View style={styles.imageContainer}>
                {item.imageUrl ? (
                  <Image source={{ uri: item.imageUrl }} style={styles.productImage} resizeMode="cover" />
                ) : (
                  <View style={styles.noImageContainer}>
                    <Icon name="image" size={24} color="#CCCCCC" />
                    <Text style={styles.placeholderText}>אין תמונה</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.detailsContainer}>
                <View style={styles.quantitySection}>
                  <View style={styles.quantityRow}>
                    <Text style={styles.quantityLabel}>כמות שהוזמנה:</Text>
                    <Text style={styles.quantityValue}>{item.orderedQuantity}</Text>
                  </View>
                  
                  <View style={[styles.quantityRow, styles.lastRow]}>
                    <Text style={styles.quantityLabel}>כמות שהגיעה:</Text>
                    <TextInput
                      style={[styles.inputQuantity, { textAlign: 'center' }]}
                      keyboardType="numeric"
                      value={item.deliveredQuantity.toString()}
                      onChangeText={(value) => handleDeliveredQuantityChange(index, value)}
                    />
                  </View>
                </View>
                
                <View style={styles.priceSection}>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>מחיר ליחידה:</Text>
                    <View style={styles.priceInputContainer}>
                      <TextInput
                        style={[styles.priceInput, { textAlign: 'center' }]}
                        keyboardType="numeric"
                        value={item.unitPrice.toString()}
                        onChangeText={(value) => handleUnitPriceChange(index, value)}
                      />
                      <Text style={styles.currencySymbol}>₪</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            
            <View style={styles.subtotalContainer}>
              <Text style={styles.subtotalLabel}>סה"כ:</Text>
              <Text style={styles.subtotalValue}>₪{item.subtotal.toFixed(2)}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>סה"כ לתשלום:</Text>
          <View style={styles.totalInputContainer}>
            <TextInput
              style={[styles.totalInput, { textAlign: 'center' }]}
              keyboardType="numeric"
              value={totalAmount}
              onChangeText={handleTotalAmountChange}
            />
            <Text style={styles.currencySymbol}>₪</Text>
          </View>
        </View>

        {hasInvoice ? (
          <View style={styles.invoiceAttachedContainer}>
            <Text style={styles.invoiceAttachedText}>חשבונית צורפה</Text>
            <TouchableOpacity style={styles.removeButton} onPress={toggleInvoice}>
              <Text style={styles.removeButtonText}>הסר</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.attachInvoiceButton} onPress={toggleInvoice}>
            <Icon name="paperclip" size={20} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.attachButtonText}>צרף חשבונית</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[styles.confirmButton, isSubmitting && styles.disabledButton]} 
          onPress={handleConfirmOrder}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Icon name="check" size={20} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.confirmButtonText}>אשר הזמנה</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {statusMessage && (
        <View style={styles.statusMessageContainer}>
          <Text style={styles.statusMessage}>{statusMessage}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ConfirmOrderScreen;
