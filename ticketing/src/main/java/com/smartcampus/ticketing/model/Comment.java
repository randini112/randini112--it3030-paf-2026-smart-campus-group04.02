package com.smartcampus.ticketing.model;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class Comment {

    private String id;
    private String ticketId;
    private String content;
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}