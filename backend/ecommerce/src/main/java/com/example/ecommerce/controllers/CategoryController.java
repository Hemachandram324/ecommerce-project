package com.example.ecommerce.controllers;

import com.example.ecommerce.models.Category;
import com.example.ecommerce.security.services.CategoryService;
import com.example.ecommerce.security.services.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;
    private final ProductService productService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getCategory")
    public List<ProductDto> list(@RequestParam String name) {
        return productService.getByCategoryName(name).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/addCategory")
    public Category create(@RequestParam String name) {
        return categoryService.create(name);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/updateByName")
    public Category updateByName(@RequestParam String name, @RequestParam String newName) {
        return categoryService.updateByName(name, newName);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/deleteByName")
    public ResponseEntity<String> deleteByName(@RequestParam String name) {
        categoryService.deleteByName(name);
        return ResponseEntity.ok("Category deleted");
    }

//    @PreAuthorize("hasRole('ADMIN')")
//    @GetMapping("/products")
//    public List<ProductDto> productsByCategory(@RequestParam String name) {
//        return productService.getByCategoryName(name).stream()
//                .map(p -> new ProductDto(p.getId(), p.getName(), p.getDescription(), p.getPrice(), p.getBrand(), p.getImageFilename()))
//                .collect(Collectors.toList());
//    }
//    record ProductDto(Long id, String name, String description, java.math.BigDecimal price, String brand, String imageFilename) {}
    private ProductDto toDto(com.example.ecommerce.models.Product p) {
        String imageUrl = (p.getImageFilename() != null)
                ? ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/images/")
                    .path(p.getImageFilename())
                    .toUriString()
                : null;

        return new ProductDto(
                p.getId(),
                p.getName(),
                p.getDescription(),
                p.getBrand(),
                p.getPrice(),
                imageUrl
        );
    }

    record ProductDto(
            Long id,
            String name,
            String description,
            String brand,
            BigDecimal price,
            String imageUrl
    ) {}
}