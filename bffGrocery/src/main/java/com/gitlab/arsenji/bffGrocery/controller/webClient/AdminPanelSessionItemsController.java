package com.gitlab.arsenji.bffGrocery.controller.webClient;

import com.gitlab.arsenji.bffGrocery.model.repository.SessionItemsRepository;
import com.gitlab.arsenji.bffGrocery.service.ExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@Controller
@RequestMapping("/admin/sessions")
@RequiredArgsConstructor
public class AdminPanelSessionItemsController {

    private final SessionItemsRepository sessionItemsRepository;
    private final ExportService exportService;

    @GetMapping
    public String list(Model model) {
        model.addAttribute("sessions", sessionItemsRepository.findAll());
        return "admin/sessions/list";
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> export(@RequestParam(defaultValue = "json") String format) throws IOException {
        var all = sessionItemsRepository.findAll();
        if ("csv".equalsIgnoreCase(format)) {
            return download(exportService.exportItemsCsv(all), "session_items.csv", "text/csv");
        }
        return download(exportService.exportItemsJson(all), "session_items.json", "application/json");
    }

    private ResponseEntity<byte[]> download(byte[] data, String filename, String contentType) {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType(contentType))
                .body(data);
    }
}
