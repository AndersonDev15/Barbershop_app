package com.barber.project.Dto.Response.BarberShop;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ImageResponse {
    private Long id;
    private String imageUrl;
    private boolean cover;
    private LocalDateTime uploadedAt;
}
