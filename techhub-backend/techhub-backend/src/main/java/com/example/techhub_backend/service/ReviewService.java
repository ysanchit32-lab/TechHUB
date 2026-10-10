package com.example.techhub_backend.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.techhub_backend.dto.ReviewRequest;
import com.example.techhub_backend.model.Order;
import com.example.techhub_backend.model.OrderItem;
import com.example.techhub_backend.model.OrderStatus;
import com.example.techhub_backend.model.Review;
import com.example.techhub_backend.model.User;
import com.example.techhub_backend.repository.OrderRepository;
import com.example.techhub_backend.repository.ProductRepository;
import com.example.techhub_backend.repository.ReviewRepository;
import com.example.techhub_backend.repository.UserRepository;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public ReviewService(
            ReviewRepository reviewRepository,
            OrderRepository orderRepository,
            UserRepository userRepository,
            ProductRepository productRepository
    ) {
        this.reviewRepository = reviewRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    // Public list of reviews. The reviewer's email is never included.
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getReviews(int productId) {

        List<Map<String, Object>> result = new ArrayList<>();

        for (Review review :
                reviewRepository.findByProductIdOrderByCreatedAtDesc(productId)) {
            result.add(toMap(review));
        }

        return result;
    }

    // A customer may review a product only after ordering it
    // (cancelled orders do not count).
    @Transactional(readOnly = true)
    public boolean hasPurchased(String email, int productId) {

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return false;
        }

        for (Order order :
                orderRepository.findByUserOrderByOrderDateDesc(user)) {

            if (order.getStatus() == OrderStatus.CANCELLED) {
                continue;
            }

            for (OrderItem item : order.getItems()) {
                if (item.getProductId() != null
                        && item.getProductId() == productId) {
                    return true;
                }
            }
        }

        return false;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getMyReview(String email, int productId) {

        return reviewRepository
                .findByProductIdAndUserEmail(productId, email)
                .map(this::toMap)
                .orElse(null);
    }

    @Transactional
    public Map<String, Object> submitReview(
            String email,
            ReviewRequest request
    ) {

        if (request.getProductId() == null) {
            throw new RuntimeException("Product id is required");
        }

        int productId = request.getProductId();

        productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        String comment = request.getComment() == null
                ? ""
                : request.getComment().trim();

        if (comment.length() > 1000) {
            throw new RuntimeException(
                    "Review must be 1000 characters or less"
            );
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!hasPurchased(email, productId)) {
            throw new RuntimeException(
                    "Only customers who bought this product can review it"
            );
        }

        // One review per customer per product: submitting again updates it
        Review review = reviewRepository
                .findByProductIdAndUserEmail(productId, email)
                .orElseGet(Review::new);

        review.setProductId(productId);
        review.setUserEmail(email);
        review.setUserName(user.getName());
        review.setRating(request.getRating());
        review.setComment(comment);
        review.setCreatedAt(LocalDateTime.now());

        return toMap(reviewRepository.save(review));
    }

    private Map<String, Object> toMap(Review review) {

        Map<String, Object> map = new LinkedHashMap<>();

        map.put("id", review.getId());
        map.put("name", review.getUserName());
        map.put("rating", review.getRating());
        map.put("comment", review.getComment());
        map.put("createdAt", review.getCreatedAt());

        return map;
    }
}
