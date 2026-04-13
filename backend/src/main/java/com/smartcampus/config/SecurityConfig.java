package com.smartcampus.config;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.filter.OncePerRequestFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
			.csrf(csrf -> csrf.disable())
			.cors(Customizer.withDefaults())
			.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
			.authorizeHttpRequests(auth -> auth
				.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
				.requestMatchers("/api/test", "/api/health").permitAll()
				.anyRequest().authenticated()
			)
			.addFilterBefore(new DemoAuthenticationFilter(), org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

	public static class DemoAuthenticationFilter extends OncePerRequestFilter {

		@Override
		protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
				throws ServletException, IOException {
			if (org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication() == null) {
				String username = request.getHeader("X-User-Name");
				String role = request.getHeader("X-User-Role");
				String moduleAssignment = request.getHeader("X-User-Module");

				if (username != null && role != null) {
					List<SimpleGrantedAuthority> authorities = new ArrayList<>();
					authorities.add(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()));

					if ("ADMIN".equalsIgnoreCase(role) && moduleAssignment != null) {
						String normalizedModule = moduleAssignment.toUpperCase().replace(' ', '_').replace('-', '_');
						authorities.add(new SimpleGrantedAuthority("MODULE_" + normalizedModule));
						if (normalizedModule.contains("BOOKING")) {
							authorities.add(new SimpleGrantedAuthority("BOOKING_MANAGEMENT_WRITE"));
						}
					}

					Authentication authentication = new UsernamePasswordAuthenticationToken(username, null, authorities);
					org.springframework.security.core.context.SecurityContextHolder.getContext().setAuthentication(authentication);
				}
			}

			filterChain.doFilter(request, response);
		}
	}
}
