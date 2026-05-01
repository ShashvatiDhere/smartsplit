package com.smartsplit.dto;

import lombok.Data;

@Data
public class SettlementRequest {

    private Long groupId;
    private Long fromUserId;
    private Long toUserId;
    private Double amount;
}