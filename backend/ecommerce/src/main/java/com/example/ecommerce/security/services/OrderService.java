package com.example.ecommerce.security.services;

import com.example.ecommerce.models.*;
import com.example.ecommerce.payload.request.CheckoutRequest;
import com.example.ecommerce.repositories.*;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final AddressRepository addressRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public Order createOrderFromCart(User user, Long shippingAddressId) {
        Address shipping = addressRepository.findById(shippingAddressId)
                .orElseThrow(() -> new IllegalArgumentException("Shipping address not found"));

        Cart cart = getOrCreateCart(user.getId());
        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new IllegalStateException("Cart is empty");
        }

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (CartItem ci : cart.getItems()) {
            OrderItem oi = OrderItem.builder()
                    .productId(ci.getProductId())
                    .productName(ci.getProductName())
                    .quantity(ci.getQuantity())
                    .unitPrice(ci.getPrice())
                    .build();
            orderItems.add(oi);
            total = total.add(ci.getPrice().multiply(BigDecimal.valueOf(ci.getQuantity())));
        }

        Order order = Order.builder()
                .user(user)
                .shippingAddress(shipping)
                .createdAt(LocalDateTime.now())
                .status(Order.OrderStatus.PENDING)
                .total(total)
                .items(orderItems)
                .build();
        orderItems.forEach(oi -> oi.setOrder(order));

        Order savedOrder = orderRepository.save(order);

        cartItemRepository.deleteAll(cart.getItems());
        cart.getItems().clear();
        cart.setTotal(BigDecimal.ZERO);
        cartRepository.save(cart);

        return savedOrder;
    }

    public Order getOrder(Long id, User user) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        if (!order.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Cannot view others' order");
        }
        Hibernate.initialize(order.getUser());
        Hibernate.initialize(order.getShippingAddress());
        return order;
    }

    public List<Order> listUserOrders(User user) {
        List<Order> orders = orderRepository.findByUserId(user.getId());
        orders.forEach(order -> {
            Hibernate.initialize(order.getItems());
            Hibernate.initialize(order.getUser());
            Hibernate.initialize(order.getShippingAddress());
        });
        return orders;
    }

    public List<Order> listAllOrders() {
        List<Order> orders = orderRepository.findAll();
        orders.forEach(order -> {
            Hibernate.initialize(order.getItems());
            Hibernate.initialize(order.getUser());
            Hibernate.initialize(order.getShippingAddress());
        });
        return orders;
    }

    public Order updateStatus(Long orderId, Order.OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        order.setStatus(status);
        Order savedOrder = orderRepository.save(order);
        Hibernate.initialize(savedOrder.getItems());
        Hibernate.initialize(savedOrder.getUser());
        Hibernate.initialize(savedOrder.getShippingAddress());
        return savedOrder;
    }
    
    @Transactional
    public void deleteOrder(Long orderId, User user) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        orderRepository.delete(order);
    }

    @Transactional
    public Long finalisePaidOrder(Long userId, Address shippingAddress, String paymentIntentId, List<CheckoutRequest.CheckoutItem> items) {
        Optional<Order> existingOrder = orderRepository.findByPaymentSessionId(paymentIntentId);
        if (existingOrder.isPresent()) {
            logger.info("Order already exists for PaymentIntent: {}", paymentIntentId);
            return existingOrder.get().getId();
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (shippingAddress.getId() == null) {
            logger.info("Saving new shipping address: {}", shippingAddress);
            shippingAddress = addressRepository.save(shippingAddress);
        }

        BigDecimal total = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (CheckoutRequest.CheckoutItem item : items) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found: " + item.getProductId()));
            
            BigDecimal itemPrice = product.getPrice();
            BigDecimal itemTotal = itemPrice.multiply(BigDecimal.valueOf(item.getQuantity()));
            total = total.add(itemTotal);

            OrderItem orderItem = OrderItem.builder()
                    .productId(item.getProductId())
                    .productName(product.getName())
                    .quantity(item.getQuantity())
                    .unitPrice(itemPrice)
                    .build();
            orderItems.add(orderItem);
        }

        Order order = Order.builder()
                .createdAt(LocalDateTime.now())
                .status(Order.OrderStatus.PAID)
                .paymentSessionId(paymentIntentId)
                .total(total)
                .user(user)
                .shippingAddress(shippingAddress)
                .items(orderItems)
                .build();

        order.getItems().forEach(oi -> oi.setOrder(order));
        Order saved = orderRepository.save(order);

        // Clear cart only if checking out from cart
        if (items.size() > 1) {
            Cart cart = getOrCreateCart(userId);
            //cartItemRepository.deleteAll(cart.getItems());
            //cart.getItems().clear();
            //cart.setTotal(BigDecimal.ZERO);
            cartRepository.save(cart);
        }

        logger.info("Order finalized: OrderId={}, PaymentIntentId={}", saved.getId(), paymentIntentId);
        return saved.getId();
    }

    private Cart getOrCreateCart(Long userId) {
        List<Cart> carts = cartRepository.findAllByUser_Id(userId);
        if (carts.isEmpty()) {
            throw new IllegalStateException("Cart is empty");
        } else {
            Cart cart = carts.get(0);
            carts.stream().skip(1).forEach(cartRepository::delete);
            return cart;
        }
    }
}