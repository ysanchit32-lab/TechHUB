package com.example.techhub_backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.techhub_backend.dto.ProductRequest;
import com.example.techhub_backend.dto.StockRequest;
import com.example.techhub_backend.model.Product;
import com.example.techhub_backend.service.ProductService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // GET all products
    @GetMapping
    public List<Product> getAllProducts() {

        return productService.getAllProducts();
    }

    // GET product by ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(
            @PathVariable int id) {

        Product product = productService.getProductById(id);

        if (product == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(product);
    }

    // GET products by category
    @GetMapping("/category/{category}")
    public List<Product> getProductsByCategory(
            @PathVariable String category) {

        return productService.getProductsByCategory(category);
    }

    // POST - Add product
    @PostMapping
    public ResponseEntity<Product> addProduct(
            @Valid @RequestBody ProductRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(productService.addProduct(request));
    }

    // PUT - Update product
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable int id,
            @Valid @RequestBody ProductRequest request) {

        Product product =
                productService.updateProduct(id, request);

        if (product == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(product);
    }

    // Stock In
    @PutMapping("/{id}/stock-in")
    public ResponseEntity<Product> stockIn(
            @PathVariable int id,
            @Valid @RequestBody StockRequest request) {

        Product product =
                productService.stockIn(
                        id,
                        request.getQuantity()
                );

        if (product == null) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(product);
    }

    // Stock Out
    @PutMapping("/{id}/stock-out")
    public ResponseEntity<Product> stockOut(
            @PathVariable int id,
            @Valid @RequestBody StockRequest request) {

        Product product =
                productService.stockOut(
                        id,
                        request.getQuantity()
                );

        if (product == null) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(product);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(
            @PathVariable int id) {

        boolean deleted =
                productService.deleteProduct(id);

        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(
                "Product deleted successfully"
        );
    }
}