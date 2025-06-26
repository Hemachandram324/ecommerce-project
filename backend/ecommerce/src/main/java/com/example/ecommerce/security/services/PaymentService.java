package com.example.ecommerce.security.services;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @PostConstruct
    void init() {
        Stripe.apiKey = stripeSecretKey;
        logger.info("Stripe API key initialized");
    }

    public PaymentIntent createPaymentIntent(long amount, String currency, String paymentMethodId) throws StripeException {
        logger.info("Creating PaymentIntent: amount={}, currency={}, paymentMethodId={}", amount, currency, paymentMethodId);
        Map<String, Object> params = new HashMap<>();
        params.put("amount", amount);
        params.put("currency", currency);
        params.put("payment_method_types", List.of("card"));
        // Don't confirm here – the frontend will do that using CardElement
        PaymentIntent pi = PaymentIntent.create(params);
        logger.info("PaymentIntent created: id={}, status={}", pi.getId(), pi.getStatus());
        return pi;
    }


    public PaymentIntent verifySucceeded(String paymentIntentId) throws StripeException {
        logger.info("Verifying PaymentIntent: id={}", paymentIntentId);
        PaymentIntent pi = PaymentIntent.retrieve(paymentIntentId);
        if (!"succeeded".equals(pi.getStatus())) {
            logger.error("PaymentIntent verification failed: id={}, status={}, error={}", 
                         paymentIntentId, pi.getStatus(), pi.getLastPaymentError());
            throw new IllegalStateException("PaymentIntent status is " + pi.getStatus());
        }
        logger.info("PaymentIntent verified: id={}, status={}", paymentIntentId, pi.getStatus());
        return pi;
    }
}