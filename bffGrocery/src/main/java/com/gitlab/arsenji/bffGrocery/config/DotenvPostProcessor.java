package com.gitlab.arsenji.bffGrocery.config;

import org.springframework.boot.context.event.ApplicationEnvironmentPreparedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;

public class DotenvPostProcessor implements ApplicationListener<ApplicationEnvironmentPreparedEvent> {

    @Override
    public void onApplicationEvent(ApplicationEnvironmentPreparedEvent event) {
        ConfigurableEnvironment environment = event.getEnvironment();
        Path envFile = Path.of(".env");
        if (!Files.exists(envFile)) return;

        Map<String, Object> props = new HashMap<>();
        try {
            for (String line : Files.readAllLines(envFile)) {
                line = line.strip();
                if (line.isEmpty() || line.startsWith("#")) continue;
                int eq = line.indexOf('=');
                if (eq < 1) continue;
                String key = line.substring(0, eq).strip();
                String value = line.substring(eq + 1).strip();
                if (System.getenv(key) == null) {
                    props.put(key, value);
                }
            }
        } catch (IOException e) {
            return;
        }

        if (!props.isEmpty()) {
            environment.getPropertySources().addLast(new MapPropertySource("dotenvFile", props));
        }
    }
}
