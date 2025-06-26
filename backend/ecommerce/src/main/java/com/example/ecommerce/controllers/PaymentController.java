package com.example.ecommerce.controllers;

import com.example.ecommerce.models.Product;
import com.example.ecommerce.payload.request.CheckoutRequest;
import com.example.ecommerce.payload.request.PaymentIntentRequest;
import com.example.ecommerce.repositories.ProductRepository;
import com.example.ecommerce.security.services.OrderService;
import com.example.ecommerce.security.services.PaymentService;
import com.example.ecommerce.security.services.UserDetailsImpl;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final OrderService orderService;
    private final ProductRepository productRepository;

    @PostMapping("/create-payment-intent")
    public ResponseEntity<?> createPaymentIntent(@AuthenticationPrincipal UserDetailsImpl principal,
                                                 @Valid @RequestBody PaymentIntentRequest request) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            long amountInCents = request.getAmount();

            PaymentIntent pi = paymentService.createPaymentIntent(
                    amountInCents,
                    request.getCurrency(),
                    request.getPaymentMethodId());

            return ResponseEntity.ok(Map.of(
                    "clientSecret", pi.getClientSecret(),
                    "paymentIntentId", pi.getId()));

        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", ex.getMessage()));
        }
    }

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@Valid @RequestBody CheckoutRequest req,
                                     @AuthenticationPrincipal UserDetailsImpl principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            paymentService.verifySucceeded(req.getPaymentIntentId());

            // Validate items and calculate total
            BigDecimal total = BigDecimal.ZERO;
            for (CheckoutRequest.CheckoutItem item : req.getItems()) {
                Product product = productRepository.findById(item.getProductId())
                        .orElseThrow(() -> new IllegalArgumentException("Product not found: " + item.getProductId()));
                BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                total = total.add(itemTotal);
            }

            Long orderId = orderService.finalisePaidOrder(
                    principal.getId(),
                    req.getShippingAddress(),
                    req.getPaymentIntentId(),
                    req.getItems());

            return ResponseEntity.ok(Map.of("orderId", orderId));

        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED)
                    .body(Map.of("error", e.getMessage()));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", ex.getMessage()));
        }
    }
}