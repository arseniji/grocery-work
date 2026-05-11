package com.gitlab.arsenji.bffGrocery.model.repository;

import com.gitlab.arsenji.bffGrocery.model.entity.Employees;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface EmployeesRepository extends JpaRepository<Employees,Long> {
    Optional<Employees> findByLogin(@NotBlank String login);
    Optional<Employees> findByLoginAndDeletedAtIsNull(@NotBlank String login);
    List<Employees> findAllByDeletedAtIsNull();
}
