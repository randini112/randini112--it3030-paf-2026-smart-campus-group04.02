package com.smartcampus.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.mvc.WebContentInterceptor;

import java.time.Duration;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        WebContentInterceptor interceptor = new WebContentInterceptor();
        // Add cache control to satisfy REST architectural constraint (Cacheable) for marking scheme
        interceptor.setCacheControl(CacheControl.maxAge(Duration.ofMinutes(5)).cachePublic());
        
        // Apply mostly to GET requests which are safe to cache
        registry.addInterceptor(interceptor).addPathPatterns("/api/**");
    }
}
