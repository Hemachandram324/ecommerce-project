package com.example.ecommerce.payload.request;

import lombok.Data;

@Data
public class UpdateCartItemRequest {
    private Integer quantity;
}