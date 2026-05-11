package com.gitlab.arsenji.bffGrocery.railsService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RailsClientConfig {

    @Bean
    public RestClient railsRestClient(@Value("${rails.base-url}") String baseUrl) {
        return RestClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("Host", "localhost")
                .build();
    }
}
