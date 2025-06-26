package com.example.ecommerce.security.services;

import com.example.ecommerce.models.Product;
import com.example.ecommerce.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository repo;
    private final String IMAGE_DIR = "uploads";

    @Override
    public Product addProduct(Product product, MultipartFile image) {
        handleImageUpload(product, image);
        return repo.save(product);
    }

    @Override
    public List<Product> getAll() {
        return repo.findAll();
    }

    @Override
    public Product getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));
    }

    @Override
    public List<Product> getByName(String name) {
        return repo.findAllByNameContainingIgnoreCase(name);
    }

    @Override
    public List<Product> getByCategoryName(String categoryName) {
        return repo.findAllByCategory_Name(categoryName);
    }

    @Override
    public Product updateByName(String name, Product changes, MultipartFile image) {
        Product existing = getByExactName(name);
        if (changes.getName() != null) existing.setName(changes.getName());
        if (changes.getDescription() != null) existing.setDescription(changes.getDescription());
        if (changes.getBrand() != null) existing.setBrand(changes.getBrand());
        if (changes.getPrice() != null) existing.setPrice(changes.getPrice());
        if (changes.getCategory() != null) existing.setCategory(changes.getCategory());
        if (image != null && !image.isEmpty()) handleImageUpload(existing, image);
        return repo.save(existing);
    }
    
    @Override
    public Product updateImageByName(String name, MultipartFile image) {
        Product p = getByExactName(name);
        handleImageUpload(p, image);
        return repo.save(p);
    }

    @Override
    public Product updateFieldByName(String name, String fieldName, Object value) {
        Product p = getByExactName(name);
        switch (fieldName) {
            case "name" -> p.setName((String) value);
            case "description" -> p.setDescription((String) value);
            case "price" -> p.setPrice((java.math.BigDecimal) value);
            case "brand" -> p.setBrand((String) value);
            case "category" -> p.setCategory((com.example.ecommerce.models.Category) value);
            default -> throw new IllegalArgumentException("Unsupported field: " + fieldName);
        }
        return repo.save(p);
    }
    
    @Override
    public void deleteByName(String name) {
        Product p = getByExactName(name);
        repo.delete(p);
    }
    @Override
    public Product getByExactName(String name) {
        return repo.findByName(name)
            .orElseThrow(() -> new RuntimeException("Product not found with name: " + name));
    }

    // helper
    private void handleImageUpload(Product product, MultipartFile image) {
        if (image == null || image.isEmpty()) return;
        try {
            Files.createDirectories(Path.of(IMAGE_DIR));
            String filename = System.currentTimeMillis() + "_" + image.getOriginalFilename();
            Path target = Path.of(IMAGE_DIR).resolve(filename);
            Files.write(target, image.getBytes());
            product.setImageFilename(filename);
        } catch (IOException e) {
            throw new RuntimeException("Image upload failed", e);
        }
    }
}
