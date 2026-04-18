package com.smartcampus.repository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Repository;

import com.smartcampus.model.Booking;

@Repository
public class BookingRepository {

    private final Map<String, Booking> bookings = new ConcurrentHashMap<>();

    public BookingRepository() {
        seedData();
    }

    public List<Booking> findAll() {
        return bookings.values().stream()
            .sorted(Comparator.comparing(Booking::getCreatedAt).reversed())
            .toList();
    }

    public List<Booking> findByStatus(String status) {
        return bookings.values().stream()
            .filter(booking -> status.equalsIgnoreCase(booking.getStatus()))
            .sorted(Comparator.comparing(Booking::getCreatedAt).reversed())
            .toList();
    }

    public Optional<Booking> findById(String id) {
        return Optional.ofNullable(bookings.get(id));
    }

    public Booking save(Booking booking) {
        if (booking.getId() == null || booking.getId().isBlank()) {
            booking.setId(String.valueOf(System.nanoTime()));
        }
        bookings.put(booking.getId(), booking);
        return booking;
    }

    public List<Booking> findConflicts(String resourceId, LocalDateTime startTime, LocalDateTime endTime, String excludeBookingId) {
        List<String> activeStatuses = List.of("PENDING", "APPROVED");
        List<Booking> conflicts = new ArrayList<>();

        for (Booking booking : bookings.values()) {
            boolean sameResource = resourceId.equals(booking.getResourceId());
            boolean active = activeStatuses.contains(booking.getStatus());
            boolean overlaps = booking.getStartTime().isBefore(endTime) && booking.getEndTime().isAfter(startTime);
            boolean notExcluded = excludeBookingId == null || !excludeBookingId.equals(booking.getId());

            if (sameResource && active && overlaps && notExcluded) {
                conflicts.add(booking);
            }
        }

        conflicts.sort(Comparator.comparing(Booking::getCreatedAt).reversed());
        return conflicts;
    }

    private void seedData() {
        Booking bookingOne = new Booking("stu-1001", "res-101", "Conference Room A",
            LocalDateTime.now().plusDays(1).withHour(9).withMinute(0).withSecond(0).withNano(0),
            LocalDateTime.now().plusDays(1).withHour(10).withMinute(0).withSecond(0).withNano(0),
            "Weekly project sync");
        bookingOne.setStatus("PENDING");
        save(bookingOne);

        Booking bookingTwo = new Booking("stu-1002", "res-102", "Lab 2",
            LocalDateTime.now().plusDays(1).withHour(11).withMinute(0).withSecond(0).withNano(0),
            LocalDateTime.now().plusDays(1).withHour(12).withMinute(30).withSecond(0).withNano(0),
            "Lab session");
        bookingTwo.setStatus("APPROVED");
        save(bookingTwo);

        Booking bookingThree = new Booking("stu-1003", "res-101", "Conference Room A",
            LocalDateTime.now().plusDays(1).withHour(10).withMinute(30).withSecond(0).withNano(0),
            LocalDateTime.now().plusDays(1).withHour(11).withMinute(30).withSecond(0).withNano(0),
            "Department meeting");
        bookingThree.setStatus("PENDING");
        save(bookingThree);
    }
}