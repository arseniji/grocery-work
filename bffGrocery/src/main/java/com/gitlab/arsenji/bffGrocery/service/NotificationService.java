package com.gitlab.arsenji.bffGrocery.service;

import com.gitlab.arsenji.bffGrocery.enums.NotificationType;
import com.gitlab.arsenji.bffGrocery.model.entity.InventoryCampaigns;
import com.gitlab.arsenji.bffGrocery.model.entity.Notifications;
import com.gitlab.arsenji.bffGrocery.model.repository.NotificationsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationsRepository notificationsRepository;

    public void campaignOpened(InventoryCampaigns campaign) {
        save(NotificationType.CAMPAIGN_OPEN, campaign);
    }

    public void campaignClosed(InventoryCampaigns campaign) {
        save(NotificationType.CAMPAIGN_CLOSE, campaign);
    }

    private void save(NotificationType type, InventoryCampaigns campaign) {
        Notifications n = new Notifications();
        n.setType(type);
        n.setCampaignTitle(campaign.getTitle());
        n.setDescription(campaign.getDescription());
        notificationsRepository.save(n);
    }
}
