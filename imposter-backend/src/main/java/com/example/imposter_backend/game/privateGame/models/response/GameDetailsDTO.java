package com.example.imposter_backend.game.privateGame.models.response;

import java.util.List;

public record GameDetailsDTO(Long id, String word, String imposterHint, List<ParticipantDTO> participants) {
}
