package com.smartcampus.facilities.service;

import com.smartcampus.facilities.dto.ResourceRequestDTO;
import com.smartcampus.facilities.dto.ResourceResponseDTO;
import com.smartcampus.facilities.exception.ResourceNotFoundException;
import com.smartcampus.facilities.mapper.ResourceMapper;
import com.smartcampus.facilities.model.Resource;
import com.smartcampus.facilities.model.enums.ResourceStatus;
import com.smartcampus.facilities.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository resourceRepository;
    private final ResourceMapper resourceMapper;

    @Override
    public ResourceResponseDTO createResource(ResourceRequestDTO requestDTO) {
        Resource entity = resourceMapper.toEntity(requestDTO);
        Resource savedEntity = resourceRepository.save(entity);
        return resourceMapper.toDto(savedEntity);
    }

    @Override
    public ResourceResponseDTO updateResource(Long id, ResourceRequestDTO requestDTO) {
        Resource existingResource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));

        resourceMapper.updateEntityFromDto(requestDTO, existingResource);
        Resource updatedEntity = resourceRepository.save(existingResource);
        return resourceMapper.toDto(updatedEntity);
    }

    @Override
    public ResourceResponseDTO getResourceById(Long id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
        return resourceMapper.toDto(resource);
    }

    @Override
    public void deleteResource(Long id) {
        Resource existingResource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
        resourceRepository.delete(existingResource);
    }

    @Override
    public ResourceResponseDTO updateResourceStatus(Long id, ResourceStatus status) {
        Resource existingResource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
        
        existingResource.setStatus(status);
        Resource updatedEntity = resourceRepository.save(existingResource);
        return resourceMapper.toDto(updatedEntity);
    }

    @Override
    public Page<ResourceResponseDTO> getAllResources(Pageable pageable) {
        Page<Resource> resources = resourceRepository.findAll(pageable);
        return resources.map(resourceMapper::toDto);
    }
}
