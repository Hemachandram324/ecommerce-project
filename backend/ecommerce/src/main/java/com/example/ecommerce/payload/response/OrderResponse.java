package com.example.ecommerce.payload.response;

import com.example.ecommerce.models.Order.OrderStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderResponse {
    private Long id;
    private LocalDateTime createdAt;
    private String paymentSessionId;
    private OrderStatus status;
    private BigDecimal total;
    private Long userId;
    private boolean isBuyNow;
    private AddressResponse shippingAddress;
    private List<OrderItemResponse> items;

    @Data
    @Builder
    public static class AddressResponse {
        private Long id;
        private String fullName;
        private String addressLine1;
        private String addressLine2;
        private String city;
        private String state;
        private String postalCode;
        private String country;
        private String phone;
    }

    @Data
    @Builder
    public static class OrderItemResponse {
        private Long id;
        private Long productId;
        private String productName;
        private int quantity;
        private BigDecimal unitPrice;
    }
}