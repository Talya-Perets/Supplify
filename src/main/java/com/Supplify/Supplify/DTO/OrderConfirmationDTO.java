package com.Supplify.Supplify.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderConfirmationDTO {
    private int orderId;
    private List<OrderProductUpdateDTO> receivedProducts; // קבלת פרטי המוצרים שהגיעו
    private double totalPaid;
    private String invoiceImage;

    @Override
    public String toString() {
        StringBuilder productIds = new StringBuilder();
        for (OrderProductUpdateDTO product : receivedProducts) {
            productIds.append(product.toString()).append(", ");  // מוסיף את ה-productId של כל מוצר
        }

        // מסיר את פסיק המיותר בסוף המחרוזת
        if (productIds.length() > 0) {
            productIds.setLength(productIds.length() - 2);
        }

        return "OrderConfirmationDTO{" +
                "orderId=" + orderId +
                ", receivedProducts=" + productIds.toString() +
                ", totalPaid=" + totalPaid +
                ", invoiceImage='" + invoiceImage + '\'' +
                '}';
    }
}
