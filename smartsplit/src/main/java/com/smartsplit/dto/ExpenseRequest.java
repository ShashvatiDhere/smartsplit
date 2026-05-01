package com.smartsplit.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.Map;

@Data
public class ExpenseRequest {

    private String title;
    private Double amount;
    private String category;
    private LocalDate expenseDate;

    private Long groupId;
    private Long paidByUserId;

    // userId -> shareAmount
    private Map<Long, Double> splits;
}