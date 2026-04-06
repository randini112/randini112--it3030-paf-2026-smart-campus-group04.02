package com.smartcampus.ticketing.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.smartcampus.ticketing.model.Ticket;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {

    List<Ticket> findByReportedBy(String reportedBy);
    List<Ticket> findByStatus(String status);
    List<Ticket> findByAssignedTo(String assignedTo);
    List<Ticket> findByPriority(String priority);
}