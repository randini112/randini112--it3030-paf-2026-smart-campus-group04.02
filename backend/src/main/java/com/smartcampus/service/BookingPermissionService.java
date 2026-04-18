package com.smartcampus.service;

import java.util.Collection;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

@Service
public class BookingPermissionService {

    public boolean canManageBookings(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        return authorities.stream().anyMatch(authority ->
            "BOOKING_MANAGEMENT_WRITE".equals(authority.getAuthority())
        );
    }
}