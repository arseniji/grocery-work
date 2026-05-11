package com.gitlab.arsenji.bffGrocery.controller.androidClient;


import com.gitlab.arsenji.bffGrocery.dto.CreateSessionRequestClient;
import com.gitlab.arsenji.bffGrocery.dto.EmployeePrincipal;
import com.gitlab.arsenji.bffGrocery.dto.SessionResponseDto;
import com.gitlab.arsenji.bffGrocery.railsService.RailsProductService;
import com.gitlab.arsenji.bffGrocery.service.SessionService;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/sessions")
@RequiredArgsConstructor
public class SessionController {
    private final SessionService sessionService;
    private final RailsProductService railsProductService;

    @GetMapping
    public List<SessionResponseDto> getSessions(
            @AuthenticationPrincipal EmployeePrincipal principal
    ) {
        return sessionService.getSessionsByEmployee(principal);
    }

    @GetMapping("/{id}")
    public SessionResponseDto getSession(
            @PathVariable Long id,
            @AuthenticationPrincipal EmployeePrincipal principal
    ) {
        return sessionService.getSessionById(id, principal);
    }

    @PostMapping
    public ResponseEntity<Void> createSession(
            @Valid @RequestBody CreateSessionRequestClient request,
            @AuthenticationPrincipal EmployeePrincipal principal
    ) {
        sessionService.submitSession(request, principal);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
