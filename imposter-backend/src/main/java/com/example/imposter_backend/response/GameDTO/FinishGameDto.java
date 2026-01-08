package com.example.imposter_backend.response.GameDTO;

import java.util.List;

public record FinishGameDto(List<String> votedOutUsers, List<String> imposters, Boolean impostersEliminated) {
}
