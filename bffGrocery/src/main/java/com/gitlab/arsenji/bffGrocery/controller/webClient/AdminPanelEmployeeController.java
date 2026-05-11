package com.gitlab.arsenji.bffGrocery.controller.webClient;

import com.gitlab.arsenji.bffGrocery.dto.EmployeeFormDto;
import com.gitlab.arsenji.bffGrocery.enums.Role;
import com.gitlab.arsenji.bffGrocery.model.entity.Employees;
import com.gitlab.arsenji.bffGrocery.model.repository.EmployeesRepository;
import com.gitlab.arsenji.bffGrocery.model.repository.SessionItemsRepository;
import com.gitlab.arsenji.bffGrocery.model.repository.WarehouseSessionsRepository;
import com.gitlab.arsenji.bffGrocery.service.EmployeeService;
import com.gitlab.arsenji.bffGrocery.service.ExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;

@Controller
@RequiredArgsConstructor
@RequestMapping("/admin/employees")
public class AdminPanelEmployeeController {

    private final EmployeeService employeeService;
    private final EmployeesRepository employeesRepository;
    private final WarehouseSessionsRepository sessionsRepository;
    private final SessionItemsRepository itemsRepository;
    private final ExportService exportService;

    @GetMapping
    public String list(Model model) {
        model.addAttribute("employees", employeeService.findAll());
        return "admin/employees/list";
    }

    @GetMapping("/new")
    public String newForm(Model model) {
        model.addAttribute("employeeForm",
                new EmployeeFormDto(null, "", null, "", "", Role.EMPLOYEE));
        return "admin/employees/form";
    }

    @GetMapping("/edit/{id}")
    public String editForm(@PathVariable Long id, Model model) {
        model.addAttribute("employeeForm", employeeService.toFormDto(id));
        return "admin/employees/form";
    }

    @PostMapping("/save")
    public String save(@ModelAttribute("employeeForm") EmployeeFormDto dto) {
        employeeService.saveEmployee(dto);
        return "redirect:/admin/employees";
    }

    @PostMapping("/delete/{id}")
    public String delete(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return "redirect:/admin/employees";
    }

    @GetMapping("/{id}/sessions")
    public String employeeSessions(@PathVariable Long id, Model model) {
        Employees emp = employeesRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        model.addAttribute("employee", emp);
        model.addAttribute("sessions", sessionsRepository.findByEmployeeId(id));
        return "admin/employees/sessions";
    }

    @GetMapping("/{id}/sessions/export")
    public ResponseEntity<byte[]> exportEmployeeSessions(@PathVariable Long id,
                                                         @RequestParam(defaultValue = "json") String format) throws IOException {
        var sessions = sessionsRepository.findByEmployeeId(id);
        if ("csv".equalsIgnoreCase(format)) {
            return download(exportService.exportSessionsCsv(sessions),
                    "employee_" + id + "_sessions.csv", "text/csv");
        }
        return download(exportService.exportSessionsJson(sessions),
                "employee_" + id + "_sessions.json", "application/json");
    }


    @GetMapping("/{id}/items")
    public String employeeItems(@PathVariable Long id, Model model) {
        Employees emp = employeesRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        model.addAttribute("employee", emp);
        model.addAttribute("items", itemsRepository.findBySession_EmployeeId(id));
        return "admin/employees/items";
    }

    @GetMapping("/{id}/items/export")
    public ResponseEntity<byte[]> exportEmployeeItems(@PathVariable Long id,
                                                      @RequestParam(defaultValue = "json") String format) throws IOException {
        var items = itemsRepository.findBySession_EmployeeId(id);
        if ("csv".equalsIgnoreCase(format)) {
            return download(exportService.exportItemsCsv(items),
                    "employee_" + id + "_items.csv", "text/csv");
        }
        return download(exportService.exportItemsJson(items),
                "employee_" + id + "_items.json", "application/json");
    }


    @GetMapping("/export")
    public ResponseEntity<byte[]> export(@RequestParam(defaultValue = "json") String format) throws IOException {
        if ("csv".equalsIgnoreCase(format)) {
            return download(exportService.exportEmployeesCsv(), "employees.csv", "text/csv");
        }
        return download(exportService.exportEmployeesJson(), "employees.json", "application/json");
    }

    @PostMapping("/import")
    public String importEmployees(@RequestParam MultipartFile file,
                                  @RequestParam(defaultValue = "json") String format) throws IOException {
        exportService.importEmployees(file, format);
        return "redirect:/admin/employees";
    }

    private ResponseEntity<byte[]> download(byte[] data, String filename, String contentType) {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType(contentType))
                .body(data);
    }
}
