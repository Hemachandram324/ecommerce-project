package com.example.ecommerce.controllers;

import com.example.ecommerce.models.Address;
import com.example.ecommerce.models.User;
import com.example.ecommerce.payload.request.AddressRequest;
import com.example.ecommerce.repositories.UserRepository;
import com.example.ecommerce.security.services.AddressService;
import com.example.ecommerce.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;
    private final UserRepository userRepository;

    /* ---------- CREATE ---------- */
    @PostMapping
    public Address create(@Valid @RequestBody AddressRequest dto,
                          @AuthenticationPrincipal UserDetailsImpl principal) {

        User user = loadCurrentUser(principal);
        return addressService.addAddress(dto, user);
    }

    /* ---------- UPDATE ---------- */
    @PutMapping("/{id}")
    public Address update(@PathVariable Long id,
                          @Valid @RequestBody AddressRequest dto,
                          @AuthenticationPrincipal UserDetailsImpl principal) {

        User user = loadCurrentUser(principal);
        return addressService.updateAddress(id, dto, user);
    }

    /* ---------- DELETE ---------- */
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id,
                       @AuthenticationPrincipal UserDetailsImpl principal) {

        User user = loadCurrentUser(principal);
        addressService.deleteAddress(id, user);
        return "Delete successfully";
    }

    /* ---------- LIST ---------- */
    @GetMapping
    public List<Address> list(@AuthenticationPrincipal UserDetailsImpl principal) {

        User user = loadCurrentUser(principal);
        return addressService.listUserAddresses(user);
    }

    /* ---------- Helper ---------- */
    private User loadCurrentUser(UserDetailsImpl principal) {
        if (principal == null) {
            // 401 if the token is missing/invalid or security context is empty
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }
        return userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));
    }
}
