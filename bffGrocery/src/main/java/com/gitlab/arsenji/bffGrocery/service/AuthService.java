package com.gitlab.arsenji.bffGrocery.service;

import com.gitlab.arsenji.bffGrocery.dto.LoginRequest;
import com.gitlab.arsenji.bffGrocery.dto.TokenResponse;
import com.gitlab.arsenji.bffGrocery.model.entity.Employees;
import com.gitlab.arsenji.bffGrocery.model.entity.RefreshTokens;
import com.gitlab.arsenji.bffGrocery.model.repository.EmployeesRepository;
import com.gitlab.arsenji.bffGrocery.model.repository.RefreshTokenRepository;
import com.gitlab.arsenji.bffGrocery.service.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final EmployeesRepository employeesRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${jwt.refresh-expiration}")
    private long refreshExpiration;

    @Transactional
    public TokenResponse login(LoginRequest request) {
        Employees employee = employeesRepository.findByLoginAndDeletedAtIsNull(request.login())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        if (!passwordEncoder.matches(request.password(), employee.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        return generateTokenPair(employee);
    }

    @Transactional
    public TokenResponse refresh(String refreshToken) {
        RefreshTokens stored = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token"));

        if (stored.getExpiresAt().isBefore(Instant.now())) {
            refreshTokenRepository.delete(stored);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token expired");
        }

        Employees employee = stored.getEmployee();
        if (employee.getDeletedAt() != null) {
            refreshTokenRepository.delete(stored);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Account deleted");
        }

        refreshTokenRepository.delete(stored);

        return generateTokenPair(employee);
    }

    @Transactional
    public void logout(String refreshToken) {
        refreshTokenRepository.findByToken(refreshToken)
                .ifPresent(refreshTokenRepository::delete);
    }

    private TokenResponse generateTokenPair(Employees employee) {
        refreshTokenRepository.deleteByEmployee(employee);

        String accessToken = jwtService.generate(employee);

        RefreshTokens newRefreshToken = new RefreshTokens();
        newRefreshToken.setToken(UUID.randomUUID().toString());
        newRefreshToken.setEmployee(employee);
        newRefreshToken.setExpiresAt(Instant.now().plusMillis(refreshExpiration));
        refreshTokenRepository.save(newRefreshToken);

        return new TokenResponse(accessToken, newRefreshToken.getToken());
    }
}
