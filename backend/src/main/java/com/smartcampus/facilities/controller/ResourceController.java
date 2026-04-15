package com.smartcampus.facilities.controller;

import com.smartcampus.facilities.dto.ResourceRequestDTO;
import com.smartcampus.facilities.dto.ResourceResponseDTO;
import com.smartcampus.facilities.model.enums.ResourceStatus;
import com.smartcampus.facilities.service.ResourceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;

    @PostMapping
    public ResponseEntity<ResourceResponseDTO> createResource(@Valid @RequestBody ResourceRequestDTO requestDTO) {
        ResourceResponseDTO createdResource = resourceService.createResource(requestDTO);
        return new ResponseEntity<>(createdResource, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<ResourceResponseDTO>> getAllResources(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String[] sort) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(
                new Sort.Order(Sort.Direction.fromString(sort[1]), sort[0])
        ));

        Page<ResourceResponseDTO> resources = resourceService.getAllResources(pageable);
        return ResponseEntity.ok(resources);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResourceResponseDTO> getResourceById(@PathVariable Long id) {
        ResourceResponseDTO resource = resourceService.getResourceById(id);
        return ResponseEntity.ok(resource);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResourceResponseDTO> updateResource(
            @PathVariable Long id, 
            @Valid @RequestBody ResourceRequestDTO requestDTO) {
        ResourceResponseDTO updatedResource = resourceService.updateResource(id, requestDTO);
        return ResponseEntity.ok(updatedResource);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ResourceResponseDTO> updateResourceStatus(
            @PathVariable Long id, 
            @RequestParam ResourceStatus status) {
        ResourceResponseDTO updatedResource = resourceService.updateResourceStatus(id, status);
        return ResponseEntity.ok(updatedResource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }
}
