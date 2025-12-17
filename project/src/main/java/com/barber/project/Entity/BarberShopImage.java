package com.barber.project.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Entity
@Table(name = "barber_shop_image")
@Data
@NoArgsConstructor
public class BarberShopImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "image_url")
    private String imageUrl;
    @Column(name = "public_id")
    private String publicId;
    @Column(name = "is_cover")
    private boolean isCover = false;
    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt = LocalDateTime.now();
    //relacion
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "barbershop_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private BarberShop barberShop;
}
