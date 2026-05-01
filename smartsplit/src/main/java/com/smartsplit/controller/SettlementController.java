package com.smartsplit.controller;

import com.smartsplit.dto.SettlementRequest;
import com.smartsplit.entity.Settlement;
import com.smartsplit.enums.SettlementStatus;
import com.smartsplit.service.SettlementService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/settlements")
@RequiredArgsConstructor
public class SettlementController {

    private final SettlementService settlementService;

    // Create settlement (manual payment)
    @PostMapping
    public Settlement createSettlement(@RequestBody SettlementRequest request) {
        return settlementService.createSettlement(request);
    }

    // Get smart suggestions (MAIN LOGIC)
    @GetMapping("/suggestions")
    public List<SettlementService.SettlementSuggestion> getSuggestions(
            @RequestParam Long groupId
    ) {
        return settlementService.getSettlementSuggestions(groupId);
    }

    @PutMapping("/{id}/status")
    public Settlement updateSettlementStatus(
            @PathVariable Long id,
            @RequestParam SettlementStatus status
    ) {
        return settlementService.updateSettlementStatus(id, status);
    }
}