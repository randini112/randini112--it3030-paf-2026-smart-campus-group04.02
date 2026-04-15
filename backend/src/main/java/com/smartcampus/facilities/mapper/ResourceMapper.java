package com.smartcampus.facilities.mapper;

import com.smartcampus.facilities.dto.ResourceRequestDTO;
import com.smartcampus.facilities.dto.ResourceResponseDTO;
import com.smartcampus.facilities.model.Resource;
import org.springframework.stereotype.Component;

@Component
public class ResourceMapper {

    public Resource toEntity(ResourceRequestDTO dto) {
        if (dto == null) {
            return null;
        }

        Resource resource = new Resource();
        resource.setName(dto.getName());
        resource.setDescription(dto.getDescription());
        resource.setType(dto.getType());
        resource.setCapacity(dto.getCapacity());
        resource.setLocation(dto.getLocation());
        resource.setFloor(dto.getFloor());
        resource.setBuilding(dto.getBuilding());
        resource.setImageUrl(dto.getImageUrl());
        resource.setStatus(dto.getStatus());
        resource.setAvailStart(dto.getAvailStart());
        resource.setAvailEnd(dto.getAvailEnd());
        return resource;
    }

    public ResourceResponseDTO toDto(Resource entity) {
        if (entity == null) {
            return null;
        }

        ResourceResponseDTO dto = new ResourceResponseDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setType(entity.getType());
        dto.setCapacity(entity.getCapacity());
        dto.setLocation(entity.getLocation());
        dto.setFloor(entity.getFloor());
        dto.setBuilding(entity.getBuilding());
        dto.setImageUrl(entity.getImageUrl());
        dto.setStatus(entity.getStatus());
        dto.setAvailStart(entity.getAvailStart());
        dto.setAvailEnd(entity.getAvailEnd());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }

    public void updateEntityFromDto(ResourceRequestDTO dto, Resource entity) {
        if (dto == null || entity == null) {
            return;
        }
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setType(dto.getType());
        entity.setCapacity(dto.getCapacity());
        entity.setLocation(dto.getLocation());
        entity.setFloor(dto.getFloor());
        entity.setBuilding(dto.getBuilding());
        entity.setImageUrl(dto.getImageUrl());
        entity.setStatus(dto.getStatus());
        entity.setAvailStart(dto.getAvailStart());
        entity.setAvailEnd(dto.getAvailEnd());
    }
}
