package com.example.imposter_backend.response.AuthDTO;

import java.time.LocalDateTime;

public record LoginResponseDTO(Long id, String username, String token, LocalDateTime createdAt) {}
