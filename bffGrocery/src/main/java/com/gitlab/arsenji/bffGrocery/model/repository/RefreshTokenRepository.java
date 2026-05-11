package com.gitlab.arsenji.bffGrocery.model.repository;

import com.gitlab.arsenji.bffGrocery.model.entity.Employees;
import com.gitlab.arsenji.bffGrocery.model.entity.RefreshTokens;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshTokens,Long> {
    Optional<RefreshTokens> findByToken(String token);
    void deleteByEmployee(Employees employees);
}
