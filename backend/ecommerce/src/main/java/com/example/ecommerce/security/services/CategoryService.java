package com.example.ecommerce.security.services;

import com.example.ecommerce.models.Category;
import java.util.List;

public interface CategoryService {
    Category getByName(String name);
    Category getById(Long id);
    List<Category> getAll();
    Category create(String name);
    Category updateByName(String name, String newName);
    void deleteByName(String name);
}