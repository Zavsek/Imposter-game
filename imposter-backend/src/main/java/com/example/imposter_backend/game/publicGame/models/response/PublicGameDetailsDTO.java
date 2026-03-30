package com.example.imposter_backend.game.publicGame.models.response;

import com.example.imposter_backend.game.privateGame.models.response.ParticipantDTO;

import java.util.List;

public record PublicGameDetailsDTO(Long id, String word, String hint, List<ParticipantDTO> participants) {
}
