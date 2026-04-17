package com.smartcampus.facilities.repository;

import com.smartcampus.facilities.model.Resource;
import com.smartcampus.facilities.model.enums.ResourceStatus;
import com.smartcampus.facilities.model.enums.ResourceType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {

    @Query("SELECT r FROM Resource r WHERE " +
           "(:search IS NULL OR LOWER(r.name) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:type IS NULL OR r.type = :type) AND " +
           "(:minCapacity IS NULL OR r.capacity >= :minCapacity) AND " +
           "(:maxCapacity IS NULL OR r.capacity <= :maxCapacity) AND " +
           "(:location IS NULL OR LOWER(r.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:building IS NULL OR LOWER(r.building) LIKE LOWER(CONCAT('%', :building, '%'))) AND " +
           "(:status IS NULL OR r.status = :status)")
    Page<Resource> findFilteredResources(
            @Param("search") String search,
            @Param("type") ResourceType type,
            @Param("minCapacity") Integer minCapacity,
            @Param("maxCapacity") Integer maxCapacity,
            @Param("location") String location,
            @Param("building") String building,
            @Param("status") ResourceStatus status,
            Pageable pageable);
}
