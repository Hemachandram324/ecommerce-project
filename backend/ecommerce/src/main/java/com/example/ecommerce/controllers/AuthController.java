// AuthController.java
package com.example.ecommerce.controllers;

import com.example.ecommerce.models.User;
import com.example.ecommerce.payload.request.LoginRequest;
import com.example.ecommerce.payload.request.RegisterRequest;
import com.example.ecommerce.payload.response.LoginResponse;
import com.example.ecommerce.payload.response.RegisterResponse;
import com.example.ecommerce.repositories.UserRepository;
import com.example.ecommerce.security.jwt.JwtUtils;
import com.example.ecommerce.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            // Log the email being used for authentication
            System.out.println("Attempting to authenticate user: " + loginRequest.getEmail());

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            User user = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            return ResponseEntity.ok(new LoginResponse(
                    jwt,
                    userDetails.getUsername(),
                    user.getRole(),
                    user.getStatus()));
        } catch (Exception e) {
            // Log the specific exception for debugging
            System.err.println("Authentication failed: " + e.getClass().getName() + ": " + e.getMessage());
            e.printStackTrace();

            return ResponseEntity.badRequest().body(new LoginResponse(
                    null,
                    null,
                    null,
                    "Invalid email or password"));
        }
    }
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new RegisterResponse("Error: Email is already in use!", null));
        }

        // Create new user account
        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(encoder.encode(registerRequest.getPassword()));
        user.setRole(registerRequest.getRole());
        user.setStatus(User.Status.ACTIVE);

        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(new RegisterResponse("User registered successfully", savedUser.getId()));
    }
}