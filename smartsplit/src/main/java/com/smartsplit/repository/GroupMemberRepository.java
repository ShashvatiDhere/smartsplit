package com.smartsplit.repository;

import com.smartsplit.entity.GroupMember;
import com.smartsplit.entity.Group;
import com.smartsplit.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GroupMemberRepository extends JpaRepository<GroupMember, Long> {

    List<GroupMember> findByGroup(Group group);

    Optional<GroupMember> findByGroupAndUser(Group group, User user);
}