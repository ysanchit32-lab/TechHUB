package com.example.techhub_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.techhub_backend.model.Order;
import com.example.techhub_backend.model.OrderStatus;
import com.example.techhub_backend.model.User;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserOrderByOrderDateDesc(User user);

    // Used to allow a one-time coupon only once per customer
    // (cancelled orders do not count as a use).
    boolean existsByUserAndCouponCodeAndStatusNot(
            User user,
            String couponCode,
            OrderStatus status
    );
}
