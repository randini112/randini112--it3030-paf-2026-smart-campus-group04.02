package com.smartcampus.facilities.repository;

import com.smartcampus.facilities.model.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    // Custom query methods (for searching/filtering) will go here later if needed
    // Spring Data JPA handles basic pagination and sorting out of the box via Pageable
}
