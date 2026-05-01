package com.smartsplit.repository;

import com.smartsplit.entity.Expense;
import com.smartsplit.entity.Group;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByGroup(Group group);
}