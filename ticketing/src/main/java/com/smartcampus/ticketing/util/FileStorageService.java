package com.smartcampus.ticketing.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;

public FileStorageService(@Value("${file.upload-dir:uploads/}") String uploadDir) {
    this.fileStorageLocation = Paths.get(uploadDir)
            .toAbsolutePath().normalize();

    try {
        Files.createDirectories(this.fileStorageLocation);
    } catch (Exception ex) {
        throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
    }
}

    public String storeFile(MultipartFile file) {
        // Generate a unique filename so we don't overwrite existing files
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String uniqueFileName = UUID.randomUUID().toString() + "_" + originalFileName;

        try {
            if (uniqueFileName.contains("..")) {
                throw new RuntimeException("Sorry! Filename contains invalid path sequence " + uniqueFileName);
            }

            // Copy file to the target location
            Path targetLocation = this.fileStorageLocation.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return uniqueFileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + uniqueFileName + ". Please try again!", ex);
        }
    }
}