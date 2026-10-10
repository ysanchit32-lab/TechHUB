package com.example.techhub_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.techhub_backend.model.Transaction;
import com.example.techhub_backend.repository.TransactionRepository;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public TransactionService(
            TransactionRepository transactionRepository) {

        this.transactionRepository = transactionRepository;
    }

    // Get all transactions
    public List<Transaction> getAllTransactions() {

        return transactionRepository
                .findAllByOrderByDateTimeDesc();
    }

    // Get transactions for a product
    public List<Transaction> getProductTransactions(int productId) {

        return transactionRepository
                .findByProductIdOrderByDateTimeDesc(productId);
    }
}