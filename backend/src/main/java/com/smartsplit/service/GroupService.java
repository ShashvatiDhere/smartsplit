package com.smartsplit.service;

import com.smartsplit.dto.GroupRequest;
import com.smartsplit.entity.Group;
import com.smartsplit.entity.GroupMember;
import com.smartsplit.entity.User;
import com.smartsplit.enums.GroupRole;
import com.smartsplit.repository.GroupMemberRepository;
import com.smartsplit.repository.GroupRepository;
import com.smartsplit.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class GroupService {

    private final GroupRepository groupRepository;
    private final UserRepository userRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final NotificationService notificationService;
    private final ActivityLogService activityLogService;

    public Group createGroup(GroupRequest request, Long userId) {
        User creator = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Group group = Group.builder()
                .name(request.getName())
                .type(request.getType())
                .createdBy(creator)
                .createdAt(LocalDateTime.now())
                .build();

        Group savedGroup = groupRepository.save(group);

        GroupMember member = GroupMember.builder()
                .group(savedGroup)
                .user(creator)
                .role(GroupRole.ADMIN)
                .joinedAt(LocalDateTime.now())
                .build();

        groupMemberRepository.save(member);

        activityLogService.createLog(
                savedGroup.getId(),
                creator.getId(),
                creator.getName() + " created group " + savedGroup.getName()
        );

        return savedGroup;
    }

    public GroupMember addMember(Long groupId, Long userId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        GroupMember member = GroupMember.builder()
                .group(group)
                .user(user)
                .role(GroupRole.MEMBER)
                .joinedAt(LocalDateTime.now())
                .build();

        GroupMember savedMember = groupMemberRepository.save(member);

        notificationService.createNotification(
                user.getId(),
                "You were added to group " + group.getName()
        );

        activityLogService.createLog(
                group.getId(),
                user.getId(),
                user.getName() + " joined group " + group.getName()
        );

        return savedMember;
    }
}