package com.example.techhub_backend.model;

public class DashboardStats {

    private long totalProducts;
    private int totalStock;
    private long lowStockProducts;

    public DashboardStats() {
    }

    public DashboardStats(
            long totalProducts,
            int totalStock,
            long lowStockProducts) {

        this.totalProducts = totalProducts;
        this.totalStock = totalStock;
        this.lowStockProducts = lowStockProducts;
    }

    public long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public int getTotalStock() {
        return totalStock;
    }

    public void setTotalStock(int totalStock) {
        this.totalStock = totalStock;
    }

    public long getLowStockProducts() {
        return lowStockProducts;
    }

    public void setLowStockProducts(long lowStockProducts) {
        this.lowStockProducts = lowStockProducts;
    }
}