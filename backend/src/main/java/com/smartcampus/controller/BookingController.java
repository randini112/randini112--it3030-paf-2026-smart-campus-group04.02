package com.smartcampus.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.smartcampus.model.Booking;
import com.smartcampus.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllBookings() {
        Map<String, Object> response = new HashMap<>();
        response.put("data", bookingService.getAllBookings());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/pending")
    public ResponseEntity<Map<String, Object>> getPendingBookings() {
        Map<String, Object> response = new HashMap<>();
        response.put("data", bookingService.getPendingBookings());
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createBooking(@RequestBody Booking booking, Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        response.put("data", bookingService.createBooking(booking, authentication));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<Map<String, Object>> approveBooking(@PathVariable String id, Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        response.put("data", bookingService.approveBooking(id, authentication));
        response.put("status", "success");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<Map<String, Object>> rejectBooking(
            @PathVariable String id,
            @RequestParam String reason,
            Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        response.put("data", bookingService.rejectBooking(id, reason, authentication));
        response.put("status", "success");
        return ResponseEntity.ok(response);
    }
}