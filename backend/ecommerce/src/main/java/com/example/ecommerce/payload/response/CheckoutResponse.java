package com.example.ecommerce.payload.response;

import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
public class CheckoutResponse {
    private String sessionId;
    private String paymentUrl;
    
}