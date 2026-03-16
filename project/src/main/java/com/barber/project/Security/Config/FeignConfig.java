package com.barber.project.Security.Config;

import com.barber.project.shared.Exception.AuthServerErrorDecoder;
import feign.Logger;
import feign.RequestInterceptor;

import feign.codec.ErrorDecoder;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignConfig {

    private static final org.slf4j.Logger log = LoggerFactory.getLogger(FeignConfig.class);
    @Value("${auth.server.api-key}")
    private String apiKey;

    /**
     *  Interceptor para agregar API Key a TODAS las requests
     */
    @Bean
    public RequestInterceptor apiKeyInterceptor(){
        return requestTemplate -> {
            log.info("agregando API Key al request: {}", requestTemplate.url());
            requestTemplate.header("X-API-Key", apiKey);
        };
    }

    @Bean
    public ErrorDecoder errorDecoder(){
        return new AuthServerErrorDecoder();
    }

    @Bean
    public Logger.Level feignLoggerLevel() {
        return Logger.Level.BASIC;  // NONE, BASIC, HEADERS, FULL
    }
}
