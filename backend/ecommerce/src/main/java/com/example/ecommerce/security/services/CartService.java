package com.example.ecommerce.security.services;

import com.example.ecommerce.payload.request.AddCartItemRequest;
import com.example.ecommerce.payload.request.UpdateCartItemRequest;
import com.example.ecommerce.payload.response.CartResponse;
import java.math.BigDecimal;

public interface CartService {
    CartResponse getCartForUser(Long userId);
    CartResponse addItem(Long userId, AddCartItemRequest request, BigDecimal productPrice, String productName);
    CartResponse updateItem(Long userId, Long itemId, UpdateCartItemRequest request);
    CartResponse removeItem(Long userId, Long itemId);
    void clearCart(Long userId);
}