package com.example.techhub_backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.techhub_backend.model.Transaction;
import com.example.techhub_backend.service.TransactionService;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:5173")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(
            TransactionService transactionService) {

        this.transactionService = transactionService;
    }

    // GET all transactions
    @GetMapping
    public List<Transaction> getAllTransactions() {

        return transactionService.getAllTransactions();
    }

    // GET transactions for a product
    @GetMapping("/product/{productId}")
    public List<Transaction> getProductTransactions(
            @PathVariable int productId) {

        return transactionService
                .getProductTransactions(productId);
    }
}