package com.example.ecommerce.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PaymentIntentRequest {
    
    @NotNull
    private Long amount;

    @NotBlank
    private String currency;

    @NotBlank
    private String paymentMethodId;
}
