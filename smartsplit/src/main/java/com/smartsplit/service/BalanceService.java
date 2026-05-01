package com.smartsplit.service;

import com.smartsplit.dto.DashboardResponse;
import com.smartsplit.entity.Expense;
import com.smartsplit.entity.ExpenseSplit;
import com.smartsplit.entity.Group;
import com.smartsplit.repository.ExpenseRepository;
import com.smartsplit.repository.ExpenseSplitRepository;
import com.smartsplit.repository.GroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BalanceService {

    private final GroupRepository groupRepository;
    private final ExpenseRepository expenseRepository;
    private final ExpenseSplitRepository expenseSplitRepository;

    public Map<Long, Double> calculateBalances(Long groupId) {
        Group group = getGroup(groupId);
        List<Expense> expenses = expenseRepository.findByGroup(group);

        Map<Long, Double> balances = new HashMap<>();

        for (Expense expense : expenses) {
            Long payerId = expense.getPaidBy().getId();

            balances.put(
                    payerId,
                    balances.getOrDefault(payerId, 0.0) + expense.getAmount()
            );

            List<ExpenseSplit> splits = expenseSplitRepository.findByExpense(expense);

            for (ExpenseSplit split : splits) {
                Long userId = split.getUser().getId();

                balances.put(
                        userId,
                        balances.getOrDefault(userId, 0.0) - split.getShareAmount()
                );
            }
        }

        return balances;
    }

    public DashboardResponse getUserDashboard(Long userId, Long groupId) {
        Map<Long, Double> balances = calculateBalances(groupId);

        double owe = 0;
        double get = 0;

        double value = balances.getOrDefault(userId, 0.0);

        if (value < 0) {
            owe = Math.abs(value);
        } else {
            get = value;
        }

        double totalGroupExpense = getTotalGroupExpense(groupId);

        return new DashboardResponse(owe, get, get - owe, totalGroupExpense);
    }

    public Double getTotalGroupExpense(Long groupId) {
        Group group = getGroup(groupId);

        return expenseRepository.findByGroup(group)
                .stream()
                .mapToDouble(Expense::getAmount)
                .sum();
    }

    private Group getGroup(Long groupId) {
        return groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
    }
}