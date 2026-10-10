package com.example.techhub_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.techhub_backend.model.Transaction;

public interface TransactionRepository
        extends JpaRepository<Transaction, Integer> {

    List<Transaction> findAllByOrderByDateTimeDesc();

    List<Transaction> findByProductIdOrderByDateTimeDesc(int productId);
}