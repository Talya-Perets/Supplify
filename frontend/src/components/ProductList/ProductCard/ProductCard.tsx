import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {BusinessProduct} from '../../../types/models';
import {globals} from '../../../util/Globals';
import styles from './ProductCard.styles';

interface ProductCardProps {
  businessProduct: BusinessProduct;
  quantity: number;
  updateQuantity: (productId: string, increment: boolean) => void;
  handleAddToCart?: (businessProduct: BusinessProduct) => void;
  handleRemoveFromCart?: (businessProduct: BusinessProduct) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  businessProduct,
  quantity,
  updateQuantity,
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
