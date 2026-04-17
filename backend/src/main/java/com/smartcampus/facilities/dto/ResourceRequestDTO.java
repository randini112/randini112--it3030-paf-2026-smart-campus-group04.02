package com.smartcampus.facilities.dto;

import com.smartcampus.facilities.model.enums.ResourceStatus;
import com.smartcampus.facilities.model.enums.ResourceType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ResourceRequestDTO {

    @NotBlank(message = "Name is required")
    private String name;

    private String description;

    @NotNull(message = "Type is required")
    private ResourceType type;

    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    @NotBlank(message = "Location is required")
    private String location;

    private String floor;
    private String building;
    private String imageUrl;

    @NotNull(message = "Status cannot be null")
    private ResourceStatus status;

    @NotBlank(message = "Availability start time is required")
    private String availStart;

    @NotBlank(message = "Availability end time is required")
    private String availEnd;
}
