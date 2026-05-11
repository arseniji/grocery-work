package com.gitlab.arsenji.bffGrocery.model.repository;

import com.gitlab.arsenji.bffGrocery.model.entity.WarehouseSessions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface WarehouseSessionsRepository extends JpaRepository<WarehouseSessions, Long> {

    @Query("SELECT ws FROM WarehouseSessions ws LEFT JOIN FETCH ws.items WHERE ws.campaign.id = :campaignId")
    List<WarehouseSessions> findByCampaignId(@Param("campaignId") Long campaignId);

    @Query("SELECT ws FROM WarehouseSessions ws WHERE ws.employee.id = :employeeId")
    List<WarehouseSessions> findByEmployeeId(@Param("employeeId") Long employeeId);

    @Query("SELECT ws FROM WarehouseSessions ws LEFT JOIN FETCH ws.items WHERE ws.employee.id = :employeeId")
    List<WarehouseSessions> findByEmployeeIdWithItems(@Param("employeeId") Long employeeId);

    @Query("SELECT ws FROM WarehouseSessions ws LEFT JOIN FETCH ws.items WHERE ws.id = :id")
    java.util.Optional<WarehouseSessions> findByIdWithItems(@Param("id") Long id);
}
