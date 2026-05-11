package com.gitlab.arsenji.bffGrocery.controller.webClient;

import com.gitlab.arsenji.bffGrocery.enums.CampaignsStatus;
import com.gitlab.arsenji.bffGrocery.model.entity.InventoryCampaigns;
import com.gitlab.arsenji.bffGrocery.model.repository.InventoryCampaignsRepository;
import com.gitlab.arsenji.bffGrocery.service.CampaignService;
import com.gitlab.arsenji.bffGrocery.service.ExportService;
import com.gitlab.arsenji.bffGrocery.service.NotificationService;
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

@Controller
@RequiredArgsConstructor
@RequestMapping("/admin/campaigns")
public class AdminPanelInventoryCampaignsController {

    private final InventoryCampaignsRepository inventoryCampaignsRepository;
    private final CampaignService campaignService;
    private final ExportService exportService;
    private final NotificationService notificationService;

    @GetMapping
    public String list(Model model) {
        model.addAttribute("campaigns", inventoryCampaignsRepository.findAll());
        return "admin/campaigns/list";
    }

    @GetMapping("/new")
    public String newForm(Model model) {
        model.addAttribute("campaign", new InventoryCampaigns());
        return "admin/campaigns/form";
    }

    @GetMapping("/edit/{id}")
    public String editForm(@PathVariable Long id, Model model) {
        InventoryCampaigns campaign = inventoryCampaignsRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        model.addAttribute("campaign", campaign);
        return "admin/campaigns/form";
    }

    @PostMapping("/save")
    public String save(@ModelAttribute("campaign") InventoryCampaigns campaign, Model model) {
        boolean isNew = campaign.getId() == null;

        if (!isNew) {
            InventoryCampaigns existing = inventoryCampaignsRepository.findById(campaign.getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
            if (existing.getStatus() == CampaignsStatus.CLOSED) {
                model.addAttribute("campaign", existing);
                model.addAttribute("error", "Закрытую кампанию нельзя редактировать.");
                return "admin/campaigns/form";
            }
            campaign.setStatus(existing.getStatus());
            campaign.setCreatedAt(existing.getCreatedAt());
        } else {
            // Новая кампания — всегда OPEN
            campaign.setStatus(CampaignsStatus.OPEN);
            if (inventoryCampaignsRepository.existsByStatus(CampaignsStatus.OPEN)) {
                model.addAttribute("campaign", campaign);
                model.addAttribute("error", "Уже существует открытая кампания. Закройте её перед созданием новой.");
                return "admin/campaigns/form";
            }
        }

        inventoryCampaignsRepository.save(campaign);
        if (isNew) {
            notificationService.campaignOpened(campaign);
        }
        return "redirect:/admin/campaigns";
    }

    @PostMapping("/close/{id}")
    public String close(@PathVariable Long id) {
        campaignService.closeCampaign(id);
        return "redirect:/admin/campaigns";
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> export(@RequestParam(defaultValue = "json") String format) throws IOException {
        if ("csv".equalsIgnoreCase(format)) {
            return download(exportService.exportCampaignsCsv(), "campaigns.csv", "text/csv");
        }
        return download(exportService.exportCampaignsJson(), "campaigns.json", "application/json");
    }

    private ResponseEntity<byte[]> download(byte[] data, String filename, String contentType) {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType(contentType))
                .body(data);
    }
}
