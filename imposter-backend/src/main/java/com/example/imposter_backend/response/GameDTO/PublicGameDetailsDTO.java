package com.example.imposter_backend.response.GameDTO;

import com.example.imposter_backend.response.PrivateGameDTO.ParticipantDTO;

import java.util.List;

public record PublicGameDetailsDTO(Long id, String word, String hint, List<ParticipantDTO> participantsDto) {
}
