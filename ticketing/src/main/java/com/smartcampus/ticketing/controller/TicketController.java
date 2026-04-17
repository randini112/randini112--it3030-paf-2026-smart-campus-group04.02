package com.smartcampus.ticketing.controller;

import com.smartcampus.ticketing.model.Comment;
import com.smartcampus.ticketing.model.Notification;
import com.smartcampus.ticketing.model.Ticket;
import com.smartcampus.ticketing.service.NotificationService;
import com.smartcampus.ticketing.service.TicketService;
import com.smartcampus.ticketing.util.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private NotificationService notificationService;

    // ==================== COMMENTS API ====================

    @PostMapping("/{id}/comments")
    public ResponseEntity<Ticket> addComment(@PathVariable String id, @RequestBody Comment comment) {
        try {
            Ticket ticket = ticketService.getTicketById(id);
            
            if (comment.getAuthor() == null || comment.getAuthor().isEmpty()) {
                comment.setAuthor("Anonymous User");
            }
            
            ticket.getComments().add(comment);
            return ResponseEntity.ok(ticketService.updateTicket(id, ticket));
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<Comment>> getComments(@PathVariable String id) {
        Ticket ticket = ticketService.getTicketById(id);
        return ResponseEntity.ok(ticket.getComments());
    }

    // ==================== CREATE TICKET (JSON) ====================

    @PostMapping
    public ResponseEntity<Ticket> createTicket(@RequestBody Ticket ticket) {
        try {
            Ticket createdTicket = ticketService.createTicket(ticket);
            
            // 🔔 Auto-create notification for ticket creation
            createAutoNotification(ticket.getCreatedBy(), "TICKET_CREATED", 
                "✅ Your ticket '" + ticket.getTitle() + "' has been created!");
            
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTicket);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ==================== CREATE TICKET WITH IMAGES (MULTIPART) ====================

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Ticket> createTicketWithImages(
            @RequestPart("data") Ticket ticket,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        
        try {
            List<String> savedFileNames = new ArrayList<>();
            
            if (images != null && !images.isEmpty()) {
                for (MultipartFile file : images) {
                    String fileName = fileStorageService.storeFile(file);
                    savedFileNames.add(fileName);
                }
                // Optional: Save file names to ticket.attachments field
            }
            
            Ticket createdTicket = ticketService.createTicket(ticket);
            
            // 🔔 Auto-notification
            createAutoNotification(ticket.getCreatedBy(), "TICKET_CREATED", 
                "✅ Your ticket '" + ticket.getTitle() + "' has been created!");
            
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTicket);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ==================== GET ALL TICKETS ====================

    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets() {
        try {
            List<Ticket> tickets = ticketService.getAllTickets();
            return ResponseEntity.ok(tickets);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ==================== GET TICKET BY ID ====================

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable String id) {
        try {
            Ticket ticket = ticketService.getTicketById(id);
            return ResponseEntity.ok(ticket);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ==================== UPDATE TICKET ====================

    @PutMapping("/{id}")
    public ResponseEntity<Ticket> updateTicket(@PathVariable String id, @RequestBody Ticket ticketDetails) {
        try {
            Ticket updatedTicket = ticketService.updateTicket(id, ticketDetails);
            return ResponseEntity.ok(updatedTicket);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ==================== UPDATE TICKET STATUS (+ Auto-Notification) ====================

    @PutMapping("/{id}/status")
    public ResponseEntity<Ticket> updateTicketStatus(
            @PathVariable String id, 
            @RequestBody Map<String, String> statusUpdate) {
        
        try {
            Ticket ticket = ticketService.getTicketById(id);
            String oldStatus = ticket.getStatus();
            String newStatus = statusUpdate.get("status");
            
            ticket.setStatus(newStatus);
            Ticket updatedTicket = ticketService.updateTicket(id, ticket);
            
            // 🔔 Auto-notification for status change (especially RESOLVED)
            if ("RESOLVED".equalsIgnoreCase(newStatus)) {
                createAutoNotification(ticket.getCreatedBy(), "TICKET_RESOLVED", 
                    "🎉 Your ticket '" + ticket.getTitle() + "' has been RESOLVED!");
            } else if (!newStatus.equals(oldStatus)) {
                createAutoNotification(ticket.getCreatedBy(), "STATUS_UPDATED", 
                    "📋 Ticket '" + ticket.getTitle() + "' status changed: " + oldStatus + " → " + newStatus);
            }
            
            return ResponseEntity.ok(updatedTicket);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }

    // ==================== DELETE TICKET ====================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable String id) {
        try {
            ticketService.deleteTicket(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ==================== GET TICKETS BY STATUS ====================

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Ticket>> getTicketsByStatus(@PathVariable String status) {
        try {
            List<Ticket> tickets = ticketService.getTicketsByStatus(status);
            return ResponseEntity.ok(tickets);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ==================== HELPER: Create Auto-Notification ====================

    private void createAutoNotification(String userId, String type, String message) {
        try {
            Notification notif = new Notification();
            notif.setUserId(userId != null ? userId : "student123");
            notif.setType(type);
            notif.setMessage(message);
            notif.setRead(false);
            notif.setCreatedAt(LocalDateTime.now());
            notificationService.createNotification(notif);
        } catch (Exception e) {
            // Don't fail the main operation if notification fails
            System.err.println("Failed to create notification: " + e.getMessage());
        }
    }
}