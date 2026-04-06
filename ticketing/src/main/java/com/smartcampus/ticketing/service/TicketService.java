package com.smartcampus.ticketing.service;

import com.smartcampus.ticketing.model.Ticket;
import com.smartcampus.ticketing.model.Comment;
import com.smartcampus.ticketing.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;

    // Create a new ticket
    public Ticket createTicket(Ticket ticket) {
        ticket.setStatus("OPEN");
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    // Get all tickets
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    // Get ticket by ID
    public Ticket getTicketById(String id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + id));
    }

    // Get tickets by user
    public List<Ticket> getTicketsByUser(String userId) {
        return ticketRepository.findByReportedBy(userId);
    }

    // Update ticket status
    public Ticket updateTicketStatus(String id, String status, String resolutionNotes) {
        Ticket ticket = getTicketById(id);
        ticket.setStatus(status);
        if (resolutionNotes != null) {
            ticket.setResolutionNotes(resolutionNotes);
        }
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    // Assign technician
    public Ticket assignTechnician(String id, String technicianId) {
        Ticket ticket = getTicketById(id);
        ticket.setAssignedTo(technicianId);
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    // Add comment
    public Ticket addComment(String id, Comment comment) {
        Ticket ticket = getTicketById(id);
        comment.setId(UUID.randomUUID().toString());
        comment.setTicketId(id);
        comment.setCreatedAt(LocalDateTime.now());
        comment.setUpdatedAt(LocalDateTime.now());
        ticket.getComments().add(comment);
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    // Delete ticket
    public void deleteTicket(String id) {
        ticketRepository.deleteById(id);
    }
}