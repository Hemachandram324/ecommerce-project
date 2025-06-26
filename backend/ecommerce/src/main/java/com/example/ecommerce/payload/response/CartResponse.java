package com.example.ecommerce.payload.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data @Builder
public class CartResponse {
    private Long cartId;
    private List<CartItemDto> items;
    private BigDecimal total;
}