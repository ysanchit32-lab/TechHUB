package com.example.techhub_backend.controller;

import com.example.techhub_backend.dto.OrderRequest;
import com.example.techhub_backend.model.Order;
import com.example.techhub_backend.model.OrderStatus;
import com.example.techhub_backend.service.OrderService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // CUSTOMER - Place order
    @PostMapping
    public ResponseEntity<?> createOrder(
            @RequestBody OrderRequest request,
            Authentication authentication
    ) {

        try {

            String email = authentication.getName();

            Order order = orderService.createOrder(email, request);

            return ResponseEntity.ok(order);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(
                    java.util.Map.of(
                            "error", e.getMessage()
                    )
            );
        }
    }

    // CUSTOMER - My orders
    @GetMapping("/my-orders")
    public ResponseEntity<?> getMyOrders(
            Authentication authentication
    ) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                orderService.getMyOrders(email)
        );
    }

    // EMPLOYEE - All orders
    @GetMapping
    public ResponseEntity<?> getAllOrders(
            Authentication authentication
    ) {

        if (!isEmployee(authentication)) {
            return ResponseEntity.status(403).body(
                    java.util.Map.of(
                            "error",
                            "Access denied. Employee access required."
                    )
            );
        }

        return ResponseEntity.ok(
                orderService.getAllOrders()
        );
    }

    // CUSTOMER - Check a coupon code
    @GetMapping("/coupon")
    public ResponseEntity<?> previewCoupon(
            @RequestParam String code,
            @RequestParam double subtotal,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                orderService.previewCoupon(
                        authentication.getName(),
                        code,
                        subtotal
                )
        );
    }

    // Get single order
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrder(
            @PathVariable Long id,
            Authentication authentication
    ) {

        Order order;

        try {

            order = orderService.getOrderById(id);

        } catch (RuntimeException e) {

            return ResponseEntity.notFound().build();
        }

        if (isEmployee(authentication)) {
            return ResponseEntity.ok(order);
        }

        String email = authentication.getName();

        if (!order.getUser().getEmail().equalsIgnoreCase(email)) {

            return ResponseEntity.status(403).body(
                    java.util.Map.of(
                            "error",
                            "You are not allowed to view this order."
                    )
            );
        }

        return ResponseEntity.ok(order);
    }

    // EMPLOYEE - Update order status
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status,
            Authentication authentication
    ) {

        if (!isEmployee(authentication)) {

            return ResponseEntity.status(403).body(
                    java.util.Map.of(
                            "error",
                            "Access denied. Employee access required."
                    )
            );
        }

        try {

            return ResponseEntity.ok(
                    orderService.updateStatus(id, status)
            );

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(
                    java.util.Map.of(
                            "error",
                            e.getMessage()
                    )
            );
        }
    }

    // CUSTOMER - Cancel own pending order
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelMyOrder(
            @PathVariable Long id,
            Authentication authentication
    ) {

        try {

            return ResponseEntity.ok(
                    orderService.cancelMyOrder(
                            authentication.getName(),
                            id
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(
                    java.util.Map.of(
                            "error",
                            e.getMessage()
                    )
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