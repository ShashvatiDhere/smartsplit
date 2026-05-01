package com.smartsplit.controller;

import com.smartsplit.entity.ActivityLog;
import com.smartsplit.service.ActivityLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activity-logs")
@RequiredArgsConstructor
public class ActivityLogController {

    private final ActivityLogService activityLogService;

    @GetMapping("/group/{groupId}")
    public List<ActivityLog> getGroupLogs(@PathVariable Long groupId) {
        return activityLogService.getGroupLogs(groupId);
    }
}