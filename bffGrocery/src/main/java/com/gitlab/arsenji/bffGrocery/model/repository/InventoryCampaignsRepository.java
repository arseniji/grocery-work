package com.gitlab.arsenji.bffGrocery.model.repository;

import com.gitlab.arsenji.bffGrocery.enums.CampaignsStatus;
import com.gitlab.arsenji.bffGrocery.model.entity.InventoryCampaigns;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface InventoryCampaignsRepository extends JpaRepository<InventoryCampaigns,Long> {
    Optional<InventoryCampaigns> findTopByStatusOrderByCreatedAtAsc(CampaignsStatus status);
    boolean existsByStatus(CampaignsStatus status);
    List<InventoryCampaigns> findByStatusAndDeadlineBefore(CampaignsStatus status, LocalDateTime now);
}
