package com.gitlab.arsenji.bffGrocery.model.repository;

import com.gitlab.arsenji.bffGrocery.model.entity.SessionItems;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SessionItemsRepository extends JpaRepository<SessionItems, Long> {

    @Query("SELECT si FROM SessionItems si WHERE si.session.id = :sessionId")
    List<SessionItems> findBySessionId(@Param("sessionId") Long sessionId);

    @Query("SELECT si FROM SessionItems si WHERE si.session.employee.id = :employeeId")
    List<SessionItems> findBySession_EmployeeId(@Param("employeeId") Long employeeId);
}
