package com.smartsplit.repository;

import com.smartsplit.entity.ExpenseSplit;
import com.smartsplit.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpenseSplitRepository extends JpaRepository<ExpenseSplit, Long> {

    List<ExpenseSplit> findByExpense(Expense expense);
}