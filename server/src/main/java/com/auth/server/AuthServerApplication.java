package com.auth.server;

import com.auth.server.Config.InternalApiProperties;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.core.env.Environment;
import org.springframework.resilience.annotation.EnableResilientMethods;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
@EnableFeignClients
@ConfigurationPropertiesScan
@EnableScheduling
public class AuthServerApplication {

	@Value("${business.api.api-key}")
	private String businessApiKey;

	public static void main(String[] args) {
		SpringApplication.run(AuthServerApplication.class, args);}

	@PostConstruct
	public void checkConfig() {
		System.out.println("===========================================");
		System.out.println("AUTH SERVER - Business API Key:");
		System.out.println("[" + businessApiKey + "]");
		System.out.println("===========================================");
	}
}
