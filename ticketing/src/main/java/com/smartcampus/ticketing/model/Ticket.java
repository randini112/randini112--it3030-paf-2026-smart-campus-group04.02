package com.smartcampus.ticketing.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Document(collection = "tickets")
public class Ticket {
    
    @Id
    private String id;
    
    @Field(name = "title")
    private String title;
    
    @Field(name = "description")
    private String description;
    
    @Field(name = "category")
    private String category;
    
    @Field(name = "priority")
    private String priority;
    
    @Field(name = "status")
    private String status;
    
    @Field(name = "assignedTo")
    private String assignedTo;
    
    @Field(name = "createdBy")
    private String createdBy;
    
    @Field(name = "createdAt")
    private LocalDateTime createdAt;
    
    @Field(name = "updatedAt")
    private LocalDateTime updatedAt;
    
    @Field(name = "attachments")
    private List<String> attachments;
    
    @Field(name = "comments")
    private List<Comment> comments = new ArrayList<>();  // ✅ Added this
    
    // Constructor
    public Ticket() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.status = "Open";
    }
    
    // --- Getters and Setters ---
    
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { 
        this.status = status; 
        this.updatedAt = LocalDateTime.now();
    }
    
    public String getAssignedTo() { return assignedTo; }
    public void setAssignedTo(String assignedTo) { this.assignedTo = assignedTo; }
    
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public List<String> getAttachments() { return attachments; }
    public void setAttachments(List<String> attachments) { this.attachments = attachments; }
    
    // ✅ Added this getter/setter
    public List<Comment> getComments() { return comments; }
    public void setComments(List<Comment> comments) { this.comments = comments; }
}