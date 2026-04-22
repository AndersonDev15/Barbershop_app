package com.barber.project;

import com.barber.project.Security.Config.InternalApiProperties;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
@RequiredArgsConstructor
public class ProjectApplication {

	private final InternalApiProperties internalApiProperties;
	public static void main(String[] args) {
		SpringApplication.run(ProjectApplication.class, args);
	}

	@PostConstruct
	public void checkApiKeys() {
		System.out.println("===========================================");
		System.out.println("📋 BUSINESS API - Internal API Keys:");
		System.out.println(internalApiProperties.getKeys());
		System.out.println("===========================================");
	}

}

