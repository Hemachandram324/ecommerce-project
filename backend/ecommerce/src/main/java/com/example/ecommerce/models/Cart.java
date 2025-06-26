package com.example.ecommerce.models;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Cart {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* ⬇️  replace the primitive column with a relation */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<CartItem> items = new ArrayList<>();

    @Builder.Default
    private BigDecimal total = BigDecimal.ZERO;

    public void recalculateTotal() {
        this.total = items.stream()
                          .map(CartItem::getSubtotal)
                          .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}

