package com.example.ecommerce.payload.request;

import com.example.ecommerce.models.Address;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class CheckoutRequest {
    @NotBlank private String paymentIntentId;
    @NotNull private Address shippingAddress;
    @NotNull
    private List<CheckoutItem> items;



//    @Data
//    public static class PaymentIntentRequest {
//        @NotNull private Long userId;
//        @NotNull private Long amount;
//        @NotBlank private String currency;
//        @NotEmpty private List<Item> items;
//        @NotBlank private String paymentMethodId;

        @Data
        public static class CheckoutItem {
            @NotNull
            private Long productId;

            @NotNull
            private Integer quantity;

            private String size;
        }
//    }
}