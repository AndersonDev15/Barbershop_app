package com.barber.project.Security.Config;

import jakarta.persistence.Column;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@ConfigurationProperties(prefix = "internal.api")
@Data
public class InternalApiProperties {
    private Map<String,String>keys;
}
