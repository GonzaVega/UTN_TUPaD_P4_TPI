package com.gvega.utn.tupad.trabajos_practicos_p_4.controller;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API Gestión de Pedidos")
                        .version("1.0")
                        .description("TP - Unidad 2 - Programación 4 - UTN TUPaD"));
    }
}