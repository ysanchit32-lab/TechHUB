package com.example.techhub_backend.config;

import java.nio.file.Paths;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// Serves uploaded product images from the "uploads" folder
// (created next to the backend project) at /uploads/**
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        String location = Paths.get("uploads")
                .toAbsolutePath()
                .toUri()
                .toString();

        if (!location.endsWith("/")) {
            location = location + "/";
        }

        registry
                .addResourceHandler("/uploads/**")
                .addResourceLocations(location);
    }
}
