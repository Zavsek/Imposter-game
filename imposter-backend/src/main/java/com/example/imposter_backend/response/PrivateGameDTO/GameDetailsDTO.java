package com.example.imposter_backend.response.PrivateGameDTO;

import java.time.LocalDateTime;
import java.util.List;

public record GameDetailsDTO(Long id, String word, String imposterHint, List<ParticipantDTO> participants) {
}
