import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {BusinessProduct} from '../../../types/models';
import {globals} from '../../../util/Globals';
import styles from './ProductCard.styles';

interface ProductCardProps {
  businessProduct: BusinessProduct;
  quantity: number;
  returnQuantity?: number; // New prop for return quantity
  updateQuantity: (productId: string, increment: boolean) => void;
  updateReturnQuantity?: (productId: string, increment: boolean) => void; // New function for return quantity
  handleAddToCart?: (businessProduct: BusinessProduct) => void;
  handleRemoveFromCart?: (businessProduct: BusinessProduct) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  businessProduct,
  quantity,
  returnQuantity = 0, // Default to 0 if not provided
  updateQuantity,
  updateReturnQuantity,
  handleAddToCart,
  handleRemoveFromCart,
}) => {
  return (
    <View style={styles.productCard}>
      <View style={styles.cardContent}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: businessProduct.imageUrl
                ? `${globals.PRODUCTION_URL}${businessProduct.imageUrl}`
                : 'https://via.placeholder.com/100',
            }}
            style={styles.image}
          />
        </View>

        <View style={styles.detailsSection}>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>
              {businessProduct.product.productName}
            </Text>
            <Text style={styles.productDetail}>
              ספק: {businessProduct.product.supplier.companyName}
            </Text>
            <Text style={styles.productDetail}>
              מלאי נדרש: {businessProduct.stock} יחידות
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.actionsSection}>
          <Text style={styles.priceText}>
            מחיר: {businessProduct.price.toFixed(2)} ₪
          </Text>
          
          {/* Order quantity controls */}
          <View style={styles.orderControlsContainer}>
            <Text style={styles.orderLabel}>הזמנה:</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateQuantity(businessProduct.product.id, false)}>
                <Icon name="minus" size={16} color="#4A90E2" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateQuantity(businessProduct.product.id, true)}>
                <Icon name="plus" size={16} color="#4A90E2" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Return quantity controls - only show if updateReturnQuantity is provided */}
          {updateReturnQuantity && (
            <View style={styles.returnControlsContainer}>
              <Text style={styles.returnLabel}>החזרה:</Text>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => updateReturnQuantity(businessProduct.product.id, false)}>
                  <Icon name="minus" size={16} color="#E24A4A" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{returnQuantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => updateReturnQuantity(businessProduct.product.id, true)}>
                  <Icon name="plus" size={16} color="#E24A4A" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          {handleRemoveFromCart ? (
            <TouchableOpacity
              style={styles.removeFromCartButton}
              onPress={() => handleRemoveFromCart(businessProduct)}>
              <Icon name="trash-2" size={16} color="white" />
              <Text style={styles.removeFromCartText}>הסר מהסל</Text>
            </TouchableOpacity>
          ) : handleAddToCart ? (
            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={() => handleAddToCart(businessProduct)}>
              <Icon name="shopping-cart" size={16} color="white" />
              <Text style={styles.addToCartText}>הוסף לסל</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
};

export default ProductCard;