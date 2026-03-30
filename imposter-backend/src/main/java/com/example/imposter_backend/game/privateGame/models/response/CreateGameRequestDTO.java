package com.example.imposter_backend.game.privateGame.models.response;

import java.util.ArrayList;

public record CreateGameRequestDTO(Long hostId,
                                   ArrayList<String> names,
                                   int numOfImposters,
                                   String word,
                                   String imposterHint) {
}
