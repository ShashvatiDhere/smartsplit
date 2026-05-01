package com.smartsplit.controller;

import com.smartsplit.dto.GroupRequest;
import com.smartsplit.entity.Group;
import com.smartsplit.entity.GroupMember;
import com.smartsplit.service.GroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;

    @PostMapping("/create/{userId}")
    public Group createGroup(@RequestBody GroupRequest request,
                             @PathVariable Long userId) {
        return groupService.createGroup(request, userId);
    }

    @PostMapping("/{groupId}/add-member/{userId}")
    public GroupMember addMember(@PathVariable Long groupId,
                                 @PathVariable Long userId) {
        return groupService.addMember(groupId, userId);
    }
}