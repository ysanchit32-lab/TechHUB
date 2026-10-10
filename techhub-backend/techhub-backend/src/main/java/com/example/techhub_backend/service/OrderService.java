package com.example.techhub_backend.service;

import com.example.techhub_backend.dto.OrderRequest;
import com.example.techhub_backend.model.Order;
import com.example.techhub_backend.model.OrderItem;
import com.example.techhub_backend.model.OrderStatus;
import com.example.techhub_backend.model.Product;
import com.example.techhub_backend.model.Transaction;
import com.example.techhub_backend.model.User;
import com.example.techhub_backend.repository.OrderRepository;
import com.example.techhub_backend.repository.ProductRepository;
import com.example.techhub_backend.repository.TransactionRepository;
import com.example.techhub_backend.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    public OrderService(
            OrderRepository orderRepository,
            ProductRepository productRepository,
            UserRepository userRepository,
            TransactionRepository transactionRepository
    ) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
    }

    @Transactional
    public Order createOrder(String email, OrderRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("Order must contain at least one product");
        }

        if (request.getShippingAddress() == null ||
                request.getShippingAddress().trim().isEmpty()) {
            throw new RuntimeException("Shipping address is required");
        }

        Order order = new Order();

        order.setUser(user);
        order.setStatus(OrderStatus.PENDING);
        order.setOrderDate(LocalDateTime.now());
        order.setShippingAddress(request.getShippingAddress());

        // DEMO payment: the server decides the status from the method.
        String paymentMethod = normalizePaymentMethod(request.getPaymentMethod());

        order.setPaymentMethod(paymentMethod);
        order.setPaymentStatus(
                paymentMethod.equals("Cash on Delivery")
                        ? "PAY ON DELIVERY"
                        : "PAID"
        );

        // Always lock products in the same order (by id) so two orders
        // with the same products can never block each other forever.
        List<OrderRequest.ItemRequest> items =
                new ArrayList<>(request.getItems());

        for (OrderRequest.ItemRequest itemRequest : items) {
            if (itemRequest.getProductId() == null) {
                throw new RuntimeException("Product id is required");
            }
        }

        items.sort(
                Comparator.comparing(OrderRequest.ItemRequest::getProductId)
        );

        double total = 0;

        for (OrderRequest.ItemRequest itemRequest : items) {

            if (itemRequest.getQuantity() <= 0) {
                throw new RuntimeException("Quantity must be greater than zero");
            }

            // Locked read: other orders wait here until this one finishes.
            Product product = productRepository
                    .findByIdForUpdate(itemRequest.getProductId())
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Product not found: " + itemRequest.getProductId()
                            )
                    );

            if (product.getStock() < itemRequest.getQuantity()) {
                throw new RuntimeException(
                        "Not enough stock for product: " + product.getName()
                );
            }

            OrderItem orderItem = new OrderItem();

            orderItem.setProductId(product.getId());
            orderItem.setProductName(product.getName());
            orderItem.setPrice(product.getPrice());
            orderItem.setQuantity(itemRequest.getQuantity());

            order.addItem(orderItem);

            total += product.getPrice() * itemRequest.getQuantity();

            product.setStock(
                    product.getStock() - itemRequest.getQuantity()
            );

            productRepository.save(product);

            // Online sales show up in the employee transaction log too
            transactionRepository.save(
                    new Transaction(
                            product.getId(),
                            product.getName(),
                            "STOCK_OUT",
                            itemRequest.getQuantity(),
                            LocalDateTime.now()
                    )
            );
        }

        // Optional coupon code
        String couponCode = request.getCouponCode() == null
                ? ""
                : request.getCouponCode().trim().toUpperCase();

        double discount = 0;

        if (!couponCode.isEmpty()) {
            discount = couponDiscount(user, couponCode, total);
            order.setCouponCode(couponCode);
        }

        order.setDiscountAmount(discount);
        order.setTotalAmount(total - discount);

        return orderRepository.save(order);
    }

    public List<Order> getMyOrders(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return orderRepository.findByUserOrderByOrderDateDesc(user);
    }

    public Order getOrderById(Long id) {

        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Transactional
    public Order updateStatus(Long id, OrderStatus newStatus) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        OrderStatus currentStatus = order.getStatus();

        if (!isAllowedChange(currentStatus, newStatus)) {
            throw new RuntimeException(
                    "Cannot change order status from "
                            + currentStatus + " to " + newStatus
            );
        }

        // Cancelling an order puts the products back in stock.
        if (newStatus == OrderStatus.CANCELLED) {
            restoreStock(order);

            // Demo refund for orders that were paid online.
            if ("PAID".equals(order.getPaymentStatus())) {
                order.setPaymentStatus("REFUNDED");
            }
        }

        order.setStatus(newStatus);

        return orderRepository.save(order);
    }

    // CUSTOMER - cancel own order (only while it is still PENDING)
    @Transactional
    public Order cancelMyOrder(String email, Long id) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getUser() == null ||
                !order.getUser().getEmail().equalsIgnoreCase(email)) {
            throw new RuntimeException(
                    "You are not allowed to cancel this order"
            );
        }

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new RuntimeException(
                    "Only pending orders can be cancelled"
            );
        }

        return updateStatus(id, OrderStatus.CANCELLED);
    }

    // PENDING   -> CONFIRMED or CANCELLED
    // CONFIRMED -> SHIPPED   or CANCELLED
    // SHIPPED   -> DELIVERED
    // DELIVERED and CANCELLED are final.
    private boolean isAllowedChange(OrderStatus from, OrderStatus to) {

        if (from == null || to == null) {
            return false;
        }

        if (from == OrderStatus.PENDING) {
            return to == OrderStatus.CONFIRMED
                    || to == OrderStatus.CANCELLED;
        }

        if (from == OrderStatus.CONFIRMED) {
            return to == OrderStatus.SHIPPED
                    || to == OrderStatus.CANCELLED;
        }

        if (from == OrderStatus.SHIPPED) {
            return to == OrderStatus.DELIVERED;
        }

        // DELIVERED and CANCELLED are final
        return false;
    }

    // Used by the checkout page to preview a coupon
    public Map<String, Object> previewCoupon(
            String email,
            String code,
            double subtotal) {

        Map<String, Object> result = new HashMap<>();

        User user = userRepository.findByEmail(email).orElse(null);

        try {
            double discount = couponDiscount(
                    user,
                    code == null ? "" : code.trim().toUpperCase(),
                    subtotal
            );

            result.put("valid", true);
            result.put("discount", discount);
            result.put("message", "Coupon applied");

        } catch (RuntimeException e) {

            result.put("valid", false);
            result.put("discount", 0);
            result.put("message", e.getMessage());
        }

        return result;
    }

    // Returns the discount amount, or throws if the coupon is not valid.
    private double couponDiscount(User user, String code, double subtotal) {

        double discount;

        if (code.equals("TECH10")) {
            discount = Math.min(subtotal * 0.10, 5000);

        } else if (code.equals("FESTIVE5")) {
            discount = Math.min(subtotal * 0.05, 3000);

        } else if (code.equals("WELCOME500")) {

            if (subtotal < 10000) {
                throw new RuntimeException(
                        "WELCOME500 needs an order of at least Rs. 10,000"
                );
            }

            // One use per customer account (cancelled orders do not count)
            if (user != null
                    && orderRepository.existsByUserAndCouponCodeAndStatusNot(
                            user,
                            "WELCOME500",
                            OrderStatus.CANCELLED)) {

                throw new RuntimeException(
                        "WELCOME500 can only be used once per account"
                );
            }

            discount = 500;

        } else {
            throw new RuntimeException("Invalid coupon code");
        }

        return Math.round(discount * 100.0) / 100.0;
    }

    private String normalizePaymentMethod(String method) {

        if ("UPI".equals(method) || "Credit / Debit Card".equals(method)) {
            return method;
        }

        return "Cash on Delivery";
    }

    private void restoreStock(Order order) {

        List<OrderItem> items = new ArrayList<>(order.getItems());

        items.sort(Comparator.comparing(OrderItem::getProductId));

        for (OrderItem item : items) {

            // If the product was deleted since the order, skip it.
            productRepository.findByIdForUpdate(item.getProductId())
                    .ifPresent(product -> {
                        product.setStock(
                                product.getStock() + item.getQuantity()
                        );
                        productRepository.save(product);

                        transactionRepository.save(
                                new Transaction(
                                        product.getId(),
                                        product.getName(),
                                        "STOCK_IN",
                                        item.getQuantity(),
                                        LocalDateTime.now()
                                )
                        );
                    });
        }
    }
}
