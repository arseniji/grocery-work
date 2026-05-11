package com.gitlab.arsenji.bffGrocery.model.repository;

import com.gitlab.arsenji.bffGrocery.model.entity.Notifications;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationsRepository extends JpaRepository<Notifications, Long> {
    List<Notifications> findAllByOrderByCreatedAtDesc();
}
