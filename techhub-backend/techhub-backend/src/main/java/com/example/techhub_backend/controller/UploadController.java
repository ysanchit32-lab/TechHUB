package com.example.techhub_backend.controller;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

// EMPLOYEE ONLY: POST /api/products/** is already restricted to
// employees in SecurityConfig, so this endpoint is protected too.
@RestController
@RequestMapping("/api/products/upload")
@CrossOrigin(origins = "http://localhost:5173")
public class UploadController {

    private static final Path UPLOAD_DIR =
            Paths.get("uploads", "products");

    private static final Set<String> ALLOWED_TYPES =
            Set.of("jpg", "jpeg", "png", "webp", "gif");

    private static final long MAX_SIZE = 5L * 1024 * 1024;

    @PostMapping
    public ResponseEntity<?> upload(
            @RequestParam("file") MultipartFile file
    ) {

        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Please choose an image file.")
            );
        }

        if (file.getSize() > MAX_SIZE) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Image must be 5 MB or smaller.")
            );
        }

        String originalName = file.getOriginalFilename() == null
                ? ""
                : file.getOriginalFilename();

        int dot = originalName.lastIndexOf('.');

        String extension = dot >= 0
                ? originalName.substring(dot + 1).toLowerCase()
                : "";

        String contentType = file.getContentType() == null
                ? ""
                : file.getContentType();

        if (!ALLOWED_TYPES.contains(extension)
                || !contentType.startsWith("image/")) {

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "error",
                            "Only JPG, PNG, WEBP or GIF images are allowed."
                    )
            );
        }

        try {

            Files.createDirectories(UPLOAD_DIR);

            // Random name, so uploads can never overwrite each other
            String fileName =
                    UUID.randomUUID() + "." + extension;

            try (InputStream input = file.getInputStream()) {
                Files.copy(
                        input,
                        UPLOAD_DIR.resolve(fileName),
                        StandardCopyOption.REPLACE_EXISTING
                );
            }

            String url = ServletUriComponentsBuilder
                    .fromCurrentContextPath()
                    .path("/uploads/products/")
                    .path(fileName)
                    .toUriString();

            return ResponseEntity.ok(Map.of("url", url));

        } catch (IOException e) {

            return ResponseEntity.internalServerError().body(
                    Map.of("error", "Could not save the image.")
            );
        }
    }
}