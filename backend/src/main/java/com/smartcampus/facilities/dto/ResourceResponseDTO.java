package com.smartcampus.facilities.dto;

import com.smartcampus.facilities.model.enums.ResourceStatus;
import com.smartcampus.facilities.model.enums.ResourceType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ResourceResponseDTO {
    private Long id;
    private String name;
    private String description;
    private ResourceType type;
    private Integer capacity;
    private String location;
    private String floor;
    private String building;
    private String imageUrl;
    private ResourceStatus status;
    private String availStart;
    private String availEnd;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
