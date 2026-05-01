package com.smartsplit.repository;

import com.smartsplit.entity.Notification;
import com.smartsplit.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUser(User user);
}