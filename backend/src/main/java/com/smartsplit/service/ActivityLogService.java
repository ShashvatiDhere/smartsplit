package com.smartsplit.service;

import com.smartsplit.entity.ActivityLog;
import com.smartsplit.entity.Group;
import com.smartsplit.entity.User;
import com.smartsplit.repository.ActivityLogRepository;
import com.smartsplit.repository.GroupRepository;
import com.smartsplit.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;
    private final GroupRepository groupRepository;
    private final UserRepository userRepository;

    public ActivityLog createLog(Long groupId, Long userId, String message) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ActivityLog log = ActivityLog.builder()
                .group(group)
                .user(user)
                .message(message)
                .createdAt(LocalDateTime.now())
                .build();

        return activityLogRepository.save(log);
    }

    public List<ActivityLog> getGroupLogs(Long groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        return activityLogRepository.findByGroup(group);
    }
}