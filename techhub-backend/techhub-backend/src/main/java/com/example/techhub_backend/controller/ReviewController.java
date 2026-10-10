package com.example.techhub_backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.techhub_backend.dto.ReviewRequest;
import com.example.techhub_backend.service.ReviewService;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // PUBLIC - everyone can read the reviews of a product
    @GetMapping("/api/products/{productId}/reviews")
    public List<Map<String, Object>> getReviews(
            @PathVariable int productId
    ) {
        return reviewService.getReviews(productId);
    }

    // CUSTOMER - can this person review this product?
    @GetMapping("/api/reviews/can-review/{productId}")
    public ResponseEntity<?> canReview(
            @PathVariable int productId,
            Authentication authentication
    ) {

        Map<String, Object> result = new HashMap<>();

        boolean allowed =
                !isEmployee(authentication)
                        && reviewService.hasPurchased(
                                authentication.getName(),
                                productId
                        );

        result.put("canReview", allowed);
        result.put(
                "myReview",
                reviewService.getMyReview(
                        authentication.getName(),
                        productId
                )
        );

        return ResponseEntity.ok(result);
    }

    // CUSTOMER - add or update own review
    @PostMapping("/api/reviews")
    public ResponseEntity<?> submitReview(
            @RequestBody ReviewRequest request,
            Authentication authentication
    ) {

        if (isEmployee(authentication)) {
            return ResponseEntity.status(403).body(
                    Map.of("error", "Employees cannot write reviews.")
            );
        }

        try {

            return ResponseEntity.ok(
                    reviewService.submitReview(
                            authentication.getName(),
                            request
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(
                    Map.of("error", e.getMessage())
            );
        }
    }

    private boolean isEmployee(Authentication authentication) {

        return authentication.getAuthorities()
                .stream()
                .anyMatch(
                        authority ->
                                authority.getAuthority()
                                        .equals("ROLE_EMPLOYEE")
                );
    }
}