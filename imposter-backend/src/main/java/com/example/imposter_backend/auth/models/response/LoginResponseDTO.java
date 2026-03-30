package com.example.imposter_backend.auth.models.response;

import java.time.LocalDateTime;

public record LoginResponseDTO(Long id, String username, String token, LocalDateTime createdAt) {}
