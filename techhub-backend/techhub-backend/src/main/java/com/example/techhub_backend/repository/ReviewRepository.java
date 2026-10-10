package com.example.techhub_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.techhub_backend.model.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByProductIdOrderByCreatedAtDesc(int productId);

    Optional<Review> findByProductIdAndUserEmail(
            int productId,
            String userEmail
    );
}
