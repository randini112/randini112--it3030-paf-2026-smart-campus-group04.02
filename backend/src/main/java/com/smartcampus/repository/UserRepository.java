package com.smartcampus.repository;

import com.smartcampus.model.User;

public interface UserRepository {
    User findByUsername(String username);
    User findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
