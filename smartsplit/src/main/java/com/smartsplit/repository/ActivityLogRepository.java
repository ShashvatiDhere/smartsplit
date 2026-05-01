package com.smartsplit.repository;

import com.smartsplit.entity.ActivityLog;
import com.smartsplit.entity.Group;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {

    List<ActivityLog> findByGroup(Group group);
}