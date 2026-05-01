package com.smartsplit.service;

import com.smartsplit.dto.ExpenseRequest;
import com.smartsplit.entity.Expense;
import com.smartsplit.entity.ExpenseSplit;
import com.smartsplit.entity.Group;
import com.smartsplit.entity.User;
import com.smartsplit.repository.ExpenseRepository;
import com.smartsplit.repository.ExpenseSplitRepository;
import com.smartsplit.repository.GroupRepository;
import com.smartsplit.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseSplitRepository expenseSplitRepository;
    private final GroupRepository groupRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final ActivityLogService activityLogService;

    public Expense addExpense(ExpenseRequest request) {
        Group group = groupRepository.findById(request.getGroupId())
                .orElseThrow(() -> new RuntimeException("Group not found"));

        User paidBy = userRepository.findById(request.getPaidByUserId())
                .orElseThrow(() -> new RuntimeException("Paid by user not found"));

        double totalSplit = request.getSplits()
                .values()
                .stream()
                .mapToDouble(Double::doubleValue)
                .sum();

        if (Math.abs(totalSplit - request.getAmount()) > 0.01) {
            throw new RuntimeException("Split amount must equal total expense amount");
        }

        Expense expense = Expense.builder()
                .title(request.getTitle())
                .amount(request.getAmount())
                .category(request.getCategory())
                .expenseDate(request.getExpenseDate())
                .group(group)
                .paidBy(paidBy)
                .createdAt(LocalDateTime.now())
                .build();

        Expense savedExpense = expenseRepository.save(expense);

        for (Map.Entry<Long, Double> entry : request.getSplits().entrySet()) {
            User user = userRepository.findById(entry.getKey())
                    .orElseThrow(() -> new RuntimeException("Split user not found"));

            ExpenseSplit split = ExpenseSplit.builder()
                    .expense(savedExpense)
                    .user(user)
                    .shareAmount(entry.getValue())
                    .build();

            expenseSplitRepository.save(split);
        }

        activityLogService.createLog(
                group.getId(),
                paidBy.getId(),
                paidBy.getName() + " added expense " + savedExpense.getTitle()
        );

        for (Long userId : request.getSplits().keySet()) {
            notificationService.createNotification(
                    userId,
                    paidBy.getName() + " added expense " + savedExpense.getTitle()
                            + " of ₹" + savedExpense.getAmount()
            );
        }

        return savedExpense;
    }
}