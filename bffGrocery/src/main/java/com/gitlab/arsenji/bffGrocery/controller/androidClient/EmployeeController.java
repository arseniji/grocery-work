package com.gitlab.arsenji.bffGrocery.controller.androidClient;


import com.gitlab.arsenji.bffGrocery.dto.EmployeeDto;
import com.gitlab.arsenji.bffGrocery.dto.EmployeePrincipal;
import com.gitlab.arsenji.bffGrocery.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/employees")
@RequiredArgsConstructor
public class EmployeeController {
    private final EmployeeService employeeService;

    @GetMapping("/me")
    public ResponseEntity<EmployeeDto> getMe(@AuthenticationPrincipal EmployeePrincipal principal) {
        return ResponseEntity.ok(employeeService.getByLogin(principal.login()));
    }
}
