package com.example.ecommerce.controllers;

import com.example.ecommerce.models.Order;
import com.example.ecommerce.models.User;
import com.example.ecommerce.payload.request.UpdateStatusRequest;
import com.example.ecommerce.payload.response.OrderResponse;
import com.example.ecommerce.repositories.UserRepository;
import com.example.ecommerce.security.services.OrderService;
import com.example.ecommerce.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    @GetMapping("/order/{orderId}")
    public OrderResponse get(@PathVariable Long orderId,
                            @AuthenticationPrincipal UserDetailsImpl principal) {
        User user = loadCurrentUser(principal);
        Order order = orderService.getOrder(orderId, user);
        return toOrderResponse(order);
    }
    
    @GetMapping("/getuserorder")
    public OrderResponse getuserorder(@PathVariable Long orderId,
    		@PathVariable UserDetailsImpl userid) {
       User user= userRepository.findByEmail(userid.getUsername())
               .orElseThrow(() -> new ResponseStatusException(
                       HttpStatus.NOT_FOUND, "User not found"));
        Order order = orderService.getOrder(orderId, user);
        return toOrderResponse(order);
    }

    @GetMapping("/user")
    public List<OrderResponse> userOrders(@AuthenticationPrincipal UserDetailsImpl principal) {
        User user = loadCurrentUser(principal);
        return orderService.listUserOrders(user).stream()
                .map(this::toOrderResponse)
                .collect(Collectors.toList());
    }
    
    @DeleteMapping("/{orderId}")
    public void deleteOrder(@PathVariable Long orderId,
                            @AuthenticationPrincipal UserDetailsImpl principal) {
        User user = loadCurrentUser(principal);
        orderService.deleteOrder(orderId, user);
    }
    
    @GetMapping("/admin/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<OrderResponse> getOrdersByUser(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return orderService.listUserOrders(user).stream()
                .map(this::toOrderResponse)
                .collect(Collectors.toList());
    }


    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public List<OrderResponse> allOrders() {
        return orderService.listAllOrders().stream()
                .map(this::toOrderResponse)
                .collect(Collectors.toList());
    }

    @PostMapping("/{orderId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public OrderResponse updateStatus(@PathVariable Long orderId,
                                     @Valid @RequestBody UpdateStatusRequest dto) {
        Order order = orderService.updateStatus(orderId, dto.getStatus());
        return toOrderResponse(order);
    }

    private User loadCurrentUser(UserDetailsImpl principal) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }
        return userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));
    }

    private OrderResponse toOrderResponse(Order order) {
        // Initialize lazy-loaded fields
        Hibernate.initialize(order.getUser());
        Hibernate.initialize(order.getShippingAddress());

        return OrderResponse.builder()
                .id(order.getId())
                .createdAt(order.getCreatedAt())
                .paymentSessionId(order.getPaymentSessionId())
                .status(order.getStatus())
                .total(order.getTotal())
                .userId(order.getUser().getId())
                .shippingAddress(OrderResponse.AddressResponse.builder()
                        .id(order.getShippingAddress().getId())
                        .fullName(order.getShippingAddress().getFullName())
                        .addressLine1(order.getShippingAddress().getLine1())
                        .addressLine2(order.getShippingAddress().getLine2())
                        .city(order.getShippingAddress().getCity())
                        .state(order.getShippingAddress().getState())
                        .postalCode(order.getShippingAddress().getPostalCode())
                        .country(order.getShippingAddress().getCountry())
                        .phone(order.getShippingAddress().getPhone())
                        .build())
                .items(order.getItems().stream()
                        .map(oi -> OrderResponse.OrderItemResponse.builder()
                                .id(oi.getId())
                                .productId(oi.getProductId())
                                .productName(oi.getProductName())
                                .quantity(oi.getQuantity())
                                .unitPrice(oi.getUnitPrice())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }
}