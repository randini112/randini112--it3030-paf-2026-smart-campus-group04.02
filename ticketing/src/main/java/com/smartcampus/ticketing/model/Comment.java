package com.smartcampus.ticketing.model;

import java.time.LocalDateTime;

public class Comment {
    private String author;
    private String content;
    private LocalDateTime createdAt;

    // Constructor to set the time automatically
    public Comment() {
        this.createdAt = LocalDateTime.now();
    }

    // --- Getters and Setters ---

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}