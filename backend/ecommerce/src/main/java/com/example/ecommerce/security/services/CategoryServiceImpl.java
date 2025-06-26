package com.example.ecommerce.security.services;

import com.example.ecommerce.models.Category;
import com.example.ecommerce.repositories.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository repo;

    @Override
    public Category getByName(String name) {
        return repo.findByName(name)
                .orElseThrow(() -> new RuntimeException("Category not found: " + name));
    }

    @Override
    public Category getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + id));
    }

    @Override
    public List<Category> getAll() {
        return repo.findAll();
    }

    @Override
    public Category create(String name) {
        return repo.save(Category.builder().name(name).build());
    }

    @Override
    public Category updateByName(String name, String newName) {
        Category category = getByName(name);
        category.setName(newName);
        return repo.save(category);
    }

    @Override
    public void deleteByName(String name) {
        Category category = getByName(name);
        repo.delete(category);
    }
}