package com.gitlab.arsenji.bffGrocery.service;


import com.gitlab.arsenji.bffGrocery.dto.*;
import com.gitlab.arsenji.bffGrocery.enums.CampaignsStatus;
import com.gitlab.arsenji.bffGrocery.enums.Mode;
import com.gitlab.arsenji.bffGrocery.model.entity.Employees;
import com.gitlab.arsenji.bffGrocery.model.entity.InventoryCampaigns;
import com.gitlab.arsenji.bffGrocery.model.entity.SessionItems;
import com.gitlab.arsenji.bffGrocery.model.entity.WarehouseSessions;
import com.gitlab.arsenji.bffGrocery.model.repository.EmployeesRepository;
import com.gitlab.arsenji.bffGrocery.model.repository.InventoryCampaignsRepository;
import com.gitlab.arsenji.bffGrocery.model.repository.WarehouseSessionsRepository;
import com.gitlab.arsenji.bffGrocery.railsService.RailsProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SessionService {
    private final EmployeesRepository employeesRepository;
    private final WarehouseSessionsRepository warehouseSessionsRepository;
    private final RailsProductService productService;
    private final InventoryCampaignsRepository inventoryCampaignsRepository;

    public List<SessionResponseDto> getSessionsByEmployee(EmployeePrincipal principal) {
        return warehouseSessionsRepository.findByEmployeeIdWithItems(principal.id())
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    public SessionResponseDto getSessionById(Long id, EmployeePrincipal principal) {
        WarehouseSessions session = warehouseSessionsRepository.findByIdWithItems(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Сессия не найдена"));
        if (!session.getEmployee().getId().equals(principal.id())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        return toResponseDto(session);
    }

    private SessionResponseDto toResponseDto(WarehouseSessions session) {
        List<SessionItemResponseDto> itemDtos = session.getItems().stream()
                .map(item -> new SessionItemResponseDto(
                        item.getId(),
                        item.getBarcode(),
                        item.getProductName(),
                        item.getQuantity(),
                        session.getCreatedAt().toString()
                ))
                .collect(Collectors.toList());

        return new SessionResponseDto(
                session.getId(),
                session.getEmployee().getId(),
                session.getMode().name(),
                "COMPLETED",
                session.getCreatedAt().toString(),
                null,
                itemDtos
        );
    }

    @Transactional
    public void submitSession(CreateSessionRequestClient request, EmployeePrincipal principal) {
        Employees employee = employeesRepository.findById(principal.id())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Нет такого сотрудника"));

        WarehouseSessions session = new WarehouseSessions();
        session.setEmployee(employee);
        session.setMode(request.mode());

        if (request.mode() == Mode.INVENTORY) {
            InventoryCampaigns campaign = inventoryCampaignsRepository
                    .findTopByStatusOrderByCreatedAtAsc(CampaignsStatus.OPEN)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.CONFLICT,
                            "Нет открытой инвентаризационной кампании"));
            session.setCampaign(campaign);
        }

        Map<String, ProductDto> productCache = new HashMap<>();
        List<SessionItems> items = new ArrayList<>();
        for (SessionItemsRequestClientDto item : request.items()) {
            ProductDto productInfo = productCache.computeIfAbsent(
                    item.barcode(), productService::getByBarcode);

            SessionItems sessionItem = new SessionItems();
            sessionItem.setSession(session);
            sessionItem.setBarcode(item.barcode());
            sessionItem.setRailsProductId(productInfo.railsId());
            sessionItem.setProductName(productInfo.productName());
            sessionItem.setMeasurementUnit(productInfo.measurementUnit());
            sessionItem.setQuantity(item.quantity());
            items.add(sessionItem);
        }
        session.setItems(items);

        if (request.mode() == Mode.RECEIVE || request.mode() == Mode.WRITE_OFF) {
            int sign = (request.mode() == Mode.RECEIVE) ? 1 : -1;

            Map<String, Integer> deltas = new HashMap<>();
            for (SessionItemsRequestClientDto item : request.items()) {
                deltas.merge(item.barcode(), item.quantity() * sign, Integer::sum);
            }

            Map<String, Integer> newQuantities = new HashMap<>();
            for (Map.Entry<String, Integer> entry : deltas.entrySet()) {
                ProductDto product = productCache.get(entry.getKey());
                int newQty = product.quantity() + entry.getValue();
                if (newQty < 0) {
                    throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
                            "Недостаточно товара на складе: " + product.productName()
                            + " (доступно: " + product.quantity() + ")");
                }
                newQuantities.put(entry.getKey(), newQty);
            }

            for (Map.Entry<String, Integer> entry : newQuantities.entrySet()) {
                ProductDto product = productCache.get(entry.getKey());
                productService.updateProduct(product.railsId(), entry.getValue());
            }
        }

        warehouseSessionsRepository.save(session);
    }
}
