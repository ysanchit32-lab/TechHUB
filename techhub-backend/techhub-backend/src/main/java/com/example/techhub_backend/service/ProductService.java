package com.example.techhub_backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.techhub_backend.dto.ProductRequest;
import com.example.techhub_backend.model.Product;
import com.example.techhub_backend.model.Transaction;
import com.example.techhub_backend.repository.ProductRepository;
import com.example.techhub_backend.repository.TransactionRepository;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final TransactionRepository transactionRepository;

    public ProductService(
            ProductRepository productRepository,
            TransactionRepository transactionRepository) {

        this.productRepository = productRepository;
        this.transactionRepository = transactionRepository;
    }

    @Transactional(readOnly = true)
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Product getProductById(int id) {
        return productRepository.findById(id).orElse(null);
    }

    @Transactional(readOnly = true)
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    @Transactional
    public Product addProduct(ProductRequest request) {

        Product product = new Product(
                request.getName(),
                request.getPrice(),
                request.getStock(),
                request.getCategory(),
                request.getImage()
        );

        product.setBrand(request.getBrand());
        product.setDescription(request.getDescription());
        product.setSpecs(request.getSpecs());

        return productRepository.save(product);
    }

    // The product row is locked while it is edited, so a customer order
    // placed at the same moment cannot overwrite (or be overwritten by)
    // this change.
    @Transactional
    public Product updateProduct(
            int id,
            ProductRequest request) {

        Product product =
                productRepository.findByIdForUpdate(id).orElse(null);

        if (product == null) {
            return null;
        }

        product.setName(request.getName());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setCategory(request.getCategory());

        // Only overwrite these when they are sent, so a request that
        // leaves them out does not erase them by accident.
        // (Send an empty string to clear one on purpose.)
        if (request.getImage() != null) {
            product.setImage(request.getImage());
        }

        if (request.getBrand() != null) {
            product.setBrand(request.getBrand());
        }

        if (request.getDescription() != null) {
            product.setDescription(request.getDescription());
        }

        if (request.getSpecs() != null) {
            product.setSpecs(request.getSpecs());
        }

        return productRepository.save(product);
    }

    @Transactional
    public boolean deleteProduct(int id) {

        if (!productRepository.existsById(id)) {
            return false;
        }

        productRepository.deleteById(id);

        return true;
    }

    @Transactional
    public Product stockIn(
            int id,
            int quantity) {

        if (quantity <= 0) {
            return null;
        }

        Product product =
                productRepository.findByIdForUpdate(id).orElse(null);

        if (product == null) {
            return null;
        }

        product.setStock(
                product.getStock() + quantity
        );

        Product savedProduct =
                productRepository.save(product);

        Transaction transaction = new Transaction(
                product.getId(),
                product.getName(),
                "STOCK_IN",
                quantity,
                LocalDateTime.now()
        );

        transactionRepository.save(transaction);

        return savedProduct;
    }

    @Transactional
    public Product stockOut(
            int id,
            int quantity) {

        if (quantity <= 0) {
            return null;
        }

        Product product =
                productRepository.findByIdForUpdate(id).orElse(null);

        if (product == null) {
            return null;
        }

        if (quantity > product.getStock()) {
            return null;
        }

        product.setStock(
                product.getStock() - quantity
        );

        Product savedProduct =
                productRepository.save(product);

        Transaction transaction = new Transaction(
                product.getId(),
                product.getName(),
                "STOCK_OUT",
                quantity,
                LocalDateTime.now()
        );

        transactionRepository.save(transaction);

        return savedProduct;
    }
}
