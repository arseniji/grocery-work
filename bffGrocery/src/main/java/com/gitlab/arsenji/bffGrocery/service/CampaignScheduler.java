package com.gitlab.arsenji.bffGrocery.service;

import com.gitlab.arsenji.bffGrocery.enums.CampaignsStatus;
import com.gitlab.arsenji.bffGrocery.model.repository.InventoryCampaignsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class CampaignScheduler {

    private final InventoryCampaignsRepository campaignRepository;
    private final CampaignService campaignService;

    @Scheduled(fixedDelay = 60_000)
    public void closeExpiredCampaigns() {
        campaignRepository
                .findByStatusAndDeadlineBefore(CampaignsStatus.OPEN, LocalDateTime.now())
                .forEach(campaign -> {
                    log.info("Auto-closing campaign id={} '{}' (deadline passed)", campaign.getId(), campaign.getTitle());
                    campaignService.closeCampaign(campaign.getId());
                });
    }
}
