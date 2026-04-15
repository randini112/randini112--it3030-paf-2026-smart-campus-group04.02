package com.smartcampus.facilities.dto;

import com.smartcampus.facilities.model.enums.ResourceStatus;
import com.smartcampus.facilities.model.enums.ResourceType;
import lombok.Data;

@Data
public class ResourceFilterDTO {
    private String search;
    private ResourceType type;
    private Integer minCapacity;
    private Integer maxCapacity;
    private String location;
    private String building;
    private ResourceStatus status;
}
