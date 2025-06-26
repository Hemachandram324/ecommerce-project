package com.example.ecommerce.security.services;

import com.example.ecommerce.models.*;
import com.example.ecommerce.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public Wishlist getWishlist(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return wishlistRepository.findByUser(user)
                .orElseGet(() -> wishlistRepository.save(Wishlist.builder().user(user).build()));
    }

    public Set<Product> getWishlistProducts(Long userId) {
        return getWishlist(userId).getProducts();
    }

    public void addToWishlist(Long userId, Long productId) {
        Product product = productRepository.findById(productId).orElseThrow();
        Wishlist wishlist = getWishlist(userId);
        wishlist.getProducts().add(product);
        wishlistRepository.save(wishlist);
    }

    public void removeFromWishlist(Long userId, Long productId) {
        Product product = productRepository.findById(productId).orElseThrow();
        Wishlist wishlist = getWishlist(userId);
        wishlist.getProducts().remove(product);
        wishlistRepository.save(wishlist);
    }
}
