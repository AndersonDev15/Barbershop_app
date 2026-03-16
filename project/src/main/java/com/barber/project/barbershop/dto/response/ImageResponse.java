package com.barber.project.barbershop.dto.response;

import java.time.LocalDateTime;


public record ImageResponse(
         Long id,
         String imageUrl,
         boolean cover,
         LocalDateTime uploadedAt
) { }
