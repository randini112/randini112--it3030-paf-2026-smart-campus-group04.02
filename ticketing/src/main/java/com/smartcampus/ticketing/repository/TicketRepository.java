package com.smartcampus.ticketing.repository;

import com.smartcampus.ticketing.model.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {
    
    // Find tickets by status
    List<Ticket> findByStatus(String status);
    
    // Find tickets by priority
    List<Ticket> findByPriority(String priority);
    
    // Find tickets by assigned user
    List<Ticket> findByAssignedTo(String assignedTo);
    
    // Find tickets by category
    List<Ticket> findByCategory(String category);
    
    // Find tickets by created by
    List<Ticket> findByCreatedBy(String createdBy);
}