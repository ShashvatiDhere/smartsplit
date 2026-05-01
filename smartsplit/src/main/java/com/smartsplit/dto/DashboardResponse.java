package com.smartsplit.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardResponse {

    private Double totalYouOwe;
    private Double totalYouGet;
    private Double netBalance;
    private Double totalGroupExpense;
}