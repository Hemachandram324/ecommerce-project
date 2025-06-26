package com.example.ecommerce.security.services;

import com.example.ecommerce.models.*;
import com.example.ecommerce.payload.request.AddCartItemRequest;
import com.example.ecommerce.payload.request.UpdateCartItemRequest;
import com.example.ecommerce.payload.response.CartItemDto;
import com.example.ecommerce.payload.response.CartResponse;
import com.example.ecommerce.repositories.CartItemRepository;
import com.example.ecommerce.repositories.CartRepository;
import com.example.ecommerce.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;

    @Override
    public CartResponse getCartForUser(Long userId) {
        Cart cart = getOrCreateUniqueCart(userId);
        return toResponse(cart);
    }

    @Override
    public CartResponse addItem(Long userId, AddCartItemRequest req,
                                BigDecimal productPrice, String productName) {

        Cart cart = getOrCreateUniqueCart(userId);

        if (cart.getItems() == null) cart.setItems(new ArrayList<>());

        CartItem item = cart.getItems().stream()
                .filter(ci -> ci.getProductId().equals(req.getProductId()))
                .findFirst()
                .orElse(null);

        int qty = (req.getQuantity() == null || req.getQuantity() <= 0)
                  ? 1 : req.getQuantity();

        if (item == null) {
            item = CartItem.builder()
                    .productId(req.getProductId())
                    .productName(productName)
                    .quantity(qty)
                    .price(productPrice)
                    .cart(cart)
                    .build();
            cart.getItems().add(item);
        } else {
            item.setQuantity(item.getQuantity() + qty);
        }

        cart.recalculateTotal();
        cartRepository.save(cart);
        return toResponse(cart);
    }

    @Override
    public CartResponse updateItem(Long userId, Long itemId,
                                   UpdateCartItemRequest req) {

        Cart cart = getOrCreateUniqueCart(userId);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!item.getCart().getId().equals(cart.getId()))
            throw new RuntimeException("Item does not belong to user's cart");

        item.setQuantity(req.getQuantity());
        if (item.getQuantity() <= 0) {
            cart.getItems().remove(item);
            cartItemRepository.delete(item);
        }

        cart.recalculateTotal();
        cartRepository.save(cart);
        return toResponse(cart);
    }

    @Override
    public CartResponse removeItem(Long userId, Long itemId) {
        Cart cart = getOrCreateUniqueCart(userId);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!item.getCart().getId().equals(cart.getId()))
            throw new RuntimeException("Item does not belong to user's cart");

        cart.getItems().remove(item);
        cartItemRepository.delete(item);
        cart.recalculateTotal();
        cartRepository.save(cart);
        return toResponse(cart);
    }

    @Override
    public void clearCart(Long userId) {
        List<Cart> carts = cartRepository.findAllByUser_Id(userId);
        if (!carts.isEmpty()) {
            Cart cart = carts.get(0);
            cartItemRepository.deleteAll(cart.getItems());
            cart.getItems().clear();
            cart.setTotal(BigDecimal.ZERO);
            cartRepository.save(cart);

            // Optional: clean up duplicate carts
            carts.stream().skip(1).forEach(cartRepository::delete);
        }
    }

    /* ───────────────────── internals ───────────────────── */

    private Cart getOrCreateUniqueCart(Long userId) {
        List<Cart> carts = cartRepository.findAllByUser_Id(userId);

        Cart cart;
        if (carts.isEmpty()) {
            cart = createCart(userId);
        } else {
            cart = carts.get(0);
            // Optional: delete duplicate carts
            carts.stream().skip(1).forEach(cartRepository::delete);
        }
        return cart;
    }

    private Cart createCart(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return cartRepository.save(
                Cart.builder()
                        .user(user)
                        .items(new ArrayList<>())
                        .total(BigDecimal.ZERO)
                        .build()
        );
    }

    private CartResponse toResponse(Cart cart) {

        List<CartItemDto> items = cart.getItems() == null ? List.of()
                : cart.getItems().stream()
                .map(ci -> CartItemDto.builder()
                        .itemId(ci.getId())
                        .productId(ci.getProductId())
                        .productName(ci.getProductName())
                        .quantity(ci.getQuantity())
                        .price(ci.getPrice())
                        .subtotal(ci.getSubtotal())
                        .build())
                .collect(Collectors.toList());

        return CartResponse.builder()
                .cartId(cart.getId())
                .items(items)
                .total(cart.getTotal())
                .build();
    }
}
