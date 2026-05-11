package com.gitlab.arsenji.bffGrocery.railsService;

import com.gitlab.arsenji.bffGrocery.dto.ProductDto;
import com.gitlab.arsenji.bffGrocery.exceptions.ProductNotFoundException;
import com.gitlab.arsenji.bffGrocery.exceptions.RailsApiException;
import org.springframework.http.HttpHeaders;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class RailsProductService {

    private final RestClient restClient;
    private final RailsAuthService authService;
    private final ObjectMapper objectMapper;

    public ProductDto getByBarcode(String barcode) {
        JsonNode json = fetch(barcode);
        if (!json.get("success").asBoolean()) {
            authService.invalidate();
            json = fetch(barcode);
            if (!json.get("success").asBoolean()) {
                throw new RailsApiException("Rails returned success=false");
            }
        }
        JsonNode products = json.get("products");
        if (products.size() == 0) {
            throw new ProductNotFoundException(barcode);
        }
        return mapProduct(products.get(0));
    }

    private JsonNode fetch(String barcode) {
        String raw = restClient.get()
                .uri("/api/v1/admin/product?search=barcode:{b}", barcode)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + authService.getToken())
                .retrieve()
                .body(String.class);
        log.debug("Rails GET product response: {}", raw);
        try {
            return objectMapper.readTree(raw);
        } catch (Exception e) {
            throw new RailsApiException("Failed to parse Rails response: " + raw);
        }
    }

    public void updateProduct(Long railsId, Integer quantity) {
        String raw = restClient.put()
                .uri("/api/v1/admin/product/{id}", railsId)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + authService.getToken())
                .body(Map.of("quantity", quantity))
                .retrieve()
                .body(String.class);
        log.debug("Rails PUT product response: {}", raw);
        try {
            JsonNode json = objectMapper.readTree(raw);
            if (!json.get("success").asBoolean()) {
                throw new RailsApiException("Rails PUT returned success=false for product " + railsId);
            }
        } catch (RailsApiException e) {
            throw e;
        } catch (Exception e) {
            throw new RailsApiException("Failed to parse Rails PUT response: " + raw);
        }
    }

    private ProductDto mapProduct(JsonNode p) {
        JsonNode details = p.get("details");
        return new ProductDto(
                p.get("id").asLong(),
                details.get("barcode").asText(),
                p.get("product_name").asText(),
                details.get("quantity").asInt(),
                details.get("unit").asText()
        );
    }
}
