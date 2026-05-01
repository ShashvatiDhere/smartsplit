package com.smartsplit.controller;

import com.smartsplit.dto.ExpenseRequest;
import com.smartsplit.entity.Expense;
import com.smartsplit.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    public Expense addExpense(@RequestBody ExpenseRequest request) {
        return expenseService.addExpense(request);
    }
}