package com.example.ecommerce.controllers;

import com.example.ecommerce.models.*;
import com.example.ecommerce.security.services.CategoryService;
import com.example.ecommerce.security.services.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final CategoryService categoryService;

    // ADD PRODUCT
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(value = "/addproduct", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ProductDto add(@RequestParam("name") String name,
                          @RequestParam(value = "description", required = false) String description,
                          @RequestParam("brand") String brand,
                          @RequestParam("price") BigDecimal price,
                          @RequestParam("category") String categoryName,
                          @RequestPart("image") MultipartFile image) {

        Category category = categoryService.getByName(categoryName);
        Product product = Product.builder()
                .name(name)
                .description(description)
                .brand(brand)
                .price(price)
                .category(category)
                .build();

        return toDto(productService.addProduct(product, image));
    }

    // LIST ALL
    @GetMapping("/getproducts")
    public List<ProductDto> all() {
        return productService.getAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    // GET BY ID
    @GetMapping("/get/{id}")
    public ProductDto byId(@PathVariable Long id) {
        return toDto(productService.getById(id));
    }

    // GET BY NAME
    @GetMapping("/getwithname")
    public List<ProductDto> byName(@RequestParam String name) {
        return productService.getByName(name).stream().map(this::toDto).collect(Collectors.toList());
    }

    // GET BY CATEGORY NAME
    @GetMapping("/category/byname")
    public List<ProductDto> byCategory(@RequestParam String name) {
        return productService.getByCategoryName(name).stream().map(this::toDto).collect(Collectors.toList());
    }

    // UPDATE PRODUCT
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping(value = "/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ProductDto updateByName(@RequestParam("name") String currentName,
                                   @RequestParam("newName") String newName,
                                   @RequestParam(value = "description", required = false) String description,
                                   @RequestParam("brand") String brand,
                                   @RequestParam("price") BigDecimal price,
                                   @RequestParam("category") String categoryName,
                                   @RequestPart(value = "image", required = false) MultipartFile image) {

        Category category = categoryService.getByName(categoryName);
        Product changes = new Product();
        changes.setName(newName);
        changes.setDescription(description);
        changes.setBrand(brand);
        changes.setPrice(price);
        changes.setCategory(category);

        return toDto(productService.updateByName(currentName, changes, image));
    }

   // DELETE by name
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteByName(@RequestParam("name") String name) {
        productService.deleteByName(name);
        return ResponseEntity.ok("Deleted record with name " + name);
    }

    // PATCH IMAGE
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping(value = "/update/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ProductDto updateImageByName(@RequestParam("name") String name, 
                                        @RequestPart("image") MultipartFile image) {
        return toDto(productService.updateImageByName(name, image));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/update/price")
    public ProductDto updatePriceByName(@RequestParam("name") String name, @RequestParam BigDecimal price) {
        return toDto(productService.updateFieldByName(name, "price", price));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/update/brand")
    public ProductDto updateBrandByName(@RequestParam("name") String name, @RequestParam String brand) {
        return toDto(productService.updateFieldByName(name, "brand", brand));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/update/description")
    public ProductDto updateDescriptionByName(@RequestParam("name") String name, @RequestParam String description) {
        return toDto(productService.updateFieldByName(name, "description", description));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/update/name")
    public ProductDto updateNameByName(@RequestParam("name") String currentName, @RequestParam("newName") String newName) {
        return toDto(productService.updateFieldByName(currentName, "name", newName));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/update/category")
    public ProductDto updateCategoryByName(@RequestParam("name") String name, @RequestParam String category) {
        Category cat = categoryService.getByName(category);
        return toDto(productService.updateFieldByName(name, "category", cat));
    }

    // IMAGE RESOURCE
    @GetMapping("/image/{filename:.+}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        try {
            Path imagePath = Path.of("uploads").resolve(filename).normalize();
            if (!Files.exists(imagePath)) {
                return ResponseEntity.notFound().build();
            }

            byte[] imageBytes = Files.readAllBytes(imagePath);
            String contentType = Files.probeContentType(imagePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(imageBytes);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // DTO MAPPER
    private ProductDto toDto(Product p) {
        String imageUrl = p.getImageFilename() == null ? null :
            ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/v1/products/image/")
                .path(p.getImageFilename())
                .toUriString();

        return new ProductDto(
            p.getId(),
            p.getName(),
            p.getDescription(),
            p.getPrice(),
            p.getBrand(),
            p.getCategory().getName(),
            imageUrl
        );
    }

    record ProductDto(Long id, String name, String description, BigDecimal price, String brand, String category, String imageUrl) {}
}