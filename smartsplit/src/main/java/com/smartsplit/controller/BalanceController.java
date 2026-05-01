package com.smartsplit.controller;

import com.smartsplit.dto.DashboardResponse;
import com.smartsplit.service.BalanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/balance")
@RequiredArgsConstructor
public class BalanceController {

    private final BalanceService balanceService;

    // ✅ Get user dashboard (owe / get / net)
    @GetMapping("/dashboard")
    public DashboardResponse getDashboard(
            @RequestParam Long userId,
            @RequestParam Long groupId
    ) {
        return balanceService.getUserDashboard(userId, groupId);
    }
}