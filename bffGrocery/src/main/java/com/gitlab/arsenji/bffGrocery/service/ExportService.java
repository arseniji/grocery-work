package com.gitlab.arsenji.bffGrocery.service;

import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;
import com.gitlab.arsenji.bffGrocery.enums.Role;
import com.gitlab.arsenji.bffGrocery.model.entity.*;
import com.gitlab.arsenji.bffGrocery.model.repository.*;
import lombok.RequiredArgsConstructor;
import org.apache.commons.csv.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ExportService {

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final EmployeesRepository employeesRepository;
    private final InventoryCampaignsRepository campaignsRepository;
    private final WarehouseSessionsRepository sessionsRepository;
    private final SessionItemsRepository itemsRepository;
    private final ObjectMapper objectMapper;
    private final PasswordEncoder passwordEncoder;

    private String fmt(LocalDateTime dt) {
        return dt != null ? dt.format(FMT) : "";
    }

    private List<Map<String, Object>> employeeRows(List<Employees> list) {
        return list.stream().map(e -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", e.getId());
            m.put("login", e.getLogin());
            m.put("firstname", e.getFirstname());
            m.put("lastname", e.getLastname());
            m.put("role", e.getRole().name());
            m.put("createdAt", fmt(e.getCreatedAt()));
            return m;
        }).toList();
    }

    public byte[] exportEmployeesJson() throws IOException {
        return objectMapper.writerWithDefaultPrettyPrinter()
                .writeValueAsBytes(employeeRows(employeesRepository.findAllByDeletedAtIsNull()));
    }

    public byte[] exportEmployeesCsv() throws IOException {
        String[] headers = {"id", "login", "firstname", "lastname", "role", "createdAt"};
        StringWriter sw = new StringWriter();
        CSVFormat fmt = CSVFormat.DEFAULT.builder().setHeader(headers).build();
        try (CSVPrinter p = new CSVPrinter(sw, fmt)) {
            for (Map<String, Object> r : employeeRows(employeesRepository.findAllByDeletedAtIsNull())) {
                p.printRecord(r.get("id"), r.get("login"), r.get("firstname"),
                        r.get("lastname"), r.get("role"), r.get("createdAt"));
            }
        }
        return ("﻿" + sw).getBytes(StandardCharsets.UTF_8);
    }

    public void importEmployees(MultipartFile file, String format) throws IOException {
        if ("csv".equalsIgnoreCase(format)) {
            importEmployeesCsv(file.getBytes());
        } else {
            importEmployeesJson(file.getBytes());
        }
    }

    private void importEmployeesJson(byte[] data) throws IOException {
        List<Map<String, Object>> rows = objectMapper.readValue(data,
                new TypeReference<List<Map<String, Object>>>() {});
        for (Map<String, Object> row : rows) {
            String login = (String) row.get("login");
            if (login == null || login.isBlank()) continue;
            if (employeesRepository.findByLogin(login).isPresent()) continue;
            Employees emp = new Employees();
            emp.setLogin(login);
            emp.setFirstname(str(row, "firstname"));
            emp.setLastname(str(row, "lastname"));
            emp.setRole(parseRole(str(row, "role")));
            emp.setPasswordHash(passwordEncoder.encode(strOrDefault(row, "password", "changeme")));
            employeesRepository.save(emp);
        }
    }

    private void importEmployeesCsv(byte[] data) throws IOException {
        try (Reader r = new InputStreamReader(new ByteArrayInputStream(data), StandardCharsets.UTF_8);
             CSVParser parser = CSVFormat.DEFAULT.builder().setHeader().setSkipHeaderRecord(true).build().parse(r)) {
            for (CSVRecord rec : parser) {
                String login = rec.get("login");
                if (login == null || login.isBlank()) continue;
                if (employeesRepository.findByLogin(login).isPresent()) continue;
                Employees emp = new Employees();
                emp.setLogin(login);
                emp.setFirstname(rec.get("firstname"));
                emp.setLastname(rec.get("lastname"));
                emp.setRole(parseRole(rec.get("role")));
                String pass = hasColumn(rec, "password") ? rec.get("password") : "";
                emp.setPasswordHash(passwordEncoder.encode(pass.isBlank() ? "changeme" : pass));
                employeesRepository.save(emp);
            }
        }
    }



    private List<Map<String, Object>> campaignRows(List<InventoryCampaigns> list) {
        return list.stream().map(c -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", c.getId());
            m.put("title", c.getTitle());
            m.put("status", c.getStatus() != null ? c.getStatus().name() : "");
            m.put("createdAt", fmt(c.getCreatedAt()));
            m.put("completedAt", fmt(c.getCompletedAt()));
            return m;
        }).toList();
    }

    public byte[] exportCampaignsJson() throws IOException {
        return objectMapper.writerWithDefaultPrettyPrinter()
                .writeValueAsBytes(campaignRows(campaignsRepository.findAll()));
    }

    public byte[] exportCampaignsCsv() throws IOException {
        String[] headers = {"id", "title", "status", "createdAt", "completedAt"};
        StringWriter sw = new StringWriter();
        CSVFormat fmt = CSVFormat.DEFAULT.builder().setHeader(headers).build();
        try (CSVPrinter p = new CSVPrinter(sw, fmt)) {
            for (Map<String, Object> r : campaignRows(campaignsRepository.findAll())) {
                p.printRecord(r.get("id"), r.get("title"), r.get("status"),
                        r.get("createdAt"), r.get("completedAt"));
            }
        }
        return ("﻿" + sw).getBytes(StandardCharsets.UTF_8);
    }



    public List<Map<String, Object>> sessionRows(List<WarehouseSessions> list) {
        return list.stream().map(s -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", s.getId());
            m.put("employeeId", s.getEmployee().getId());
            m.put("employeeName", s.getEmployee().getFirstname() + " " + s.getEmployee().getLastname());
            m.put("mode", s.getMode().name());
            m.put("createdAt", fmt(s.getCreatedAt()));
            m.put("campaignId", s.getCampaign() != null ? s.getCampaign().getId() : "");
            m.put("campaignTitle", s.getCampaign() != null ? s.getCampaign().getTitle() : "");
            m.put("itemCount", s.getItems().size());
            return m;
        }).toList();
    }

    public byte[] exportSessionsJson(List<WarehouseSessions> sessions) throws IOException {
        return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsBytes(sessionRows(sessions));
    }

    public byte[] exportSessionsCsv(List<WarehouseSessions> sessions) throws IOException {
        String[] headers = {"id", "employeeId", "employeeName", "mode", "createdAt", "campaignId", "campaignTitle", "itemCount"};
        StringWriter sw = new StringWriter();
        CSVFormat fmt = CSVFormat.DEFAULT.builder().setHeader(headers).build();
        try (CSVPrinter p = new CSVPrinter(sw, fmt)) {
            for (Map<String, Object> r : sessionRows(sessions)) {
                p.printRecord(r.get("id"), r.get("employeeId"), r.get("employeeName"),
                        r.get("mode"), r.get("createdAt"), r.get("campaignId"),
                        r.get("campaignTitle"), r.get("itemCount"));
            }
        }
        return ("﻿" + sw).getBytes(StandardCharsets.UTF_8);
    }



    public List<Map<String, Object>> itemRows(List<SessionItems> list) {
        return list.stream().map(i -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", i.getId());
            m.put("sessionId", i.getSession().getId());
            m.put("barcode", i.getBarcode());
            m.put("productName", i.getProductName() != null ? i.getProductName() : "");
            m.put("measurementUnit", i.getMeasurementUnit() != null ? i.getMeasurementUnit() : "");
            m.put("quantity", i.getQuantity());
            m.put("railsProductId", i.getRailsProductId() != null ? i.getRailsProductId() : "");
            return m;
        }).toList();
    }

    public byte[] exportItemsJson(List<SessionItems> items) throws IOException {
        return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsBytes(itemRows(items));
    }

    public byte[] exportItemsCsv(List<SessionItems> items) throws IOException {
        String[] headers = {"id", "sessionId", "barcode", "productName", "measurementUnit", "quantity", "railsProductId"};
        StringWriter sw = new StringWriter();
        CSVFormat fmt = CSVFormat.DEFAULT.builder().setHeader(headers).build();
        try (CSVPrinter p = new CSVPrinter(sw, fmt)) {
            for (Map<String, Object> r : itemRows(items)) {
                p.printRecord(r.get("id"), r.get("sessionId"), r.get("barcode"),
                        r.get("productName"), r.get("measurementUnit"),
                        r.get("quantity"), r.get("railsProductId"));
            }
        }
        return ("﻿" + sw).getBytes(StandardCharsets.UTF_8);
    }



    private String str(Map<String, Object> m, String key) {
        Object v = m.get(key);
        return v != null ? v.toString() : "";
    }

    private String strOrDefault(Map<String, Object> m, String key, String def) {
        Object v = m.get(key);
        return (v != null && !v.toString().isBlank()) ? v.toString() : def;
    }

    private boolean hasColumn(CSVRecord rec, String name) {
        try { rec.get(name); return true; } catch (IllegalArgumentException e) { return false; }
    }

    private Role parseRole(String s) {
        try { return Role.valueOf(s.toUpperCase()); } catch (Exception e) { return Role.EMPLOYEE; }
    }

}
