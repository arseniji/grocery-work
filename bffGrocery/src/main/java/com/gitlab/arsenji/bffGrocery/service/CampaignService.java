package com.gitlab.arsenji.bffGrocery.service;

import com.gitlab.arsenji.bffGrocery.enums.CampaignsStatus;
import com.gitlab.arsenji.bffGrocery.exceptions.RailsApiException;
import com.gitlab.arsenji.bffGrocery.model.entity.InventoryCampaigns;
import com.gitlab.arsenji.bffGrocery.model.entity.SessionItems;
import com.gitlab.arsenji.bffGrocery.model.entity.WarehouseSessions;
import com.gitlab.arsenji.bffGrocery.model.repository.InventoryCampaignsRepository;
import com.gitlab.arsenji.bffGrocery.model.repository.WarehouseSessionsRepository;
import com.gitlab.arsenji.bffGrocery.railsService.RailsProductService;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CampaignService {

    private final InventoryCampaignsRepository campaignRepository;
    private final WarehouseSessionsRepository sessionsRepository;
    private final RailsProductService railsProductService;
    private final NotificationService notificationService;

    @Transactional
    public void closeCampaign(Long id) {
        InventoryCampaigns campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Кампания не найдена"));

        if (campaign.getStatus() == CampaignsStatus.CLOSED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Кампания уже закрыта");
        }

        List<WarehouseSessions> sessions = sessionsRepository.findByCampaignId(id);

        Map<Long, Integer> totals = new HashMap<>();
        for (WarehouseSessions session : sessions) {
            for (SessionItems item : session.getItems()) {
                if (item.getRailsProductId() != null) {
                    totals.merge(item.getRailsProductId(), item.getQuantity(), Integer::sum);
                }
            }
        }

        for (Map.Entry<Long, Integer> entry : totals.entrySet()) {
            try {
                railsProductService.updateProduct(entry.getKey(), entry.getValue());
            } catch (RailsApiException e) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                        "Не удалось обновить остаток в Rails для товара id=" + entry.getKey()
                        + ": " + e.getMessage());
            }
        }

        campaign.setStatus(CampaignsStatus.CLOSED);
        campaign.setCompletedAt(LocalDateTime.now());
        campaignRepository.save(campaign);
        notificationService.campaignClosed(campaign);
    }
}
