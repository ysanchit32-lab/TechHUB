package com.example.techhub_backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ProductRequest {

    @NotBlank(message = "Product name cannot be empty")
    @Size(max = 255, message = "Product name must be 255 characters or less")
    private String name;

    @Min(value = 0, message = "Price cannot be negative")
    private double price;

    @Min(value = 0, message = "Stock cannot be negative")
    private int stock;

    @NotBlank(message = "Category cannot be empty")
    @Size(max = 255, message = "Category must be 255 characters or less")
    private String category;

    @Size(max = 1000, message = "Image link must be 1000 characters or less")
    private String image;

    @Size(max = 100, message = "Brand must be 100 characters or less")
    private String brand;

    @Size(max = 1000, message = "Description must be 1000 characters or less")
    private String description;

    @Size(max = 2000, message = "Specs must be 2000 characters or less")
    private String specs;

    public ProductRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSpecs() {
        return specs;
    }

    public void setSpecs(String specs) {
        this.specs = specs;
    }
}
