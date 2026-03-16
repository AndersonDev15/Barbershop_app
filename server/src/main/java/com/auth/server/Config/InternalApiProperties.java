package com.auth.server.Config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.Map;

@Data
@ConfigurationProperties(prefix = "internal.api")
public class InternalApiProperties {
    private Map<String, String> keys;
}
