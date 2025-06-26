package com.example.ecommerce.payload.request;


import lombok.Data;

import com.example.ecommerce.models.Order.OrderStatus;

import jakarta.validation.constraints.NotNull;

@Data
public class UpdateStatusRequest {
    @NotNull
    private OrderStatus status;
}