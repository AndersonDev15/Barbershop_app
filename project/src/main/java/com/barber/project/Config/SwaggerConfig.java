package com.barber.project.Config;


import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI barbershopAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Barbershop API")
                        .version("1.0.0")
                        .description("""
                                API del sistema de barberías.
                                
                                Permite la gestión de:
                                - Clientes
                                - Barberos
                                - Barberías
                                - Reservas
                                - Disponibilidad
                                - Transacciones
                                - Dashboards de ingresos
                                
                                La API utiliza autenticación JWT mediante Bearer Token.
                                """))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth",
                                new SecurityScheme()
                                        .name("Authorization")
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                        )
                )
                .tags(List.of(


                         // ---  AUTENTICACIÓN ---

                        new Tag()
                                .name("Auth")
                                .description("Registro, inicio de sesión y autenticación de usuarios"),
                        new Tag()
                                .name("Password Reset")
                                .description("Cambio de contraseña mediante código de verificación enviado por correo"),


                        // --- PERFILES ---

                        new Tag()
                                .name("Perfil - Cliente")
                                .description("Gestión del perfil del cliente"),
                        new Tag()
                                .name("Perfil - Barbero")
                                .description("Gestión del perfil del barbero"),
                        new Tag()
                                .name("Perfil - Barbería")
                                .description("Gestión del perfil de la barbería"),


                        // --- BARBERÍA ---

                        new Tag()
                                .name("Barbería - Gestión de Barberos")
                                .description("Vinculación de barberos, comisiones, estados y disponibilidad"),
                        new Tag()
                                .name("Barbería - Gestión de Imágenes")
                                .description("Subida, listado, eliminación y portada de imágenes"),
                        new Tag()
                                .name("Barbería - Horarios de Atención")
                                .description("Configuración de horarios de atención de la barbería"),
                        new Tag()
                                .name("Barbería - Servicios")
                                .description("Gestión de categorías y subcategorías de servicios"),
                        new Tag()
                                .name("Barbería - Dashboard")
                                .description("Dashboard de ingresos y métricas de la barbería"),


                        // ---  BARBERO ---

                        new Tag()
                                .name("Barbero - Disponibilidad y Descansos")
                                .description("Endpoints para consultar disponibilidad del barbero y gestionar descansos"),
                        new Tag()
                                .name("Barbero - Reservas")
                                .description("Gestión de reservas asignadas al barbero"),
                        new Tag()
                                .name("Barbero - Transacciones")
                                .description("Confirmación y cierre de transacciones"),
                        new Tag()
                                .name("Barbero - Dashboard")
                                .description("Dashboard de ingresos y estadísticas del barbero"),


                        // --- CLIENTE ---

                        new Tag()
                                .name("Cliente - Búsqueda")
                                .description("Búsqueda de barberías, barberos y servicios disponibles"),
                        new Tag()
                                .name("Cliente - Disponibilidad")
                                .description("Consulta de disponibilidad para agendar citas"),
                        new Tag()
                                .name("Cliente - Reservas")
                                .description("Creación, visualización y cancelación de reservas"),
                        new Tag()
                                .name("Cliente - Transacciones")
                                .description("Creación y consulta de transacciones realizadas por el cliente")






                ));
    }
}

