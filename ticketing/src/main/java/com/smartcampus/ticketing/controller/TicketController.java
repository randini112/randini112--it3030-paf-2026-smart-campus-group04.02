package com.smartcampus.ticketing.controller;

import com.smartcampus.ticketing.model.Ticket;
import com.smartcampus.ticketing.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import com.smartcampus.ticketing.model.Comment;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    @Autowired
    private TicketService ticketService;

        // Add a comment to a ticket
    @PostMapping("/{id}/comments")
    public ResponseEntity<Ticket> addComment(@PathVariable String id, @RequestBody Comment comment) {
        try {
            Ticket ticket = ticketService.getTicketById(id);
            
            // Set author if not provided (for now we use a default)
            if (comment.getAuthor() == null || comment.getAuthor().isEmpty()) {
                comment.setAuthor("Anonymous User");
            }
            
            ticket.getComments().add(comment);
            
            // Save the updated ticket
            return ResponseEntity.ok(ticketService.updateTicket(id, ticket));
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }

    // Get comments for a ticket
    @GetMapping("/{id}/comments")
    public ResponseEntity<List<Comment>> getComments(@PathVariable String id) {
        Ticket ticket = ticketService.getTicketById(id);
        return ResponseEntity.ok(ticket.getComments());
    }

    // CREATE a new ticket (JSON)
    @PostMapping
    public ResponseEntity<Ticket> createTicket(@RequestBody Ticket ticket) {
        Ticket createdTicket = ticketService.createTicket(ticket);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTicket);
    }

    // CREATE a new ticket with images (Multipart)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<Ticket> createTicketWithImages(
        @RequestPart("data") Ticket ticket,
        @RequestPart(value = "images", required = false) List<MultipartFile> images) {
    
    try {
        // Validate images only if provided
        if (images != null && !images.isEmpty() && images.size() > 3) {
            return ResponseEntity.badRequest().body(null);
        }
        
        // Save the ticket (images are optional)
        Ticket createdTicket = ticketService.createTicket(ticket);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTicket);
        
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}

    // GET all tickets
    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets() {
        List<Ticket> tickets = ticketService.getAllTickets();
        return ResponseEntity.ok(tickets);
    }

    // GET ticket by ID
    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable String id) {
        Ticket ticket = ticketService.getTicketById(id);
        return ResponseEntity.ok(ticket);
    }

    // UPDATE a ticket
    @PutMapping("/{id}")
    public ResponseEntity<Ticket> updateTicket(@PathVariable String id, @RequestBody Ticket ticketDetails) {
        Ticket updatedTicket = ticketService.updateTicket(id, ticketDetails);
        return ResponseEntity.ok(updatedTicket);
    }

    // UPDATE ticket status
    @PutMapping("/{id}/status")
    public ResponseEntity<Ticket> updateTicketStatus(
            @PathVariable String id, 
            @RequestBody Map<String, String> statusUpdate) {
        
        Ticket ticket = ticketService.getTicketById(id);
        ticket.setStatus(statusUpdate.get("status"));
        Ticket updatedTicket = ticketService.updateTicket(id, ticket);
        return ResponseEntity.ok(updatedTicket);
    }

    // DELETE a ticket
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable String id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }

    // GET tickets by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Ticket>> getTicketsByStatus(@PathVariable String status) {
        List<Ticket> tickets = ticketService.getTicketsByStatus(status);
        return ResponseEntity.ok(tickets);
    }
}