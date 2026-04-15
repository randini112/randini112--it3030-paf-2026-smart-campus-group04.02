package com.smartcampus.facilities.service;

import com.smartcampus.facilities.dto.ResourceRequestDTO;
import com.smartcampus.facilities.dto.ResourceResponseDTO;
import com.smartcampus.facilities.dto.ResourceFilterDTO;
import com.smartcampus.facilities.model.enums.ResourceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ResourceService {
    ResourceResponseDTO createResource(ResourceRequestDTO requestDTO);
    ResourceResponseDTO updateResource(Long id, ResourceRequestDTO requestDTO);
    ResourceResponseDTO getResourceById(Long id);
    void deleteResource(Long id);
    ResourceResponseDTO updateResourceStatus(Long id, ResourceStatus status);
    
    // Get filtered resources
    Page<ResourceResponseDTO> getAllResources(ResourceFilterDTO filterDTO, Pageable pageable);
}
