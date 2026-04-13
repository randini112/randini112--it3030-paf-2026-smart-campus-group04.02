package com.smartcampus.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;

@Configuration
@ConditionalOnProperty(name = "spring.data.mongodb.uri", havingValue = "in-memory")
public class InMemoryDatabaseConfig {

    @Bean
    public MongoClient mongoClient() {
        // For demo purposes, we'll use a simple in-memory setup
        // In production, you'd want to use a real MongoDB instance
        return MongoClients.create("mongodb://localhost:27017/smartcampus");
    }

    @Bean
    public MongoTemplate mongoTemplate() {
        return new MongoTemplate(mongoClient(), "smartcampus");
    }
}
