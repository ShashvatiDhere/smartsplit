package com.smartsplit.repository;

import com.smartsplit.entity.Settlement;
import com.smartsplit.entity.Group;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SettlementRepository extends JpaRepository<Settlement, Long> {

    List<Settlement> findByGroup(Group group);
}