package com.example.ecommerce.payload.request;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderItemDTO {
    private Long productId;
    private int quantity;
}