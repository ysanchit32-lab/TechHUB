package com.example.techhub_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.techhub_backend.model.DashboardStats;
import com.example.techhub_backend.model.Product;
import com.example.techhub_backend.repository.ProductRepository;

@Service
public class DashboardService {

    private final ProductRepository productRepository;

    public DashboardService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public DashboardStats getDashboardStats() {

        List<Product> products = productRepository.findAll();

        long totalProducts = products.size();

        int totalStock = 0;

        long lowStockProducts = 0;

        for (Product product : products) {

            totalStock += product.getStock();

            if (product.getStock() < 5) {
                lowStockProducts++;
            }
        }

        return new DashboardStats(
                totalProducts,
                totalStock,
                lowStockProducts
        );
    }
}