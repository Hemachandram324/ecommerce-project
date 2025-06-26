package com.example.ecommerce.repositories;

import com.example.ecommerce.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findAllByNameContainingIgnoreCase(String name);
    List<Product> findAllByCategory_Name(String categoryName);
    Optional<Product> findByName(String name);
    Optional<Product> findById(Long id);

    
    
}