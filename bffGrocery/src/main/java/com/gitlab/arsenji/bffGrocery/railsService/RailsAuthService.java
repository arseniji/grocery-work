package com.gitlab.arsenji.bffGrocery.railsService;

import com.gitlab.arsenji.bffGrocery.exceptions.RailsApiException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class RailsAuthService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private String token;

    @Value("${rails.login}")
    private String login;

    @Value("${rails.password}")
    private String password;

    public synchronized String getToken() {
        if (token == null) refreshToken();
        return token;
    }

    public synchronized void refreshToken() {
        String raw = restClient.post()
                .uri("/api/v1/login")
                .body(Map.of("login", login, "password", password))
                .retrieve()
                .body(String.class);
        try {
            JsonNode json = objectMapper.readTree(raw);
            token = json.get("session").get("session_id").asText();
            log.debug("Rails auth token refreshed");
        } catch (Exception e) {
            throw new RailsApiException("Failed to parse auth response");
        }
    }

    public synchronized void invalidate() {
        token = null;
    }
}
