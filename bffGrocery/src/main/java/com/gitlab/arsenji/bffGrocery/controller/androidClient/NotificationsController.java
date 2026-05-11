package com.gitlab.arsenji.bffGrocery.controller.androidClient;

import com.gitlab.arsenji.bffGrocery.dto.NotificationResponseDto;
import com.gitlab.arsenji.bffGrocery.dto.NotificationsListResponseDto;
import com.gitlab.arsenji.bffGrocery.enums.CampaignsStatus;
import com.gitlab.arsenji.bffGrocery.model.repository.InventoryCampaignsRepository;
import com.gitlab.arsenji.bffGrocery.model.repository.NotificationsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/notifications")
public class NotificationsController {

    private final NotificationsRepository notificationsRepository;
    private final InventoryCampaignsRepository campaignsRepository;

    @GetMapping
    public NotificationsListResponseDto getNotifications() {
        boolean hasActiveCampaign = campaignsRepository
                .findTopByStatusOrderByCreatedAtAsc(CampaignsStatus.OPEN)
                .isPresent();

        List<NotificationResponseDto> notifications = notificationsRepository
                .findAllByOrderByCreatedAtDesc()
                .stream()
                .map(n -> new NotificationResponseDto(
                        n.getId(),
                        n.getType().name(),
                        n.getCampaignTitle(),
                        n.getDescription(),
                        n.getCreatedAt().toString()
                ))
                .collect(Collectors.toList());

        return new NotificationsListResponseDto(hasActiveCampaign, notifications);
    }
}
