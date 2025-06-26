package com.example.ecommerce.payload.request;

import lombok.Data;

@Data
public class AddCartItemRequest {
    private Long productId;
    private Integer quantity;
}