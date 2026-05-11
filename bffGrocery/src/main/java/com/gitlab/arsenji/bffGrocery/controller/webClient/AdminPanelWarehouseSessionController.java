package com.gitlab.arsenji.bffGrocery.controller.webClient;

import com.gitlab.arsenji.bffGrocery.model.entity.WarehouseSessions;
import com.gitlab.arsenji.bffGrocery.model.repository.SessionItemsRepository;
import com.gitlab.arsenji.bffGrocery.model.repository.WarehouseSessionsRepository;
import com.gitlab.arsenji.bffGrocery.service.ExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;

@Controller
@RequestMapping("/admin/warehouse_sessions")
@RequiredArgsConstructor
public class AdminPanelWarehouseSessionController {

    private final WarehouseSessionsRepository sessionsRepository;
    private final SessionItemsRepository itemsRepository;
    private final ExportService exportService;

    @GetMapping
    public String list(Model model) {
        model.addAttribute("warehouse_sessions", sessionsRepository.findAll());
        return "admin/warehouse_sessions/list";
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> export(@RequestParam(defaultValue = "json") String format) throws IOException {
        List<WarehouseSessions> all = sessionsRepository.findAll();
        if ("csv".equalsIgnoreCase(format)) {
            return download(exportService.exportSessionsCsv(all), "sessions.csv", "text/csv");
        }
        return download(exportService.exportSessionsJson(all), "sessions.json", "application/json");
    }

    @GetMapping("/{id}")
    public String detail(@PathVariable Long id, Model model) {
        WarehouseSessions ws = sessionsRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        model.addAttribute("ws", ws);
        model.addAttribute("items", itemsRepository.findBySessionId(id));
        return "admin/warehouse_sessions/detail";
    }

    @GetMapping("/{id}/export")
    public ResponseEntity<byte[]> exportDetail(@PathVariable Long id,
                                               @RequestParam(defaultValue = "json") String format) throws IOException {
        var items = itemsRepository.findBySessionId(id);
        if ("csv".equalsIgnoreCase(format)) {
            return download(exportService.exportItemsCsv(items),
                    "session_" + id + "_items.csv", "text/csv");
        }
        return download(exportService.exportItemsJson(items),
                "session_" + id + "_items.json", "application/json");
    }

    private ResponseEntity<byte[]> download(byte[] data, String filename, String contentType) {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType(contentType))
                .body(data);
    }
}
