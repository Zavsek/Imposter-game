package com.example.imposter_backend.game.publicGame.models.response;

import java.util.List;

public record FinishGameDto(List<String> votedOutUsers, List<String> imposters, Boolean impostersEliminated) {
}
