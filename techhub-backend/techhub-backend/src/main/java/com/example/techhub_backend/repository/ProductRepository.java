package com.example.techhub_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.techhub_backend.model.Product;

import jakarta.persistence.LockModeType;

public interface ProductRepository
        extends JpaRepository<Product, Integer> {

    List<Product> findByCategory(String category);

    // Locks the product row until the current transaction finishes,
    // so two orders cannot change the same stock at the same time.
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Product p WHERE p.id = :id")
    Optional<Product> findByIdForUpdate(@Param("id") int id);
}
