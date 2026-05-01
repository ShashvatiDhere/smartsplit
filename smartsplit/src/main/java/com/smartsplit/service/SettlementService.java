package com.smartsplit.service;

import com.smartsplit.dto.SettlementRequest;
import com.smartsplit.entity.Group;
import com.smartsplit.entity.Settlement;
import com.smartsplit.entity.User;
import com.smartsplit.enums.SettlementStatus;
import com.smartsplit.repository.GroupRepository;
import com.smartsplit.repository.SettlementRepository;
import com.smartsplit.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class SettlementService {

    private final SettlementRepository settlementRepository;
    private final GroupRepository groupRepository;
    private final UserRepository userRepository;
    private final BalanceService balanceService;
    private final NotificationService notificationService;
    private final ActivityLogService activityLogService;

    public Settlement createSettlement(SettlementRequest request) {
        Group group = groupRepository.findById(request.getGroupId())
                .orElseThrow(() -> new RuntimeException("Group not found"));

        User fromUser = userRepository.findById(request.getFromUserId())
                .orElseThrow(() -> new RuntimeException("From user not found"));

        User toUser = userRepository.findById(request.getToUserId())
                .orElseThrow(() -> new RuntimeException("To user not found"));

        Settlement settlement = Settlement.builder()
                .group(group)
                .fromUser(fromUser)
                .toUser(toUser)
                .amount(request.getAmount())
                .status(SettlementStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        Settlement savedSettlement = settlementRepository.save(settlement);

        notificationService.createNotification(
                toUser.getId(),
                fromUser.getName() + " created settlement of ₹" + request.getAmount()
        );

        activityLogService.createLog(
                group.getId(),
                fromUser.getId(),
                fromUser.getName() + " paid ₹" + request.getAmount() + " to " + toUser.getName()
        );

        return savedSettlement;
    }

    public List<SettlementSuggestion> getSettlementSuggestions(Long groupId) {
        Map<Long, Double> balances = balanceService.calculateBalances(groupId);

        Queue<BalanceUser> receivers = new LinkedList<>();
        Queue<BalanceUser> payers = new LinkedList<>();

        for (Map.Entry<Long, Double> entry : balances.entrySet()) {
            double amount = entry.getValue();

            if (amount > 0.01) {
                receivers.add(new BalanceUser(entry.getKey(), amount));
            } else if (amount < -0.01) {
                payers.add(new BalanceUser(entry.getKey(), -amount));
            }
        }

        List<SettlementSuggestion> suggestions = new ArrayList<>();

        while (!payers.isEmpty() && !receivers.isEmpty()) {
            BalanceUser payer = payers.poll();
            BalanceUser receiver = receivers.poll();

            double amount = Math.min(payer.getAmount(), receiver.getAmount());

            suggestions.add(new SettlementSuggestion(
                    payer.getUserId(),
                    receiver.getUserId(),
                    amount
            ));

            payer.setAmount(payer.getAmount() - amount);
            receiver.setAmount(receiver.getAmount() - amount);

            if (payer.getAmount() > 0.01) {
                payers.add(payer);
            }

            if (receiver.getAmount() > 0.01) {
                receivers.add(receiver);
            }
        }

        return suggestions;
    }

    public Settlement updateSettlementStatus(Long settlementId, SettlementStatus status) {
        Settlement settlement = settlementRepository.findById(settlementId)
                .orElseThrow(() -> new RuntimeException("Settlement not found"));

        settlement.setStatus(status);

        Settlement savedSettlement = settlementRepository.save(settlement);

        notificationService.createNotification(
                settlement.getFromUser().getId(),
                "Settlement status updated to " + status
        );

        activityLogService.createLog(
                settlement.getGroup().getId(),
                settlement.getToUser().getId(),
                "Settlement of ₹" + settlement.getAmount() + " marked as " + status
        );

        return savedSettlement;
    }

    @Data
    @AllArgsConstructor
    public static class SettlementSuggestion {
        private Long fromUserId;
        private Long toUserId;
        private Double amount;
    }

    @Data
    @AllArgsConstructor
    private static class BalanceUser {
        private Long userId;
        private Double amount;
    }
}

