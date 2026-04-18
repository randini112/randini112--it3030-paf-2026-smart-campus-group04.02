package com.smartcampus.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.smartcampus.model.Booking;
import com.smartcampus.repository.BookingRepository;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getPendingBookings() {
        return bookingRepository.findByStatus("PENDING");
    }

    @PreAuthorize("hasRole('ADMIN') and @bookingPermissionService.canManageBookings(authentication)")
    public Booking createBooking(Booking booking, Authentication authentication) {
        validateTimeRange(booking);
        ensureNoConflict(booking.getResourceId(), booking.getStartTime(), booking.getEndTime(), null);
        booking.setStatus("PENDING");
        booking.setCreatedAt(LocalDateTime.now());
        booking.setUpdatedAt(LocalDateTime.now());
        if (authentication != null) {
            booking.setUserId(authentication.getName());
        }
        return bookingRepository.save(booking);
    }

    @PreAuthorize("hasRole('ADMIN') and @bookingPermissionService.canManageBookings(authentication)")
    public Booking approveBooking(String bookingId, Authentication authentication) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        if (!"PENDING".equals(booking.getStatus())) {
            throw new IllegalStateException("Only pending bookings can be approved");
        }

        ensureNoConflict(booking.getResourceId(), booking.getStartTime(), booking.getEndTime(), bookingId);
        booking.setStatus("APPROVED");
        booking.setApprovedBy(authentication != null ? authentication.getName() : "admin");
        booking.setUpdatedAt(LocalDateTime.now());
        return bookingRepository.save(booking);
    }

    @PreAuthorize("hasRole('ADMIN') and @bookingPermissionService.canManageBookings(authentication)")
    public Booking rejectBooking(String bookingId, String reason, Authentication authentication) {
        if (reason == null || reason.trim().isEmpty()) {
            throw new IllegalArgumentException("Rejection reason is required");
        }

        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        if (!"PENDING".equals(booking.getStatus())) {
            throw new IllegalStateException("Only pending bookings can be rejected");
        }

        booking.setStatus("REJECTED");
        booking.setRejectionReason(reason.trim());
        booking.setRejectedBy(authentication != null ? authentication.getName() : "admin");
        booking.setUpdatedAt(LocalDateTime.now());
        return bookingRepository.save(booking);
    }

    private void validateTimeRange(Booking booking) {
        if (booking.getStartTime() == null || booking.getEndTime() == null) {
            throw new IllegalArgumentException("Start and end time are required");
        }
        if (!booking.getStartTime().isBefore(booking.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }
    }

    private void ensureNoConflict(String resourceId, LocalDateTime startTime, LocalDateTime endTime, String excludeBookingId) {
        if (!bookingRepository.findConflicts(resourceId, startTime, endTime, excludeBookingId).isEmpty()) {
            throw new IllegalStateException("Time slot overlaps with another booking for the same resource");
        }
    }
}