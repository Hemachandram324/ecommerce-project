package com.example.ecommerce.repositories;

import com.example.ecommerce.models.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CartRepository extends JpaRepository<Cart, Long> {

    /* Return list, because duplicates may exist */
    List<Cart> findAllByUser_Id(Long userId);
}
