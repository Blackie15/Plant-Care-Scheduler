package com.suchitra.plantcarescheduler.config;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final Path uploadRootDir;

    public WebConfig(@Value("${app.upload.dir:uploads}") String uploadDir) {
        this.uploadRootDir = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    /**
     * Maps /uploads/** requests to the local uploads directory so browser <img> tags can load saved photos.
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String locationUri = uploadRootDir.toUri().toString();
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(locationUri);
    }
}

