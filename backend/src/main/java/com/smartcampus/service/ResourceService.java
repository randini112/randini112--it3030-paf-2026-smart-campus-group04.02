package com.smartcampus.service;

import com.smartcampus.model.Resource;
import com.smartcampus.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ResourceService {

    @Autowired
    private ResourceRepository repository;

    public List<Resource> getAllResources() {
        return repository.findAll();
    }

    public Optional<Resource> getResourceById(String id) {
        return repository.findById(id);
    }

    public Resource createResource(Resource resource) {
        // Optional validation logic here
        return repository.save(resource);
    }

    public Resource updateResource(String id, Resource updatedData) {
        Optional<Resource> existing = repository.findById(id);
        if (existing.isPresent()) {
            Resource res = existing.get();
            res.setName(updatedData.getName());
            res.setType(updatedData.getType());
            res.setCapacity(updatedData.getCapacity());
            res.setLocation(updatedData.getLocation());
            res.setAvailabilityWindows(updatedData.getAvailabilityWindows());
            res.setStatus(updatedData.getStatus());
            return repository.save(res);
        }
        return null;
    }

    public boolean deleteResource(String id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }
}
