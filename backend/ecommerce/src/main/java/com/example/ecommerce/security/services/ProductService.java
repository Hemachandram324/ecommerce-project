package com.example.ecommerce.security.services;

import com.example.ecommerce.models.Product;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface ProductService {
    Product addProduct(Product product, MultipartFile image);
    List<Product> getAll();
    Product getById(Long id);
    List<Product> getByName(String name);
    List<Product> getByCategoryName(String categoryName);
    void deleteByName(String name);
    Product updateByName(String name, Product changes, MultipartFile image);
    Product updateFieldByName(String name, String fieldName, Object value);
    Product getByExactName(String name);
    Product updateImageByName(String name, MultipartFile image);
}