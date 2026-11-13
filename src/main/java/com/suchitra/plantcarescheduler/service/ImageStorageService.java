package com.suchitra.plantcarescheduler.service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImageStorageService {

    private static final long MAX_FILE_SIZE_BYTES = 5L * 1024 * 1024;
    private static final String COMMUNITY_URL_PREFIX = "/uploads/community/";
    private static final Map<String, String> ALLOWED_CONTENT_TYPES = Map.of(
            "image/jpeg", ".jpg",
            "image/jpg", ".jpg",
            "image/png", ".png",
            "image/webp", ".webp",
            "image/gif", ".gif"
    );

    private final Path communityUploadDir;

    public ImageStorageService(@Value("${app.upload.dir:uploads}") String uploadDir) {
        this.communityUploadDir = Paths.get(uploadDir, "community").toAbsolutePath().normalize();
    }

    /**
     * Validates and saves an uploaded community image to disk, returning its public URL path.
     */
    public String storeCommunityImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Please select an image file to upload.");
        }
        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new IllegalArgumentException("Image file size must be 5 MB or smaller.");
        }

        String extension = resolveSafeExtension(file);
        String filename = UUID.randomUUID() + extension;

        try {
            Files.createDirectories(communityUploadDir);
            Path targetPath = communityUploadDir.resolve(filename).normalize();
            if (!targetPath.startsWith(communityUploadDir)) {
                throw new IllegalArgumentException("Invalid file path.");
            }
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetPath, StandardCopyOption.REPLACE_EXISTING);
            }
            return COMMUNITY_URL_PREFIX + filename;
        } catch (IOException ex) {
            throw new RuntimeException("Failed to store uploaded image.", ex);
        }
    }

    /**
     * Deletes a locally stored community image when a post is deleted or its photo is replaced.
     */
    public void deleteIfLocalCommunityImage(String imageUrl) {
        if (imageUrl == null || !imageUrl.startsWith(COMMUNITY_URL_PREFIX)) {
            return;
        }
        String filename = imageUrl.substring(COMMUNITY_URL_PREFIX.length());
        if (filename.isBlank() || filename.contains("/") || filename.contains("\\") || filename.contains("..")) {
            return;
        }
        try {
            Path targetPath = communityUploadDir.resolve(filename).normalize();
            if (targetPath.startsWith(communityUploadDir)) {
                Files.deleteIfExists(targetPath);
            }
        } catch (IOException ignored) {
            // Non-fatal cleanup failure should not block post updates or deletion.
        }
    }

    private String resolveSafeExtension(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType != null) {
            String mapped = ALLOWED_CONTENT_TYPES.get(contentType.toLowerCase());
            if (mapped != null) {
                return mapped;
            }
        }
        throw new IllegalArgumentException("Only JPG, PNG, WEBP, and GIF image files are supported.");
    }
}

