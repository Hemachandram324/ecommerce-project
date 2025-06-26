package com.example.ecommerce.payload.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class AddressRequest {

    @NotBlank
    private String fullName;
    @NotBlank
    private String line1;
    private String line2;
    @NotBlank
    private String city;
    @NotBlank
    private String state;
    @NotBlank
    private String postalCode;
    @NotBlank
    private String country;
    @NotBlank
    private String phone;
}